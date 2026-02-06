import { useState } from 'react'
import './App.css'

// Demo data for the dashboard
const demoCompany = {
  name: "Horizon Ventures LLC",
  flightNumber: "JP-2026-0042",
  state: "Wyoming",
  ein: "88-1234567",
  formed: "Feb 7, 2026",
  status: "cruising", // check-in, security, gate, boarding, takeoff, cruising
  captain: "Alex Chen",
  bank: "Mercury Financial",
  bankStatus: "Active"
}

const demoWaypoints = [
  { id: 1, name: "BOI Report", dueDate: "Apr 15, 2026", daysLeft: 71, status: "prepare" },
  { id: 2, name: "Annual Report", dueDate: "Jan 1, 2027", daysLeft: 298, status: "clear" },
  { id: 3, name: "RA Renewal", dueDate: "Feb 7, 2027", daysLeft: 362, status: "clear" },
]

const demoDocuments = [
  { id: 1, name: "Articles of Organization", type: "pdf", date: "Feb 7, 2026" },
  { id: 2, name: "Operating Agreement", type: "pdf", date: "Feb 7, 2026" },
  { id: 3, name: "EIN Letter (CP 575)", type: "pdf", date: "Feb 20, 2026" },
  { id: 4, name: "Business Plan", type: "pdf", date: "Feb 5, 2026" },
  { id: 5, name: "Bank Account Confirmation", type: "pdf", date: "Mar 1, 2026" },
]

const demoChecklist = [
  { id: 1, task: "Form 5472 Filing", completed: true, dueDate: "Apr 15, 2026" },
  { id: 2, task: "State Tax Review", completed: false, dueDate: "Apr 15, 2026" },
  { id: 3, task: "BOI Report Submission", completed: false, dueDate: "Apr 15, 2026" },
]

// Icons as simple SVG components
const PlaneIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
)

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const ChecklistIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
)

const FolderIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
)

const PassportIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
  </svg>
)

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const SupportIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
)

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

// Glass card style
const glassCard = "bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-sky-200/30"
const glassCardHover = "hover:bg-white/80 hover:shadow-xl hover:shadow-sky-200/40 transition-all duration-300"

// Sidebar Component
function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Flight Center', icon: <DashboardIcon /> },
    { id: 'calendar', label: 'Flight Plan', icon: <CalendarIcon /> },
    { id: 'checklist', label: 'Checklist', icon: <ChecklistIcon /> },
    { id: 'documents', label: 'Cargo Hold', icon: <FolderIcon /> },
    { id: 'company', label: 'My Passport', icon: <PassportIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ]

  return (
    <div className={`w-64 ${glassCard} flex flex-col h-screen fixed left-0 top-0`}>
      {/* Logo */}
      <div className="p-6 border-b border-sky-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-sky-400/30">
            <PlaneIcon />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">JetPrimer</h1>
            <p className="text-xs text-sky-600">Flight Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-400/30'
                    : 'text-slate-600 hover:bg-sky-100/50 hover:text-sky-700'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Support */}
      <div className="p-4 border-t border-sky-200/50">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-sky-100/50 hover:text-sky-700 transition-all">
          <SupportIcon />
          <span className="text-sm font-medium">Call Crew</span>
        </button>
      </div>
    </div>
  )
}

// Status Badge Component
function StatusBadge({ status }) {
  const statusConfig = {
    cruising: { label: 'CRUISING', bgColor: 'bg-emerald-100', textColor: 'text-emerald-600', dotColor: 'bg-emerald-500' },
    boarding: { label: 'BOARDING', bgColor: 'bg-sky-100', textColor: 'text-sky-600', dotColor: 'bg-sky-500' },
    gate: { label: 'AT GATE', bgColor: 'bg-blue-100', textColor: 'text-blue-600', dotColor: 'bg-blue-500' },
    delayed: { label: 'DELAYED', bgColor: 'bg-rose-100', textColor: 'text-rose-600', dotColor: 'bg-rose-500' },
    clear: { label: 'CLEAR', bgColor: 'bg-emerald-100', textColor: 'text-emerald-600', dotColor: 'bg-emerald-500' },
    prepare: { label: 'PREPARE', bgColor: 'bg-amber-100', textColor: 'text-amber-600', dotColor: 'bg-amber-500' },
  }

  const config = statusConfig[status] || statusConfig.clear

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor}`}>
      <div className={`w-2 h-2 rounded-full ${config.dotColor} ${status === 'cruising' ? 'animate-pulse' : ''}`}></div>
      <span className={`text-xs font-semibold ${config.textColor}`}>{config.label}</span>
    </div>
  )
}

// Flight Status Card Component
function FlightStatusCard({ company }) {
  return (
    <div className={`${glassCard} ${glassCardHover} rounded-2xl p-6`}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-slate-500 text-sm mb-1">Flight</p>
          <p className="text-sky-600 font-mono text-lg font-semibold">{company.flightNumber}</p>
        </div>
        <StatusBadge status={company.status} />
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">{company.name}</h2>
        <p className="text-slate-500">Captain {company.captain}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-sky-200/50">
        <div>
          <p className="text-slate-400 text-xs mb-1">DESTINATION</p>
          <p className="text-slate-700 font-medium">{company.state}, USA 🇺🇸</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">FORMED</p>
          <p className="text-slate-700 font-medium">{company.formed}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">EIN</p>
          <p className="text-slate-700 font-mono">{company.ein}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">BANK</p>
          <p className="text-emerald-600 font-medium">{company.bank}</p>
        </div>
      </div>
    </div>
  )
}

// Waypoint Item Component
function WaypointItem({ waypoint }) {
  const isUrgent = waypoint.daysLeft <= 30
  const isPrepare = waypoint.status === 'prepare'

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl ${
      isPrepare
        ? 'bg-amber-50/80 border border-amber-200/50'
        : 'bg-white/50 border border-white/50'
    } backdrop-blur-sm`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isPrepare ? 'bg-amber-100' : 'bg-sky-100'
        }`}>
          <span className="text-lg">📍</span>
        </div>
        <div>
          <p className="text-slate-800 font-medium">{waypoint.name}</p>
          <p className="text-slate-500 text-sm">{waypoint.dueDate}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className={`px-3 py-1 rounded-full text-sm font-mono ${
          isUrgent
            ? 'bg-rose-100 text-rose-600'
            : isPrepare
              ? 'bg-amber-100 text-amber-600'
              : 'bg-slate-100 text-slate-500'
        }`}>
          D-{waypoint.daysLeft}
        </div>
        <StatusBadge status={waypoint.status} />
      </div>
    </div>
  )
}

// Dashboard Content
function DashboardContent({ company, waypoints }) {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Flight Center</h1>
          <p className="text-slate-500">Welcome aboard, Captain {company.captain}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-sm">Local Time</p>
          <p className="text-2xl font-mono text-slate-700">{currentTime}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Flight Status */}
        <div className="col-span-2">
          <FlightStatusCard company={company} />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className={`${glassCard} rounded-2xl p-6 text-center border-emerald-200/50`}>
            <div className="text-4xl font-bold text-emerald-500 mb-2">✓</div>
            <p className="text-emerald-600 font-medium">All Systems Normal</p>
            <p className="text-slate-500 text-sm mt-1">No immediate action required</p>
          </div>

          <div className={`${glassCard} rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500">Tasks</span>
              <span className="text-slate-800 font-bold">2/3</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full" style={{ width: '66%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Waypoints */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Upcoming Waypoints</h2>
          <button className="text-sky-600 text-sm hover:text-sky-700 transition-colors font-medium">
            View Flight Plan →
          </button>
        </div>
        <div className="space-y-3">
          {waypoints.map((wp) => (
            <WaypointItem key={wp.id} waypoint={wp} />
          ))}
        </div>
      </div>

      {/* Crew Message */}
      <div className="bg-gradient-to-r from-sky-100/80 to-blue-50/50 border border-sky-200/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-sky-200 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-lg">💬</span>
          </div>
          <div>
            <p className="text-sky-700 font-medium mb-1">Crew Message</p>
            <p className="text-slate-600">"Smooth cruising at 35,000 ft. Your next waypoint is BOI Report in 71 days. Enjoy the flight, Captain."</p>
            <p className="text-slate-400 text-sm mt-2">— JetPrimer Flight Crew • 2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Documents Content
function DocumentsContent({ documents }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Cargo Hold</h1>
        <p className="text-slate-500">Your important documents, safely stored</p>
      </div>

      <div className="grid gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`flex items-center justify-between p-4 ${glassCard} ${glassCardHover} rounded-xl cursor-pointer`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center text-rose-500">
                <DocumentIcon />
              </div>
              <div>
                <p className="text-slate-800 font-medium">{doc.name}</p>
                <p className="text-slate-500 text-sm">Added {doc.date}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-sky-100 hover:bg-sky-200 rounded-lg text-sky-700 transition-all">
              <DownloadIcon />
              <span className="text-sm">Download</span>
            </button>
          </div>
        ))}
      </div>

      <button className="w-full p-4 border-2 border-dashed border-sky-300 rounded-xl text-sky-500 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50/50 transition-all">
        + Upload Document
      </button>
    </div>
  )
}

// Checklist Content
function ChecklistContent({ checklist }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Pre-Flight Checklist</h1>
        <p className="text-slate-500">2026 Tax Season</p>
      </div>

      <div className="space-y-4">
        {checklist.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-sm ${
              item.completed
                ? 'bg-emerald-50/80 border-emerald-200/50'
                : `${glassCard}`
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                item.completed
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-slate-300'
              }`}>
                {item.completed && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <p className={`font-medium ${item.completed ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {item.task}
                </p>
                <p className="text-slate-500 text-sm">Due: {item.dueDate}</p>
              </div>
            </div>
            {!item.completed && (
              <button className="px-4 py-2 bg-sky-100 text-sky-700 rounded-lg text-sm hover:bg-sky-200 transition-all">
                Mark Complete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Company/Passport Content
function CompanyContent({ company }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">My Passport</h1>
        <p className="text-slate-500">Your company credentials</p>
      </div>

      {/* Boarding Pass Style Card */}
      <div className={`${glassCard} rounded-2xl overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <PlaneIcon />
            <span className="font-bold">JETPRIMER BOARDING PASS</span>
          </div>
          <span className="font-mono">{company.flightNumber}</span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-slate-400 text-xs mb-1">CAPTAIN</p>
              <p className="text-slate-800 text-xl font-bold">{company.captain}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">CLASS</p>
              <p className="text-sky-600 text-xl font-bold">Premium</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-slate-400 text-xs mb-1">FROM</p>
              <p className="text-slate-700 text-lg">Seoul, Korea 🇰🇷</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">TO</p>
              <p className="text-slate-700 text-lg">{company.state}, USA 🇺🇸</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-sky-200/50">
            <div>
              <p className="text-slate-400 text-xs mb-1">COMPANY</p>
              <p className="text-slate-700 font-medium">{company.name}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">EIN</p>
              <p className="text-slate-700 font-mono">{company.ein}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">FORMED</p>
              <p className="text-slate-700 font-medium">{company.formed}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-sky-200/50">
            <div>
              <p className="text-slate-400 text-xs mb-1">STATUS</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-600 font-semibold">CRUISING</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-slate-300 text-sm">|||||||||||||||||||||||||||</p>
              <p className="font-mono text-slate-400 text-xs">{company.flightNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`${glassCard} rounded-xl p-4`}>
          <p className="text-slate-400 text-xs mb-2">REGISTERED AGENT</p>
          <p className="text-slate-700 font-medium">Northwest Registered Agent</p>
          <p className="text-slate-500 text-sm">Renewal: Feb 7, 2027</p>
        </div>
        <div className={`${glassCard} rounded-xl p-4`}>
          <p className="text-slate-400 text-xs mb-2">BANK ACCOUNT</p>
          <p className="text-slate-700 font-medium">{company.bank}</p>
          <p className="text-emerald-600 text-sm">Active</p>
        </div>
      </div>
    </div>
  )
}

// Calendar Content (Simplified)
function CalendarContent({ waypoints }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Flight Plan</h1>
        <p className="text-slate-500">2026 Compliance Calendar</p>
      </div>

      {/* Month Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {months.map((month, i) => (
          <button
            key={month}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              i === 3
                ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white font-medium shadow-lg shadow-sky-400/30'
                : 'bg-white/70 text-slate-500 hover:bg-sky-100/50 border border-white/50'
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-sky-200"></div>

        <div className="space-y-6">
          {waypoints.map((wp) => (
            <div key={wp.id} className="flex gap-6 items-start">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                wp.status === 'prepare'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-400/30'
                  : 'bg-white border-2 border-sky-200'
              }`}>
                <span className="text-lg">📍</span>
              </div>
              <div className={`flex-1 ${glassCard} rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-slate-800 font-medium">{wp.name}</h3>
                  <StatusBadge status={wp.status} />
                </div>
                <p className="text-slate-500 text-sm">{wp.dueDate}</p>
                <p className="text-slate-400 text-sm mt-2">
                  {wp.status === 'prepare'
                    ? 'Action required before this date'
                    : 'No action needed yet'
                  }
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Settings Content
function SettingsContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Settings</h1>
        <p className="text-slate-500">Manage your preferences</p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <div className={`${glassCard} rounded-xl p-6`}>
          <h3 className="text-slate-800 font-medium mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-700">Email Alerts</p>
                <p className="text-slate-500 text-sm">Receive important updates via email</p>
              </div>
              <div className="w-12 h-6 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-700">30-Day Reminders</p>
                <p className="text-slate-500 text-sm">Get notified 30 days before deadlines</p>
              </div>
              <div className="w-12 h-6 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-700">7-Day Reminders</p>
                <p className="text-slate-500 text-sm">Get notified 7 days before deadlines</p>
              </div>
              <div className="w-12 h-6 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className={`${glassCard} rounded-xl p-6`}>
          <h3 className="text-slate-800 font-medium mb-4">Account</h3>
          <div className="space-y-4">
            <div>
              <p className="text-slate-500 text-sm mb-1">Email</p>
              <p className="text-slate-700">alex.chen@example.com</p>
            </div>
            <button className="text-sky-600 text-sm hover:text-sky-700 font-medium">
              Change Password →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent company={demoCompany} waypoints={demoWaypoints} />
      case 'calendar':
        return <CalendarContent waypoints={demoWaypoints} />
      case 'checklist':
        return <ChecklistContent checklist={demoChecklist} />
      case 'documents':
        return <DocumentsContent documents={demoDocuments} />
      case 'company':
        return <CompanyContent company={demoCompany} />
      case 'settings':
        return <SettingsContent />
      default:
        return <DashboardContent company={demoCompany} waypoints={demoWaypoints} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="ml-64 p-8">
        <div className="max-w-5xl">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App
