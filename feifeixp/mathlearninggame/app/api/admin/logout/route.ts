import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // 清除cookie
  cookies().delete("admin-token")

  return NextResponse.json({ message: "退出成功" })
}

