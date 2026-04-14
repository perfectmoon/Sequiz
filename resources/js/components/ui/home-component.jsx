'use client'
import { useState, useEffect } from 'react';
import { AnimatePresence, delay, motion } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react'
import { router } from '@inertiajs/react';
import { useLayout } from "@/Layouts/LayoutContext";
import { Search, SignIn, LearnMore, PersonalComputer, Pencil, Book, Clock } from '@/components/ui/attributes';
import { truncate } from '@/lib/utils';

export default function HomeSkeleton({buttonDelay}) {
  const {setSharedValue, isHomeActive, currIdx, routes, next} = useLayout()
  const { url } = usePage()
  const [toDo,setToDo] = useState(false)
  const [clock,setClock] = useState(false)
  const [roles, setRole] = useState(false)
  const [switchPage, setSwitch] = useState(false)
    const { props } = usePage();
    const auth = props?.auth ?? {};
    const user = auth?.user ?? null;
    const username = truncate(user?.name) ?? 'Guest';
  const size = {sizeAll:2, sizePencil:3};
  return (
    <motion.div 
      key='home'
      animate={{translateX:0, translateY:0, scale:1}}
      exit={{translateX:-1500, translateY:100 ,scale:0.5}}
      transition={{duration:0.8, ease:'easeInOut'}}
      className="fixed inset-0 flex flex-col">
        <div className='min-h-full'>
          <div className='flex h-[10%] w-full'/> 
          <div className='flex flex-row w-[100%] h-[15%]'>          
            <div className='flex justify-center items-center w-[20%] h-full'>
              <button
              className='outline-green-600 ring-white ring-4 duration-75 ease-in-out bg-green-700/80 outline-2 w-[100px] text-white text-xl h-[50px] rounded-2xl'>
                {username}
              </button>       
            </div>
          </div>
          <div className="flex justify-center items-center flex-col h-[75%] rounded-2xl text-8xl [-webkit-text-stroke:0.4px_white] [text-shadow:_4px_4px_0_#000] font-extralight text-white">
            <motion.div 
              initial={isHomeActive&&{
                opacity:0, 
                x:-100
              }}
              animate={{
                opacity:1, 
                x:0
              }}
              transition={{duration:1}}
              className='flex flex-col justify-center items-center'>
                <p>
                Hello! 
                </p>
                <p>
                Welcome to <span className='text-green-500 [text-shadow:_4px_4px_0_#fff]'>Sequiz!</span>
                </p>
              </motion.div>
              <div className='flex flex-row w-full h-full'>
                <div className='flex flex-col items-center w-[25%] h-full justify-baseline'>{
                  !isHomeActive&&(
                    <motion.div 
                    initial={{
                      scale:0, 
                      opacity:0,
                    }}
                    animate={{
                      scale:1, 
                      opacity:1,
                    }}
                    transition={{
                      duration:0.9, 
                      ease:'circOut',
                      type:'spring',
                      delay:buttonDelay
                    }}
                    className='flex flex-col w-[35%] h-full justify-center items-center'>
                      <Search/>
                    </motion.div>
                  )}
                </div>
                <div className='flex justify-between w-[50%] pt-5'>
                  {
                    username=='Guest'?(
                    <>
                      <motion.button 
                      onClick={()=>router.visit('/login')}
                      initial={{
                        scale:0, 
                        opacity:0,
                      }}
                      animate={{
                        scale:1, 
                        opacity:1,
                      }}
                      transition={{
                        duration:0.9, 
                        ease:'circOut',
                        type:'spring',
                        delay:buttonDelay??0
                      }}
                      className='w-[300px] h-[100px]'>
                        <SignIn/>
                      </motion.button>
                      <motion.button 
                      initial={{
                        scale:0, 
                        opacity:0,
                      }}
                      animate={{
                        scale:1, 
                        opacity:1,
                      }}
                      transition={{
                        duration:0.9, 
                        ease:'easeInOut', 
                        type:'spring', 
                        delay:buttonDelay??0.2
                      }}
                      className='w-[300px] h-[100px]'>
                          <Link href={'/about'}>
                              <LearnMore/>
                          </Link>
                      </motion.button>
                    </>  
                    ):(
                      <>
                        <motion.div 
                        initial={{opacity:0,translateX:700}}
                        animate={{opacity:1,translateX:0}}
                        transition={{duration:1, ease:'easeOut'}}
                        className="flex flex-col w-full items-center justify-baseline h-full gap-6">
                          <motion.div
                          onClick={()=>router.visit('/quiz')}
                          onHoverStart={()=>setToDo(true)} 
                          onHoverEnd={()=>setToDo(false)}
                          className="flex justify-center items-center gap-x-3 pr-5 hover:opacity-75 cursor-pointer hover:scale-102 transition duration-500 ease-in-out w-[175px] h-[175px] bg-gradient from-green-800 to-transparent">
                            <motion.img 
                            animate={{
                            x: [0, 50, 0],
                            y: [0, 30, 0],       
                            rotate: [0, -0.2, 9,0], 
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          whileHover={{rotate:780}}
                          className='w-full h-full object-contain hover:animate-pulse hover:scale-90 duration-75' src='/assets/search.png'/>
                          </motion.div>
                            <p className="text-4xl">
                              Play the Trivia! 
                            </p>
                          </motion.div>
                        </> 
                      )
                    }
                </div>  
                <div className='flex flex-row w-[25%] h-full justify-center'>
                  <motion.div 
                  initial={isHomeActive&&{
                    scale:0, 
                    opacity:0
                  }}
                  animate={{
                    scale:1, 
                    opacity:1
                  }}
                  transition={{
                    duration:0.9, 
                    ease:'circOut',
                    type:'spring'
                  }}
                  className='w-[180px] h-[170px]'>
                    <PersonalComputer/>
                  </motion.div>
                </div>
            </div>
          </div>
        </div>
      </motion.div>
  );
}
