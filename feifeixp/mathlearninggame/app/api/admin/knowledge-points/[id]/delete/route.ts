import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 删除知识点
    await prisma.knowledgePoint.delete({
      where: { id },
    })

    return NextResponse.json({ message: "知识点删除成功" })
  } catch (error) {
    console.error("删除知识点失败:", error)
    return NextResponse.json({ message: "删除知识点失败，可能该知识点已被问题或关卡引用" }, { status: 500 })
  }
}

