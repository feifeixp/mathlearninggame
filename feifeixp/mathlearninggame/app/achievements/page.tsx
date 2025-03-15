"use client"

import { useEffect, useState } from "react"
import { useGame } from "@/context/game-context"
import GameLayout from "@/components/game/game-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Achievement } from "@/types/game"
import { Award, Lock, Star } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AchievementsPage() {
  const { achievements, user, isLoading } = useGame()
  const [unlockedCount, setUnlockedCount] = useState(0)

  useEffect(() => {
    if (!isLoading && achievements.length > 0) {
      const count = achievements.filter((a) => a.unlocked).length
      setUnlockedCount(count)
    }
  }, [isLoading, achievements])

  if (isLoading) {
    return (
      <GameLayout>
        <div className="container px-4 mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin-slow">
              <Award className="h-12 w-12 text-game-primary" />
            </div>
            <p className="mt-4 text-lg">加载中...</p>
          </div>
        </div>
      </GameLayout>
    )
  }

  return (
    <GameLayout>
      <div className="container px-4 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center mb-2">
            <Award className="h-8 w-8 mr-2 text-game-primary" />
            成就与奖励
          </h1>
          <p className="text-gray-500">展示你在数学冒险中获得的成就和奖励</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>成就进度</CardTitle>
              <CardDescription>已解锁的成就数量</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-game-primary">
                {unlockedCount}/{achievements.length}
              </div>
              <div className="text-sm text-gray-500">
                完成度: {Math.round((unlockedCount / achievements.length) * 100)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>收集的星星</CardTitle>
              <CardDescription>完成关卡获得的星星</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Star className="h-6 w-6 text-game-secondary mr-2" fill="currentColor" />
                <span className="text-4xl font-bold text-game-primary">{user?.progress.stars || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>收集的徽章</CardTitle>
              <CardDescription>完成特定任务获得的徽章</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-game-primary">{user?.progress.badges.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>所有成就</CardTitle>
            <CardDescription>完成特定目标解锁成就</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  )
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div
      className={cn(
        "border rounded-lg p-4 transition-all",
        achievement.unlocked ? "bg-white hover:shadow-md" : "bg-gray-50 opacity-70",
      )}
    >
      <div className="flex items-start">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mr-3",
            achievement.unlocked ? "bg-yellow-100" : "bg-gray-200",
          )}
        >
          {achievement.unlocked ? (
            <span className="text-2xl">{achievement.icon}</span>
          ) : (
            <Lock className="h-6 w-6 text-gray-400" />
          )}
        </div>
        <div>
          <h3 className="font-medium">{achievement.name}</h3>
          <p className="text-sm text-gray-500">{achievement.description}</p>
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-xs text-gray-400 mt-1">
              解锁于: {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

