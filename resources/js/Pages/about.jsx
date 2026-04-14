import { AnimatePresence, motion } from "framer-motion"
import { router, usePage } from '@inertiajs/react';
import { useLayout } from "../Layouts/LayoutContext";
import { useState, useEffect } from 'react';
import Home from "./home"
import HomeSkeleton from "@/components/ui/home-component";
export default function About({}){
    const {url} = usePage()
    const [switchPage, setSwitch] = useState(false)
    const {setSharedValue, isHomeActive, currIdx, routes, next} = useLayout()
    useEffect(()=>{
      if(routes[currIdx] === url)
      {
        setSwitch(true)
      }
    },[currIdx])
    return(
        <>
        <AnimatePresence>
            {
                !switchPage&&(routes[next]!=url)?(
                    <motion.div 
                    animate={{translateX:0, translateY:0, scale:1}}
                    exit={{translateX:1500, translateY:100 ,scale:0.5}}
                    transition={{duration:0.8, ease:'easeInOut'}}
                    key='about'
                    className="fixed inset-0 flex flex-col h-dvh "
                    >
                        <div className="w-full h-[10%] shadow-2xl"/>
                        <div className="flex flex-col items-center justify-center w-full h-[100%] gap-2">
                            <motion.div 
                            className="flex flex-col justify-center w-full h-[10%] p-4 pl-[10%] text-6xl text-white bg-gradient-to-r via-transparent from-green-700/70 to-transparent [-webkit-text-stroke:0.4px_black] [text-shadow:_4px_4px_0_#000]">
                                <motion.h1
                                animate={{opacity:[0,1]}}
                                transition={{duration:0.4, ease:'easeInOut'}}>
                                    About Sequiz
                                </motion.h1>
                            </motion.div>
                            <motion.div 
                            className="w-[80%] h-[70%] p-4 text-white text-2xl bg-green-800/70 rounded-2xl [-webkit-text-stroke:0.3px_green] outline-3 font-extralight shadow-2xl">
                                <motion.p animate={{opacity:[0,1]}}
                                transition={{duration:0.4, ease:'easeInOut'}} className="text-wrap">
                                    Sequiz is an A.I-powered cyber security quiz platform to enhance your knowledge based that fully compromise with your personalization!
                                </motion.p>
                            </motion.div>
                        </div>
                    </motion.div>

                ):(
            <motion.div 
            key='home'
            initial={{opacity:0, scale:0.5, translateX:-1600}}
            animate={{opacity:1, scale:1, translateX:0}}
            transition={{duration:1, ease:'easeInOut', type:'tween'}}
            className="fixed inset-0 flex flex-col h-dvh ">
                <HomeSkeleton buttonDelay={5}/>
            </motion.div>
                )
            }        
        </AnimatePresence>
        </>
    )
}