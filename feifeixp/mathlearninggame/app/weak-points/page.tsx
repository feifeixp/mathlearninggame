"use client"

import { useEffect, useState } from "react"
import { useGame } from "@/context/game-context"
import GameLayout from "@/components/game/game-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { WeakPoint, KnowledgePoint } from "@/types/game"
import { BrainCircuit, TrendingUp, TrendingDown, Minus, ArrowRight, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function WeakPointsPage() {
  const { getWeakPoints, knowledgePoints, isLoading } = useGame()
  const [weakPoints, setWeakPoints] = useState<WeakPoint[]>([])
  const [knowledgePointMap, setKnowledgePointMap] = useState<Record<string, KnowledgePoint>>({})

  useEffect(() => {
    if (!isLoading) {
      const points = getWeakPoints()
      setWeakPoints(points)

      // 创建知识点映射
      const kpMap: Record<string, KnowledgePoint> = {}
      knowledgePoints.forEach((kp) => {
        kpMap[kp.id] = kp
      })
      setKnowledgePointMap(kpMap)
    }
  }, [isLoading, getWeakPoints, knowledgePoints])

  if (isLoading) {
    return (
      <GameLayout>
        <div className="container px-4 mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin-slow">
              <BrainCircuit className="h-12 w-12 text-game-primary" />
            </div>
            <p className="mt-4 text-lg">加载中...</p>
          </div>
        </div>
      </GameLayout>
    )
  }

  // 按正确率排序
  const sortedWeakPoints = [...weakPoints].sort((a, b) => a.correctRate - b.correctRate)

  return (
    <GameLayout>
      <div className="container px-4 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center mb-2">
            <BrainCircuit className="h-8 w-8 mr-2 text-game-primary" />
            薄弱点分析
          </h1>
          <p className="text-gray-500">这里展示了你需要加强练习的知识点，针对性练习可以帮助你更快提高</p>
        </div>

        {weakPoints.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">暂无薄弱点</h2>
              <p className="text-gray-500 mb-6">太棒了！目前没有发现明显的薄弱知识点。继续保持，多做练习巩固知识。</p>
              <Button asChild>
                <Link href="/map">
                  继续冒险
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>薄弱点数量</CardTitle>
                  <CardDescription>需要重点关注的知识点</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-game-primary">{weakPoints.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>最薄弱知识点</CardTitle>
                  <CardDescription>正确率最低的知识点</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-medium text-game-danger">
                    {knowledgePointMap[sortedWeakPoints[0]?.knowledgePointId]?.name || "未知"}
                  </div>
                  <div className="text-sm text-gray-500">
                    正确率: {Math.round(sortedWeakPoints[0]?.correctRate * 100)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>改进趋势</CardTitle>
                  <CardDescription>薄弱点的整体趋势</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {weakPoints.filter((wp) => wp.trend === "improving").length >
                    weakPoints.filter((wp) => wp.trend === "declining").length ? (
                      <>
                        <TrendingUp className="h-6 w-6 text-green-600" />
                        <span className="text-xl font-medium text-green-600">上升</span>
                      </>
                    ) : weakPoints.filter((wp) => wp.trend === "declining").length >
                      weakPoints.filter((wp) => wp.trend === "improving").length ? (
                      <>
                        <TrendingDown className="h-6 w-6 text-red-600" />
                        <span className="text-xl font-medium text-red-600">下降</span>
                      </>
                    ) : (
                      <>
                        <Minus className="h-6 w-6 text-yellow-600" />
                        <span className="text-xl font-medium text-yellow-600">稳定</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  薄弱知识点详情
                </CardTitle>
                <CardDescription>按正确率从低到高排序，优先练习正确率低的知识点</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sortedWeakPoints.map((wp) => {
                    const kp = knowledgePointMap[wp.knowledgePointId]
                    const correctRate = Math.round(wp.correctRate * 100)

                    return (
                      <div key={wp.knowledgePointId} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{kp?.name || wp.knowledgePointId}</h3>
                            <p className="text-sm text-gray-500">{kp?.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {wp.trend === "improving" ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : wp.trend === "declining" ? (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            ) : (
                              <Minus className="h-5 w-5 text-yellow-600" />
                            )}
                            <span
                              className={cn(
                                "text-sm font-medium",
                                correctRate < 40
                                  ? "text-red-600"
                                  : correctRate < 60
                                    ? "text-yellow-600"
                                    : "text-green-600",
                              )}
                            >
                              {correctRate}%
                            </span>
                          </div>
                        </div>

                        <Progress
                          value={correctRate}
                          className={cn(
                            correctRate < 40 ? "bg-red-100" : correctRate < 60 ? "bg-yellow-100" : "bg-green-100",
                          )}
                        />

                        <div className="flex justify-between text-xs text-gray-500">
                          <span>尝试次数: {wp.attempts}</span>
                          <span>最近练习: {new Date(wp.lastPracticed).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/practice">
                    开始针对性练习
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </GameLayout>
  )
}

