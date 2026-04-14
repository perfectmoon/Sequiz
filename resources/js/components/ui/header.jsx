'use client'

import { Link, usePage, router, useForm } from '@inertiajs/react'
import { useState, useRef, useEffect } from 'react'
import { Profil, Close_Button } from "./attributes" 
import { truncate } from '@/lib/utils'
import axios from 'axios'

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
)

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
)

const TrophyIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.143 2.515A2.75 2.75 0 0 0 2.5 5.25v.297c0 .77.197 1.496.544 2.136a4.75 4.75 0 0 0 2.56 2.23 6.5 6.5 0 0 0 9.792 0 4.75 4.75 0 0 0 2.56-2.23 4.747 4.747 0 0 0 .544-2.136v-.297a2.75 2.75 0 0 0-2.643-2.735 45.75 45.75 0 0 0-10.714 0ZM12 14.75a8.001 8.001 0 0 1-6.192-3.036 6.25 6.25 0 0 0 .97 1.63 7.994 7.994 0 0 0 4.222 2.353V19.5h-2a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-2v-3.797a7.993 7.993 0 0 0 4.222-2.352 6.25 6.25 0 0 0 .97-1.631A8.001 8.001 0 0 1 12 14.75Z" clipRule="evenodd" />
    </svg>
)

export default function Header({ role }) {
    const { url, props } = usePage()
    
    const [showProfile, setShowProfile] = useState(false)
    const [showLogoutPopup, setShowLogoutPopup] = useState(false)
    const [isEditing, setIsEditing] = useState(false) 
    const fileInputRef = useRef(null) 

    const [showLeaderboard, setShowLeaderboard] = useState(false)
    const [leaderboardData, setLeaderboardData] = useState([])
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(false)

    const auth = props?.auth ?? {};
    const user = auth?.user ?? null;
    const username = user?.name ?? 'Guest';
    const score = user?.score ?? 0;
    const avatarUrl = user?.avatar;

    const { data, setData, post, processing, errors } = useForm({
        name: user?.name || '',
        avatar: null,
        _method: 'POST',
    })

    const [previewImage, setPreviewImage] = useState(null)

    const hiddenPages = ['/login', '/register', '/forgot-password']
    if (hiddenPages.includes(url)) return null;

    const links = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
    ]


    const handleProfileClick = () => {
        if (!user) {
            router.visit('/login')
        } else {
            setShowProfile(true)
            setIsEditing(false) 
            setData('name', user.name) 
            setPreviewImage(null)
        }
    }

    const handleLogout = () => {
        router.post('/logout');
        setShowLogoutPopup(false);
        setShowProfile(false);
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    }

    const saveProfile = (e) => {
        e.preventDefault();
        post('/profile/update', {
            onSuccess: () => {
                setIsEditing(false); 
            },
            preserveScroll: true,
        });
    }
    const fetchLeaderboard = async () => {
        setLoadingLeaderboard(true);
        try {
            const res = await axios.get('/leaderboard'); 
            setLeaderboardData(res.data);
        } catch (error) {
            console.error("Failed to load leaderboard:", error);
        } finally {
            setLoadingLeaderboard(false);
        }
    }

    useEffect(() => {
        if (showLeaderboard) {
            fetchLeaderboard();
        }
    }, [showLeaderboard]);

    return (
        <>
            <div className="w-screen h-[10%] shadow-2xl fixed top-0 z-40">
                <div className="w-full h-full bg-[#035e17] border-b border-[#42f566]/30">
                    <div className="flex ml-auto w-full md:w-[40%] lg:w-[30%] justify-center items-center h-full pr-8">
                        <div className="flex justify-evenly items-center text-xl md:text-2xl h-full w-[70%] text-white font-medium">
                            {links.map((item, i) => {
                                const active = url === item.href;
                                return (
                                    <div
                                        key={i}
                                        className={`cursor-pointer hover:text-[#42f566] transition duration-200 ease-in-out relative group
                                        ${active ? 'text-[#1eff44]' : 'text-white'}`}>
                                        <Link href={item.href}>{item.name}</Link>
                                        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#42f566] transition-all duration-300 group-hover:w-full ${active ? 'w-full' : ''}`}></span>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex justify-center items-center h-full w-[30%] gap-4">
                            
                            <div 
                                className="cursor-pointer text-yellow-400 hover:text-yellow-200 transition-colors p-2 rounded-full hover:bg-white/10 group relative"
                                onClick={() => setShowLeaderboard(true)}
                                title="Leaderboard"
                            >
                                <TrophyIcon className="w-8 h-8 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] group-hover:scale-110 transition-transform" />
                            </div>

                            <div className="flex justify-center items-center cursor-pointer group" onClick={handleProfileClick}>
                                <div className="p-1 rounded-full border-2 border-transparent group-hover:border-[#42f566] transition-all duration-300">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-lg object-cover" />
                                    ) : (
                                        <Profil className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-lg" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showLeaderboard && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/70 flex justify-center items-center z-50 transition-opacity duration-300"
                     onClick={() => setShowLeaderboard(false)}>
                    
                    <div
                        className="bg-[#0a0a0a] border-2 border-green-500 rounded-3xl w-[90%] md:w-[500px] h-[600px] shadow-[0_0_50px_rgba(34,197,94,0.3)] text-white overflow-hidden flex flex-col relative"
                        onClick={(e) => e.stopPropagation()}>

                        <div className="p-6 border-b border-green-500/30 bg-green-900/20 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <TrophyIcon className="w-8 h-8 text-yellow-400" />
                                <h2 className="text-2xl font-bold text-green-400 tracking-wider pixel-font">TOP AGENTS</h2>
                            </div>
                            <div onClick={() => setShowLeaderboard(false)} className="cursor-pointer text-gray-400 hover:text-white">
                                <Close_Button className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-900">
                            {loadingLeaderboard ? (
                                <div className="flex flex-col justify-center items-center h-full text-green-500 gap-2">
                                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="animate-pulse tracking-widest text-sm">RETRIEVING DATA...</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {leaderboardData.map((agent, idx) => {
                                        let rankColor = "text-white";
                                        let bgClass = "bg-white/5 border-white/10";
                                        let rankIcon = `#${idx + 1}`;

                                        if (idx === 0) {
                                            rankColor = "text-yellow-400";
                                            bgClass = "bg-yellow-500/10 border-yellow-500/50";
                                            rankIcon = "🥇";
                                        } else if (idx === 1) {
                                            rankColor = "text-gray-300";
                                            bgClass = "bg-gray-500/10 border-gray-400/50";
                                            rankIcon = "🥈";
                                        } else if (idx === 2) {
                                            rankColor = "text-orange-400";
                                            bgClass = "bg-orange-500/10 border-orange-500/50";
                                            rankIcon = "🥉";
                                        }

                                        const isMe = user && agent.name === user.name;
                                        if (isMe) bgClass += " border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]";

                                        return (
                                            <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border ${bgClass} transition-all hover:scale-[1.02] hover:bg-opacity-80`}>
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-xl font-bold w-8 text-center ${rankColor} drop-shadow-md`}>{rankIcon}</span>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-gray-800">
                                                            {agent.avatar ? (
                                                                <img src={agent.avatar} className="w-full h-full object-cover" alt={agent.name}/>
                                                            ) : (
                                                                <Profil className="w-full h-full p-1 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className={`font-bold text-sm md:text-base ${isMe ? 'text-green-400' : 'text-white'}`}>
                                                                {truncate(agent.name, 15)} {isMe && <span className="text-[10px] bg-green-900 text-green-300 px-1 rounded ml-1">YOU</span>}
                                                            </p>
                                                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Cyber Agent</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-green-400 font-mono tracking-wide">
                                                        {agent.score.toLocaleString()}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold">XP</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                        
                        <div className="p-3 bg-black border-t border-green-900/30 text-center">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Global Rankings • Live Update</p>
                        </div>
                    </div>
                </div>
            )}

            {showProfile && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/60 flex justify-center items-center z-50 transition-opacity duration-300"
                     onClick={() => setShowProfile(false)}>
                    
                    <div
                        className="flex flex-row bg-[#1a1a1a] border-2 border-[#42f566] rounded-3xl w-[90%] md:w-[600px] h-[350px] shadow-[0_0_40px_rgba(66,245,102,0.3)] text-white overflow-hidden relative"
                        onClick={(e) => e.stopPropagation()}>

                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#42f566]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="flex flex-col w-[35%] bg-[#0f0f0f] border-r border-white/10 items-center justify-center relative">
                            
                            <div className="relative w-28 h-28 md:w-32 md:h-32 group">
                                <div className="w-full h-full rounded-full border-4 border-[#42f566] p-1 shadow-[0_0_20px_rgba(66,245,102,0.4)] overflow-hidden bg-gray-800">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-full" />
                                    ) : avatarUrl ? (
                                        <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <Profil className="w-full h-full rounded-full" />
                                    )}
                                </div>

                                {isEditing && (
                                    <div 
                                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <CameraIcon />
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                                <span className="text-[#42f566] font-bold text-lg tracking-widest opacity-80">
                                    {isEditing ? 'EDIT' : 'AGENT'}
                                </span>
                                {!isEditing && (
                                    <button onClick={() => setIsEditing(true)} className="text-[#42f566] hover:text-white transition-colors">
                                        <EditIcon />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col w-[65%] h-full">
                            
                            <div className="flex justify-end items-center h-[15%] px-6 pt-4 gap-4">
                                {isEditing && (
                                    <>
                                        <button onClick={() => { setIsEditing(false); setData('name', user.name); setPreviewImage(null); }} className="text-xs text-gray-400 hover:text-white mr-2">Cancel</button>
                                        <button 
                                            onClick={saveProfile} 
                                            disabled={processing}
                                            className="text-xs md:text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-500 transition-all shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                        >
                                            {processing ? 'SAVING...' : 'SAVE'}
                                        </button>
                                    </>
                                )}
                                
                                {user && !isEditing && (
                                    <button 
                                        onClick={() => setShowLogoutPopup(true)} 
                                        className="text-xs md:text-sm bg-red-900/30 text-red-400 border border-red-500/50 px-3 py-1 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
                                    >
                                        LOGOUT
                                    </button>
                                )}

                                <div onClick={() => setShowProfile(false)} className="cursor-pointer text-gray-400 hover:text-white transition-colors ml-2">
                                    <Close_Button className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="flex flex-col justify-center h-[65%] px-8 space-y-5">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Codename</p>
                                    {isEditing ? (
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full bg-black/50 border border-green-500 text-white px-3 py-2 rounded-lg focus:outline-none focus:shadow-[0_0_10px_#42f566] transition-all font-mono"
                                                maxLength={20}
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>
                                    ) : (
                                        <div className="text-2xl md:text-3xl font-bold text-white truncate font-mono" title={user?.name}>
                                            {truncate(user?.name, 20)}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Career Score</p>
                                    <div className="inline-flex items-center space-x-3 bg-[#42f566]/10 border border-[#42f566]/50 px-4 py-2 rounded-xl">
                                        <span className="text-2xl">🏆</span>
                                        <span className="text-[#42f566] text-2xl font-bold font-mono tracking-widest shadow-green-500">
                                            {score.toLocaleString()} XP
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[20%] bg-[#42f566] flex items-center justify-center">
                                <p className="text-black font-extrabold text-xl tracking-[0.2em]">
                                    SEQUIZ INTELLIGENCE
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showLogoutPopup && (
                <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex justify-center items-center z-[60]"
                     onClick={() => setShowLogoutPopup(false)}>
                    <div
                        className="bg-[#1a1a1a] border-2 border-red-500 rounded-2xl p-8 w-[80%] md:w-[400px] text-center shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                        onClick={(e) => e.stopPropagation()}>
                        
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                                !
                            </div>
                            <h3 className="text-xl text-white font-bold mb-2">Confirm Logout</h3>
                            <p className="text-gray-400 text-sm">
                                Are you sure you want to end your session, Agent 
                                <span className="text-white font-bold"> {username}</span>?
                            </p>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowLogoutPopup(false)}
                                className="px-6 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors w-full"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-900/50 transition-all w-full"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}