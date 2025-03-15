import DashboardLayout from "../dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Map, Award, Brain } from "lucide-react"
import prisma from "@/lib/prisma"

async function getStats() {
  try {
    const [userCount, questionCount, knowledgePointCount, themeAreaCount, levelCount, achievementCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.question.count(),
        prisma.knowledgePoint.count(),
        prisma.themeArea.count(),
        prisma.level.count(),
        prisma.achievement.count(),
      ])

    return {
      userCount,
      questionCount,
      knowledgePointCount,
      themeAreaCount,
      levelCount,
      achievementCount,
    }
  } catch (error) {
    console.error("获取统计数据失败:", error)
    return {
      userCount: 0,
      questionCount: 0,
      knowledgePointCount: 0,
      themeAreaCount: 0,
      levelCount: 0,
      achievementCount: 0,
    }
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">管理后台</h1>
        <p className="text-gray-500 mt-1">欢迎使用数学冒险游戏管理后台</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              用户数量
            </CardTitle>
            <CardDescription>系统中的用户总数</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.userCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <BookOpen className="h-5 w-5 mr-2 text-green-500" />
              问题数量
            </CardTitle>
            <CardDescription>系统中的问题总数</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.questionCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Brain className="h-5 w-5 mr-2 text-purple-500" />
              知识点数量
            </CardTitle>
            <CardDescription>系统中的知识点总数</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.knowledgePointCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Map className="h-5 w-5 mr-2 text-orange-500" />
              主题区域数量
            </CardTitle>
            <CardDescription>系统中的主题区域总数</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.themeAreaCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Map className="h-5 w-5 mr-2 text-red-500" />
              关卡数量
            </CardTitle>
            <CardDescription>系统中的关卡总数</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.levelCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              成就数量
            </CardTitle>
            <CardDescription>系统中的成就总数</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.achievementCount}</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

