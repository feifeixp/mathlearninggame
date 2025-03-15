"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type {
  User,
  Level,
  ThemeArea,
  Question,
  WeakPoint,
  AnswerRecord,
  KnowledgePoint,
  Achievement,
} from "@/types/game"
import { mockUser, mockThemeAreas, mockKnowledgePoints, mockAchievements } from "@/data/mock-data"

interface GameContextType {
  user: User | null
  themeAreas: ThemeArea[]
  currentLevel: Level | null
  knowledgePoints: KnowledgePoint[]
  achievements: Achievement[]
  isLoading: boolean
  setCurrentLevel: (level: Level | null) => void
  completeLevel: (levelId: string, stars: number, records: AnswerRecord[]) => void
  unlockLevel: (levelId: string) => void
  updateWeakPoints: (records: AnswerRecord[]) => void
  getWeakPoints: () => WeakPoint[]
  getPracticeQuestions: () => Question[]
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [themeAreas, setThemeAreas] = useState<ThemeArea[]>([])
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null)
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 初始化游戏数据
  useEffect(() => {
    const initGameData = async () => {
      try {
        // 这里通常会从API获取数据，现在使用模拟数据
        setUser(mockUser)
        setThemeAreas(mockThemeAreas)
        setKnowledgePoints(mockKnowledgePoints)
        setAchievements(mockAchievements)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load game data:", error)
        setIsLoading(false)
      }
    }

    initGameData()
  }, [])

  // 完成关卡
  const completeLevel = (levelId: string, stars: number, records: AnswerRecord[]) => {
    if (!user) return

    // 更新关卡状态
    setThemeAreas((prevAreas) => {
      const newAreas = [...prevAreas]

      for (const area of newAreas) {
        const levelIndex = area.levels.findIndex((level) => level.id === levelId)
        if (levelIndex >= 0) {
          // 更新关卡完成状态
          area.levels[levelIndex].completed = true
          area.levels[levelIndex].stars = Math.max(area.levels[levelIndex].stars, stars)

          // 解锁下一关卡
          for (const nextLevelId of area.levels[levelIndex].nextLevelIds) {
            const nextLevelAreaIndex = newAreas.findIndex((a) => a.levels.some((l) => l.id === nextLevelId))

            if (nextLevelAreaIndex >= 0) {
              const nextLevelIndex = newAreas[nextLevelAreaIndex].levels.findIndex((l) => l.id === nextLevelId)

              if (nextLevelIndex >= 0) {
                newAreas[nextLevelAreaIndex].levels[nextLevelIndex].unlocked = true
              }
            }
          }

          break
        }
      }

      return newAreas
    })

    // 更新用户进度
    setUser((prevUser) => {
      if (!prevUser) return null

      const completedLevels = [...prevUser.progress.completedLevels]
      if (!completedLevels.includes(levelId)) {
        completedLevels.push(levelId)
      }

      // 计算总星星数
      let totalStars = 0
      themeAreas.forEach((area) => {
        area.levels.forEach((level) => {
          if (level.id === levelId) {
            totalStars += stars
          } else if (level.completed) {
            totalStars += level.stars
          }
        })
      })

      // 更新薄弱点
      const updatedWeakPoints = updateWeakPointsInternal(prevUser.progress.weakPoints, records)

      return {
        ...prevUser,
        progress: {
          ...prevUser.progress,
          completedLevels,
          stars: totalStars,
          answerRecords: [...prevUser.progress.answerRecords, ...records],
          weakPoints: updatedWeakPoints,
        },
      }
    })
  }

  // 解锁关卡
  const unlockLevel = (levelId: string) => {
    setThemeAreas((prevAreas) => {
      const newAreas = [...prevAreas]

      for (const area of newAreas) {
        const levelIndex = area.levels.findIndex((level) => level.id === levelId)
        if (levelIndex >= 0) {
          area.levels[levelIndex].unlocked = true
          break
        }
      }

      return newAreas
    })

    setUser((prevUser) => {
      if (!prevUser) return null

      const unlockedLevels = [...prevUser.progress.unlockedLevels]
      if (!unlockedLevels.includes(levelId)) {
        unlockedLevels.push(levelId)
      }

      return {
        ...prevUser,
        progress: {
          ...prevUser.progress,
          unlockedLevels,
        },
      }
    })
  }

  // 更新薄弱点内部实现
  const updateWeakPointsInternal = (currentWeakPoints: WeakPoint[], records: AnswerRecord[]): WeakPoint[] => {
    const updatedWeakPoints = [...currentWeakPoints]

    // 按知识点分组处理答题记录
    const knowledgePointRecords: Record<string, { correct: number; total: number }> = {}

    records.forEach((record) => {
      record.knowledgePoints.forEach((kpId) => {
        if (!knowledgePointRecords[kpId]) {
          knowledgePointRecords[kpId] = { correct: 0, total: 0 }
        }

        knowledgePointRecords[kpId].total += 1
        if (record.isCorrect) {
          knowledgePointRecords[kpId].correct += 1
        }
      })
    })

    // 更新薄弱点
    Object.entries(knowledgePointRecords).forEach(([kpId, stats]) => {
      const weakPointIndex = updatedWeakPoints.findIndex((wp) => wp.knowledgePointId === kpId)

      if (weakPointIndex >= 0) {
        // 已存在的薄弱点
        const wp = updatedWeakPoints[weakPointIndex]
        const oldCorrectCount = wp.correctRate * wp.attempts
        const newCorrectCount = oldCorrectCount + stats.correct
        const newAttempts = wp.attempts + stats.total
        const newCorrectRate = newCorrectCount / newAttempts

        // 判断趋势
        let trend: "improving" | "declining" | "stable" = "stable"
        if (newCorrectRate > wp.correctRate + 0.1) {
          trend = "improving"
        } else if (newCorrectRate < wp.correctRate - 0.1) {
          trend = "declining"
        }

        updatedWeakPoints[weakPointIndex] = {
          ...wp,
          correctRate: newCorrectRate,
          attempts: newAttempts,
          lastPracticed: new Date().toISOString(),
          trend,
        }
      } else {
        // 新的薄弱点
        updatedWeakPoints.push({
          knowledgePointId: kpId,
          correctRate: stats.correct / stats.total,
          attempts: stats.total,
          lastPracticed: new Date().toISOString(),
          trend: "stable",
        })
      }
    })

    return updatedWeakPoints
  }

  // 更新薄弱点 - 外部接口
  const updateWeakPoints = (records: AnswerRecord[]) => {
    if (!user) return

    setUser((prevUser) => {
      if (!prevUser) return null

      const updatedWeakPoints = updateWeakPointsInternal(prevUser.progress.weakPoints, records)

      return {
        ...prevUser,
        progress: {
          ...prevUser.progress,
          weakPoints: updatedWeakPoints,
          answerRecords: [...prevUser.progress.answerRecords, ...records],
        },
      }
    })
  }

  // 获取薄弱点
  const getWeakPoints = (): WeakPoint[] => {
    if (!user) return []
    return user.progress.weakPoints.filter((wp) => wp.correctRate < 0.7)
  }

  // 获取针对性练习题
  const getPracticeQuestions = (): Question[] => {
    if (!user || !themeAreas.length) return []

    const weakPoints = getWeakPoints()
    if (weakPoints.length === 0) return []

    const weakKnowledgePointIds = weakPoints.map((wp) => wp.knowledgePointId)
    const practiceQuestions: Question[] = []

    // 从所有关卡中筛选涉及薄弱知识点的题目
    themeAreas.forEach((area) => {
      area.levels.forEach((level) => {
        level.questions.forEach((question) => {
          const hasWeakKnowledgePoint = question.knowledgePoints.some((kpId) => weakKnowledgePointIds.includes(kpId))

          if (hasWeakKnowledgePoint && !practiceQuestions.some((q) => q.id === question.id)) {
            practiceQuestions.push(question)
          }
        })
      })
    })

    // 根据难度排序，从简单到困难
    return practiceQuestions.sort((a, b) => a.difficulty - b.difficulty)
  }

  const value = {
    user,
    themeAreas,
    currentLevel,
    knowledgePoints,
    achievements,
    isLoading,
    setCurrentLevel,
    completeLevel,
    unlockLevel,
    updateWeakPoints,
    getWeakPoints,
    getPracticeQuestions,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}

