import { createContext, useContext, useEffect, useState } from "react";

const LayoutContext = createContext(null);

export function LayoutProvider({ children }) {
  const [sharedValue, setSharedValue] = useState(false);
  const [isHomeActive, setHomeActive] = useState(false);
  const [next, setNext] = useState(null);
  const [currIdx,setIdx] = useState(null)
  const routes = ['/','/about'];

  return (
    <LayoutContext.Provider value={{ sharedValue, setSharedValue, isHomeActive, setHomeActive, next, setNext, currIdx, setIdx, routes}}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used within LayoutProvider");
  return ctx;
}
