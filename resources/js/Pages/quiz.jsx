'use client';

import '../../css/app.css';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Placeholder } from '@/components/ui/overlay-skeleton';
import axios from 'axios';

const CATEGORIES = [
  { id: 'crypto', label: 'Cryptography' },
  { id: 'web-ex', label: 'Web Exploitation' },
  { id: 'forensics', label: 'Forensics' },
  { id: 'network', label: 'Network & Protocols' },
  { id: 'mixed', label: 'Mixed Cyber' },
];

export default function Quiz() {
  const [category, setCategory] = useState('crypto');
  const [loading, setLoading] = useState(false);
  const [quizSessionId, setQuizSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [submittingResult, setSubmittingResult] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleStartQuiz = async () => {
    setLoading(true);
    setError(null);
    setFinished(false);
    setResult(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setQuizSessionId(null);

    try {
      const res = await axios.post('/quiz/generate', { category });
      const data = res.data;
      
      setQuizSessionId(data.quiz_session_id);
      setQuestions(data.questions || []);
      setCurrentIndex(0);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Unable to generate quiz. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFinished(false);
    setResult(null);
    setQuestions([]); 
    setCurrentIndex(0);
    setSelectedAnswers({});
    setQuizSessionId(null);
    setError(null);
  };

  const handleSelectChoice = (choiceIndex) => {
    if (finished) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: choiceIndex,
    }));
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFinishQuiz = async () => {
    if (!questions.length) return;

    let score = 0;
    questions.forEach((q, idx) => {
      const user = selectedAnswers[idx];
      if (typeof user === 'number' && user === parseInt(q.correct_index)) {
        score += 20; 
      }
    });

    setFinished(true);
    setSubmittingResult(true);

    try {
      if (quizSessionId) {
        const res = await axios.post(`/quiz/${quizSessionId}/finish`, {
            answers: selectedAnswers,
        });

        const data = res.data;
        
        setResult({
            score: data.score,
            total: questions.length * 20, 
            totalUserScore: data.total_user_score 
        });
      } else {
        setResult({ score, total: questions.length * 20 });
      }
    } catch (err) {
      console.error(err);
      setResult({ score, total: questions.length * 20 });
    } finally {
      setSubmittingResult(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        key="quiz-page"
        initial={{ opacity: 0, scale: 0.5, translateX: 1600 }}
        animate={{ opacity: 1, scale: 1, translateX: 0 }}
        transition={{ duration: 1, ease: 'easeInOut', type: 'tween' }}
        className="fixed inset-0 flex flex-col h-dvh"
      >
         <p
          onClick={() => window.history.back()}
          className="absolute top-3 left-18 text-white text-3xl font-bold cursor-pointer hover:opacity-80 mt-15 z-50 ml-10"
        >
          ‹ back
        </p>

        <div className="relative z-10 flex flex-col items-center justify-start h-full px-8 pt-24 pb-10 h text-white">
          <div className="w-full max-w-5xl bg-black/40 border border-white/30 rounded-3xl p-6 md:p-8 backdrop-blur-md">
            
            {!questions.length && (
                <>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold pixel-font text-green-400">
                            Sequiz Trivia
                            </h1>
                            <p className="text-sm md:text-base text-gray-200 mt-1">
                            Pick a cyber category, let the AI generate 5 questions, and
                            see how hard it claps you.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center py-8 gap-6">
                        <div className="flex flex-wrap gap-3 justify-center">
                            {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm md:text-base border transition-all ${
                                category === cat.id
                                    ? 'bg-green-500 text-black border-green-300 shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-105'
                                    : 'bg-black/40 border-white/40 hover:bg-green-400/20 hover:border-green-400'
                                }`}
                                disabled={loading}
                            >
                                {cat.label}
                            </button>
                            ))}
                        </div>

                        {error && (
                            <div className="text-red-300 text-sm p-2 bg-red-900/30 rounded border border-red-500/50">{error}</div>
                        )}

                        <button
                            onClick={handleStartQuiz}
                            disabled={loading}
                            className="px-8 py-4 rounded-full bg-green-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(34,197,94,0.6)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Initializing Hack...' : 'START MISSION'}
                        </button>
                    </div>
                </>
            )}

            {questions.length > 0 && currentQuestion && !result && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4 text-xs md:text-sm text-gray-300">
                  <span>
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span>
                    Category:{' '}
                    <span className="text-green-300">
                      {CATEGORIES.find((c) => c.id === category)?.label}
                    </span>
                  </span>
                </div>

                <div className="w-full h-2 bg.white/15 rounded-full mb-5 overflow-hidden">
                  <div
                    className="h-2 bg-green-400 transition-all"
                    style={{
                      width: `${((currentIndex + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="bg-black/50 border border-white/20 rounded-2xl p-4 md:p-6">
                  <p className="text-base md:text-lg font-semibold mb-4 leading-relaxed">
                    {currentQuestion.question}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {Array.isArray(currentQuestion.choices) &&
                      currentQuestion.choices.map((choice, idx) => {
                        const isSelected = selectedAnswers[currentIndex] === idx;
                        const bg = isSelected ? 'bg-green-400/80 text-black' : 'bg-white/5 hover:bg-white/10';

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectChoice(idx)}
                            className={`text-left px-4 py-3 rounded-xl border border-white/20 text-sm md:text-base transition-all ${bg}`}
                          >
                            <span className="font-semibold mr-2">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            {choice}
                          </button>
                        );
                      })}
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <button
                      onClick={goPrev}
                      disabled={currentIndex === 0}
                      className="px-4 py-2 rounded-full text-xs md:text-sm border border-white/30 bg-black/40 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10"
                    >
                      ◀ Prev
                    </button>

                    <button
                        onClick={goNext}
                        disabled={selectedAnswers[currentIndex] === undefined}
                        className="px-6 py-2 rounded-full text-xs md:text-sm bg-green-500 text-black font-semibold shadow-[0_0_12px_rgba(34,197,94,0.7)] hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {currentIndex === questions.length - 1
                          ? 'Finish'
                          : 'Next ▶'}
                      </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {finished && result && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-4xl bg-[#0a0a0a] border-2 border-green-500 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.2)] overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 border-b border-green-500/30 bg-green-900/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-green-400 pixel-font">MISSION REPORT</h2>
                            <p className="text-gray-400 text-sm">Operation: {CATEGORIES.find((c) => c.id === category)?.label}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-300 text-xs uppercase tracking-widest">Score Acquired</p>
                            <p className="text-4xl font-bold text-white">
                                {result.score} <span className="text-green-500 text-xl">/ 100</span>
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-300 text-xs uppercase tracking-widest">Total Career XP</p>
                            <p className="text-2xl font-bold text-yellow-400 shadow-yellow-500/50 drop-shadow-md">
                                {result.totalUserScore ?? '...'}
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-900">
                        {questions.map((q, idx) => {
                            const userAnswer = selectedAnswers[idx];
                            const isCorrect = userAnswer === q.correct_index;
                            
                            return (
                                <div key={idx} className={`p-4 rounded-xl border ${isCorrect ? 'border-green-500/30 bg-green-900/10' : 'border-red-500/30 bg-red-900/10'}`}>
                                    <div className="flex items-start gap-3">
                                        <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${isCorrect ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1">
                                            <p className="font-semibold text-white mb-2">{q.question}</p>
                                            
                                            <div className="space-y-1 mb-3">
                                                {q.choices.map((choice, cIdx) => {
                                                    let choiceClass = "text-sm text-white px-3 py-1 rounded border border-gray-400 bg-neutral-900/40 opacity-60";
                                                    
                                                    if (cIdx === q.correct_index) {
                                                        choiceClass = "text-sm px-3 py-1 rounded bg-green-500/20 border-green-500 text-green-300 font-bold opacity-100"; 
                                                    } else if (cIdx === userAnswer && !isCorrect) {
                                                        choiceClass = "text-sm px-3 py-1 rounded bg-red-500/20 border-red-500 text-red-300 font-bold opacity-100";
                                                    }

                                                    return (
                                                        <div key={cIdx} className={choiceClass}>
                                                            {String.fromCharCode(65 + cIdx)}. {choice} 
                                                            {cIdx === q.correct_index && " ✅"}
                                                            {cIdx === userAnswer && !isCorrect && " ❌"}
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className="mt-2 bg-black/40 p-3 rounded-lg border-l-4 border-blue-500">
                                                <p className="text-xs text-blue-300 font-bold uppercase mb-1">Intel / Explanation:</p>
                                                <p className="text-sm text-gray-300">{q.explanation}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="p-6 border-t border-gray-800 bg-black flex justify-center gap-4">
                        <button 
                            onClick={handleReset} 
                            disabled={loading || submittingResult}
                            className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-transform hover:scale-105"
                        >
                            New Mission
                        </button>
                        
                        <a href="/" className="px-6 py-3 border border-gray-600 hover:border-white text-gray-300 hover:text-white rounded-full transition-colors">
                            Return to HQ
                        </a>
                    </div>
                </motion.div>
            </div>
        )}

      </motion.div>
    </AnimatePresence>
  );
}