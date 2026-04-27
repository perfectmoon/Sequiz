'use client'

import { useState, useEffect } from 'react'
import Obsheader from '@/components/ui/Obsheader'
import MatrixBackground from '@/components/ui/matrix-background'

export default function Level3({ level, hints, usedHints, csrfToken }) {
    const [answer, setAnswer] = useState('')
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const [hintDisplay, setHintDisplay] = useState(null)
    const [disabledHints, setDisabledHints] = useState(usedHints || [])
    const [currentPoints, setCurrentPoints] = useState(0)
    const [consoleCommand, setConsoleCommand] = useState('')
    const [commandOutput, setCommandOutput] = useState('> System ready. Type \'help\' to begin.')

    useEffect(() => {
        const pointsElement = document.getElementById('pointsDisplay')
        if (pointsElement) setCurrentPoints(parseInt(pointsElement.textContent) || 0)
        
        console.log('%c💻 OBSCURUM - LEVEL 3', 'font-size: 20px; color: #4ade80;')
        console.log('Use the terminal to decode base64 strings')
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

    const processCommand = (command) => {
        const cmd = command.trim().toLowerCase()
        
        if (cmd === 'help') {
            setCommandOutput(prev => prev + `\n> help\n📋 Available commands:\n  scan - Scan page for hidden data\n  decode <base64> - Decode base64 string\n  solve <password> - Submit password\n  clear - Clear terminal`)
            return
        }
        
        if (cmd === 'clear') {
            setCommandOutput('> System ready. Type \'help\' to begin.')
            return
        }
        
        if (cmd === 'scan') {
            const encoded = "bmV0d29ya19uaW5qYQ=="
            setCommandOutput(prev => prev + `\n> scan\n🔍 Scanning page...\nFound encoded string: ${encoded}`)
            return
        }
        
        if (cmd.startsWith('decode')) {
            const parts = command.trim().split(' ')
            if (parts.length < 2) {
                setCommandOutput(prev => prev + `\n> decode\n❌ Usage: decode <base64_string>`)
                return
            }
            try {
                const decoded = atob(parts[1])
                setCommandOutput(prev => prev + `\n> decode ${parts[1]}\n✅ Decoded: ${decoded}`)
            } catch(e) {
                setCommandOutput(prev => prev + `\n> decode ${parts[1]}\n❌ Invalid base64 string`)
            }
            return
        }
        
        if (cmd.startsWith('solve')) {
            const parts = command.trim().split(' ')
            if (parts.length < 2) {
                setCommandOutput(prev => prev + `\n> solve\n❌ Usage: solve <password>`)
                return
            }
            const password = parts.slice(1).join(' ')
            const correct = atob("bmV0d29ya19uaW5qYQ==")
            if (password === correct) {
                setAnswer(password)
                setCommandOutput(prev => prev + `\n> solve ${password}\n🎉 ACCESS GRANTED!\nPassword accepted! Submit it below.`)
            } else {
                setCommandOutput(prev => prev + `\n> solve ${password}\n❌ ACCESS DENIED!\nTry scanning the page first: scan`)
            }
            return
        }
        
        setCommandOutput(prev => prev + `\n> ${command}\n❌ Unknown command. Type 'help' for available commands.`)
    }

    const handleConsoleSubmit = (e) => {
        e.preventDefault()
        if (consoleCommand.trim()) {
            processCommand(consoleCommand)
            setConsoleCommand('')
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
                            <h1 className="text-4xl font-bold mb-2">💻 Level 3: Console Chronicles</h1>
                            <div className="flex justify-center space-x-4 text-sm">
                                <span className="bg-blue-500 px-3 py-1 rounded-full">{level.difficulty || 'Medium'}</span>
                                <span className="bg-gray-700 px-3 py-1 rounded-full">{level.time_estimate || '10 mins'}</span>
                                <span className="bg-yellow-600 px-3 py-1 rounded-full">{level.points_awarded} pts</span>
                            </div>
                        </div>

                        <div className="mb-4 p-3 bg-gray-700 rounded-lg text-center">
                            <p className="text-sm">
                                <i className="fas fa-star text-yellow-400"></i> Base points: {level.points_awarded} | 
                                <i className="fas fa-lightbulb text-yellow-400"></i> Hint costs: Hint 1 = 5, Hint 2 = 10, Hint 3 = 15
                            </p>
                        </div>

                        <div className="bg-black rounded-lg p-6 mb-8 font-mono border-2 border-green-500">
                            <div className="text-green-500 mb-4">
                                <p>&gt; OBSCURUM TERMINAL v3.0</p>
                                <p>&gt; SECURITY PROTOCOL: ACTIVE</p>
                                <p>&gt; PASSWORD REQUIRED FOR ACCESS</p>
                                <p>&gt; _________________________</p>
                            </div>
                            <div className="text-green-500">
                                <p>&gt; All commands must be entered in the terminal below.</p>
                                <p>&gt; Type 'help' to see available commands.</p>
                                <p>&gt;_ <span className="animate-pulse">█</span></p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block mb-2 text-green-400">Terminal Input:</label>
                            <form onSubmit={handleConsoleSubmit} className="flex">
                                <span className="bg-black text-green-500 px-3 py-3 rounded-l border border-green-500 border-r-0 font-mono">&gt;</span>
                                <input 
                                    type="text" 
                                    value={consoleCommand}
                                    onChange={(e) => setConsoleCommand(e.target.value)}
                                    className="flex-1 bg-black text-green-500 border border-green-500 p-3 rounded-r font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter command here..."
                                />
                            </form>
                            <div className="mt-4 text-green-500 font-mono text-sm bg-black p-3 rounded max-h-60 overflow-y-auto whitespace-pre-wrap">
                                {commandOutput}
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
                                placeholder="Enter password from terminal"
                                autoComplete="off"
                            />
                            <button onClick={checkAnswer} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mb-4">
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