import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Inter } from "next/font/google"
import { GameProvider } from "@/context/game-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "数学冒险 - 小学四年级数学学习游戏",
  description: "通过有趣的冒险关卡学习数学知识，智能识别薄弱点并提供针对性练习",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <GameProvider>
            {children}
            <Toaster />
          </GameProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'