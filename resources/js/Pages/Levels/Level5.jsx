'use client'

import { useState, useEffect } from 'react'
import Obsheader from '@/components/ui/Obsheader'
import MatrixBackground from '@/components/ui/matrix-background'

export default function Level5({ level, hints, usedHints, csrfToken }) {
    const [answer, setAnswer] = useState('')
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const [hintDisplay, setHintDisplay] = useState(null)
    const [disabledHints, setDisabledHints] = useState(usedHints || [])
    const [currentPoints, setCurrentPoints] = useState(0)
    const [encryptedInput, setEncryptedInput] = useState('')
    const [keyInput, setKeyInput] = useState('0x55')
    const [decodedResult, setDecodedResult] = useState('')

    useEffect(() => {
        const pointsElement = document.getElementById('pointsDisplay')
        if (pointsElement) setCurrentPoints(parseInt(pointsElement.textContent) || 0)
        
        console.log('%c🔢 OBSCURUM - LEVEL 5', 'font-size: 20px; color: #f87171;')
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

    const xorDecode = () => {
        try {
            const encrypted = encryptedInput.split(',').map(b => parseInt(b.trim(), 16))
            const key = parseInt(keyInput, 16)
            const decrypted = encrypted.map(b => String.fromCharCode(b ^ key)).join('')
            setDecodedResult(`Decoded: "${decrypted}"`)
        } catch (e) {
            setDecodedResult('Error decoding. Check your input.')
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
            setMessage('Error checking answer.')
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
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold mb-2">🔢 Level 5: XOR Encryption</h1>
                            <div className="flex justify-center space-x-4 text-sm">
                                <span className="bg-yellow-600 px-3 py-1 rounded-full">{level.difficulty || 'Hard'}</span>
                                <span className="bg-gray-700 px-3 py-1 rounded-full">{level.time_estimate || '20 mins'}</span>
                                <span className="bg-yellow-600 px-3 py-1 rounded-full">{level.points_awarded} pts</span>
                            </div>
                        </div>

                        <div className="mb-4 p-3 bg-gray-700 rounded-lg text-center">
                            <p className="text-sm">
                                <i className="fas fa-star text-yellow-400"></i> Base points: {level.points_awarded} | 
                                <i className="fas fa-lightbulb text-yellow-400"></i> Hint costs: Hint 1 = 5, Hint 2 = 10, Hint 3 = 15
                            </p>
                        </div>

                        <p style={{display: 'none'}} className="font-mono">
                            0x36 0x27 0x2c 0x25 0x21 0x3a 0x0a 0x3d 0x34 0x36 0x3e 0x30 0x27
                        </p>
                        
                        <div className="mb-8 p-4 bg-gray-700 rounded-lg">
                            <p><strong>KEY:</strong> <span className="text-yellow-400">0x55</span></p>
                        </div>

                        <div className="mb-8 p-4 bg-gray-700 rounded-lg">
                            <h4 className="font-semibold mb-4">🛠️ XOR Decoder Tool:</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-2">Encrypted bytes:</label>
                                    <input 
                                        type="text" 
                                        value={encryptedInput}
                                        onChange={(e) => setEncryptedInput(e.target.value)}
                                        placeholder="Enter hex value (e.g., 0x36, 0x27)"
                                        className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Key (hex):</label>
                                    <input 
                                        type="text" 
                                        value={keyInput}
                                        onChange={(e) => setKeyInput(e.target.value)}
                                        placeholder="Enter key in hex"
                                        className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                                    />
                                </div>
                                <button onClick={xorDecode} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Decode</button>
                                {decodedResult && (
                                    <div className="mt-4 p-4 bg-black rounded font-mono">
                                        {decodedResult}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8">
                            <input 
                                type="text" 
                                id="answer"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg mb-4"
                                placeholder="Enter decrypted password"
                                autoComplete="off"
                            />
                            <button onClick={checkAnswer} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg mb-4">
                                Submit Answer
                            </button>
                            {message && <div className={`mt-4 p-4 rounded-lg ${getMessageClass()}`}>{message}</div>}
                        </div>

                        <div className="mt-8 pt-4 border-t border-gray-700">
                            <h4 className="text-lg font-semibold mb-4">Hints (Click to reveal):</h4>
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