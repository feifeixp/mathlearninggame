import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 删除问题
    await prisma.question.delete({
      where: { id },
    })

    return NextResponse.json({ message: "问题删除成功" })
  } catch (error) {
    console.error("删除问题失败:", error)
    return NextResponse.json({ message: "删除问题失败" }, { status: 500 })
  }
}

