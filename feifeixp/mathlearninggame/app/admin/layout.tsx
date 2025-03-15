import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "数学冒险 - 管理后台",
  description: "数学冒险游戏管理后台",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

