'use client'

import { useState, useEffect } from 'react'
import Obsheader from '@/components/ui/Obsheader'
import MatrixBackground from '@/components/ui/matrix-background'

export default function Level2({ level, hints, usedHints, csrfToken }) {
    const [answer, setAnswer] = useState('')
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const [hintDisplay, setHintDisplay] = useState(null)
    const [disabledHints, setDisabledHints] = useState(usedHints || [])
    const [currentPoints, setCurrentPoints] = useState(0)

    useEffect(() => {
        const pointsElement = document.getElementById('pointsDisplay')
        if (pointsElement) setCurrentPoints(parseInt(pointsElement.textContent) || 0)
        
        const input = document.getElementById('answer')
        if (input) input.focus()
        
        console.log('%c🎨 OBSCURUM - LEVEL 2', 'font-size: 20px; color: #a78bfa;')
        console.log('The password is hidden in CSS hex colors')
        console.log('Look for: #636f6e, #736f6c65, #5f6d61, #73746572')
    }, [])

    const updatePointsDisplay = (newPoints) => {
        setCurrentPoints(newPoints)
        const pointsElement = document.getElementById('pointsDisplay')
        if (pointsElement) {
            pointsElement.textContent = newPoints
            pointsElement.classList.add('points-animation')
            setTimeout(() => pointsElement.classList.remove('points-animation'), 500)
        }
    }

    const getHint = async (hintNumber, cost) => {
        if (disabledHints.includes(hintNumber)) return
        try {
            const response = await fetch(`/level/${level.level_number}/hint`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify({ hint_number: hintNumber })
            })
            const data = await response.json()
            if (data.success) {
                setHintDisplay({ number: data.hint_number, hint: data.hint, cost: data.cost })
                setDisabledHints([...disabledHints, hintNumber])
                if (data.total_points !== undefined) updatePointsDisplay(data.total_points)
            } else {
                alert(data.error || 'Hint not available')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Error getting hint')
        }
    }

    const checkAnswer = async () => {
        if (!answer.trim()) { alert('Please enter an answer'); return }
        setMessage('Checking answer...')
        setMessageType('info')
        try {
            const response = await fetch(`/level/${level.level_number}/check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify({ answer: answer })
            })
            const data = await response.json()
            if (data.success) {
                setMessageType('success')
                setMessage(data.message)
                updatePointsDisplay(data.total_points)
                setTimeout(() => { window.location.href = data.redirect }, 2000)
            } else {
                setMessageType('error')
                setMessage(data.message)
                setAnswer('')
                document.getElementById('answer').focus()
            }
        } catch (error) {
            setMessageType('error')
            setMessage('Error checking answer. Please try again.')
        }
    }

    const getMessageClass = () => {
        switch(messageType) {
            case 'success': return 'bg-green-600 text-white'
            case 'error': return 'bg-red-600 text-white'
            default: return 'bg-gray-700 text-white'
        }
    }

    return (
        <>
            <Obsheader role="player" />
            <MatrixBackground />
            
            <div className="min-h-screen text-white pt-20 relative z-10">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8">
                        <style>{`
                            .color-clue-1 { color: #636f6e; }
                            .color-clue-2 { color: #736f6c65; }
                            .color-clue-3 { color: #5f6d61; }
                            .color-clue-4 { color: #73746572; }
                            .invisible-text { color: transparent; text-shadow: 0 0 0 #636f6e; }
                        `}</style>

                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold mb-2">🎨 Level 2: CSS Secrets</h1>
                            <div className="flex justify-center space-x-4 text-sm">
                                <span className="bg-blue-500 px-3 py-1 rounded-full">{level.difficulty || 'Medium'}</span>
                                <span className="bg-gray-700 px-3 py-1 rounded-full">{level.time_estimate || '10 mins'}</span>
                                <span className="bg-yellow-600 px-3 py-1 rounded-full">{level.points_awarded} pts</span>
                            </div>
                        </div>

                        <div className="mb-4 p-3 bg-gray-700 rounded-lg text-center">
                            <p className="text-sm">
                                <i className="fas fa-star text-yellow-400"></i> Base points: {level.points_awarded} | 
                                <i className="fas fa-lightbulb text-yellow-400"></i> Hint costs: Hint 1 = 5, Hint 2 = 10
                            </p>
                        </div>

                        <div className="mb-8 p-4 bg-gray-700 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">🎯 Your Mission:</h3>
                            <p>{level.description}</p>
                            <p className="text-sm text-gray-400 mt-2">Look closely at the CSS styles!</p>
                        </div>

                        <div className="mt-8">
                            <input 
                                type="text" 
                                id="answer"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg mb-4"
                                placeholder="Enter decoded password"
                                autoComplete="off"
                            />
                            <button onClick={checkAnswer} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg mb-4">
                                Submit Answer
                            </button>
                            {message && <div className={`mt-4 p-4 rounded-lg ${getMessageClass()}`}>{message}</div>}
                        </div>

                        <div className="mt-8 pt-4 border-t border-gray-700">
                            <h4 className="text-lg font-semibold mb-4">💡 Hints (Click to reveal):</h4>
                            <div className="grid grid-cols-1 gap-3 mb-4">
                                {hints.map((hint, index) => {
                                    const hintNumber = hint.order || (index + 1)
                                    const isUsed = disabledHints.includes(hintNumber)
                                    const cost = hintNumber * 5
                                    return (
                                        <button 
                                            key={hint.id}
                                            onClick={() => getHint(hintNumber, cost)}
                                            disabled={isUsed}
                                            className={`text-left bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg transition ${isUsed ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span><i className="fas fa-lightbulb"></i> Hint {hintNumber}</span>
                                                <span className="text-yellow-400 text-sm">-{cost} points</span>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                            {hintDisplay && (
                                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                                    <p className="text-yellow-400 font-semibold mb-2">💡 Hint {hintDisplay.number}:</p>
                                    <p className="text-white">{hintDisplay.hint}</p>
                                    {hintDisplay.cost > 0 && <p className="text-sm text-gray-400 mt-2">Cost: {hintDisplay.cost} points</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}