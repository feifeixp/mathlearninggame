"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useGame } from "@/context/game-context"
import GameLayout from "@/components/game/game-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Level } from "@/types/game"
import { ArrowLeft, Play, Star, Trophy, BookOpen, Clock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LevelPage() {
  const params = useParams()
  const router = useRouter()
  const { themeAreas, isLoading } = useGame()
  const [level, setLevel] = useState<Level | null>(null)
  const [themeArea, setThemeArea] = useState<string>("")
  const [themeColor, setThemeColor] = useState<string>("#6366F1")

  useEffect(() => {
    if (!isLoading && themeAreas.length > 0) {
      const levelId = params.id as string

      // 查找关卡
      for (const area of themeAreas) {
        const foundLevel = area.levels.find((l) => l.id === levelId)
        if (foundLevel) {
          setLevel(foundLevel)
          setThemeArea(area.name)
          setThemeColor(area.color)
          break
        }
      }
    }
  }, [isLoading, themeAreas, params.id])

  if (isLoading || !level) {
    return (
      <GameLayout>
        <div className="container px-4 mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin-slow">
              <Star className="h-16 w-16 text-game-primary" />
            </div>
            <p className="mt-6 text-xl">加载中...</p>
          </div>
        </div>
      </GameLayout>
    )
  }

  return (
    <GameLayout>
      <div className="container px-4 mx-auto">
        <div className="mb-8">
          <Button variant="ghost" className="mb-4 text-lg rounded-xl" onClick={() => router.push("/map")}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            返回地图
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative">
              <h1 className="text-4xl font-bold" style={{ color: themeColor }}>
                {level.name}
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                {themeArea} · {level.description}
              </p>
              <Sparkles className="absolute -right-8 -top-4 h-6 w-6 text-game-secondary animate-spin-slow" />
            </div>

            {level.completed ? (
              <div className="flex items-center space-x-3 bg-yellow-100 px-5 py-3 rounded-xl shadow-kid">
                <Trophy className="h-6 w-6 text-game-secondary" />
                <span className="font-bold text-lg">已完成</span>
                <div className="flex ml-2">
                  {[...Array(3)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn("w-6 h-6", i < level.stars ? "text-game-secondary" : "text-gray-300")}
                      fill={i < level.stars ? "currentColor" : "none"}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <Button
                className="btn-kid px-8 bg-game-primary hover:bg-game-primary/90 text-lg"
                onClick={() => router.push(`/play/${level.id}`)}
              >
                <Play className="mr-2 h-5 w-5" />
                开始挑战
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="card-kid border-2">
              <CardHeader className="bg-kid-gradient-purple">
                <CardTitle className="flex items-center text-2xl">
                  <BookOpen className="mr-3 h-6 w-6" />
                  关卡内容
                </CardTitle>
                <CardDescription className="text-base">本关卡包含 {level.questions.length} 道题目</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  {level.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="p-5 border-2 rounded-xl hover:border-game-primary hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg">
                          题目 {index + 1}: {question.type}
                        </h3>
                        <div className="flex items-center text-base text-gray-600">
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full mr-2",
                              question.difficulty === 1
                                ? "bg-green-500"
                                : question.difficulty === 2
                                  ? "bg-yellow-500"
                                  : "bg-red-500",
                            )}
                          />
                          {question.difficulty === 1 ? "简单" : question.difficulty === 2 ? "中等" : "困难"}

                          {question.timeLimit && (
                            <div className="flex items-center ml-4">
                              <Clock className="w-4 h-4 mr-1" />
                              {question.timeLimit}秒
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3 text-lg line-clamp-2">{question.text}</p>
                      <div className="flex flex-wrap gap-2">
                        {question.knowledgePoints.map((kpId) => {
                          const kp = themeAreas[0].levels[0].knowledgePoints.find((k) => k === kpId)
                          return (
                            <span
                              key={kpId}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                              {kpId}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="card-kid border-2">
              <CardHeader className="bg-kid-gradient-yellow">
                <CardTitle className="flex items-center text-2xl">
                  <Trophy className="mr-3 h-6 w-6" />
                  关卡奖励
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="flex mr-3">
                      {[...Array(level.reward.stars)].map((_, i) => (
                        <Star key={i} className="w-8 h-8 text-game-secondary" fill="currentColor" />
                      ))}
                    </div>
                    <span className="font-bold text-xl">{level.reward.stars} 星</span>
                  </div>

                  {level.reward.badges && level.reward.badges.length > 0 && (
                    <div>
                      <h4 className="font-bold text-lg mb-3">徽章</h4>
                      <div className="flex flex-wrap gap-3">
                        {level.reward.badges.map((badge) => (
                          <div
                            key={badge}
                            className="px-4 py-2 bg-purple-100 rounded-xl text-base font-bold text-purple-800"
                          >
                            {badge}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {level.reward.items && level.reward.items.length > 0 && (
                    <div>
                      <h4 className="font-bold text-lg mb-3">物品</h4>
                      <div className="flex flex-wrap gap-3">
                        {level.reward.items.map((item) => (
                          <div
                            key={item}
                            className="px-4 py-2 bg-green-100 rounded-xl text-base font-bold text-green-800"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full btn-kid bg-game-primary hover:bg-game-primary/90 text-lg"
                  onClick={() => router.push(`/play/${level.id}`)}
                >
                  <Play className="mr-2 h-5 w-5" />
                  {level.completed ? "再次挑战" : "开始挑战"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </GameLayout>
  )
}

