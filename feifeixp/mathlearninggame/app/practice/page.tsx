"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useGame } from "@/context/game-context"
import GameLayout from "@/components/game/game-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Question, AnswerRecord } from "@/types/game"
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, HelpCircle, BrainCircuit } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PracticePage() {
  const router = useRouter()
  const { getPracticeQuestions, updateWeakPoints, isLoading } = useGame()

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({})
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [startTime, setStartTime] = useState<Record<string, number>>({})
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([])
  const [practiceCompleted, setPracticeCompleted] = useState(false)

  // 加载练习题
  useEffect(() => {
    if (!isLoading) {
      const practiceQuestions = getPracticeQuestions()

      if (practiceQuestions.length > 0) {
        // 最多取10道题
        const selectedQuestions = practiceQuestions.slice(0, 10)
        setQuestions(selectedQuestions)

        // 初始化答案和开始时间
        const initialAnswers: Record<string, string | string[]> = {}
        const initialStartTimes: Record<string, number> = {}

        selectedQuestions.forEach((q) => {
          initialAnswers[q.id] = q.type === "选择题" ? "" : []
          initialStartTimes[q.id] = Date.now()
        })

        setUserAnswers(initialAnswers)
        setStartTime(initialStartTimes)
      }
    }
  }, [isLoading, getPracticeQuestions])

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

  if (questions.length === 0) {
    return (
      <GameLayout>
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center mb-2">
              <BrainCircuit className="h-8 w-8 mr-2 text-game-primary" />
              针对性练习
            </h1>
            <p className="text-gray-500">根据你的薄弱点生成的个性化练习题</p>
          </div>

          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">暂无练习题</h2>
              <p className="text-gray-500 mb-6">
                目前没有针对你薄弱点的练习题，或者你没有明显的薄弱点。继续完成更多关卡来获取更准确的薄弱点分析。
              </p>
              <Button onClick={() => router.push("/map")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回地图
              </Button>
            </CardContent>
          </Card>
        </div>
      </GameLayout>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  // 处理答案变更
  const handleAnswerChange = (value: string | string[]) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: value,
    })
  }

  // 提交答案
  const handleSubmitAnswer = () => {
    const userAnswer = userAnswers[currentQuestion.id]
    const isCorrect = Array.isArray(currentQuestion.correctAnswer)
      ? Array.isArray(userAnswer) && currentQuestion.correctAnswer.every((a) => userAnswer.includes(a))
      : userAnswer === currentQuestion.correctAnswer

    // 计算用时
    const timeSpent = Math.round((Date.now() - startTime[currentQuestion.id]) / 1000)

    // 记录答题结果
    const newAnswerResults = {
      ...answerResults,
      [currentQuestion.id]: isCorrect,
    }
    setAnswerResults(newAnswerResults)

    // 创建答题记录
    const record: AnswerRecord = {
      userId: "user1", // 假设用户ID
      levelId: "practice", // 练习模式
      questionId: currentQuestion.id,
      userAnswer,
      isCorrect,
      timeSpent,
      timestamp: new Date().toISOString(),
      knowledgePoints: currentQuestion.knowledgePoints,
    }

    setAnswerRecords([...answerRecords, record])

    // 显示解析
    setShowExplanation(true)
  }

  // 下一题
  const handleNextQuestion = () => {
    setShowExplanation(false)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // 所有题目已完成
      completePractice()
    }
  }

  // 完成练习
  const completePractice = () => {
    setPracticeCompleted(true)

    // 更新薄弱点
    updateWeakPoints(answerRecords)
  }

  // 检查答案是否为空
  const isAnswerEmpty = () => {
    const answer = userAnswers[currentQuestion.id]
    if (currentQuestion.type === "选择题") {
      return !answer || (typeof answer === "string" && answer.trim() === "")
    } else {
      // 对于填空题或其他类型
      return (
        !answer ||
        (typeof answer === "string" && answer.trim() === "") ||
        (Array.isArray(answer) && answer.length === 0)
      )
    }
  }

  // 渲染选择题
  const renderMultipleChoice = (question: Question) => {
    return (
      <RadioGroup
        value={userAnswers[question.id] as string}
        onValueChange={(value) => handleAnswerChange(value)}
        className="space-y-3"
        disabled={showExplanation}
      >
        {question.options?.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`option-${index}`} />
            <Label
              htmlFor={`option-${index}`}
              className={cn(
                "text-base p-2 rounded-md w-full",
                showExplanation && option === question.correctAnswer
                  ? "bg-green-100"
                  : showExplanation && option === userAnswers[question.id]
                    ? "bg-red-100"
                    : "",
              )}
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    )
  }

  // 渲染填空题
  const renderFillInBlank = (question: Question) => {
    return (
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="请输入答案"
          value={(userAnswers[question.id] as string) || ""}
          onChange={(e) => handleAnswerChange(e.target.value)}
          disabled={showExplanation}
          className={cn(
            showExplanation && userAnswers[question.id] === question.correctAnswer
              ? "border-green-500 bg-green-50"
              : showExplanation
                ? "border-red-500 bg-red-50"
                : "",
          )}
        />

        {showExplanation && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            正确答案: {question.correctAnswer}
          </div>
        )}
      </div>
    )
  }

  // 渲染练习完成页面
  if (practiceCompleted) {
    const correctCount = Object.values(answerResults).filter(Boolean).length
    const totalQuestions = questions.length
    const correctRate = Math.round((correctCount / totalQuestions) * 100)

    return (
      <GameLayout>
        <div className="container px-4 mx-auto">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">练习完成！</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="inline-block w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <BrainCircuit className="h-12 w-12 text-game-primary" />
                </div>
                <h3 className="text-xl font-bold mb-1">针对性练习已完成</h3>
                <p className="text-gray-500">
                  答对 {correctCount}/{totalQuestions} 题，正确率 {correctRate}%
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">答题情况</h4>
                <div className="space-y-2">
                  {questions.map((question, index) => (
                    <div key={question.id} className="flex items-center justify-between p-2 rounded-md bg-white">
                      <span>题目 {index + 1}</span>
                      {answerResults[question.id] ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-800">提示</h4>
                <p className="text-gray-700">
                  你的薄弱点数据已更新。继续练习可以帮助你更快地提高这些知识点的掌握程度。
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/weak-points")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                查看薄弱点
              </Button>
              <Button onClick={() => router.push("/map")}>
                返回地图
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </GameLayout>
    )
  }

  return (
    <GameLayout>
      <div className="container px-4 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center mb-2">
            <BrainCircuit className="h-8 w-8 mr-2 text-game-primary" />
            针对性练习
          </h1>
          <p className="text-gray-500">根据你的薄弱点生成的个性化练习题</p>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/weak-points")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回薄弱点
          </Button>

          <div className="text-sm font-medium">
            题目 {currentQuestionIndex + 1}/{questions.length}
          </div>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
              <div className="flex items-center text-sm text-gray-500">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full mr-1",
                    currentQuestion.difficulty === 1
                      ? "bg-green-500"
                      : currentQuestion.difficulty === 2
                        ? "bg-yellow-500"
                        : "bg-red-500",
                  )}
                />
                {currentQuestion.difficulty === 1 ? "简单" : currentQuestion.difficulty === 2 ? "中等" : "困难"}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 根据题目类型渲染不同的答题组件 */}
            {currentQuestion.type === "选择题" && renderMultipleChoice(currentQuestion)}
            {currentQuestion.type === "填空题" && renderFillInBlank(currentQuestion)}

            {/* 解析 */}
            {showExplanation && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                  <h3 className="font-medium text-blue-800">解析</h3>
                </div>
                <p className="text-gray-700">{currentQuestion.explanation}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {!showExplanation ? (
              <Button className="w-full" onClick={handleSubmitAnswer} disabled={isAnswerEmpty()}>
                提交答案
              </Button>
            ) : (
              <Button className="w-full" onClick={handleNextQuestion}>
                {currentQuestionIndex < questions.length - 1 ? "下一题" : "完成"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </GameLayout>
  )
}

