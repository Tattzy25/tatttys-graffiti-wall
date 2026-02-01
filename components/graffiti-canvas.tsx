"use client"

import { useRef, useState, useCallback } from "react"
import { BrickWall } from "./brick-wall"
import { SprayCan } from "./spray-can"
import { Button } from "@/components/ui/button"
import { Trash2, Download } from "lucide-react"

const SPRAY_COLORS = [
  { color: "rgb(220, 38, 38)", label: "Fire Red" },
  { color: "rgb(37, 99, 235)", label: "Electric Blue" },
  { color: "rgb(22, 163, 74)", label: "Toxic Green" },
  { color: "rgb(250, 204, 21)", label: "Neon Yellow" },
  { color: "rgb(168, 85, 247)", label: "Purple Haze" },
  { color: "rgb(15, 15, 15)", label: "Midnight Black" },
]

export function GraffitiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedColor, setSelectedColor] = useState(SPRAY_COLORS[0].color)

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  const handleDownload = useCallback(() => {
    const drawingCanvas = canvasRef.current
    if (!drawingCanvas) return

    // Create a combined canvas
    const combinedCanvas = document.createElement("canvas")
    combinedCanvas.width = drawingCanvas.width
    combinedCanvas.height = drawingCanvas.height
    const ctx = combinedCanvas.getContext("2d")
    if (!ctx) return

    // Draw brick pattern first
    const brickPatternCanvas = drawingCanvas.previousElementSibling as HTMLCanvasElement
    if (brickPatternCanvas) {
      ctx.drawImage(brickPatternCanvas, 0, 0)
    }

    // Draw the graffiti on top
    ctx.drawImage(drawingCanvas, 0, 0)

    // Download
    const link = document.createElement("a")
    link.download = `graffiti-art-${Date.now()}.png`
    link.href = combinedCanvas.toDataURL("image/png")
    link.click()
  }, [])

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* Main canvas area - takes all available space */}
      <div className="flex-1 relative">
        <BrickWall selectedColor={selectedColor} canvasRef={canvasRef} />
        
        {/* Vignette overlay for atmosphere */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      {/* Bottom toolbar */}
      <div className="bg-card/95 backdrop-blur-md border-t border-border">
        <div className="flex items-center justify-between px-4 py-4 md:px-8">
          {/* Spray cans */}
          <div className="flex items-end gap-3 md:gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {SPRAY_COLORS.map((sprayColor) => (
              <SprayCan
                key={sprayColor.color}
                color={sprayColor.color}
                label={sprayColor.label}
                isSelected={selectedColor === sprayColor.color}
                onClick={() => setSelectedColor(sprayColor.color)}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 ml-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleClear}
              className="gap-2 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 bg-transparent"
            >
              <Trash2 className="w-5 h-5" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
            <Button
              size="lg"
              onClick={handleDownload}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
