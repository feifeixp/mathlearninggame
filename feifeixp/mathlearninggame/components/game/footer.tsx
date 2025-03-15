import { Sparkles, Star } from "lucide-react"

export default function Footer() {
  return (
    <footer className="py-8 border-t bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center justify-between text-center gap-6 md:flex-row md:text-left">
          <div className="relative">
            <h3 className="text-2xl font-bold text-game-primary flex items-center">
              数学冒险
              <Sparkles className="ml-2 h-5 w-5 text-game-secondary" />
            </h3>
            <p className="text-lg text-gray-600 mt-1">让学习数学变得有趣而高效</p>
          </div>
          <div className="text-base text-gray-600 flex items-center">
            <Star className="h-5 w-5 mr-2 text-game-secondary" />© {new Date().getFullYear()} 数学冒险游戏. 版权所有.
          </div>
        </div>
      </div>
    </footer>
  )
}

