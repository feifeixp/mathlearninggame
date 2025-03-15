"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useGame } from "@/context/game-context"
import GameLayout from "@/components/game/game-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Level, Question, AnswerRecord } from "@/types/game"
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Clock, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PlayPage() {
  const params = useParams()
  const router = useRouter()
  const { themeAreas, isLoading, completeLevel } = useGame()

  const [level, setLevel] = useState<Level | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({})
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<Record<string, number>>({})
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([])
  const [gameCompleted, setGameCompleted] = useState(false)
  const [stars, setStars] = useState(0)

  // 加载关卡数据
  useEffect(() => {
    if (!isLoading && themeAreas.length > 0) {
      const levelId = params.id as string

      // 查找关卡
      for (const area of themeAreas) {
        const foundLevel = area.levels.find((l) => l.id === levelId)
        if (foundLevel) {
          setLevel(foundLevel)

          // 初始化答案和开始时间
          const initialAnswers: Record<string, string | string[]> = {}
          const initialStartTimes: Record<string, number> = {}

          foundLevel.questions.forEach((q) => {
            initialAnswers[q.id] = q.type === "选择题" ? "" : []
            initialStartTimes[q.id] = Date.now()
          })

          setUserAnswers(initialAnswers)
          setStartTime(initialStartTimes)

          // 设置第一题的计时器
          if (foundLevel.questions[0].timeLimit) {
            setTimeLeft(foundLevel.questions[0].timeLimit)
          }

          break
        }
      }
    }
  }, [isLoading, themeAreas, params.id])

  // 计时器
  useEffect(() => {
    if (timeLeft === null || gameCompleted) return

    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      // 时间到，自动提交当前题目
      handleSubmitAnswer()
    }
  }, [timeLeft, gameCompleted])

  if (isLoading || !level) {
    return (
      <GameLayout>
        <div className="container px-4 mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin-slow">
              <Clock className="h-12 w-12 text-game-primary" />
            </div>
            <p className="mt-4 text-lg">加载中...</p>
          </div>
        </div>
      </GameLayout>
    )
  }

  const currentQuestion = level.questions[currentQuestionIndex]

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
      levelId: level.id,
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

    if (currentQuestionIndex < level.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)

      // 设置下一题的计时器
      const nextQuestion = level.questions[nextIndex]
      if (nextQuestion.timeLimit) {
        setTimeLeft(nextQuestion.timeLimit)
      } else {
        setTimeLeft(null)
      }
    } else {
      // 所有题目已完成
      completeGame()
    }
  }

  // 完成游戏
  const completeGame = () => {
    setGameCompleted(true)

    // 计算星星数量
    const correctCount = Object.values(answerResults).filter(Boolean).length
    const totalQuestions = level.questions.length
    const correctRate = correctCount / totalQuestions

    let earnedStars = 0
    if (correctRate >= 0.9) {
      earnedStars = 3
    } else if (correctRate >= 0.7) {
      earnedStars = 2
    } else if (correctRate >= 0.5) {
      earnedStars = 1
    }

    setStars(earnedStars)

    // 更新关卡完成状态
    completeLevel(level.id, earnedStars, answerRecords)
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

  // 渲染游戏完成页面
  if (gameCompleted) {
    const correctCount = Object.values(answerResults).filter(Boolean).length
    const totalQuestions = level.questions.length
    const correctRate = Math.round((correctCount / totalQuestions) * 100)

    return (
      <GameLayout>
        <div className="container px-4 mx-auto">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">关卡完成！</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="relative mx-2">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center border-4",
                        i < stars ? "border-game-secondary bg-yellow-50" : "border-gray-200",
                      )}
                    >
                      <div className={cn("text-3xl", i < stars ? "text-game-secondary" : "text-gray-300")}>★</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold mb-1">你获得了 {stars} 颗星！</h3>
                <p className="text-gray-500">
                  答对 {correctCount}/{totalQuestions} 题，正确率 {correctRate}%
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">答题情况</h4>
                <div className="space-y-2">
                  {level.questions.map((question, index) => (
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push(`/level/${level.id}`)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回关卡
              </Button>
              <Button onClick={() => router.push("/map")}>
                继续冒险
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
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push(`/level/${level.id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            退出关卡
          </Button>

          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium">
              题目 {currentQuestionIndex + 1}/{level.questions.length}
            </div>

            {timeLeft !== null && (
              <div
                className={cn(
                  "flex items-center px-3 py-1 rounded-full text-sm font-medium",
                  timeLeft > 10
                    ? "bg-blue-100 text-blue-800"
                    : timeLeft > 5
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800",
                )}
              >
                <Clock className="w-4 h-4 mr-1" />
                {timeLeft}秒
              </div>
            )}
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
                {currentQuestionIndex < level.questions.length - 1 ? "下一题" : "完成"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </GameLayout>
  )
}

