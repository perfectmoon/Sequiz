'use client'

import { useState, useEffect } from 'react'
import Obsheader from '@/components/ui/Obsheader'
import MatrixBackground from '@/components/ui/matrix-background'

export default function Level7({ level, hints, usedHints, csrfToken }) {
    const [answer, setAnswer] = useState('')
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const [hintDisplay, setHintDisplay] = useState(null)
    const [disabledHints, setDisabledHints] = useState(usedHints || [])
    const [currentPoints, setCurrentPoints] = useState(0)
    const [consoleInput, setConsoleInput] = useState('')
    const [consoleOutput, setConsoleOutput] = useState('> OBSCURUM CONSOLE v7.0\n> System ready.')

    useEffect(() => {
        const pointsElement = document.getElementById('pointsDisplay')
        if (pointsElement) setCurrentPoints(parseInt(pointsElement.textContent) || 0)
        
        // Expose helper functions to window
        if (typeof window !== 'undefined') {
            window.binaryToAscii = function(binary) {
                return binary.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('')
            }
            window.hexToAscii = function(hex) {
                let str = ''
                for (let i = 0; i < hex.length; i += 2) {
                    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
                }
                return str
            }
            window.finalHint = function() {
                setConsoleOutput(prev => prev + '\n> finalHint()\n💡 Hint: Combine all previous passwords in reverse order!')
            }
        }
        
        console.log('%c🏆 OBSCURUM - LEVEL 7', 'font-size: 20px; color: #fbbf24;')
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

    const processConsoleCommand = (cmd) => {
        if (cmd.trim() === 'finalHint()') {
            setConsoleOutput(prev => prev + `\n> ${cmd}\n💡 Hint: Combine all previous passwords in reverse order with dashes!\nFormat: level6-password-level5-password-...-level1-password`)
            return
        }
        setConsoleOutput(prev => prev + `\n> ${cmd}\n❌ Unknown command. Type 'finalHint();' for help.`)
    }

    const handleConsoleSubmit = (e) => {
        e.preventDefault()
        if (consoleInput.trim()) {
            processConsoleCommand(consoleInput)
            setConsoleInput('')
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
                    <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8 border-2 border-yellow-500">
                        <style>{`
                            .binary-bg {
                                opacity: 0.1;
                                font-family: monospace;
                                font-size: 10px;
                                position: fixed;
                                bottom: 0;
                                right: 0;
                                pointer-events: none;
                                color: #0f0;
                                white-space: pre;
                                z-index: 0;
                            }
                            .gradient-clue {
                                width: 100%;
                                height: 50px;
                                background: linear-gradient(90deg, 
                                    #670000ff, #6c0000ff, #610000ff, #640000ff, #5f0000ff, #690000ff, #740000ff, #730000ff, #5f0000ff, #6f0000ff, #760000ff, #650000ff, #720000ff, #5f0000ff, #700000ff, #750000ff, #7a0000ff, #7a0000ff, #6c0000ff, #650000ff);
                            }
                        `}</style>

                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold mb-2 animate-pulse">Level 7: The Meta Puzzle</h1>
                            <div className="flex justify-center space-x-4 text-sm">
                                <span className="bg-red-600 px-3 py-1 rounded-full">{level.difficulty || 'Expert'}</span>
                                <span className="bg-gray-700 px-3 py-1 rounded-full">{level.time_estimate || '30 mins'}</span>
                                <span className="bg-yellow-600 px-3 py-1 rounded-full">{level.points_awarded} pts</span>
                            </div>
                        </div>

                        <div className="mb-4 p-3 bg-gray-700 rounded-lg text-center">
                            <p className="text-sm">
                                <i className="fas fa-star text-yellow-400"></i> Base points: {level.points_awarded} | 
                                <i className="fas fa-lightbulb text-yellow-400"></i> Hint costs: Hint 1 = 5, Hint 2 = 10
                            </p>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-yellow-400">THE FINAL CHALLENGE</h2>
                            <p className="mt-4">Congratulations, Agent. You've reached the final level.</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="p-4 bg-gray-900 rounded-lg">
                                <h4 className="font-semibold text-green-400 mb-2">🔍 CLUE #1: The Binary Message</h4>
                                <p className="font-mono text-xs break-all">01110000 01100001 01110011 01110011 01110111 01101111 01110010 01100100 00100000 01101001 01110011 00100000 01101101 01100001 01100100 01100101 00100000 01101111 01100110 00100000 01110100 01101000 01100101 00100000 01110000 01100001 01110011 01110100</p>
                            </div>
                            <div className="p-4 bg-gray-900 rounded-lg">
                                <h4 className="font-semibold text-blue-400 mb-2">🔍 CLUE #2: The CSS Gradient</h4>
                                <div className="gradient-clue mb-4"></div>
                            </div>
                            <div className="p-4 bg-gray-900 rounded-lg">
                                <h4 className="font-semibold text-purple-400 mb-2">🔍 CLUE #3: The Journey Back</h4>
                                <p>All previous passwords are stored in your session</p>
                            </div>
                        </div>

                        <div className="mb-8 p-4 bg-black rounded-lg border border-green-500 font-mono text-sm">
                            <p className="text-green-400 mb-2">OBSCURUM CONSOLE v7.0</p>
                            <div className="bg-black text-green-400 p-3 rounded mb-4 h-32 overflow-y-auto whitespace-pre-wrap text-xs">
                                {consoleOutput}
                            </div>
                            <form onSubmit={handleConsoleSubmit} className="flex">
                                <span className="text-green-400 mr-2">&gt;</span>
                                <input 
                                    type="text" 
                                    value={consoleInput}
                                    onChange={(e) => setConsoleInput(e.target.value)}
                                    placeholder="Type 'finalHint();' for help"
                                    className="flex-1 bg-black text-green-400 border-0 outline-none"
                                />
                            </form>
                        </div>

                        <div className="mb-8 p-6 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg">
                            <h4 className="font-semibold text-xl mb-4">🎯 FINAL TASK:</h4>
                            <ol className="list-decimal list-inside space-y-2 text-sm">
                                <li>Decode the binary message (CLUE #1)</li>
                                <li>Decode the CSS gradient hex to ASCII (CLUE #2)</li>
                                <li>Retrieve all 6 previous level passwords from your session</li>
                                <li>Combine passwords in REVERSE order (Level 6 → Level 1) with dashes</li>
                                <li>Format: level6-password-level5-password-...-level1-password</li>
                                <li><em>Type 'finalHint();' in the console above for additional guidance</em></li>
                            </ol>
                        </div>

                        <div className="mt-8">
                            <input 
                                type="text" 
                                id="answer"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg mb-4 font-mono text-sm"
                                placeholder="Enter the final password"
                                autoComplete="off"
                            />
                            <button onClick={checkAnswer} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg mb-4">
                                Submit Final Answer
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