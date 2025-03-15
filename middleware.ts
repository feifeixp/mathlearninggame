import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

export function middleware(request: NextRequest) {
  // 只拦截管理后台路由
  if (!request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next()
  }

  // 获取token
  const token = request.cookies.get("admin-token")?.value

  // 如果没有token，重定向到登录页面
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  try {
    // 验证token
    const secret = process.env.JWT_SECRET || "your-secret-key"
    const payload = verify(token, secret)

    // 检查是否是管理员
    if (payload && typeof payload === "object" && payload.role === "ADMIN") {
      return NextResponse.next()
    }

    // 不是管理员，重定向到登录页面
    return NextResponse.redirect(new URL("/admin/login", request.url))
  } catch (error) {
    // token无效，重定向到登录页面
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
}

// 配置中间件匹配的路由
export const config = {
  matcher: ["/admin/:path*"],
}

