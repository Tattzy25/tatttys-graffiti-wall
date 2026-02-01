"use client"

import React from "react"

import { useRef, useEffect, useCallback, useState } from "react"

interface BrickWallProps {
  selectedColor: string
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export function BrickWall({ selectedColor, canvasRef }: BrickWallProps) {
  const brickPatternRef = useRef<HTMLCanvasElement>(null)
  const textureRef = useRef<HTMLCanvasElement>(null)
  const depthMapRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(false)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)

  // Generate ultra-realistic weathered white brick pattern like the reference
  const drawBrickPattern = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Base layer - slightly warm off-white like aged painted brick
      ctx.fillStyle = "#e6e2db"
      ctx.fillRect(0, 0, width, height)

      const brickWidth = 90
      const brickHeight = 42
      const mortarSize = 8

      // First pass: Draw deep recessed mortar/grout
      for (let row = 0; row < Math.ceil(height / (brickHeight + mortarSize)) + 1; row++) {
        for (let col = -1; col < Math.ceil(width / (brickWidth + mortarSize)) + 2; col++) {
          const offset = row % 2 === 0 ? 0 : brickWidth / 2 + mortarSize / 2
          const x = col * (brickWidth + mortarSize) + offset
          const y = row * (brickHeight + mortarSize)

          // Deep mortar base - darker gray
          const mortarBase = 130 + Math.random() * 20 - 10
          ctx.fillStyle = `rgb(${mortarBase}, ${mortarBase - 5}, ${mortarBase - 8})`
          
          // Horizontal mortar
          ctx.fillRect(x - mortarSize, y, brickWidth + mortarSize * 2, mortarSize)
          
          // Vertical mortar
          ctx.fillRect(x - mortarSize, y + mortarSize, mortarSize, brickHeight)
        }
      }

      // Add shadows in mortar for 3D depth
      for (let row = 0; row < Math.ceil(height / (brickHeight + mortarSize)) + 1; row++) {
        for (let col = -1; col < Math.ceil(width / (brickWidth + mortarSize)) + 2; col++) {
          const offset = row % 2 === 0 ? 0 : brickWidth / 2 + mortarSize / 2
          const x = col * (brickWidth + mortarSize) + offset
          const y = row * (brickHeight + mortarSize)

          // Top shadow in horizontal mortar (light comes from top)
          ctx.fillStyle = "rgba(0, 0, 0, 0.25)"
          ctx.fillRect(x - mortarSize, y, brickWidth + mortarSize * 2, 3)
          
          // Left shadow in vertical mortar
          ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
          ctx.fillRect(x - mortarSize, y + mortarSize, 3, brickHeight)

          // Mortar texture - rough cement look
          for (let t = 0; t < 30; t++) {
            const tx = x - mortarSize + Math.random() * mortarSize
            const ty = y + Math.random() * mortarSize
            ctx.fillStyle = `rgba(${Math.random() > 0.5 ? 0 : 255}, ${Math.random() > 0.5 ? 0 : 255}, ${Math.random() > 0.5 ? 0 : 255}, ${Math.random() * 0.08})`
            ctx.beginPath()
            ctx.arc(tx, ty, Math.random() * 1.5, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // Second pass: Draw bricks with 3D textured surfaces
      for (let row = 0; row < Math.ceil(height / (brickHeight + mortarSize)) + 1; row++) {
        for (let col = -1; col < Math.ceil(width / (brickWidth + mortarSize)) + 2; col++) {
          const offset = row % 2 === 0 ? 0 : brickWidth / 2 + mortarSize / 2
          const x = col * (brickWidth + mortarSize) + offset
          const y = row * (brickHeight + mortarSize) + mortarSize

          // Each brick has unique character
          const brickSeed = row * 1000 + col

          // Base color varies between warm white, cream, light beige, cool gray-white
          const colorType = (brickSeed % 5)
          let baseR, baseG, baseB
          
          if (colorType === 0) {
            // Warm cream
            baseR = 228 + Math.random() * 15 - 7
            baseG = 222 + Math.random() * 15 - 7
            baseB = 210 + Math.random() * 12 - 6
          } else if (colorType === 1) {
            // Cool gray-white
            baseR = 218 + Math.random() * 12 - 6
            baseG = 218 + Math.random() * 12 - 6
            baseB = 218 + Math.random() * 12 - 6
          } else if (colorType === 2) {
            // Light beige
            baseR = 225 + Math.random() * 15 - 7
            baseG = 218 + Math.random() * 15 - 7
            baseB = 205 + Math.random() * 12 - 6
          } else if (colorType === 3) {
            // Slightly pinkish white
            baseR = 230 + Math.random() * 12 - 6
            baseG = 222 + Math.random() * 12 - 6
            baseB = 218 + Math.random() * 12 - 6
          } else {
            // Pure off-white
            baseR = 235 + Math.random() * 10 - 5
            baseG = 232 + Math.random() * 10 - 5
            baseB = 228 + Math.random() * 10 - 5
          }

          // Fill base brick color
          ctx.fillStyle = `rgb(${baseR}, ${baseG}, ${baseB})`
          ctx.fillRect(x, y, brickWidth, brickHeight)

          // 3D lighting gradient - top edge lighter, bottom darker
          const topGradient = ctx.createLinearGradient(x, y, x, y + brickHeight)
          topGradient.addColorStop(0, "rgba(255, 255, 255, 0.15)")
          topGradient.addColorStop(0.15, "rgba(255, 255, 255, 0.05)")
          topGradient.addColorStop(0.7, "rgba(0, 0, 0, 0)")
          topGradient.addColorStop(1, "rgba(0, 0, 0, 0.12)")
          ctx.fillStyle = topGradient
          ctx.fillRect(x, y, brickWidth, brickHeight)

          // Left edge highlight (light from top-left)
          ctx.fillStyle = "rgba(255, 255, 255, 0.08)"
          ctx.fillRect(x, y, 4, brickHeight)

          // Bottom edge shadow
          ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
          ctx.fillRect(x, y + brickHeight - 3, brickWidth, 3)

          // Right edge subtle shadow
          ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
          ctx.fillRect(x + brickWidth - 3, y, 3, brickHeight)

          // TEXTURE: Surface pits, bumps, and rough texture (key to realism)
          const pitCount = 40 + Math.floor(Math.random() * 30)
          for (let p = 0; p < pitCount; p++) {
            const px = x + 3 + Math.random() * (brickWidth - 6)
            const py = y + 3 + Math.random() * (brickHeight - 6)
            const pitSize = Math.random() * 4 + 1
            
            // Pits (dark spots)
            if (Math.random() > 0.4) {
              const pitGradient = ctx.createRadialGradient(px, py, 0, px, py, pitSize)
              pitGradient.addColorStop(0, `rgba(0, 0, 0, ${Math.random() * 0.15 + 0.05})`)
              pitGradient.addColorStop(0.5, `rgba(0, 0, 0, ${Math.random() * 0.08})`)
              pitGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
              ctx.fillStyle = pitGradient
              ctx.beginPath()
              ctx.arc(px, py, pitSize, 0, Math.PI * 2)
              ctx.fill()
            } else {
              // Bumps (light spots with shadow)
              ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.12 + 0.03})`
              ctx.beginPath()
              ctx.arc(px - 0.5, py - 0.5, pitSize * 0.7, 0, Math.PI * 2)
              ctx.fill()
              ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.08 + 0.02})`
              ctx.beginPath()
              ctx.arc(px + 0.5, py + 0.5, pitSize * 0.5, 0, Math.PI * 2)
              ctx.fill()
            }
          }

          // Larger surface imperfections
          const imperfectionCount = 3 + Math.floor(Math.random() * 4)
          for (let imp = 0; imp < imperfectionCount; imp++) {
            const ix = x + 8 + Math.random() * (brickWidth - 16)
            const iy = y + 5 + Math.random() * (brickHeight - 10)
            const iw = Math.random() * 15 + 8
            const ih = Math.random() * 8 + 4

            // Subtle depression or raised area
            if (Math.random() > 0.5) {
              ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.06 + 0.02})`
            } else {
              ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.06 + 0.02})`
            }
            
            ctx.beginPath()
            ctx.ellipse(ix, iy, iw, ih, Math.random() * Math.PI, 0, Math.PI * 2)
            ctx.fill()
          }

          // Some bricks have deeper worn patches
          if (Math.random() > 0.7) {
            const wearX = x + 10 + Math.random() * (brickWidth - 30)
            const wearY = y + 5 + Math.random() * (brickHeight - 15)
            const wearW = Math.random() * 25 + 15
            const wearH = Math.random() * 12 + 8

            const wearGradient = ctx.createRadialGradient(
              wearX + wearW / 2,
              wearY + wearH / 2,
              0,
              wearX + wearW / 2,
              wearY + wearH / 2,
              Math.max(wearW, wearH)
            )
            wearGradient.addColorStop(0, `rgba(${baseR - 15}, ${baseG - 15}, ${baseB - 10}, 0.4)`)
            wearGradient.addColorStop(0.6, `rgba(${baseR - 10}, ${baseG - 10}, ${baseB - 8}, 0.2)`)
            wearGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
            ctx.fillStyle = wearGradient
            ctx.fillRect(wearX, wearY, wearW, wearH)
          }

          // Rounded/chipped corner edges on some bricks
          if (Math.random() > 0.8) {
            const cornerSize = 3 + Math.random() * 5
            const corners = [
              { cx: x, cy: y }, // top-left
              { cx: x + brickWidth, cy: y }, // top-right
              { cx: x, cy: y + brickHeight }, // bottom-left
              { cx: x + brickWidth, cy: y + brickHeight }, // bottom-right
            ]
            const corner = corners[Math.floor(Math.random() * corners.length)]
            ctx.fillStyle = `rgba(${130 + Math.random() * 20}, ${125 + Math.random() * 20}, ${118 + Math.random() * 20}, 0.6)`
            ctx.beginPath()
            ctx.arc(corner.cx, corner.cy, cornerSize, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // Add overall noise/grain texture
      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 8
        data[i] = Math.min(255, Math.max(0, data[i] + noise))
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
      }
      ctx.putImageData(imageData, 0, 0)

      // Subtle dirt/age spots scattered across
      for (let i = 0; i < 400; i++) {
        const dx = Math.random() * width
        const dy = Math.random() * height
        const dSize = Math.random() * 3 + 1
        ctx.fillStyle = `rgba(${100 + Math.random() * 40}, ${95 + Math.random() * 40}, ${85 + Math.random() * 40}, ${Math.random() * 0.06 + 0.02})`
        ctx.beginPath()
        ctx.arc(dx, dy, dSize, 0, Math.PI * 2)
        ctx.fill()
      }
    },
    []
  )

  // Generate depth map for realistic paint-in-grout interaction
  const generateDepthMap = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const brickWidth = 90
      const brickHeight = 42
      const mortarSize = 8

      // White = surface (full paint), Dark = recessed (less paint)
      ctx.fillStyle = "rgb(255, 255, 255)"
      ctx.fillRect(0, 0, width, height)

      // Mark mortar as deeply recessed
      for (let row = 0; row < Math.ceil(height / (brickHeight + mortarSize)) + 1; row++) {
        for (let col = -1; col < Math.ceil(width / (brickWidth + mortarSize)) + 2; col++) {
          const offset = row % 2 === 0 ? 0 : brickWidth / 2 + mortarSize / 2
          const x = col * (brickWidth + mortarSize) + offset
          const y = row * (brickHeight + mortarSize)

          // Horizontal mortar - very dark (deep recess)
          ctx.fillStyle = "rgb(60, 60, 60)"
          ctx.fillRect(x - mortarSize, y, brickWidth + mortarSize * 2, mortarSize)

          // Vertical mortar
          ctx.fillStyle = "rgb(60, 60, 60)"
          ctx.fillRect(x - mortarSize, y + mortarSize, mortarSize, brickHeight)

          // Mortar edges are slightly less recessed (gradient from brick to mortar)
          ctx.fillStyle = "rgb(120, 120, 120)"
          ctx.fillRect(x - mortarSize, y, brickWidth + mortarSize * 2, 2)
          ctx.fillRect(x - mortarSize, y + mortarSize - 2, brickWidth + mortarSize * 2, 2)
          ctx.fillRect(x - mortarSize, y + mortarSize, 2, brickHeight)
          ctx.fillRect(x - 2, y + mortarSize, 2, brickHeight)
        }
      }

      // Add random pits on brick surfaces (slight recesses)
      for (let i = 0; i < 3000; i++) {
        const px = Math.random() * width
        const py = Math.random() * height
        const pSize = Math.random() * 3 + 0.5
        const depth = Math.floor(Math.random() * 60 + 180)
        ctx.fillStyle = `rgb(${depth}, ${depth}, ${depth})`
        ctx.beginPath()
        ctx.arc(px, py, pSize, 0, Math.PI * 2)
        ctx.fill()
      }
    },
    []
  )

  // Initialize canvases
  useEffect(() => {
    const canvas = canvasRef.current
    const patternCanvas = brickPatternRef.current
    const depthCanvas = depthMapRef.current
    if (!canvas || !patternCanvas || !depthCanvas) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (!container) return

      const width = container.clientWidth
      const height = container.clientHeight

      // Pattern canvas
      patternCanvas.width = width
      patternCanvas.height = height
      const patternCtx = patternCanvas.getContext("2d")
      if (patternCtx) {
        drawBrickPattern(patternCtx, width, height)
      }

      // Depth map canvas
      depthCanvas.width = width
      depthCanvas.height = height
      const depthCtx = depthCanvas.getContext("2d")
      if (depthCtx) {
        generateDepthMap(depthCtx, width, height)
      }

      // Drawing canvas
      canvas.width = width
      canvas.height = height
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [canvasRef, drawBrickPattern, generateDepthMap])

  // Realistic spray paint with depth-aware texture interaction
  const spray = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, intensity = 1) => {
      const depthCanvas = depthMapRef.current
      if (!depthCanvas) return
      const depthCtx = depthCanvas.getContext("2d")
      if (!depthCtx) return

      const particleCount = Math.floor(100 * intensity)
      const radius = 28

      // Parse color
      const colorMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
      if (!colorMatch) return
      const [, rStr, gStr, bStr] = colorMatch
      const r = Number(rStr)
      const g = Number(gStr)
      const b = Number(bStr)

      for (let i = 0; i < particleCount; i++) {
        // Gaussian distribution for natural spray pattern
        const angle = Math.random() * Math.PI * 2
        const u1 = Math.random()
        const u2 = Math.random()
        const gaussian = Math.sqrt(-2 * Math.log(u1 || 0.001)) * Math.cos(2 * Math.PI * u2)
        const distance = Math.abs(gaussian) * radius * 0.35

        const px = x + Math.cos(angle) * distance
        const py = y + Math.sin(angle) * distance

        // Sample depth map at this point
        const depthData = depthCtx.getImageData(
          Math.max(0, Math.min(depthCanvas.width - 1, Math.floor(px))),
          Math.max(0, Math.min(depthCanvas.height - 1, Math.floor(py))),
          1,
          1
        ).data
        const depthValue = depthData[0] / 255 // 0 = deep recess, 1 = surface

        // Paint opacity based on distance and depth
        const distanceRatio = distance / radius
        const centerWeight = Math.pow(1 - distanceRatio, 1.5)
        const baseAlpha = centerWeight * 0.25 * intensity

        // Depth affects paint: recessed areas get less paint (spray misses them)
        // But not zero - some paint still gets in the cracks
        const depthFactor = 0.15 + depthValue * 0.85
        const finalAlpha = baseAlpha * depthFactor

        if (finalAlpha > 0.008) {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`
          
          // Vary particle size - larger in center, smaller at edges
          const size = (Math.random() * 2 + 1) * (1 - distanceRatio * 0.5)

          ctx.beginPath()
          ctx.arc(px, py, size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Occasional splatter dots for authenticity
      if (Math.random() > 0.92) {
        for (let s = 0; s < 3; s++) {
          const splatAngle = Math.random() * Math.PI * 2
          const splatDist = radius + Math.random() * 20
          const sx = x + Math.cos(splatAngle) * splatDist
          const sy = y + Math.sin(splatAngle) * splatDist
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.random() * 0.3 + 0.1})`
          ctx.beginPath()
          ctx.arc(sx, sy, Math.random() * 2 + 0.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    },
    []
  )

  // Drawing handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDrawing(true)
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      lastPosRef.current = { x, y }

      const ctx = canvas.getContext("2d")
      if (ctx) {
        spray(ctx, x, y, selectedColor, 1.2)
      }
    },
    [canvasRef, selectedColor, spray]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setCursorPos({ x: e.clientX, y: e.clientY })

      if (!isDrawing) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const lastPos = lastPosRef.current
      if (lastPos) {
        const dx = x - lastPos.x
        const dy = y - lastPos.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const steps = Math.max(1, Math.floor(dist / 3))

        for (let i = 0; i <= steps; i++) {
          const t = i / steps
          const px = lastPos.x + dx * t
          const py = lastPos.y + dy * t
          spray(ctx, px, py, selectedColor, 0.85)
        }
      }

      lastPosRef.current = { x, y }
    },
    [canvasRef, isDrawing, selectedColor, spray]
  )

  const handlePointerUp = useCallback(() => {
    setIsDrawing(false)
    lastPosRef.current = null
  }, [])

  const handlePointerEnter = useCallback(() => {
    setShowCursor(true)
  }, [])

  const handlePointerLeave = useCallback(() => {
    setShowCursor(false)
    setIsDrawing(false)
    lastPosRef.current = null
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Brick pattern background */}
      <canvas ref={brickPatternRef} className="absolute inset-0 w-full h-full" />

      {/* Hidden depth map for paint interaction */}
      <canvas ref={depthMapRef} className="hidden" />

      {/* Drawing canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerUp}
      />

      {/* Custom spray cursor - nozzle tip at exact cursor position */}
      {showCursor && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: "translate(-50%, -2px)",
          }}
        >
          <svg width="32" height="64" viewBox="0 0 32 64" className="drop-shadow-lg">
            {/* Spray particles when drawing - above the nozzle */}
            {isDrawing && (
              <g>
                <circle cx="16" cy="-6" r="4" fill={selectedColor} opacity="0.5">
                  <animate attributeName="r" values="3;10;3" dur="0.12s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.1;0.6" dur="0.12s" repeatCount="indefinite" />
                </circle>
                <circle cx="12" cy="-10" r="2" fill={selectedColor} opacity="0.4">
                  <animate attributeName="cy" values="-10;-20;-10" dur="0.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="0.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="20" cy="-8" r="1.5" fill={selectedColor} opacity="0.4">
                  <animate attributeName="cy" values="-8;-18;-8" dur="0.18s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="0.18s" repeatCount="indefinite" />
                </circle>
                <circle cx="16" cy="-12" r="1" fill={selectedColor} opacity="0.3">
                  <animate attributeName="cy" values="-12;-22;-12" dur="0.15s" repeatCount="indefinite" />
                </circle>
              </g>
            )}

            {/* Nozzle tip - this is exactly at cursor position */}
            <ellipse cx="16" cy="2" rx="3" ry="2" fill="#1a1a1a" />
            
            {/* Spray nozzle button */}
            <rect x="12" y="2" width="8" height="8" rx="1.5" fill="#333" />
            <rect x="13" y="4" width="6" height="5" rx="1" fill="#222" />
            <ellipse cx="16" cy="5" rx="2" ry="1" fill="#444" />

            {/* Can top cap */}
            <ellipse cx="16" cy="12" rx="11" ry="3" fill="#4a4a4a" />
            <ellipse cx="16" cy="11" rx="9" ry="2" fill="#5a5a5a" />

            {/* Can body */}
            <rect x="5" y="12" width="22" height="48" rx="1" fill={selectedColor} />
            
            {/* Can shine/highlight */}
            <rect x="6" y="12" width="4" height="48" fill="rgba(255,255,255,0.3)" />
            <rect x="8" y="12" width="1" height="48" fill="rgba(255,255,255,0.15)" />
            
            {/* Can shadow edge */}
            <rect x="23" y="12" width="3" height="48" fill="rgba(0,0,0,0.2)" />

            {/* Label band */}
            <rect x="5" y="26" width="22" height="22" fill="rgba(255,255,255,0.1)" />
            <rect x="5" y="26" width="22" height="2" fill="rgba(0,0,0,0.15)" />
            <rect x="5" y="46" width="22" height="2" fill="rgba(0,0,0,0.15)" />
            
            {/* Color indicator circle */}
            <circle cx="16" cy="37" r="6" fill={selectedColor} stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
            <circle cx="14" cy="35" r="2" fill="rgba(255,255,255,0.35)" />

            {/* Bottom rim */}
            <ellipse cx="16" cy="60" rx="11" ry="3" fill="#3a3a3a" />
            <ellipse cx="16" cy="59" rx="9" ry="2" fill="#4a4a4a" />
          </svg>
        </div>
      )}
    </div>
  )
}
