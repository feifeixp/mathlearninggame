import GameLayout from "@/components/game/game-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Map, Award, BrainCircuit, BookOpen, Star, Rocket, Sparkles, Gift } from "lucide-react"

export default function HomePage() {
  return (
    <GameLayout>
      <div className="container px-4 mx-auto">
        <section className="mb-12 text-center">
          <div className="relative mb-6">
            <h1 className="text-5xl font-bold mb-4 text-game-primary relative z-10 inline-block">
              欢迎来到数学冒险！
              <div className="absolute -right-8 -top-8 text-game-secondary animate-spin-slow">
                <Sparkles className="h-10 w-10" />
              </div>
            </h1>
          </div>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600 leading-relaxed">
            通过有趣的冒险关卡学习数学知识，智能识别薄弱点并提供针对性练习
          </p>
          <Button asChild size="lg" className="btn-kid text-xl px-8 py-6 bg-game-primary hover:bg-game-primary/90">
            <Link href="/map">
              开始冒险
              <Rocket className="ml-2 h-6 w-6 animate-bounce-slow" />
            </Link>
          </Button>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">探索学习之旅</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="game-card border-game-primary hover:border-game-primary hover:shadow-md overflow-hidden">
              <Link href="/map">
                <div className="h-2 bg-game-primary"></div>
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 p-4 rounded-full bg-blue-100 animate-bounce-slow">
                    <Map className="h-12 w-12 text-game-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">冒险地图</h3>
                  <p className="text-gray-600 text-lg">探索不同的主题区域，通过闯关学习数学知识</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="game-card border-game-danger hover:border-game-danger hover:shadow-md overflow-hidden">
              <Link href="/weak-points">
                <div className="h-2 bg-game-danger"></div>
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 p-4 rounded-full bg-red-100 animate-float">
                    <BrainCircuit className="h-12 w-12 text-game-danger" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">薄弱点分析</h3>
                  <p className="text-gray-600 text-lg">发现你的薄弱知识点，获取针对性的练习和辅导</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="game-card border-game-secondary hover:border-game-secondary hover:shadow-md overflow-hidden">
              <Link href="/achievements">
                <div className="h-2 bg-game-secondary"></div>
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 p-4 rounded-full bg-yellow-100 animate-spin-slow">
                    <Award className="h-12 w-12 text-game-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">成就与奖励</h3>
                  <p className="text-gray-600 text-lg">收集徽章和奖励，记录你的学习成就</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="game-card border-game-success hover:border-game-success hover:shadow-md overflow-hidden">
              <Link href="/progress">
                <div className="h-2 bg-game-success"></div>
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 p-4 rounded-full bg-green-100 animate-bounce-slow">
                    <BookOpen className="h-12 w-12 text-game-success" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">学习记录</h3>
                  <p className="text-gray-600 text-lg">查看你的学习进度和历史记录，了解学习趋势</p>
                </CardContent>
              </Link>
            </Card>
          </div>
        </section>

        <section className="mb-16 bg-kid-gradient rounded-3xl p-8 shadow-kid">
          <h2 className="text-3xl font-bold mb-8 text-center">特色功能</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex bg-white p-6 rounded-2xl shadow-kid">
              <div className="mr-6 flex-shrink-0">
                <div className="rounded-full p-4 bg-blue-100">
                  <Star className="h-8 w-8 text-game-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">关卡闯关系统</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  通过有趣的关卡设计，让学习变成一场冒险，每个关卡对应不同的数学知识点
                </p>
              </div>
            </div>

            <div className="flex bg-white p-6 rounded-2xl shadow-kid">
              <div className="mr-6 flex-shrink-0">
                <div className="rounded-full p-4 bg-yellow-100">
                  <BrainCircuit className="h-8 w-8 text-game-secondary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">智能薄弱点识别</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  系统会智能分析你的答题情况，识别出薄弱的知识点，并提供针对性的辅导
                </p>
              </div>
            </div>

            <div className="flex bg-white p-6 rounded-2xl shadow-kid">
              <div className="mr-6 flex-shrink-0">
                <div className="rounded-full p-4 bg-green-100">
                  <BookOpen className="h-8 w-8 text-game-success" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">针对性练习</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  根据薄弱点生成个性化练习题，帮助你攻克难点，减少无效刷题
                </p>
              </div>
            </div>

            <div className="flex bg-white p-6 rounded-2xl shadow-kid">
              <div className="mr-6 flex-shrink-0">
                <div className="rounded-full p-4 bg-purple-100">
                  <Gift className="h-8 w-8 text-game-purple" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">成就与激励系统</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  完成学习目标获得星星和徽章，激励持续学习，培养学习兴趣
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </GameLayout>
  )
}

