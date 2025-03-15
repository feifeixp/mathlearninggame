import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"
import { sign } from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "邮箱和密码不能为空" }, { status: 400 })
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.password) {
      return NextResponse.json({ message: "邮箱或密码不正确" }, { status: 401 })
    }

    // 检查用户是否是管理员
    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "没有管理员权限" }, { status: 403 })
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: "邮箱或密码不正确" }, { status: 401 })
    }

    // 创建JWT令牌
    const token = sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" },
    )

    // 设置cookie
    cookies().set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1天
      path: "/",
    })

    return NextResponse.json({
      message: "登录成功",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("登录错误:", error)
    return NextResponse.json({ message: "登录失败，请重试" }, { status: 500 })
  }
}

