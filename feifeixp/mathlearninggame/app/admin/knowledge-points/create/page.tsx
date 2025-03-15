"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "../../dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateKnowledgePointPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/knowledge-points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "创建知识点失败")
      }

      toast({
        title: "创建成功",
        description: "知识点已成功创建",
      })

      router.push("/admin/knowledge-points")
    } catch (error) {
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : "创建知识点失败，请重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-2">
          <Link href="/admin/knowledge-points">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回知识点列表
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">创建知识点</h1>
        <p className="text-gray-500 mt-1">添加新的知识点到系统中</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>知识点信息</CardTitle>
            <CardDescription>填写知识点的详细信息</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">知识点名称</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="例如：整数加法"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">类别</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="例如：整数运算"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="请输入知识点描述"
                  required
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/admin/knowledge-points">取消</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "保存中..." : "保存知识点"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}

