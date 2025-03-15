import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
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

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("获取问题列表失败:", error)
    return NextResponse.json({ message: "获取问题列表失败" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { text, type, options, correctAnswer, explanation, difficulty, timeLimit, knowledgePointIds } = data

    // 验证必填字段
    if (!text || !type || !correctAnswer || !explanation || !difficulty) {
      return NextResponse.json({ message: "缺少必要的字段" }, { status: 400 })
    }

    // 创建问题
    const question = await prisma.question.create({
      data: {
        text,
        type,
        options: options || [],
        correctAnswer,
        explanation,
        difficulty,
        timeLimit,
        knowledgePoints: {
          create: knowledgePointIds.map((kpId: string) => ({
            knowledgePoint: {
              connect: { id: kpId },
            },
          })),
        },
      },
    })

    return NextResponse.json({
      message: "问题创建成功",
      question,
    })
  } catch (error) {
    console.error("创建问题失败:", error)
    return NextResponse.json({ message: "创建问题失败" }, { status: 500 })
  }
}

