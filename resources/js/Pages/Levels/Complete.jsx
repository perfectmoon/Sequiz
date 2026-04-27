'use client'

import { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import obsheader from '@/components/ui/Obsheader'
import MatrixBackground from '@/components/ui/matrix-background'

export default function Complete({ totalPoints, totalCompleted, csrfToken }) {
    const [matrixCanvas, setMatrixCanvas] = useState(null)

    useEffect(() => {
        const canvas = document.getElementById('matrixCanvas')
        if (!canvas) return
        
        const ctx = canvas.getContext('2d')
        
        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        window.addEventListener('resize', resize)
        resize()
        
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\\\'#&_(),.;:?!\\|{}<>[]^~'
        const BASE_FONT = 16
        
        let rows = Math.max(1, Math.floor(canvas.height / BASE_FONT))
        let xsPx = Array(rows).fill(0).map(() => Math.random() * canvas.width)
        let baseSpeedCols = Array(rows).fill(0).map(() => 0.6 + Math.random() * 0.8)
        
        const lerpColor = (t) => {
            const r = Math.round(0 + 255 * t)
            const g = Math.round(255 - 255 * t)
            const b = 0
            return `rgb(${r},${g},${b})`
        }
        
        let colorBlend = 0
        
        const draw = () => {
            ctx.fillStyle = 'rgba(0,0,0,0.05)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            
            ctx.fillStyle = lerpColor(colorBlend)
            ctx.font = `${BASE_FONT}px monospace`
            
            for (let i = 0; i < rows; i++) {
                const ch = chars[Math.floor(Math.random() * chars.length)]
                const x = xsPx[i]
                const y = (i * BASE_FONT) + BASE_FONT
                ctx.fillText(ch, x, y)
                
                xsPx[i] += baseSpeedCols[i] * 1
                if (xsPx[i] > canvas.width) {
                    xsPx[i] = -20
                    baseSpeedCols[i] = 0.6 + Math.random() * 0.8
                }
            }
            
            requestAnimationFrame(draw)
        }
        
        draw()
    }, [])

    const resetAndPlayAgain = () => {
        if (confirm('Reset all progress and start over?')) {
            fetch('/reset-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                }
            }).then(() => {
                window.location.href = '/level/1'
            })
        }
    }

    return (
        <>
            <Obsheader role="player" />
            
            <div className="min-h-screen relative overflow-hidden">
                <canvas id="matrixCanvas" className="fixed inset-0 w-full h-full z-0"></canvas>
                
                <div className="relative z-10 container mx-auto px-4 py-16">
                    <div className="max-w-2xl mx-auto bg-gray-900/90 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl shadow-2xl p-8 text-center">
                        <div className="text-8xl mb-6 animate-bounce">🏆</div>
                        
                        <h1 className="text-5xl font-bold mb-4 text-green-400">
                            CONGRATULATIONS!
                        </h1>
                        
                        <p className="text-2xl text-green-300 mb-8">
                            You've completed all 7 levels of Obscurum!
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-800/80 border border-green-500/30 p-4 rounded-lg">
                                <p className="text-gray-400 text-sm">Total Points</p>
                                <p className="text-3xl font-bold text-yellow-400">{totalPoints ?? 0}</p>
                            </div>
                            <div className="bg-gray-800/80 border border-green-500/30 p-4 rounded-lg">
                                <p className="text-gray-400 text-sm">Levels Completed</p>
                                <p className="text-3xl font-bold text-green-400">{totalCompleted ?? 7}/7</p>
                            </div>
                        </div>
                        
                        <p className="text-gray-300 mb-8">
                            You've mastered: View Source, CSS Inspection, Console Commands,<br />
                            Browser Storage, XOR Cryptography, Multi-layer Obfuscation, and Meta Puzzles!
                        </p>
                        
                        <button 
                            onClick={resetAndPlayAgain}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
                        >
                            <i className="fas fa-redo-alt"></i> Play Again (Reset Progress)
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}