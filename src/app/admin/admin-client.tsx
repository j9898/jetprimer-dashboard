'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { User } from '@supabase/supabase-js'
import { useToast } from '@/components/Toast'

// Icons
const PlaneIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
)

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
)

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const GlobeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
)

const NoteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const SaveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

const CheckboxIcon = ({ checked }: { checked: boolean }) => (
  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
    checked ? 'bg-slate-700 border-slate-700' : 'border-slate-300 bg-white'
  }`}>
    {checked && (
      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    )}
  </div>
)

interface Step {
  id: number
  customer_id: number
  step_key?: string
  step_name?: string
  step_order: number
  status: string
  completed_at: string | null
}

interface Customer {
  id: number
  user_id: string
  name: string
  email: string
  locale?: string
  email_locale?: string
  admin_notes?: string
  is_paid?: boolean
  flight_code: string
  created_at: string
  steps: Step[]
}

interface EmailLog {
  id: number
  created_at: string
  customer_id: number
  recipient_email: string
  subject: string
  step_key: string
  status: string
  sent_by: string
}

interface Props {
  user: User
  customers: Customer[]
  emailLogs: EmailLog[]
}

export default function AdminClient({ user, customers, emailLogs }: Props) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'emails'>('dashboard')
  const [isUpdatingLocale, setIsUpdatingLocale] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const [notesSaved, setNotesSaved] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUpdatingPaidStatus, setIsUpdatingPaidStatus] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid'>('all')
  const [emailPreview, setEmailPreview] = useState<{
    customerId: number
    stepKey: string
    status: string
    customerName: string
    customerEmail: string
    locale: string
  } | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewSubject, setPreviewSubject] = useState('')
  const [customerPage, setCustomerPage] = useState(1)
  const [emailPage, setEmailPage] = useState(1)
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<Set<number>>(new Set())
  const [isBulkUpdating, setIsBulkUpdating] = useState(false)
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [newTodoDescription, setNewTodoDescription] = useState('')
  const [isAddingTodo, setIsAddingTodo] = useState(false)
  const [showTodoInput, setShowTodoInput] = useState(false)
  const ITEMS_PER_PAGE = 10
  const t = useTranslations('admin')
  const tCommon = useTranslations('common')
  const tDashboard = useTranslations('dashboard')
  const tLanguage = useTranslations('language')

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const updateStepStatus = async (stepId: number, newStatus: string) => {
    setIsUpdating(true)
    const supabase = createClient()

    const updateData: { status: string; completed_at?: string | null } = { status: newStatus }

    if (newStatus === 'completed') {
      updateData.completed_at = new Date().toISOString()
    } else {
      updateData.completed_at = null
    }

    const { error } = await supabase
      .from('steps')
      .update(updateData)
      .eq('id', stepId)

    if (error) {
      console.error('Update error:', error)
      showToast('Update failed: ' + error.message, 'error')
    } else {
      showToast('Status updated', 'success')
      router.refresh()
    }
    setIsUpdating(false)
  }

  // 이메일 발송 언어 설정 업데이트 (고객 설정 언어와 별개)
  const updateEmailLocale = async (customerId: number, newLocale: string) => {
    setIsUpdatingLocale(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('customers')
      .update({ email_locale: newLocale })
      .eq('id', customerId)

    if (error) {
      console.error('Email locale update error:', error)
      showToast(t('localeUpdateFailed'), 'error')
    } else {
      // 선택된 고객 정보 업데이트
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer({ ...selectedCustomer, email_locale: newLocale })
      }
      router.refresh()
    }
    setIsUpdatingLocale(false)
  }

  // 관리자 메모 저장
  const saveAdminNotes = async (customerId: number) => {
    setIsSavingNotes(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('customers')
      .update({ admin_notes: adminNotes })
      .eq('id', customerId)

    if (error) {
      console.error('Admin notes save error:', error)
      showToast(t('notesSaveFailed'), 'error')
    } else {
      // 선택된 고객 정보 업데이트
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer({ ...selectedCustomer, admin_notes: adminNotes })
      }
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 2000)
      router.refresh()
    }
    setIsSavingNotes(false)
  }

  // 결제 상태 업데이트
  const updatePaidStatus = async (customerId: number, isPaid: boolean) => {
    setIsUpdatingPaidStatus(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('customers')
      .update({ is_paid: isPaid })
      .eq('id', customerId)

    if (error) {
      console.error('Paid status update error:', error)
      showToast(t('paidStatusUpdateFailed'), 'error')
    } else {
      // 선택된 고객 정보 업데이트
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer({ ...selectedCustomer, is_paid: isPaid })
      }
      router.refresh()
    }
    setIsUpdatingPaidStatus(false)
  }

  // 관리자 할 일 추가
  const addTodoForCustomer = async () => {
    if (!selectedCustomer || !newTodoTitle.trim()) return

    setIsAddingTodo(true)
    try {
      const response = await fetch('/api/admin/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: selectedCustomer.id,
          title: newTodoTitle,
          description: newTodoDescription || null,
        })
      })

      const result = await response.json()

      if (result.success) {
        showToast(t('todoAdded'), 'success')
        setNewTodoTitle('')
        setNewTodoDescription('')
        setShowTodoInput(false)
      } else {
        showToast(t('todoAddFailed'), 'error')
      }
    } catch (error) {
      console.error('Add todo error:', error)
      showToast(t('todoAddFailed'), 'error')
    }
    setIsAddingTodo(false)
  }

  // 고객 선택 시 메모 로드
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setAdminNotes(customer.admin_notes || '')
    setNotesSaved(false)
    setNewTodoTitle('')
    setNewTodoDescription('')
    setShowTodoInput(false)
  }

  // 이메일 미리보기 열기
  const openEmailPreview = async (customerId: number, stepKey: string, status: string, customerName: string, customerEmail: string, locale: string) => {
    setEmailPreview({ customerId, stepKey, status, customerName, customerEmail, locale })
    setIsLoadingPreview(true)
    setPreviewHtml('')
    setPreviewSubject('')

    try {
      const response = await fetch('/api/admin/email-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          stepKey,
          newStatus: status,
          locale
        })
      })

      const result = await response.json()

      if (result.success) {
        setPreviewSubject(result.subject)
        setPreviewHtml(result.html)
      } else {
        showToast(t('emailFailed') + ': ' + result.error, 'error')
        setEmailPreview(null)
      }
    } catch (error) {
      console.error('Email preview error:', error)
      showToast(t('emailFailed'), 'error')
      setEmailPreview(null)
    }
    setIsLoadingPreview(false)
  }

  // 이메일 발송
  const sendNotificationEmail = async () => {
    if (!emailPreview) return

    setIsSendingEmail(emailPreview.customerId)
    try {
      const response = await fetch('/api/admin/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: emailPreview.customerId,
          stepKey: emailPreview.stepKey,
          newStatus: emailPreview.status,
          locale: emailPreview.locale
        })
      })

      const result = await response.json()

      if (result.success) {
        showToast(t('emailSent'), 'success')
        setEmailPreview(null)
        router.refresh()
      } else {
        showToast(t('emailFailed') + ': ' + result.error, 'error')
      }
    } catch (error) {
      console.error('Email send error:', error)
      showToast(t('emailFailed'), 'error')
    }
    setIsSendingEmail(null)
  }

  // 현재 진행 단계 계산
  const getCurrentStep = (steps: Step[]) => {
    if (!steps || steps.length === 0) return null

    const inProgress = steps.find(s => s.status === 'in_progress')
    if (inProgress) return inProgress.step_key || inProgress.step_name

    const pending = steps.find(s => s.status === 'pending')
    if (pending) return pending.step_key || pending.step_name

    return 'completed'
  }

  // 진행률 계산
  const getProgress = (steps: Step[]) => {
    if (!steps || steps.length === 0) return 0
    const completed = steps.filter(s => s.status === 'completed').length
    return Math.round((completed / steps.length) * 100)
  }

  // 고객 필터링
  const filteredCustomers = customers.filter(customer => {
    // 검색 필터
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = !searchQuery ||
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.flight_code.toLowerCase().includes(searchLower)

    // 결제 상태 필터
    const matchesPayment = filterStatus === 'all' ||
      (filterStatus === 'paid' && customer.is_paid) ||
      (filterStatus === 'unpaid' && !customer.is_paid)

    return matchesSearch && matchesPayment
  })

  // 페이지네이션 계산
  const totalCustomerPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE)
  const paginatedCustomers = filteredCustomers.slice(
    (customerPage - 1) * ITEMS_PER_PAGE,
    customerPage * ITEMS_PER_PAGE
  )

  const totalEmailPages = Math.ceil(emailLogs.length / ITEMS_PER_PAGE)
  const paginatedEmailLogs = emailLogs.slice(
    (emailPage - 1) * ITEMS_PER_PAGE,
    emailPage * ITEMS_PER_PAGE
  )

  // 검색/필터 변경 시 페이지 리셋
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCustomerPage(1)
  }

  const handleFilterChange = (status: 'all' | 'paid' | 'unpaid') => {
    setFilterStatus(status)
    setCustomerPage(1)
  }

  // 고객 선택 토글
  const toggleCustomerSelection = (customerId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    const newSelection = new Set(selectedCustomerIds)
    if (newSelection.has(customerId)) {
      newSelection.delete(customerId)
    } else {
      newSelection.add(customerId)
    }
    setSelectedCustomerIds(newSelection)
  }

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedCustomerIds.size === filteredCustomers.length) {
      setSelectedCustomerIds(new Set())
    } else {
      setSelectedCustomerIds(new Set(filteredCustomers.map(c => c.id)))
    }
  }

  // 벌크 결제 상태 업데이트
  const bulkUpdatePaymentStatus = async (isPaid: boolean) => {
    if (selectedCustomerIds.size === 0) return

    setIsBulkUpdating(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('customers')
        .update({ is_paid: isPaid })
        .in('id', Array.from(selectedCustomerIds))

      if (error) {
        console.error('Bulk update error:', error)
        showToast(t('bulkUpdateFailed'), 'error')
      } else {
        showToast(t('bulkUpdateSuccess', { count: selectedCustomerIds.size }), 'success')
        setSelectedCustomerIds(new Set())
        router.refresh()
      }
    } catch (error) {
      console.error('Bulk update error:', error)
      showToast(t('bulkUpdateFailed'), 'error')
    }
    setIsBulkUpdating(false)
  }

  // 선택 해제
  const clearSelection = () => {
    setSelectedCustomerIds(new Set())
  }

  // 통계 계산
  const stats = {
    totalCustomers: customers.length,
    paidCustomers: customers.filter(c => c.is_paid).length,
    unpaidCustomers: customers.filter(c => !c.is_paid).length,
    completedCustomers: customers.filter(c => {
      const allCompleted = c.steps.length > 0 && c.steps.every(s => s.status === 'completed')
      return allCompleted
    }).length,
    inProgressCustomers: customers.filter(c => {
      const hasInProgress = c.steps.some(s => s.status === 'in_progress')
      return hasInProgress
    }).length,
    totalEmailsSent: emailLogs.filter(l => l.status === 'sent').length,
    totalEmailsFailed: emailLogs.filter(l => l.status === 'failed').length,
    // 이번 주 신규 고객
    newThisWeek: customers.filter(c => {
      const createdDate = new Date(c.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return createdDate >= weekAgo
    }).length,
    // 이번 달 신규 고객
    newThisMonth: customers.filter(c => {
      const createdDate = new Date(c.created_at)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return createdDate >= monthAgo
    }).length
  }

  // 단계별 통계
  const stepStats = {
    documents: { pending: 0, inProgress: 0, completed: 0 },
    llc: { pending: 0, inProgress: 0, completed: 0 },
    ein: { pending: 0, inProgress: 0, completed: 0 },
    bank: { pending: 0, inProgress: 0, completed: 0 }
  }

  customers.forEach(customer => {
    customer.steps.forEach(step => {
      const key = (step.step_key || 'documents') as keyof typeof stepStats
      if (stepStats[key]) {
        if (step.status === 'completed') stepStats[key].completed++
        else if (step.status === 'in_progress') stepStats[key].inProgress++
        else stepStats[key].pending++
      }
    })
  })

  // CSV 내보내기 - 고객
  const exportCustomersToCSV = () => {
    const headers = ['Name', 'Email', 'Flight Code', 'Join Date', 'Payment Status', 'Progress', 'Current Step']
    const rows = filteredCustomers.map(customer => {
      const progress = getProgress(customer.steps)
      const currentStep = getCurrentStep(customer.steps)
      return [
        customer.name,
        customer.email,
        customer.flight_code,
        new Date(customer.created_at).toLocaleDateString(),
        customer.is_paid ? 'Paid' : 'Unpaid',
        `${progress}%`,
        currentStep || '-'
      ]
    })

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast(t('csvExported'), 'success')
  }

  // CSV 내보내기 - 이메일 로그
  const exportEmailLogsToCSV = () => {
    const headers = ['Sent At', 'Recipient', 'Subject', 'Step', 'Status', 'Sent By']
    const rows = emailLogs.map(log => [
      new Date(log.created_at).toLocaleString(),
      log.recipient_email,
      log.subject,
      log.step_key || '-',
      log.status,
      log.sent_by
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `email_logs_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast(t('csvExported'), 'success')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-zinc-100">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-slate-400/30">
              <PlaneIcon />
            </div>
            <h1 className="text-lg font-bold text-slate-800">JetPrimer Admin</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-700"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: fixed, Mobile: slide-in */}
      <div className={`
        w-64 bg-white/70 backdrop-blur-xl border-r border-white/50 shadow-lg shadow-slate-200/30 flex flex-col h-screen fixed left-0 top-0 z-40
        transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-slate-400/30">
                <PlaneIcon />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">JetPrimer</h1>
                <p className="text-xs text-slate-500">{t('console')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg shadow-slate-400/30'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ChartIcon />
                <span className="text-sm font-medium">{t('dashboardTab')}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'customers'
                    ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg shadow-slate-400/30'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UsersIcon />
                <span className="text-sm font-medium">{t('title')}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('emails')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'emails'
                    ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg shadow-slate-400/30'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MailIcon />
                <span className="text-sm font-medium">{t('emailHistory')}</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-200/50">
          <div className="mb-3 px-4">
            <p className="text-xs text-slate-400">{t('administrator')}</p>
            <p className="text-sm text-slate-700 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all"
          >
            <LogoutIcon />
            <span className="text-sm font-medium">
              {isLoggingOut ? tCommon('loggingOut') : tCommon('logout')}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8">
        <div className="max-w-6xl">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              {activeTab === 'dashboard' ? t('dashboardTab') : activeTab === 'customers' ? t('title') : t('emailHistory')}
            </h1>
            <p className="text-slate-500 text-sm md:text-base">
              {activeTab === 'dashboard'
                ? t('dashboardDescription')
                : activeTab === 'customers'
                  ? t('totalCustomers', { count: customers.length })
                  : t('totalEmails', { count: emailLogs.length })}
            </p>
          </div>

          {activeTab === 'dashboard' ? (
          /* Dashboard Tab */
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-6">
                <p className="text-slate-500 text-sm mb-1">{t('stats.totalCustomers')}</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalCustomers}</p>
              </div>
              <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-6">
                <p className="text-slate-500 text-sm mb-1">{t('stats.paidCustomers')}</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.paidCustomers}</p>
              </div>
              <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-6">
                <p className="text-slate-500 text-sm mb-1">{t('stats.unpaidCustomers')}</p>
                <p className="text-3xl font-bold text-amber-600">{stats.unpaidCustomers}</p>
              </div>
              <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-6">
                <p className="text-slate-500 text-sm mb-1">{t('stats.completedCustomers')}</p>
                <p className="text-3xl font-bold text-sky-600">{stats.completedCustomers}</p>
              </div>
            </div>

            {/* New Customers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('stats.newCustomers')}</h3>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-slate-500 text-sm">{t('stats.thisWeek')}</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.newThisWeek}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">{t('stats.thisMonth')}</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.newThisMonth}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('stats.emailStats')}</h3>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-slate-500 text-sm">{t('stats.emailsSent')}</p>
                    <p className="text-2xl font-bold text-emerald-600">{stats.totalEmailsSent}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">{t('stats.emailsFailed')}</p>
                    <p className="text-2xl font-bold text-red-600">{stats.totalEmailsFailed}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step Progress */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('stats.stepProgress')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(['documents', 'llc', 'ein', 'bank'] as const).map((step) => {
                  const total = stepStats[step].pending + stepStats[step].inProgress + stepStats[step].completed
                  const completedPercent = total > 0 ? Math.round((stepStats[step].completed / total) * 100) : 0
                  return (
                    <div key={step} className="bg-slate-50 rounded-xl p-4">
                      <p className="text-slate-700 font-medium mb-2">{tDashboard(`steps.${step}`)}</p>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                          style={{ width: `${completedPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{t('stats.completed')}: {stepStats[step].completed}</span>
                        <span>{t('stats.inProgress')}: {stepStats[step].inProgress}</span>
                        <span>{t('stats.pending')}: {stepStats[step].pending}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Payment Rate */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('stats.paymentRate')}</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                      style={{ width: `${stats.totalCustomers > 0 ? Math.round((stats.paidCustomers / stats.totalCustomers) * 100) : 0}%` }}
                    />
                  </div>
                </div>
                <span className="text-2xl font-bold text-slate-800">
                  {stats.totalCustomers > 0 ? Math.round((stats.paidCustomers / stats.totalCustomers) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
          ) : activeTab === 'customers' ? (
          <>
          {/* Bulk Action Bar */}
          {selectedCustomerIds.size > 0 && (
            <div className="mb-4 p-4 bg-slate-700 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-white text-sm font-medium">
                {t('selectedCount', { count: selectedCustomerIds.size })}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => bulkUpdatePaymentStatus(true)}
                  disabled={isBulkUpdating}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all disabled:opacity-50"
                >
                  {t('bulkMarkPaid')}
                </button>
                <button
                  onClick={() => bulkUpdatePaymentStatus(false)}
                  disabled={isBulkUpdating}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-all disabled:opacity-50"
                >
                  {t('bulkMarkUnpaid')}
                </button>
                <button
                  onClick={clearSelection}
                  className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-all"
                >
                  {t('clearSelection')}
                </button>
              </div>
            </div>
          )}

          {/* Search, Filter and Export Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 items-start sm:items-center">
            {/* Select All */}
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-all"
            >
              <CheckboxIcon checked={selectedCustomerIds.size === filteredCustomers.length && filteredCustomers.length > 0} />
              <span className="hidden sm:inline">{t('selectAll')}</span>
            </button>
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-white/70 backdrop-blur-xl border border-white/50 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400 transition-all"
              />
            </div>
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  filterStatus === 'all'
                    ? 'bg-slate-700 text-white'
                    : 'bg-white/70 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t('filterAll')}
              </button>
              <button
                onClick={() => handleFilterChange('paid')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  filterStatus === 'paid'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/70 text-slate-600 hover:bg-emerald-50'
                }`}
              >
                {t('paid')}
              </button>
              <button
                onClick={() => handleFilterChange('unpaid')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  filterStatus === 'unpaid'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/70 text-slate-600 hover:bg-amber-50'
                }`}
              >
                {t('unpaid')}
              </button>
            </div>
            </div>
            {/* Export Button */}
            <button
              onClick={exportCustomersToCSV}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white/70 hover:bg-slate-100 rounded-xl transition-all whitespace-nowrap"
            >
              <DownloadIcon />
              {t('exportCSV')}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Customer List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredCustomers.length === 0 ? (
                <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-8 text-center">
                  <p className="text-slate-500">{searchQuery ? t('noSearchResults') : t('noCustomers')}</p>
                </div>
              ) : (
                paginatedCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => handleSelectCustomer(customer)}
                    className={`bg-white/70 backdrop-blur-xl border shadow-lg shadow-slate-200/30 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-xl ${
                      selectedCustomer?.id === customer.id
                        ? 'border-slate-400 ring-2 ring-slate-400/20'
                        : selectedCustomerIds.has(customer.id)
                          ? 'border-slate-300 bg-slate-50'
                          : 'border-white/50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={(e) => toggleCustomerSelection(customer.id, e)}
                          className="mt-1 flex-shrink-0"
                        >
                          <CheckboxIcon checked={selectedCustomerIds.has(customer.id)} />
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-800">{customer.name}</h3>
                          {customer.is_paid ? (
                            <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                              {t('paid')}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-500 rounded-full">
                              {t('unpaid')}
                            </span>
                          )}
                          </div>
                          <p className="text-slate-500 text-sm truncate">{customer.email}</p>
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-slate-400 text-xs">{t('flightCode')}</p>
                        <p className="font-mono text-slate-700">{customer.flight_code}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-500">{t('progress')}</span>
                        <span className="text-slate-700 font-medium">{getProgress(customer.steps)}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all"
                          style={{ width: `${getProgress(customer.steps)}%` }}
                        />
                      </div>
                    </div>

                    {/* Current Step */}
                    <div className="flex items-center gap-2 text-sm">
                      <ClockIcon />
                      <span className="text-slate-500">{t('currentStep')}:</span>
                      <span className="text-slate-700 font-medium">
                        {getCurrentStep(customer.steps)
                          ? (getCurrentStep(customer.steps) === 'completed'
                              ? t('status.completed')
                              : tDashboard(`steps.${getCurrentStep(customer.steps)}`))
                          : '-'}
                      </span>
                    </div>
                  </div>
                ))
              )}

              {/* Customer Pagination */}
              {totalCustomerPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    onClick={() => setCustomerPage(p => Math.max(1, p - 1))}
                    disabled={customerPage === 1}
                    className="px-3 py-2 text-sm font-medium text-slate-600 bg-white/70 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {t('prevPage')}
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalCustomerPages }, (_, i) => i + 1)
                      .filter(page => {
                        // 현재 페이지 근처 3개만 표시
                        return Math.abs(page - customerPage) <= 1 || page === 1 || page === totalCustomerPages
                      })
                      .map((page, index, arr) => (
                        <span key={page} className="flex items-center">
                          {index > 0 && arr[index - 1] !== page - 1 && (
                            <span className="px-2 text-slate-400">...</span>
                          )}
                          <button
                            onClick={() => setCustomerPage(page)}
                            className={`w-8 h-8 text-sm font-medium rounded-lg transition-all ${
                              customerPage === page
                                ? 'bg-slate-700 text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {page}
                          </button>
                        </span>
                      ))}
                  </div>
                  <button
                    onClick={() => setCustomerPage(p => Math.min(totalCustomerPages, p + 1))}
                    disabled={customerPage === totalCustomerPages}
                    className="px-3 py-2 text-sm font-medium text-slate-600 bg-white/70 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {t('nextPage')}
                  </button>
                </div>
              )}
            </div>

            {/* Customer Detail Panel */}
            <div className="space-y-4">
              {selectedCustomer ? (
                <>
                  {/* Customer Info Card */}
                  <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('customerInfo')}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-xs">{t('name')}</p>
                        <p className="text-slate-700">{selectedCustomer.name}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">{t('email')}</p>
                        <p className="text-slate-700">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">{t('flightCode')}</p>
                        <p className="text-slate-700 font-mono">{selectedCustomer.flight_code}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">{t('joinDate')}</p>
                        <p className="text-slate-700">
                          {new Date(selectedCustomer.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs flex items-center gap-1">
                          <GlobeIcon />
                          {t('customerLanguage')}
                        </p>
                        <p className="text-slate-700 font-medium">
                          {tLanguage(selectedCustomer.locale || 'ko')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email Language Selection Card */}
                  <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('emailLanguageSettings')}</h3>
                    <p className="text-slate-500 text-xs mb-3">{t('emailLanguageDescription')}</p>
                    <div className="flex gap-2">
                      {(['ko', 'en', 'ja'] as const).map((locale) => (
                        <button
                          key={locale}
                          onClick={() => updateEmailLocale(selectedCustomer.id, locale)}
                          disabled={isUpdatingLocale}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            (selectedCustomer.email_locale || 'ko') === locale
                              ? 'bg-slate-700 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          } disabled:opacity-50`}
                        >
                          {tLanguage(locale)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Status Card */}
                  <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('paymentStatus')}</h3>
                    <p className="text-slate-500 text-xs mb-3">{t('paymentStatusDescription')}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updatePaidStatus(selectedCustomer.id, false)}
                        disabled={isUpdatingPaidStatus}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          !selectedCustomer.is_paid
                            ? 'bg-slate-700 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        } disabled:opacity-50`}
                      >
                        {t('unpaid')}
                      </button>
                      <button
                        onClick={() => updatePaidStatus(selectedCustomer.id, true)}
                        disabled={isUpdatingPaidStatus}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          selectedCustomer.is_paid
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
                        } disabled:opacity-50`}
                      >
                        {t('paid')}
                      </button>
                    </div>
                  </div>

                  {/* Admin Notes Card */}
                  <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                      <NoteIcon />
                      {t('adminNotes')}
                    </h3>
                    <p className="text-slate-500 text-xs mb-3">{t('adminNotesDescription')}</p>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => {
                        setAdminNotes(e.target.value)
                        setNotesSaved(false)
                      }}
                      placeholder={t('adminNotesPlaceholder')}
                      className="w-full h-32 p-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400 transition-all"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs transition-opacity ${notesSaved ? 'text-emerald-600 opacity-100' : 'opacity-0'}`}>
                        {t('notesSaved')}
                      </span>
                      <button
                        onClick={() => saveAdminNotes(selectedCustomer.id)}
                        disabled={isSavingNotes}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 rounded-lg transition-all disabled:opacity-50"
                      >
                        <SaveIcon />
                        {isSavingNotes ? t('saving') : t('saveNotes')}
                      </button>
                    </div>
                  </div>

                  {/* Customer Todo Card */}
                  <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                      📋 {t('customerTodo')}
                    </h3>
                    <p className="text-slate-500 text-xs mb-3">{t('customerTodoDescription')}</p>

                    {!showTodoInput ? (
                      <button
                        onClick={() => setShowTodoInput(true)}
                        className="w-full py-2.5 px-4 text-sm font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {t('addTodoForCustomer')}
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={newTodoTitle}
                          onChange={(e) => setNewTodoTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newTodoTitle.trim()) addTodoForCustomer()
                            if (e.key === 'Escape') {
                              setShowTodoInput(false)
                              setNewTodoTitle('')
                              setNewTodoDescription('')
                            }
                          }}
                          placeholder={t('todoTitlePlaceholder')}
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400 transition-all"
                          autoFocus
                        />
                        <input
                          type="text"
                          value={newTodoDescription}
                          onChange={(e) => setNewTodoDescription(e.target.value)}
                          placeholder={t('todoDescriptionPlaceholder')}
                          className="w-full px-3 py-2 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400 transition-all"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setShowTodoInput(false)
                              setNewTodoTitle('')
                              setNewTodoDescription('')
                            }}
                            className="flex-1 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
                          >
                            {t('cancel')}
                          </button>
                          <button
                            onClick={addTodoForCustomer}
                            disabled={!newTodoTitle.trim() || isAddingTodo}
                            className="flex-1 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-all disabled:opacity-50"
                          >
                            {isAddingTodo ? t('addingTodo') : t('addTodo')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Steps Card */}
                  <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('steps')}</h3>
                    <div className="space-y-3">
                      {(!selectedCustomer.steps || selectedCustomer.steps.length === 0) ? (
                        <p className="text-slate-400 text-sm text-center py-4">No steps data</p>
                      ) : selectedCustomer.steps.map((step) => {
                        const stepKey = step.step_key || step.step_name || ''

                        return (
                          <div
                            key={step.id}
                            className="p-4 bg-slate-50 rounded-xl"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-slate-700 font-medium">
                                {tDashboard(`steps.${stepKey}`)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                step.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-600'
                                  : step.status === 'in_progress'
                                    ? 'bg-amber-100 text-amber-600'
                                    : 'bg-slate-100 text-slate-500'
                              }`}>
                                {t(`status.${step.status === 'in_progress' ? 'inProgress' : step.status}`)}
                              </span>
                            </div>

                            {/* Status Buttons */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateStepStatus(step.id, 'pending')}
                                disabled={isUpdating || step.status === 'pending'}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                                  step.status === 'pending'
                                    ? 'bg-slate-200 text-slate-600'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                } disabled:opacity-50`}
                              >
                                {t('status.pending')}
                              </button>
                              <button
                                onClick={() => updateStepStatus(step.id, 'in_progress')}
                                disabled={isUpdating || step.status === 'in_progress'}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                                  step.status === 'in_progress'
                                    ? 'bg-amber-200 text-amber-700'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-amber-50'
                                } disabled:opacity-50`}
                              >
                                {t('status.inProgress')}
                              </button>
                              <button
                                onClick={() => updateStepStatus(step.id, 'completed')}
                                disabled={isUpdating || step.status === 'completed'}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                                  step.status === 'completed'
                                    ? 'bg-emerald-200 text-emerald-700'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'
                                } disabled:opacity-50`}
                              >
                                <CheckIcon />
                                {t('status.completed')}
                              </button>
                            </div>

                            {/* Email & Completed Info */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                              {step.completed_at && (
                                <p className="text-slate-400 text-xs">
                                  {t('completedAt')}: {new Date(step.completed_at).toLocaleDateString()}
                                </p>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openEmailPreview(
                                    selectedCustomer.id,
                                    stepKey,
                                    step.status,
                                    selectedCustomer.name,
                                    selectedCustomer.email,
                                    selectedCustomer.email_locale || selectedCustomer.locale || 'ko'
                                  )
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg transition-all ml-auto"
                              >
                                <MailIcon />
                                {t('sendEmail')}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl p-8 text-center">
                  <p className="text-slate-400">{t('selectCustomer')}</p>
                </div>
              )}
            </div>
          </div>
          </>
          ) : (
          /* Email History Tab */
          <div className="space-y-4">
            {/* Export Button */}
            <div className="flex justify-end">
              <button
                onClick={exportEmailLogsToCSV}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white/70 hover:bg-slate-100 rounded-xl transition-all"
              >
                <DownloadIcon />
                {t('exportCSV')}
              </button>
            </div>
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/30 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">{t('sentAt')}</th>
                    <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">{t('recipient')}</th>
                    <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">{t('subject')}</th>
                    <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">{t('step')}</th>
                    <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">{t('emailStatus')}</th>
                    <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">{t('sentBy')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {emailLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                        {t('noEmailLogs')}
                      </td>
                    </tr>
                  ) : (
                    paginatedEmailLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-slate-600 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-slate-700">
                          {log.recipient_email}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-slate-700 max-w-xs truncate">
                          {log.subject}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-slate-600 whitespace-nowrap">
                          {log.step_key ? tDashboard(`steps.${log.step_key}`) : '-'}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.status === 'sent'
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {log.status === 'sent' ? t('emailSentStatus') : t('emailFailedStatus')}
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-slate-500 truncate max-w-[150px]">
                          {log.sent_by}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Email Pagination */}
            {totalEmailPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-4 border-t border-slate-200">
                <button
                  onClick={() => setEmailPage(p => Math.max(1, p - 1))}
                  disabled={emailPage === 1}
                  className="px-3 py-2 text-sm font-medium text-slate-600 bg-white/70 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {t('prevPage')}
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalEmailPages }, (_, i) => i + 1)
                    .filter(page => Math.abs(page - emailPage) <= 1 || page === 1 || page === totalEmailPages)
                    .map((page, index, arr) => (
                      <span key={page} className="flex items-center">
                        {index > 0 && arr[index - 1] !== page - 1 && (
                          <span className="px-2 text-slate-400">...</span>
                        )}
                        <button
                          onClick={() => setEmailPage(page)}
                          className={`w-8 h-8 text-sm font-medium rounded-lg transition-all ${
                            emailPage === page
                              ? 'bg-slate-700 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {page}
                        </button>
                      </span>
                    ))}
                </div>
                <button
                  onClick={() => setEmailPage(p => Math.min(totalEmailPages, p + 1))}
                  disabled={emailPage === totalEmailPages}
                  className="px-3 py-2 text-sm font-medium text-slate-600 bg-white/70 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {t('nextPage')}
                </button>
              </div>
            )}
          </div>
          </div>
          )}
        </div>
      </main>

      {/* Email Preview Modal */}
      {emailPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEmailPreview(null)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">{t('emailPreview')}</h3>
              <button
                onClick={() => setEmailPreview(null)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-all"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoadingPreview ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {/* Email Info */}
                  <div className="mb-4 space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-slate-400 w-16">{t('recipient')}:</span>
                      <span className="text-slate-700">{emailPreview.customerEmail}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-slate-400 w-16">{t('subject')}:</span>
                      <span className="text-slate-700 font-medium">{previewSubject}</span>
                    </div>
                  </div>

                  {/* Email Preview */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <iframe
                      srcDoc={previewHtml}
                      className="w-full h-96 bg-white"
                      title="Email Preview"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setEmailPreview(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-all"
              >
                {t('cancel')}
              </button>
              <button
                onClick={sendNotificationEmail}
                disabled={isSendingEmail !== null || isLoadingPreview}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-all disabled:opacity-50"
              >
                <MailIcon />
                {isSendingEmail !== null ? t('sendingEmail') : t('confirmSend')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
