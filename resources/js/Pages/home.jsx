'use client'
import '../../css/app.css'; 
import { useState, useEffect } from 'react';
import Header from '../components/ui/header';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react'
import { router } from '@inertiajs/react';
import { useLayout } from "../Layouts/LayoutContext";
import HomeSkeleton from '@/components/ui/home-component';
import { Placeholder } from '@/components/ui/overlay-skeleton';
import { Search, SignIn, LearnMore, PersonalComputer, Pencil, Book, Clock } from '../components/ui/attributes';
export default function Home() {
  const {setSharedValue, isHomeActive, currIdx, routes, next} = useLayout()
  const { url } = usePage()
    const [toDo,setToDo] = useState(false)
    const [clock,setClock] = useState(false)
    const [roles, setRole] = useState(false)
    const [switchPage, setSwitch] = useState(false)
    const role = roles?'user':'guest' 
    const size = {sizeAll:2, sizePencil:3};
    console.log(currIdx)
    useEffect(()=>{
      if(routes[currIdx] === url)
      {
        setSwitch(true)
      }
    },[next])
  return (
    <>
      <AnimatePresence>
    {
        !switchPage&&(routes[next]!==url)?(  
          <HomeSkeleton/>
        ):(
          <motion.div 
          key='placeholder'
        initial={{opacity:0, scale:0.5, translateX:1600}}
        animate={{opacity:1, scale:1, translateX:0}}
        transition={{duration:1, ease:'easeInOut', type:'tween'}}
        className="fixed inset-0 flex flex-col h-dvh ">
          <Placeholder/>
        </motion.div>
        )
      }
      </AnimatePresence>
    </>
  );
}
