// 知识点类型
export interface KnowledgePoint {
  id: string
  name: string
  description: string
  category: KnowledgeCategory
}

// 知识点类别
export type KnowledgeCategory = "整数运算" | "分数" | "小数" | "图形与空间" | "统计与概率" | "应用问题"

// 问题类型
export interface Question {
  id: string
  text: string
  type: "选择题" | "填空题" | "连线题" | "拖拽题"
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  knowledgePoints: string[]
  difficulty: 1 | 2 | 3 // 1-简单, 2-中等, 3-困难
  timeLimit?: number // 以秒为单位
}

// 主题区域类型
export interface ThemeArea {
  id: string
  name: string
  description: string
  image: string
  color: string
  unlocked: boolean
  levels: Level[]
}

// 关卡类型
export interface Level {
  id: string
  name: string
  description: string
  themeAreaId: string
  position: {
    x: number
    y: number
  }
  unlocked: boolean
  completed: boolean
  stars: number // 0-3星
  questions: Question[]
  knowledgePoints: string[]
  reward: {
    stars: number
    badges?: string[]
    items?: string[]
  }
  nextLevelIds: string[]
}

// 用户答题记录
export interface AnswerRecord {
  userId: string
  levelId: string
  questionId: string
  userAnswer: string | string[]
  isCorrect: boolean
  timeSpent: number // 以秒为单位
  timestamp: string
  knowledgePoints: string[]
}

// 薄弱点数据
export interface WeakPoint {
  knowledgePointId: string
  correctRate: number // 0-1
  attempts: number
  lastPracticed: string
  trend: "improving" | "declining" | "stable"
}

// 用户进度数据
export interface UserProgress {
  userId: string
  completedLevels: string[]
  unlockedLevels: string[]
  stars: number
  badges: string[]
  items: string[]
  streak: number // 连续学习天数
  weakPoints: WeakPoint[]
  answerRecords: AnswerRecord[]
}

// 用户类型
export interface User {
  id: string
  name: string
  avatar: string
  grade: string
  progress: UserProgress
}

// 成就类型
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

