"use client"

import { useEffect, useState } from "react"
import { useGame } from "@/context/game-context"
import GameLayout from "@/components/game/game-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AnswerRecord, KnowledgePoint } from "@/types/game"
import { BookOpen, Calendar, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react"

export default function ProgressPage() {
  const { user, knowledgePoints, isLoading } = useGame()
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([])
  const [knowledgePointMap, setKnowledgePointMap] = useState<Record<string, KnowledgePoint>>({})
  const [stats, setStats] = useState({
    totalQuestions: 0,
    correctCount: 0,
    averageTime: 0,
    streak: 0,
  })

  useEffect(() => {
    if (!isLoading && user) {
      // 获取答题记录
      const records = user.progress.answerRecords
      setAnswerRecords(records)

      // 创建知识点映射
      const kpMap: Record<string, KnowledgePoint> = {}
      knowledgePoints.forEach((kp) => {
        kpMap[kp.id] = kp
      })
      setKnowledgePointMap(kpMap)

      // 计算统计数据
      if (records.length > 0) {
        const correctCount = records.filter((r) => r.isCorrect).length
        const totalTime = records.reduce((sum, r) => sum + r.timeSpent, 0)

        setStats({
          totalQuestions: records.length,
          correctCount,
          averageTime: Math.round(totalTime / records.length),
          streak: user.progress.streak,
        })
      }
    }
  }, [isLoading, user, knowledgePoints])

  if (isLoading) {
    return (
      <GameLayout>
        <div className="container px-4 mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin-slow">
              <BookOpen className="h-12 w-12 text-game-primary" />
            </div>
            <p className="mt-4 text-lg">加载中...</p>
          </div>
        </div>
      </GameLayout>
    )
  }

  // 按日期分组答题记录
  const recordsByDate: Record<string, AnswerRecord[]> = {}
  answerRecords.forEach((record) => {
    const date = new Date(record.timestamp).toLocaleDateString()
    if (!recordsByDate[date]) {
      recordsByDate[date] = []
    }
    recordsByDate[date].push(record)
  })

  // 按日期排序
  const sortedDates = Object.keys(recordsByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return (
    <GameLayout>
      <div className="container px-4 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center mb-2">
            <BookOpen className="h-8 w-8 mr-2 text-game-primary" />
            学习记录
          </h1>
          <p className="text-gray-500">查看你的学习进度和历史记录</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>总题数</CardTitle>
              <CardDescription>已完成的题目数量</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-game-primary">{stats.totalQuestions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>正确率</CardTitle>
              <CardDescription>答对题目的比例</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-game-primary">
                {stats.totalQuestions > 0 ? Math.round((stats.correctCount / stats.totalQuestions) * 100) : 0}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>平均用时</CardTitle>
              <CardDescription>每题平均耗时</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-4xl font-bold text-game-primary">{stats.averageTime}</span>
                <span className="text-gray-500 ml-1">秒</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>学习连续天数</CardTitle>
              <CardDescription>持续学习的天数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                <span className="text-4xl font-bold text-game-primary">{stats.streak}</span>
                <span className="text-gray-500 ml-1">天</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>学习历史</CardTitle>
            <CardDescription>按日期查看你的学习记录</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedDates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">暂无学习记录，开始闯关来记录你的学习历程吧！</div>
            ) : (
              <div className="space-y-8">
                {sortedDates.map((date) => (
                  <div key={date}>
                    <div className="flex items-center mb-4">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                      <h3 className="font-medium">{date}</h3>
                      <div className="ml-auto text-sm text-gray-500">{recordsByDate[date].length} 题</div>
                    </div>

                    <div className="space-y-3">
                      {recordsByDate[date].map((record) => {
                        // 获取知识点名称
                        const knowledgePointNames = record.knowledgePoints
                          .map((kpId) => knowledgePointMap[kpId]?.name || kpId)
                          .join(", ")

                        return (
                          <div key={record.questionId} className="p-3 border rounded-lg bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center">
                                {record.isCorrect ? (
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                                )}
                                <div>
                                  <p className="font-medium">
                                    {record.levelId === "practice" ? "针对性练习" : `关卡: ${record.levelId}`}
                                  </p>
                                  <p className="text-sm text-gray-500">知识点: {knowledgePointNames}</p>
                                </div>
                              </div>
                              <div className="text-right text-sm text-gray-500">
                                <div className="flex items-center justify-end">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {record.timeSpent}秒
                                </div>
                                <div>{new Date(record.timestamp).toLocaleTimeString()}</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  )
}

