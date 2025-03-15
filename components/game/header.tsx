"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Home, Map, Award, Settings, LogOut, Menu, X, Star, BookOpen, BrainCircuit, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useGame } from "@/context/game-context"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useGame()

  if (!user) return null

  const navigation = [
    { name: "首页", href: "/", icon: Home },
    { name: "冒险地图", href: "/map", icon: Map },
    { name: "成就", href: "/achievements", icon: Award },
    { name: "薄弱点", href: "/weak-points", icon: BrainCircuit },
    { name: "学习记录", href: "/progress", icon: BookOpen },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-md">
      <div className="container px-4 py-4 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <span className="inline-block p-3 rounded-full bg-game-primary text-white shadow-md">
              <Star className="w-7 h-7" />
            </span>
            <div className="relative">
              <h1 className="text-2xl font-bold text-game-primary">数学冒险</h1>
              <Sparkles className="absolute -right-6 -top-3 h-5 w-5 text-game-secondary animate-spin-slow" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-base font-bold rounded-full transition-all",
                  pathname === item.href
                    ? "text-white bg-game-primary shadow-md"
                    : "text-gray-600 hover:text-game-primary hover:bg-blue-50",
                )}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <div className="flex items-center space-x-1 px-4 py-2 bg-yellow-100 rounded-full text-base font-bold shadow-sm">
                <Star className="w-5 h-5 text-game-secondary" />
                <span className="font-bold">{user.progress.stars}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-base font-bold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.grade}</p>
              </div>
              <Avatar className="h-10 w-10 border-3 border-game-primary shadow-md">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-game-primary text-white font-bold">
                  {user.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 mt-3 border-t">
            <div className="flex items-center space-x-3 py-3">
              <Avatar className="h-12 w-12 border-2 border-game-primary">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-lg">{user.name}</p>
                <div className="flex items-center text-base text-gray-600">
                  <Star className="w-5 h-5 mr-1 text-game-secondary" />
                  <span>{user.progress.stars} 星</span>
                </div>
              </div>
            </div>
            <nav className="grid grid-cols-1 gap-2 mt-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl font-bold",
                    pathname === item.href
                      ? "text-white bg-game-primary"
                      : "text-gray-600 hover:text-game-primary hover:bg-gray-100",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-6 h-6 mr-3" />
                  {item.name}
                </Link>
              ))}
              <Link
                href="/settings"
                className="flex items-center px-4 py-3 text-gray-600 rounded-xl font-bold hover:text-game-primary hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="w-6 h-6 mr-3" />
                设置
              </Link>
              <Button
                variant="ghost"
                className="flex items-center justify-start px-4 py-3 text-gray-600 rounded-xl font-bold hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-6 h-6 mr-3" />
                退出
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

