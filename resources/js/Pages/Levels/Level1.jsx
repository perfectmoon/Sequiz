'use client'

import React, { useState, useEffect } from 'react';
import Obsheader from '@/components/ui/Obsheader';
import MatrixBackground from '../../components/ui/matrix-background';

export default function Level1({ level, hints, usedHints, csrfToken }) {
    const [answer, setAnswer] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [hintDisplay, setHintDisplay] = useState(null);
    const [disabledHints, setDisabledHints] = useState(usedHints || []);
    const [currentPoints, setCurrentPoints] = useState(0);

    useEffect(() => {
        // Get current points from the navbar display
        const pointsElement = document.getElementById('pointsDisplay');
        if (pointsElement) {
            setCurrentPoints(parseInt(pointsElement.textContent) || 0);
        }
        
        // Focus on answer input
        const input = document.getElementById('answer');
        if (input) input.focus();
        
        // Console hints for CTF
        console.log(`%c🔍 ${level.title || `LEVEL ${level.level_number}`}`, 'font-size: 20px; color: #fbbf24; font-weight: bold;');
        if (level.level_number === 1) {
            console.log('%c💡 Hint: Check the HTML source code for comments!', 'color: #4ade80');
        }
    }, []);

    const updatePointsDisplay = (newPoints) => {
        setCurrentPoints(newPoints);
        const pointsElement = document.getElementById('pointsDisplay');
        if (pointsElement) {
            pointsElement.textContent = newPoints;
            pointsElement.classList.add('points-animation');
            setTimeout(() => {
                pointsElement.classList.remove('points-animation');
            }, 500);
        }
    };

    const getHint = async (hintNumber, cost) => {
        // Check if hint already used
        if (disabledHints.includes(hintNumber)) {
            return;
        }
        
        try {
            const response = await fetch(`/level/${level.level_number}/hint`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({ hint_number: hintNumber })
            });
            const data = await response.json();
            
            if (data.success) {
                setHintDisplay({
                    number: data.hint_number,
                    hint: data.hint,
                    cost: data.cost
                });
                
                setDisabledHints([...disabledHints, hintNumber]);
                
                if (data.total_points !== undefined) {
                    updatePointsDisplay(data.total_points);
                }
            } else {
                alert(data.error || 'Hint not available');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error getting hint');
        }
    };

    const checkAnswer = async () => {
        if (!answer.trim()) {
            alert('Please enter an answer');
            return;
        }
        
        setMessage('Checking answer...');
        setMessageType('info');
        
        try {
            const response = await fetch(`/level/${level.level_number}/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({ answer: answer })
            });
            const data = await response.json();
            
            if (data.success) {
                setMessageType('success');
                setMessage(data.message);
                updatePointsDisplay(data.total_points);
                
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 2000);
            } else {
                setMessageType('error');
                setMessage(data.message);
                setAnswer('');
                document.getElementById('answer').focus();
            }
        } catch (error) {
            console.error('Error:', error);
            setMessageType('error');
            setMessage('Error checking answer. Please try again.');
        }
    };

    const getMessageClass = () => {
        switch(messageType) {
            case 'success': return 'bg-green-600 text-white';
            case 'error': return 'bg-red-600 text-white';
            default: return 'bg-gray-700 text-white';
        }
    };

    return (
        <>
            <Obsheader role="player" />
            <MatrixBackground />
            
            <div className="min-h-screen text-white relative pt-16" style={{ backgroundColor: 'transparent' }}>
                <div className="container mx-auto px-4 py-8 relative z-10">
                    <div className="max-w-3xl mx-auto bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-2xl p-8">
                        {/* Level Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold mb-2">{level.title || `Level ${level.level_number}: ${level.name || 'The Hidden Message'}`}</h1>
                            <div className="flex justify-center space-x-4 text-sm">
                                <span className="bg-green-500 px-3 py-1 rounded-full">{level.difficulty || 'Easy'}</span>
                                <span className="bg-gray-700 px-3 py-1 rounded-full">{level.time_estimate || '5 mins'}</span>
                                <span className="bg-yellow-600 px-3 py-1 rounded-full">{level.points_awarded} pts</span>
                            </div>
                        </div>
                        
                        {/* Points Info */}
                        <div className="mb-4 p-3 bg-gray-700/90 rounded-lg text-center">
                            <p className="text-sm">
                                <i className="fas fa-star text-yellow-400"></i> 
                                Base points: {level.points_awarded} | 
                                <i className="fas fa-lightbulb text-yellow-400"></i> 
                                {level.level_number === 1 
                                    ? 'Hints are FREE for Level 1!' 
                                    : 'Hint costs are progressive: Hint 1 = 5, Hint 2 = 10, Hint 3 = 15, etc.'}
                            </p>
                        </div>
                        
                        {/* Puzzle Description */}
                        <div className="mb-8 p-4 bg-gray-700/90 rounded-lg">
                            <p>{level.description}</p>
                            {level.level_number === 1 && (
                                <p className="text-sm text-gray-400 mt-2">Hint: Look for comments in the HTML source (Ctrl+U)</p>
                            )}
                        </div>
                        
                        {/* Answer Input */}
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
                            <button 
                                onClick={checkAnswer}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mb-4"
                            >
                                Submit Answer
                            </button>
                            {message && (
                                <div className={`mt-4 p-4 rounded-lg ${getMessageClass()}`}>
                                    {message}
                                </div>
                            )}
                        </div>
                        
                        {/* Hints Section */}
                        <div className="mt-8 pt-4 border-t border-gray-700">
                            <h4 className="text-lg font-semibold mb-4">💡 Hints (Click to reveal):</h4>
                            
                            <div className="grid grid-cols-1 gap-3 mb-4">
                                {hints.map((hint, index) => {
                                    const hintNumber = hint.order || (index + 1);
                                    const isUsed = disabledHints.includes(hintNumber);
                                    const cost = level.level_number === 1 ? 0 : hintNumber * 5;
                                    
                                    return (
                                        <button 
                                            key={hint.id}
                                            onClick={() => getHint(hintNumber, cost)}
                                            disabled={isUsed}
                                            className={`text-left bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg transition ${isUsed ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span><i className="fas fa-lightbulb"></i> Hint {hintNumber}</span>
                                                <span className="text-yellow-400 text-sm">
                                                    {cost === 0 ? 'FREE' : `-${cost} points`}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {hintDisplay && (
                                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                                    <p className="text-yellow-400 font-semibold mb-2">💡 Hint {hintDisplay.number}:</p>
                                    <p className="text-white">{hintDisplay.hint}</p>
                                    {hintDisplay.cost > 0 && (
                                        <p className="text-sm text-gray-400 mt-2">Cost: {hintDisplay.cost} points</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}