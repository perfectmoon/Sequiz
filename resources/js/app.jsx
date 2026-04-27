'use client'
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import AppLayout from './Layouts/AppLayout';
import '../css/app.css';

createInertiaApp({
  resolve: async (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx');
    let pagePath = `./Pages/${name}.jsx`;
    
    if (!pages[pagePath]) {
      pagePath = `./Pages/Levels/${name}.jsx`;
    }
    
    if (!pages[pagePath] && name.startsWith('Levels/')) {
      const cleanName = name.replace('Levels/', '');
      pagePath = `./Pages/Levels/${cleanName}.jsx`;
    }
    
    const page = await pages[pagePath]();
    page.default.layout ??= (el) => <AppLayout>{el}</AppLayout>;
    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  }
})