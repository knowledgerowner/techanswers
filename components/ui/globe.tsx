"use client"

import createGlobe, { COBEOptions } from "cobe"
import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  baseColor: [0.3, 0.3, 0.3],
  markerColor: [0.1, 0.8, 1],
  glowColor: [1, 1, 1],
  markers: [
    { location: [37.7749, -122.4194], size: 0.03 }, // San Francisco
    { location: [40.7128, -74.0060], size: 0.03 },  // New York
    { location: [51.5074, -0.1278], size: 0.03 },   // London
    { location: [48.8566, 2.3522], size: 0.03 },    // Paris
    { location: [35.6762, 139.6503], size: 0.03 },  // Tokyo
    { location: [22.3193, 114.1694], size: 0.03 },  // Hong Kong
    { location: [19.0760, 72.8777], size: 0.03 },   // Mumbai
    { location: [-33.8688, 151.2093], size: 0.03 }, // Sydney
    { location: [55.7558, 37.6176], size: 0.03 },   // Moscow
    { location: [-23.5505, -46.6333], size: 0.03 }, // São Paulo
    { location: [28.6139, 77.2090], size: 0.03 },   // Delhi
    { location: [39.9042, 116.4074], size: 0.03 },  // Beijing
  ],
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
  showLogo = false,
  enableExpansionAnimation = false,
}: {
  className?: string
  config?: COBEOptions
  showLogo?: boolean
  enableExpansionAnimation?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Variables de rotation (refs pour éviter les re-renders)
  const phiRef = useRef(0)
  const thetaRef = useRef(0)
  const targetPhiRef = useRef(0)
  const targetThetaRef = useRef(0)
  const autoRotateRef = useRef(true)
  const widthRef = useRef(0)
  
  // États pour l'interaction
  const [isDragging, setIsDragging] = useState(false)
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null)
  
  // Animation d'expansion
  const [markers, setMarkers] = useState(config.markers || [])
  const [isExpanding, setIsExpanding] = useState(false)

  // Gestion de l'interaction pointer
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    autoRotateRef.current = false
    lastPointerRef.current = { x: e.clientX, y: e.clientY }
    
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grabbing"
      canvasRef.current.setPointerCapture(e.pointerId)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !lastPointerRef.current) return

    const deltaX = e.clientX - lastPointerRef.current.x
    const deltaY = e.clientY - lastPointerRef.current.y

    // Vitesse de rotation ajustée pour être plus réactive
    const sensitivity = 0.005
    
    targetPhiRef.current += deltaX * sensitivity
    targetThetaRef.current = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, targetThetaRef.current - deltaY * sensitivity)
    )

    lastPointerRef.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    lastPointerRef.current = null
    
    // Reprendre la rotation auto après un délai
    setTimeout(() => {
      if (!isDragging) {
        autoRotateRef.current = true
      }
    }, 2000)
    
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grab"
      canvasRef.current.releasePointerCapture(e.pointerId)
    }
  }

  // Gestion du wheel pour le zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.95 : 1.05
    
    if (canvasRef.current) {
      const currentTransform = canvasRef.current.style.transform
      const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/)
      const currentScale = scaleMatch ? parseFloat(scaleMatch[1]) : 1
      const newScale = Math.max(0.5, Math.min(3, currentScale * delta))
      canvasRef.current.style.transform = `scale(${newScale})`
    }
  }

  // Animation d'expansion
  const startExpansion = useCallback(() => {
    if (!enableExpansionAnimation || isExpanding) return
    
    setIsExpanding(true)
    let animationTime = 0
    
    const animate = () => {
      animationTime += 0.02
      
      const expandedMarkers = (config.markers || []).map((marker, index) => {
        const delay = index * 0.15
        const progress = Math.max(0, animationTime - delay)
        const pulse = Math.sin(progress * 4) * Math.exp(-progress * 0.8)
        const expansion = Math.max(0, pulse * 0.05)
        
        return {
          ...marker,
          size: (marker.size || 0.03) + expansion,
        }
      })
      
      setMarkers(expandedMarkers)
      
      if (animationTime < 4) {
        requestAnimationFrame(animate)
      } else {
        setIsExpanding(false)
        setMarkers(config.markers || [])
      }
    }
    
    animate()
  }, [config.markers, enableExpansionAnimation, isExpanding])

  // Fonction de rendu avec interpolation douce
  const onRender = useCallback((state: Record<string, number>) => {
    // Rotation automatique continue
    if (autoRotateRef.current) {
      targetPhiRef.current += 0.003
    }
    
    // Interpolation douce vers les valeurs cibles
    const lerpFactor = 0.1
    phiRef.current += (targetPhiRef.current - phiRef.current) * lerpFactor
    thetaRef.current += (targetThetaRef.current - thetaRef.current) * lerpFactor
    
    // Application des valeurs
    state.phi = phiRef.current
    state.theta = thetaRef.current
    state.width = widthRef.current * 2
    state.height = widthRef.current * 2
  }, [])

  // Gestion du redimensionnement
  const onResize = useCallback(() => {
    if (canvasRef.current) {
      widthRef.current = canvasRef.current.offsetWidth
    }
  }, [])

  // Effet principal
  useEffect(() => {
    window.addEventListener("resize", onResize)
    onResize()

    const globeConfig = {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender,
      markers: enableExpansionAnimation ? markers : config.markers,
    }

    const globe = createGlobe(canvasRef.current!, globeConfig)

    // Animation d'apparition
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1"
      }
    }, 100)

    return () => {
      window.removeEventListener("resize", onResize)
      globe.destroy()
    }
  }, [onRender, onResize, config, markers, enableExpansionAnimation])

  return (
    <div
      className={cn(
        "relative mx-auto aspect-[1/1] w-full h-full max-w-[500px] max-h-full",
        className,
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-1000 [contain:layout_paint_size] cursor-grab select-none",
        )}
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        style={{ touchAction: 'none' }}
      />
      
      {/* Logo overlay */}
      {showLogo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-200/50">
            <Image
              src="/favicon/logo.png"
              alt="ClimGO"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
        </div>
      )}

      {/* Bouton d'expansion */}
      {enableExpansionAnimation && (
        <div className="absolute top-4 right-4">
          <button
            onClick={startExpansion}
            disabled={isExpanding}
            className="bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExpanding ? "🌊 Expansion..." : "🌍 Lancer expansion"}
          </button>
        </div>
      )}
    </div>
  )
}