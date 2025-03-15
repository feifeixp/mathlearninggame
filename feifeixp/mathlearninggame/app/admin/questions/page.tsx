import DashboardLayout from "../dashboard-layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/prisma"

async function getQuestions() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        knowledgePoints: {
          include: {
            knowledgePoint: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return questions
  } catch (error) {
    console.error("获取问题列表失败:", error)
    return []
  }
}

export default async function QuestionsPage() {
  const questions = await getQuestions()

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">问题管理</h1>
          <p className="text-gray-500 mt-1">管理系统中的所有问题</p>
        </div>
        <Button asChild>
          <Link href="/admin/questions/create">
            <Plus className="h-5 w-5 mr-1" />
            添加问题
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>问题内容</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>难度</TableHead>
              <TableHead>知识点</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  暂无问题数据
                </TableCell>
              </TableRow>
            ) : (
              questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium">{question.id.substring(0, 5)}...</TableCell>
                  <TableCell className="max-w-md truncate">{question.text}</TableCell>
                  <TableCell>{question.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        question.difficulty === 1 ? "success" : question.difficulty === 2 ? "warning" : "destructive"
                      }
                    >
                      {question.difficulty === 1 ? "简单" : question.difficulty === 2 ? "中等" : "困难"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {question.knowledgePoints.map((kp) => (
                        <Badge key={kp.id} variant="outline">
                          {kp.knowledgePoint.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" asChild>
                        <Link href={`/admin/questions/${question.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <form action={`/api/admin/questions/${question.id}/delete`} method="POST">
                        <Button size="icon" variant="ghost" type="submit" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  )
}

