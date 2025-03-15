"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, Users, Map, Award, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function AdminNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const navigation = [
    { name: "仪表盘", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "问题管理", href: "/admin/questions", icon: BookOpen },
    { name: "知识点管理", href: "/admin/knowledge-points", icon: BookOpen },
    { name: "用户管理", href: "/admin/users", icon: Users },
    { name: "主题区域", href: "/admin/theme-areas", icon: Map },
    { name: "关卡管理", href: "/admin/levels", icon: Map },
    { name: "成就管理", href: "/admin/achievements", icon: Award },
  ]

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      })

      toast({
        title: "退出成功",
        description: "您已成功退出管理后台",
      })

      router.push("/admin/login")
    } catch (error) {
      console.error("退出失败:", error)
    }
  }

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin/dashboard" className="flex items-center">
                <span className="text-2xl font-bold text-game-primary">数学冒险</span>
                <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-md">管理后台</span>
              </Link>
            </div>

            {/* 桌面导航 */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "text-white bg-game-primary"
                      : "text-gray-600 hover:text-game-primary hover:bg-gray-100",
                  )}
                >
                  <item.icon className="h-5 w-5 mr-1" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button variant="ghost" className="text-gray-600 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-1" />
              退出
            </Button>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="flex items-center sm:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 text-base font-medium rounded-md",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "text-white bg-game-primary"
                    : "text-gray-600 hover:text-game-primary hover:bg-gray-100",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </div>
              </Link>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 text-base font-medium rounded-md"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              退出
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

