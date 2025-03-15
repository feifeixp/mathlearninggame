"use client"

import GameLayout from "@/components/game/game-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGame } from "@/context/game-context"
import Link from "next/link"
import { useState } from "react"
import { Lock, MapIcon, Star, Sparkles, Compass, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MapPage() {
  const { themeAreas, isLoading } = useGame()
  const [selectedArea, setSelectedArea] = useState<string | null>(null)

  if (isLoading) {
    return (
      <GameLayout>
        <div className="container px-4 mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin-slow">
              <Star className="h-16 w-16 text-game-primary" />
            </div>
            <p className="mt-6 text-xl">加载中...</p>
          </div>
        </div>
      </GameLayout>
    )
  }

  const selectedThemeArea = themeAreas.find((area) => area.id === selectedArea) || themeAreas[0]

  return (
    <GameLayout>
      <div className="container px-4 mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold flex items-center">
            <Compass className="h-10 w-10 mr-3 text-game-primary" />
            冒险地图
            <div className="ml-3 text-game-secondary animate-spin-slow">
              <Sparkles className="h-6 w-6" />
            </div>
          </h1>
          <div className="text-lg text-gray-600 bg-blue-50 px-4 py-2 rounded-full">
            选择一个主题区域开始你的数学冒险！
          </div>
        </div>

        {/* 主题区域选择 */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themeAreas.map((area) => (
            <Card
              key={area.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-kid-lg game-card",
                selectedArea === area.id || (!selectedArea && area.id === themeAreas[0].id)
                  ? "border-4 border-game-primary"
                  : "border-2",
              )}
              onClick={() => setSelectedArea(area.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: area.color }}
                  >
                    {area.unlocked ? (
                      <MapIcon className="h-10 w-10 text-white" />
                    ) : (
                      <Lock className="h-10 w-10 text-white/70" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{area.name}</h3>
                    <p className="text-gray-600 text-lg">{area.description}</p>
                    {!area.unlocked && <p className="text-sm text-game-danger mt-2 font-bold">需要解锁前面的区域</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 选中区域的关卡地图 */}
        <Card className="overflow-hidden border-2 rounded-3xl shadow-kid-lg">
          <CardHeader className="bg-kid-gradient-purple pb-6">
            <CardTitle className="text-2xl flex items-center" style={{ color: selectedThemeArea.color }}>
              <Trophy className="mr-2 h-6 w-6" />
              {selectedThemeArea.name}关卡
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* 关卡地图 */}
            <div className="relative w-full h-[600px] bg-kid-gradient rounded-2xl p-6 shadow-inner">
              {/* 关卡节点 */}
              {selectedThemeArea.levels.map((level) => (
                <div
                  key={level.id}
                  className="absolute"
                  style={{
                    left: `${level.position.x}%`,
                    top: `${level.position.y}%`,
                  }}
                >
                  {/* 连接线 */}
                  {level.nextLevelIds.map((nextId) => {
                    const nextLevel = selectedThemeArea.levels.find((l) => l.id === nextId)
                    if (!nextLevel) return null

                    // 计算连接线的长度和角度
                    const x1 = level.position.x
                    const y1 = level.position.y
                    const x2 = nextLevel.position.x
                    const y2 = nextLevel.position.y

                    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
                    const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI

                    return (
                      <div
                        key={`path-${level.id}-${nextId}`}
                        className={cn("map-path", level.completed ? "map-path-completed" : "")}
                        style={{
                          width: `${length}%`,
                          transformOrigin: "0 0",
                          transform: `rotate(${angle}deg)`,
                        }}
                      />
                    )
                  })}

                  {/* 关卡节点 */}
                  {level.unlocked ? (
                    <Link href={`/level/${level.id}`}>
                      <div
                        className={cn(
                          "map-node",
                          level.completed ? "map-node-completed" : "map-node-unlocked",
                          "animate-pop",
                        )}
                      >
                        {level.id.replace("level", "")}
                      </div>
                    </Link>
                  ) : (
                    <div className="map-node map-node-locked">
                      <Lock className="w-6 h-6" />
                    </div>
                  )}

                  {/* 关卡名称 */}
                  <div className="absolute mt-3 w-40 text-center" style={{ left: "-45px" }}>
                    <p className="font-bold text-lg bg-white px-3 py-1 rounded-full shadow-kid inline-block">
                      {level.name}
                    </p>
                    {level.completed && (
                      <div className="flex justify-center mt-2">
                        {[...Array(3)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn("w-6 h-6", i < level.stars ? "text-game-secondary" : "text-gray-300")}
                            fill={i < level.stars ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* 如果没有解锁的关卡，显示提示信息 */}
              {selectedThemeArea.levels.filter((l) => l.unlocked).length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8 bg-white rounded-2xl shadow-kid-lg">
                    <Lock className="h-16 w-16 mx-auto mb-6 text-gray-400" />
                    <h3 className="text-2xl font-bold mb-3">区域未解锁</h3>
                    <p className="text-gray-600 text-lg">完成前面的区域来解锁这个区域的关卡</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  )
}

