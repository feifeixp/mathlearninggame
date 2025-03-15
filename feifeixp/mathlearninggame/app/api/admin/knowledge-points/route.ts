import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const knowledgePoints = await prisma.knowledgePoint.findMany({
      orderBy: {
        category: "asc",
      },
    })

    return NextResponse.json({ knowledgePoints })
  } catch (error) {
    console.error("获取知识点列表失败:", error)
    return NextResponse.json({ message: "获取知识点列表失败" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, description, category } = data

    // 验证必填字段
    if (!name || !description || !category) {
      return NextResponse.json({ message: "缺少必要的字段" }, { status: 400 })
    }

    // 创建知识点
    const knowledgePoint = await prisma.knowledgePoint.create({
      data: {
        name,
        description,
        category,
      },
    })

    return NextResponse.json({
      message: "知识点创建成功",
      knowledgePoint,
    })
  } catch (error) {
    console.error("创建知识点失败:", error)
    return NextResponse.json({ message: "创建知识点失败" }, { status: 500 })
  }
}

