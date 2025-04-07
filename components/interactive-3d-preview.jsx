"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CuboidIcon as Cube, Maximize2, Minimize2, RotateCcw } from "lucide-react"

export function Interactive3DPreview({ projectType, subType }) {
  const canvasRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsLoading(true)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set background
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#334155"
    ctx.lineWidth = 1

    const gridSize = 20
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw 3D building based on project type
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)

    // Draw different building types
    if (projectType === "house") {
      drawHouse(ctx, subType)
    } else if (projectType === "building") {
      drawBuilding(ctx, subType)
    } else if (projectType === "school") {
      drawSchool(ctx)
    } else if (projectType === "commercial") {
      drawCommercial(ctx)
    } else if (projectType === "warehouse") {
      drawWarehouse(ctx)
    } else {
      // Default
      drawHouse(ctx, "3BHK")
    }

    ctx.restore()

    setIsLoading(false)
  }, [projectType, subType])

  const toggleFullscreen = () => {
    if (!canvasRef.current) return

    if (!isFullscreen) {
      if (canvasRef.current.requestFullscreen) {
        canvasRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }

    setIsFullscreen(!isFullscreen)
  }

  // Drawing functions
  const drawHouse = (ctx, type) => {
    const size = type === "1BHK" ? 80 : type === "2BHK" ? 100 : 120

    // Base
    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.moveTo(-size, -size / 2)
    ctx.lineTo(size, -size / 2)
    ctx.lineTo(size, size / 2)
    ctx.lineTo(-size, size / 2)
    ctx.closePath()
    ctx.fill()

    // Roof
    ctx.fillStyle = "#1d4ed8"
    ctx.beginPath()
    ctx.moveTo(-size - 20, -size / 2)
    ctx.lineTo(0, -size - 20)
    ctx.lineTo(size + 20, -size / 2)
    ctx.closePath()
    ctx.fill()

    // Windows
    ctx.fillStyle = "#bfdbfe"
    const windowSize = 20
    const floors = type === "1BHK" ? 1 : type === "2BHK" ? 2 : 3

    for (let floor = 0; floor < floors; floor++) {
      const yPos = -size / 2 + 30 + floor * 40

      // Left window
      ctx.fillRect(-size + 30, yPos, windowSize, windowSize)

      // Right window
      ctx.fillRect(size - 30 - windowSize, yPos, windowSize, windowSize)

      if (type !== "1BHK") {
        // Middle window
        ctx.fillRect(-windowSize / 2, yPos, windowSize, windowSize)
      }
    }

    // Door
    ctx.fillStyle = "#475569"
    ctx.fillRect(-15, size / 2 - 40, 30, 40)
  }

  const drawBuilding = (ctx, type) => {
    const floors = type === "4-Story" ? 4 : type === "8-Story" ? 8 : 12
    const width = 120
    const floorHeight = 20
    const height = floors * floorHeight

    // Base
    ctx.fillStyle = "#64748b"
    ctx.fillRect(-width / 2, -height, width, height)

    // Windows
    ctx.fillStyle = "#bfdbfe"
    const windowSize = 15
    const windowsPerFloor = 5
    const windowSpacing = width / (windowsPerFloor + 1)

    for (let floor = 0; floor < floors; floor++) {
      const yPos = -height + floor * floorHeight + 5

      for (let w = 0; w < windowsPerFloor; w++) {
        const xPos = -width / 2 + (w + 1) * windowSpacing - windowSize / 2
        ctx.fillRect(xPos, yPos, windowSize, windowSize - 5)
      }
    }

    // Roof
    ctx.fillStyle = "#334155"
    ctx.fillRect(-width / 2 - 10, -height - 10, width + 20, 10)

    // Ground
    ctx.fillStyle = "#94a3b8"
    ctx.fillRect(-width / 2 - 20, 0, width + 40, 5)
  }

  const drawSchool = (ctx) => {
    // Main building
    ctx.fillStyle = "#f97316"
    ctx.fillRect(-100, -60, 200, 60)

    // Roof
    ctx.fillStyle = "#c2410c"
    ctx.beginPath()
    ctx.moveTo(-110, -60)
    ctx.lineTo(0, -90)
    ctx.lineTo(110, -60)
    ctx.closePath()
    ctx.fill()

    // Windows
    ctx.fillStyle = "#bfdbfe"
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(-90 + i * 30, -50, 20, 20)
    }

    // Door
    ctx.fillStyle = "#475569"
    ctx.fillRect(-15, 0, 30, -30)

    // Flag
    ctx.fillStyle = "#ef4444"
    ctx.fillRect(80, -90, 20, 15)
    ctx.fillStyle = "#475569"
    ctx.fillRect(80, -90, 2, 30)
  }

  const drawCommercial = (ctx) => {
    // Glass building
    ctx.fillStyle = "#0ea5e9"
    ctx.fillRect(-80, -120, 160, 120)

    // Glass panels
    ctx.fillStyle = "#0284c7"
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 8; x++) {
        ctx.fillRect(-80 + x * 20 + 1, -120 + y * 20 + 1, 18, 18)
      }
    }

    // Base
    ctx.fillStyle = "#334155"
    ctx.fillRect(-90, 0, 180, 10)

    // Entrance
    ctx.fillStyle = "#0f172a"
    ctx.fillRect(-20, 0, 40, -30)
  }

  const drawWarehouse = (ctx) => {
    // Main structure
    ctx.fillStyle = "#78716c"
    ctx.fillRect(-100, -40, 200, 40)

    // Roof
    ctx.fillStyle = "#57534e"
    ctx.beginPath()
    ctx.moveTo(-110, -40)
    ctx.lineTo(0, -70)
    ctx.lineTo(110, -40)
    ctx.closePath()
    ctx.fill()

    // Door
    ctx.fillStyle = "#44403c"
    ctx.fillRect(-30, 0, 60, -30)

    // Windows
    ctx.fillStyle = "#bfdbfe"
    ctx.fillRect(-80, -30, 20, 10)
    ctx.fillRect(60, -30, 20, 10)
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">3D Model Preview</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white">
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
          <Cube className="h-5 w-5 text-blue-400" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-white">Loading 3D Preview...</p>
            </div>
          </div>
        )}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <canvas ref={canvasRef} width={800} height={450} className="w-full h-full object-cover" />
        </div>
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            className="text-white border-blue-600 hover:bg-blue-600/20"
            onClick={() => {
              if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d")
                if (ctx) {
                  // Redraw the canvas
                  setIsLoading(true)
                  setTimeout(() => setIsLoading(false), 500)
                }
              }
            }}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Rotate View
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

