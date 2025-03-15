"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "../../dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

interface KnowledgePoint {
  id: string
  name: string
  category: string
}

export default function CreateQuestionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([])

  const [formData, setFormData] = useState({
    text: "",
    type: "选择题",
    options: ["", "", "", ""],
    correctAnswer: [""],
    explanation: "",
    difficulty: "1",
    timeLimit: "",
    knowledgePointIds: [] as string[],
  })

  useEffect(() => {
    // 获取所有知识点
    const fetchKnowledgePoints = async () => {
      try {
        const response = await fetch("/api/admin/knowledge-points")
        const data = await response.json()
        if (data.knowledgePoints) {
          setKnowledgePoints(data.knowledgePoints)
        }
      } catch (error) {
        console.error("获取知识点失败:", error)
      }
    }

    fetchKnowledgePoints()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData((prev) => ({ ...prev, options: newOptions }))
  }

  const handleCorrectAnswerChange = (index: number, value: string) => {
    const newCorrectAnswer = [...formData.correctAnswer]
    newCorrectAnswer[index] = value
    setFormData((prev) => ({ ...prev, correctAnswer: newCorrectAnswer }))
  }

  const addOption = () => {
    setFormData((prev) => ({ ...prev, options: [...prev.options, ""] }))
  }

  const removeOption = (index: number) => {
    const newOptions = [...formData.options]
    newOptions.splice(index, 1)
    setFormData((prev) => ({ ...prev, options: newOptions }))
  }

  const addCorrectAnswer = () => {
    setFormData((prev) => ({ ...prev, correctAnswer: [...prev.correctAnswer, ""] }))
  }

  const removeCorrectAnswer = (index: number) => {
    const newCorrectAnswer = [...formData.correctAnswer]
    newCorrectAnswer.splice(index, 1)
    setFormData((prev) => ({ ...prev, correctAnswer: newCorrectAnswer }))
  }

  const handleKnowledgePointChange = (id: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        knowledgePointIds: [...prev.knowledgePointIds, id],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        knowledgePointIds: prev.knowledgePointIds.filter((kpId) => kpId !== id),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          difficulty: Number.parseInt(formData.difficulty),
          timeLimit: formData.timeLimit ? Number.parseInt(formData.timeLimit) : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "创建问题失败")
      }

      toast({
        title: "创建成功",
        description: "问题已成功创建",
      })

      router.push("/admin/questions")
    } catch (error) {
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : "创建问题失败，请重试",
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
          <Link href="/admin/questions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回问题列表
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">创建问题</h1>
        <p className="text-gray-500 mt-1">添加新的问题到系统中</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
                <CardDescription>设置问题的基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text">问题内容</Label>
                  <Textarea
                    id="text"
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    placeholder="请输入问题内容"
                    required
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">问题类型</Label>
                    <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择问题类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="选择题">选择题</SelectItem>
                        <SelectItem value="填空题">填空题</SelectItem>
                        <SelectItem value="连线题">连线题</SelectItem>
                        <SelectItem value="拖拽题">拖拽题</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">难度</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => handleSelectChange("difficulty", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择难度" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">简单</SelectItem>
                        <SelectItem value="2">中等</SelectItem>
                        <SelectItem value="3">困难</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeLimit">时间限制（秒，可选）</Label>
                  <Input
                    id="timeLimit"
                    name="timeLimit"
                    type="number"
                    value={formData.timeLimit}
                    onChange={handleChange}
                    placeholder="例如：60"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="explanation">解析</Label>
                  <Textarea
                    id="explanation"
                    name="explanation"
                    value={formData.explanation}
                    onChange={handleChange}
                    placeholder="请输入问题解析"
                    required
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {formData.type === "选择题" && (
              <Card>
                <CardHeader>
                  <CardTitle>选项</CardTitle>
                  <CardDescription>设置选择题的选项</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`选项 ${index + 1}`}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        disabled={formData.options.length <= 2}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addOption} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    添加选项
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>正确答案</CardTitle>
                <CardDescription>设置问题的正确答案</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.correctAnswer.map((answer, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={answer}
                      onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                      placeholder={`正确答案 ${index + 1}`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCorrectAnswer(index)}
                      disabled={formData.correctAnswer.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {formData.type !== "选择题" && (
                  <Button type="button" variant="outline" onClick={addCorrectAnswer} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    添加正确答案
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>知识点</CardTitle>
                <CardDescription>选择问题涉及的知识点</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {knowledgePoints.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">暂无知识点数据</p>
                  ) : (
                    knowledgePoints.map((kp) => (
                      <div key={kp.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`kp-${kp.id}`}
                          checked={formData.knowledgePointIds.includes(kp.id)}
                          onCheckedChange={(checked) => handleKnowledgePointChange(kp.id, checked as boolean)}
                        />
                        <Label htmlFor={`kp-${kp.id}`} className="flex-1">
                          {kp.name}
                          <span className="text-xs text-gray-500 ml-2">({kp.category})</span>
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>操作</CardTitle>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/admin/questions">取消</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "保存中..." : "保存问题"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </DashboardLayout>
  )
}

