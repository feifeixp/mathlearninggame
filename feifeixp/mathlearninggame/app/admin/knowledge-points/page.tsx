import DashboardLayout from "../dashboard-layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/prisma"

async function getKnowledgePoints() {
  try {
    const knowledgePoints = await prisma.knowledgePoint.findMany({
      orderBy: {
        category: "asc",
      },
    })

    return knowledgePoints
  } catch (error) {
    console.error("获取知识点列表失败:", error)
    return []
  }
}

export default async function KnowledgePointsPage() {
  const knowledgePoints = await getKnowledgePoints()

  // 按类别分组
  const groupedKnowledgePoints: Record<string, typeof knowledgePoints> = {}
  knowledgePoints.forEach((kp) => {
    if (!groupedKnowledgePoints[kp.category]) {
      groupedKnowledgePoints[kp.category] = []
    }
    groupedKnowledgePoints[kp.category].push(kp)
  })

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">知识点管理</h1>
          <p className="text-gray-500 mt-1">管理系统中的所有知识点</p>
        </div>
        <Button asChild>
          <Link href="/admin/knowledge-points/create">
            <Plus className="h-5 w-5 mr-1" />
            添加知识点
          </Link>
        </Button>
      </div>

      {Object.keys(groupedKnowledgePoints).length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">暂无知识点数据</p>
        </div>
      ) : (
        Object.entries(groupedKnowledgePoints).map(([category, points]) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Badge className="mr-2">{category}</Badge>
              知识点
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>名称</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {points.map((kp) => (
                    <TableRow key={kp.id}>
                      <TableCell className="font-medium">{kp.id.substring(0, 5)}...</TableCell>
                      <TableCell>{kp.name}</TableCell>
                      <TableCell className="max-w-md truncate">{kp.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" asChild>
                            <Link href={`/admin/knowledge-points/${kp.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <form action={`/api/admin/knowledge-points/${kp.id}/delete`} method="POST">
                            <Button size="icon" variant="ghost" type="submit" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))
      )}
    </DashboardLayout>
  )
}

