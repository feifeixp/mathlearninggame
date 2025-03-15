import type { ReactNode } from "react"
import Header from "./header"
import Footer from "./footer"

interface GameLayoutProps {
  children: ReactNode
}

export default function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-kid-gradient">
      <Header />
      <main className="flex-1 py-8">{children}</main>
      <Footer />
    </div>
  )
}

