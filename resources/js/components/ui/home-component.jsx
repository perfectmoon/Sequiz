'use client'
import { useState, useEffect } from 'react';
import { AnimatePresence, delay, motion } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react'
import { router } from '@inertiajs/react';
import { useLayout } from "@/Layouts/LayoutContext";
import { Search, SignIn, LearnMore, PersonalComputer, Pencil, Book, Clock, ArchegoLogo, ObscurumLogo } from '@/components/ui/attributes';
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
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'transparent',
      padding: '20px'
    }}>
      {/* Username button */}
      <div style={{display: 'flex', justifyContent: 'flex-start', marginBottom: '20px'}}>
        <button style={{
          padding: '10px 20px',
          backgroundColor: 'rgba(21, 128, 61, 0.5)',
          color: 'white',
          border: '2px solid white',
          borderRadius: '16px',
          fontSize: '18px',
          cursor: 'pointer'
        }}>
          {username}
        </button>
      </div>

      {/* Main content - scrollable if needed */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px'
      }}>
        {/* Text greeting */}
        <div style={{
          textAlign: 'center',
          fontSize: '48px',
          color: 'white',
          fontWeight: 'light',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
        }}>
          <p>Hello!</p>
          <p>Welcome to <span style={{color: '#22c55e'}}>Sequiz!</span></p>
        </div>

        {/* Buttons */}
        <div style={{display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap'}}>
          {/* ARCHEGO Button */}
          <button
            onClick={() => router.visit('/play/archego')}
            style={{
              width: '175px',
              height: '200px',
              backgroundColor: 'rgba(20, 83, 45, 0.4)',
              border: '2px solid rgba(34, 197, 94, 0.5)',
              borderRadius: '16px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0',
              overflow: 'hidden'
            }}
          >
            <div style={{width: '100px', height: '100px'}}>
              <ArchegoLogo/>
            </div>
            <p style={{fontSize: '20px', marginTop: '16px', color: '#86efac', fontFamily: 'monospace', margin: '0px'}}>ARCHEGO</p>
          </button>

          {/* SEQUIZ Button — FIX: label "QUIZ" → "SEQUIZ" */}
          <button
            onClick={() => router.visit('/quiz')}
            style={{
              width: '175px',
              height: '200px',
              backgroundColor: 'rgba(20, 83, 45, 0.4)',
              border: '2px solid rgba(34, 197, 94, 0.5)',
              borderRadius: '16px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0'
            }}
          >
            <p style={{fontSize: '60px', margin: '0px'}}>🔭</p>
            <p style={{fontSize: '20px', marginTop: '16px', color: '#86efac', fontFamily: 'monospace', margin: '0px'}}>SEQUIZ</p>
          </button>

          {/* OBSCURUM Button */}
          <button
            onClick={() => window.location.href = 'http://127.0.0.1:8001'}
            style={{
              width: '175px',
              height: '200px',
              backgroundColor: 'rgba(20, 83, 45, 0.4)',
              border: '2px solid rgba(34, 197, 94, 0.5)',
              borderRadius: '16px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0',
              overflow: 'hidden'
            }}
          >
            <div style={{width: '100px', height: '100px'}}>
              <ObscurumLogo/>
            </div>
            <p style={{fontSize: '20px', marginTop: '16px', color: '#86efac', fontFamily: 'monospace', margin: '0px'}}>OBSCURUM</p>
          </button>
        </div>
      </div>
    </div>
  );
}
