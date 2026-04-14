'use client'
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import AppLayout from './Layouts/AppLayout';

createInertiaApp({
  resolve: async (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx');
    const page = await pages[`./Pages/${name}.jsx`]();
    
    page.default.layout ??= (el) => <AppLayout>{el}</AppLayout>;
    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  }
})