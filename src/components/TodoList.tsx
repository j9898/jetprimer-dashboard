'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

interface Todo {
  id: string
  title: string
  description: string | null
  is_completed: boolean
  due_date: string | null
  priority: number
  created_at: string
  updated_at: string
}

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
)

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const FlagIcon = ({ priority }: { priority: number }) => {
  const colors: Record<number, string> = {
    1: 'text-amber-500',
    2: 'text-orange-500',
    3: 'text-rose-500',
  }
  return (
    <svg className={`w-4 h-4 ${colors[priority] || 'text-slate-300'}`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
    </svg>
  )
}

const MoreIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
)

export default function TodoList() {
  const t = useTranslations('todos')
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [showAddInput, setShowAddInput] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newPriority, setNewPriority] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      const data = await response.json()
      if (data.success) {
        setTodos(data.todos)
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  useEffect(() => {
    if (showAddInput && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showAddInput])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Add new todo
  const handleAddTodo = async () => {
    if (!newTitle.trim()) return

    setIsAdding(true)
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription || null,
          due_date: newDueDate || null,
          priority: newPriority,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setTodos([data.todo, ...todos])
        setNewTitle('')
        setNewDescription('')
        setNewDueDate('')
        setNewPriority(0)
        setShowAddInput(false)
      }
    } catch (error) {
      console.error('Failed to add todo:', error)
    } finally {
      setIsAdding(false)
    }
  }

  // Toggle todo completion
  const handleToggle = async (todo: Todo) => {
    // Optimistic update
    setTodos(todos.map(t => t.id === todo.id ? { ...t, is_completed: !t.is_completed } : t))

    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: !todo.is_completed }),
      })
      const data = await response.json()
      if (!data.success) {
        // Revert on failure
        setTodos(todos.map(t => t.id === todo.id ? todo : t))
      }
    } catch (error) {
      console.error('Failed to update todo:', error)
      setTodos(todos.map(t => t.id === todo.id ? todo : t))
    }
  }

  // Delete todo
  const handleDelete = async (id: string) => {
    setActiveMenu(null)
    const todoToDelete = todos.find(t => t.id === id)
    // Optimistic delete
    setTodos(todos.filter(t => t.id !== id))

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (!data.success && todoToDelete) {
        // Revert on failure
        setTodos(prev => [...prev, todoToDelete])
      }
    } catch (error) {
      console.error('Failed to delete todo:', error)
      if (todoToDelete) {
        setTodos(prev => [...prev, todoToDelete])
      }
    }
  }

  // Update priority
  const handleUpdatePriority = async (id: string, priority: number) => {
    setActiveMenu(null)
    setTodos(todos.map(t => t.id === id ? { ...t, priority } : t))

    try {
      await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority }),
      })
    } catch (error) {
      console.error('Failed to update priority:', error)
    }
  }

  // Sort todos: incomplete first, then by priority (high to low), then by due date
  const activeTodos = todos.filter(t => !t.is_completed).sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority
    if (a.due_date && b.due_date) {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    }
    if (a.due_date) return -1
    if (b.due_date) return 1
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const completedTodos = todos.filter(t => t.is_completed).sort((a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )

  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dueDate = new Date(dateStr)
    dueDate.setHours(0, 0, 0, 0)

    if (dueDate.getTime() === today.getTime()) return t('today')
    if (dueDate.getTime() === tomorrow.getTime()) return t('tomorrow')
    if (dueDate < today) return t('overdue')

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  const getDueDateColor = (dateStr: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(dateStr)
    dueDate.setHours(0, 0, 0, 0)

    if (dueDate < today) return 'text-rose-500'
    if (dueDate.getTime() === today.getTime()) return 'text-emerald-600'
    return 'text-slate-500'
  }

  const priorityColors: Record<number, string> = {
    1: 'border-amber-400 hover:bg-amber-50',
    2: 'border-orange-400 hover:bg-orange-50',
    3: 'border-rose-500 hover:bg-rose-50',
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-rose-500 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header - Todoist style */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <span className="text-rose-500">📋</span>
            {t('title')}
          </h2>
          <span className="text-sm text-slate-400">
            {activeTodos.length} {t('tasksLeft')}
          </span>
        </div>
      </div>

      {/* Add Task Button / Form */}
      <div className="px-4 py-2 border-b border-slate-100">
        {!showAddInput ? (
          <button
            onClick={() => setShowAddInput(true)}
            className="flex items-center gap-3 w-full py-2 text-slate-400 hover:text-rose-500 transition-colors group"
          >
            <span className="w-5 h-5 rounded-full border-2 border-dashed border-slate-300 group-hover:border-rose-400 flex items-center justify-center">
              <PlusIcon />
            </span>
            <span className="text-sm">{t('addTask')}</span>
          </button>
        ) : (
          <div className="py-2 space-y-3">
            <input
              ref={inputRef}
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newTitle.trim()) handleAddTodo()
                if (e.key === 'Escape') {
                  setShowAddInput(false)
                  setNewTitle('')
                  setNewDescription('')
                  setNewDueDate('')
                  setNewPriority(0)
                }
              }}
              placeholder={t('taskNamePlaceholder')}
              className="w-full px-0 py-1 text-sm border-0 focus:ring-0 focus:outline-none placeholder-slate-400"
            />
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              className="w-full px-0 py-1 text-xs text-slate-500 border-0 focus:ring-0 focus:outline-none placeholder-slate-300"
            />
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <div className="relative">
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="text-xs px-2 py-1 border border-slate-200 rounded hover:border-slate-300 focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                />
              </div>
              <div className="flex items-center gap-1 border border-slate-200 rounded px-1">
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => setNewPriority(newPriority === p ? 0 : p)}
                    className={`p-1 rounded transition-colors ${newPriority === p ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                  >
                    <FlagIcon priority={newPriority === p ? p : 0} />
                  </button>
                ))}
              </div>
              <div className="flex-1" />
              <button
                onClick={() => {
                  setShowAddInput(false)
                  setNewTitle('')
                  setNewDescription('')
                  setNewDueDate('')
                  setNewPriority(0)
                }}
                className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleAddTodo}
                disabled={!newTitle.trim() || isAdding}
                className="px-3 py-1 text-xs bg-rose-500 text-white rounded hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? t('adding') : t('addTask')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Tasks */}
      <div className="divide-y divide-slate-100">
        {activeTodos.length === 0 && completedTodos.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-slate-500">{t('allDone')}</p>
          </div>
        ) : (
          activeTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 group transition-colors"
            >
              {/* Checkbox */}
              <button
                onClick={() => handleToggle(todo)}
                className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all ${
                  priorityColors[todo.priority] || 'border-slate-300 hover:bg-slate-100'
                }`}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800">{todo.title}</p>
                {todo.description && (
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{todo.description}</p>
                )}
                {todo.due_date && (
                  <span className={`inline-flex items-center gap-1 text-xs mt-1 ${getDueDateColor(todo.due_date)}`}>
                    <CalendarIcon />
                    {formatDueDate(todo.due_date)}
                  </span>
                )}
              </div>

              {/* Priority Flag */}
              {todo.priority > 0 && (
                <FlagIcon priority={todo.priority} />
              )}

              {/* Actions Menu */}
              <div className="relative" ref={activeMenu === todo.id ? menuRef : null}>
                <button
                  onClick={() => setActiveMenu(activeMenu === todo.id ? null : todo.id)}
                  className="p-1 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-slate-600 hover:bg-slate-200 rounded transition-all"
                >
                  <MoreIcon />
                </button>
                {activeMenu === todo.id && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 mb-2">{t('priority')}</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 0].map((p) => (
                          <button
                            key={p}
                            onClick={() => handleUpdatePriority(todo.id, p)}
                            className={`p-1.5 rounded flex-1 ${todo.priority === p ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                          >
                            <FlagIcon priority={p} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="w-full px-3 py-2 text-left text-sm text-rose-500 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <TrashIcon />
                      {t('delete')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed Tasks */}
      {completedTodos.length > 0 && (
        <div className="border-t border-slate-200">
          <details className="group">
            <summary className="px-4 py-3 text-sm text-slate-500 cursor-pointer hover:bg-slate-50 flex items-center gap-2">
              <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('completed')} ({completedTodos.length})
            </summary>
            <div className="divide-y divide-slate-100 bg-slate-50/50">
              {completedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-start gap-3 px-4 py-3 group"
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggle(todo)}
                    className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-slate-300 flex items-center justify-center text-white"
                  >
                    <CheckIcon />
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-400 line-through">{todo.title}</p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="p-1 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-rose-500 rounded transition-all"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  )
}
