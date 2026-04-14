'use client'
import { Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { ProfileIcon } from './attributes'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import { router } from '@inertiajs/react'
import { useLayout } from "../../Layouts/LayoutContext";
export default function Direction({sidebar}){
    const {url} = usePage()
    const [leftHover,setHoverLeft] = useState(false)
    const [rightHover,setHoverRight] = useState(false)
    const {setSharedValue, setHomeActive, setNext, setIdx, routes} = useLayout()
    const idx = routes.indexOf(url)
    const navigate = (clicks)=>{
        const next = clicks==='left'?
        Math.max(0, idx - 1):
        Math.min(routes.length - 1, idx + 1);
        if (routes[next]===url) return;
        setSharedValue(true)
        setNext(next)
        setIdx(idx)
        setTimeout(()=>{
            router.visit(routes[next])
        setSharedValue(false)
        setNext(null)
        setIdx(null)
        },1000)
    }
    return(
        <div className="w-[10%] h-[10%] shadow-2xl [shadow:_1px_1px_4_#000] fixed top-[12%] right-[2%] z-25">
            <div 
            className="flex justify-between items-center p-2 w-full h-full bg-neutral-900/80 rounded-3xl outline-3 text-white">
                <motion.button 
                animate={url===routes[0]? {opacity:0.6}:(leftHover?{opacity:0.6}:{opacity:1})}
                onHoverStart={()=>setHoverLeft(true)}
                onHoverEnd={()=>setHoverLeft(false)}
                onClick={()=>navigate('left')}
                className={`${url===routes[0]?'cursor-not-allowed':'cursor-pointer'} flex items-center justify-center w-[60px] h-[60px] rounded-full bg-neutral-950 text-2xl outline-white outline-2`}>
                    {`<`}
                </motion.button>
                <motion.button
                animate={url===routes[1]? {opacity:0.6}:(rightHover?{opacity:0.6}:{opacity:1})}
                onHoverStart={()=>setHoverRight(true)}
                onHoverEnd={()=>setHoverRight(false)}
                onClick={()=>navigate('right')}
                className={`${url===routes[1]?'cursor-not-allowed':'cursor-pointer'} flex items-center justify-center w-[60px] h-[60px] rounded-full bg-neutral-950 text-2xl outline-white outline-2`}>
                    {`>`}
                </motion.button>
            </div>
        </div>
    )
}