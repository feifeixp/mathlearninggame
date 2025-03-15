import type { ReactNode } from "react"
import AdminNav from "./components/admin-nav"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}

