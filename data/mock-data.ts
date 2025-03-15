import type { User, ThemeArea, KnowledgePoint, Achievement } from "@/types/game"

// 模拟知识点数据
export const mockKnowledgePoints: KnowledgePoint[] = [
  {
    id: "kp1",
    name: "整数加法",
    description: "两位数及以上整数的加法计算",
    category: "整数运算",
  },
  {
    id: "kp2",
    name: "整数减法",
    description: "两位数及以上整数的减法计算",
    category: "整数运算",
  },
  {
    id: "kp3",
    name: "整数乘法",
    description: "一位数乘以两位数的乘法计算",
    category: "整数运算",
  },
  {
    id: "kp4",
    name: "整数除法",
    description: "两位数除以一位数的除法计算",
    category: "整数运算",
  },
  {
    id: "kp5",
    name: "分数基础概念",
    description: "分数的基本概念和表示方法",
    category: "分数",
  },
  {
    id: "kp6",
    name: "分数大小比较",
    description: "分数大小的比较方法",
    category: "分数",
  },
  {
    id: "kp7",
    name: "小数加减法",
    description: "小数的加减法计算",
    category: "小数",
  },
  {
    id: "kp8",
    name: "长方形周长",
    description: "长方形周长的计算方法",
    category: "图形与空间",
  },
  {
    id: "kp9",
    name: "长方形面积",
    description: "长方形面积的计算方法",
    category: "图形与空间",
  },
  {
    id: "kp10",
    name: "统计表格",
    description: "简单统计表格的读取和分析",
    category: "统计与概率",
  },
  {
    id: "kp11",
    name: "应用题解题",
    description: "多步应用题的分析和解题",
    category: "应用问题",
  },
]

// 模拟主题区域数据
export const mockThemeAreas: ThemeArea[] = [
  {
    id: "area1",
    name: "数字王国",
    description: "在这里学习整数的加减乘除运算",
    image: "/placeholder.svg?height=200&width=200",
    color: "#4F46E5",
    unlocked: true,
    levels: [
      {
        id: "level1",
        name: "加法村",
        description: "学习两位数加法",
        themeAreaId: "area1",
        position: { x: 20, y: 30 },
        unlocked: true,
        completed: false,
        stars: 0,
        questions: [
          {
            id: "q1_1",
            text: "计算: 25 + 47 = ?",
            type: "选择题",
            options: ["62", "72", "82", "92"],
            correctAnswer: "72",
            explanation: "将个位和十位分别相加：5+7=12，十位进1；2+4+1=7，所以结果是72。",
            knowledgePoints: ["kp1"],
            difficulty: 1,
          },
          {
            id: "q1_2",
            text: "计算: 38 + 45 = ?",
            type: "选择题",
            options: ["73", "83", "93", "63"],
            correctAnswer: "83",
            explanation: "将个位和十位分别相加：8+5=13，十位进1；3+4+1=8，所以结果是83。",
            knowledgePoints: ["kp1"],
            difficulty: 1,
          },
          {
            id: "q1_3",
            text: "在□里填上合适的数: 27 + □ = 65",
            type: "填空题",
            correctAnswer: "38",
            explanation: "用65减去27：65-27=38，所以空格里应填38。",
            knowledgePoints: ["kp1", "kp2"],
            difficulty: 2,
          },
          {
            id: "q1_4",
            text: "小明有36本书，小红有29本书，他们一共有多少本书？",
            type: "填空题",
            correctAnswer: "65",
            explanation: "36+29=65，所以他们一共有65本书。",
            knowledgePoints: ["kp1", "kp11"],
            difficulty: 1,
          },
          {
            id: "q1_5",
            text: "计算: 125 + 237 = ?",
            type: "选择题",
            options: ["352", "362", "372", "462"],
            correctAnswer: "362",
            explanation: "将个位、十位和百位分别相加：5+7=12，十位进1；2+3+1=6；1+2=3，所以结果是362。",
            knowledgePoints: ["kp1"],
            difficulty: 2,
          },
        ],
        knowledgePoints: ["kp1", "kp2", "kp11"],
        reward: {
          stars: 3,
          badges: ["加法高手"],
        },
        nextLevelIds: ["level2"],
      },
      {
        id: "level2",
        name: "减法山",
        description: "学习两位数减法",
        themeAreaId: "area1",
        position: { x: 60, y: 50 },
        unlocked: false,
        completed: false,
        stars: 0,
        questions: [
          {
            id: "q2_1",
            text: "计算: 85 - 37 = ?",
            type: "选择题",
            options: ["38", "48", "58", "68"],
            correctAnswer: "48",
            explanation: "从个位开始计算：5-7不够减，需要向十位借1，变成15-7=8；8-3-1=4，所以结果是48。",
            knowledgePoints: ["kp2"],
            difficulty: 1,
          },
          {
            id: "q2_2",
            text: "计算: 74 - 46 = ?",
            type: "选择题",
            options: ["18", "28", "38", "48"],
            correctAnswer: "28",
            explanation: "从个位开始计算：4-6不够减，需要向十位借1，变成14-6=8；7-4-1=2，所以结果是28。",
            knowledgePoints: ["kp2"],
            difficulty: 1,
          },
          {
            id: "q2_3",
            text: "在□里填上合适的数: □ - 27 = 38",
            type: "填空题",
            correctAnswer: "65",
            explanation: "用27加上38：27+38=65，所以空格里应填65。",
            knowledgePoints: ["kp1", "kp2"],
            difficulty: 2,
          },
          {
            id: "q2_4",
            text: "小明有65元，买了一本书花了29元，他还剩下多少元？",
            type: "填空题",
            correctAnswer: "36",
            explanation: "65-29=36，所以他还剩下36元。",
            knowledgePoints: ["kp2", "kp11"],
            difficulty: 1,
          },
          {
            id: "q2_5",
            text: "计算: 325 - 137 = ?",
            type: "选择题",
            options: ["188", "198", "288", "298"],
            correctAnswer: "188",
            explanation:
              "从个位开始计算：5-7不够减，需要向十位借1，变成15-7=8；2-3不够减，需要向百位借1，变成12-3=9；3-1-1=1，所以结果是188。",
            knowledgePoints: ["kp2"],
            difficulty: 2,
          },
        ],
        knowledgePoints: ["kp1", "kp2", "kp11"],
        reward: {
          stars: 3,
          badges: ["减法能手"],
        },
        nextLevelIds: ["level3"],
      },
      {
        id: "level3",
        name: "乘法森林",
        description: "学习一位数乘以两位数",
        themeAreaId: "area1",
        position: { x: 100, y: 30 },
        unlocked: false,
        completed: false,
        stars: 0,
        questions: [
          {
            id: "q3_1",
            text: "计算: 7 × 24 = ?",
            type: "选择题",
            options: ["158", "168", "178", "188"],
            correctAnswer: "168",
            explanation: "7×4=28，个位是8，十位进2；7×2=14，加上进位的2是16，所以结果是168。",
            knowledgePoints: ["kp3"],
            difficulty: 2,
          },
          // 其他题目...
        ],
        knowledgePoints: ["kp3", "kp11"],
        reward: {
          stars: 3,
          badges: ["乘法达人"],
        },
        nextLevelIds: ["level4"],
      },
      // 其他关卡...
    ],
  },
  {
    id: "area2",
    name: "分数森林",
    description: "在这里学习分数的基本概念和运算",
    image: "/placeholder.svg?height=200&width=200",
    color: "#10B981",
    unlocked: false,
    levels: [
      // 分数相关关卡...
    ],
  },
  // 其他主题区域...
]

// 模拟用户数据
export const mockUser: User = {
  id: "user1",
  name: "小明",
  avatar: "/placeholder.svg?height=100&width=100",
  grade: "四年级",
  progress: {
    userId: "user1",
    completedLevels: [],
    unlockedLevels: ["level1"],
    stars: 0,
    badges: [],
    items: [],
    streak: 1,
    weakPoints: [
      {
        knowledgePointId: "kp3",
        correctRate: 0.4,
        attempts: 5,
        lastPracticed: "2025-03-14T10:30:00Z",
        trend: "improving",
      },
      {
        knowledgePointId: "kp6",
        correctRate: 0.3,
        attempts: 3,
        lastPracticed: "2025-03-13T14:20:00Z",
        trend: "stable",
      },
    ],
    answerRecords: [],
  },
}

// 模拟成就数据
export const mockAchievements: Achievement[] = [
  {
    id: "ach1",
    name: "数学新手",
    description: "完成第一个关卡",
    icon: "🌟",
    unlocked: false,
  },
  {
    id: "ach2",
    name: "勤奋学习",
    description: "连续学习3天",
    icon: "📚",
    unlocked: false,
  },
  {
    id: "ach3",
    name: "计算高手",
    description: "在计算题中获得5个满星评价",
    icon: "🧮",
    unlocked: false,
  },
  {
    id: "ach4",
    name: "克服困难",
    description: "成功克服一个薄弱知识点",
    icon: "💪",
    unlocked: false,
  },
  // 其他成就...
]

