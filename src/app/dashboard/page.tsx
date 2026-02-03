import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Demo data - will be replaced with real data from Supabase
  const demoCompany = {
    name: "Horizon Ventures LLC",
    flightNumber: "JP-2026-0042",
    state: "Wyoming",
    ein: "88-1234567",
    formed: "Feb 7, 2026",
    status: "cruising",
    captain: user.email?.split('@')[0] || "Captain",
    bank: "Mercury Financial",
    bankStatus: "Active"
  }

  const demoWaypoints = [
    { id: 1, name: "BOI Report", dueDate: "Apr 15, 2026", daysLeft: 71, status: "prepare" },
    { id: 2, name: "Annual Report", dueDate: "Jan 1, 2027", daysLeft: 298, status: "clear" },
    { id: 3, name: "RA Renewal", dueDate: "Feb 7, 2027", daysLeft: 362, status: "clear" },
  ]

  return (
    <DashboardClient
      user={user}
      company={demoCompany}
      waypoints={demoWaypoints}
    />
  )
}
