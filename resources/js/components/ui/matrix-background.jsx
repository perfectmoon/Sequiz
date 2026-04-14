import { useEffect, useRef } from "react";
import { useLayout } from "../../Layouts/LayoutContext";

const MatrixBackground = () => {
  const { sharedValue } = useLayout();
  const canvasRef = useRef(null);

  const dirRef = useRef(1);
  const speedMultRef = useRef(1);
  const targetMultRef = useRef(1);
  const fontScaleRef = useRef(1);
  const targetFontScaleRef = useRef(1);

  // nilai 0..1 buat transisi warna (0 = hijau, 1 = merah)
  const colorBlendRef = useRef(0);
  const targetColorBlendRef = useRef(0);

  // ubah arah, speed, font scale, dan warna saat reverse
  useEffect(() => {
    if (sharedValue) {
      dirRef.current = -1;
      targetMultRef.current = 10.0;
      targetFontScaleRef.current = 0.65;
      targetColorBlendRef.current = 1; // merah
    } else {
      dirRef.current = 1;
      targetMultRef.current = 1.0;
      targetFontScaleRef.current = 1.0;
      targetColorBlendRef.current = 0; // hijau
    }
  }, [sharedValue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';

    const BASE_FONT = 16;

    let rows = Math.max(1, Math.floor(canvas.height / (BASE_FONT * fontScaleRef.current)));
    let xsPx = Array(rows).fill(0).map(() => Math.random() * canvas.width);
    let baseSpeedCols = Array(rows).fill(0).map(() => 0.6 + Math.random() * 0.8);

    const reconcileRows = (fontSizeNow) => {
      const newRows = Math.max(1, Math.floor(canvas.height / fontSizeNow));
      if (newRows === rows) return;
      const nXs = Array(newRows).fill(0);
      const nSp = Array(newRows).fill(1);
      const lim = Math.min(rows, newRows);
      for (let i = 0; i < lim; i++) {
        nXs[i] = xsPx[i];
        nSp[i] = baseSpeedCols[i];
      }
      for (let i = lim; i < newRows; i++) {
        nXs[i] = Math.random() * canvas.width;
        nSp[i] = 0.6 + Math.random() * 0.8;
      }
      xsPx = nXs;
      baseSpeedCols = nSp;
      rows = newRows;
    };

    // Fungsi bantu lerp warna (hijau → merah)
    const lerpColor = (t) => {
        const r = 255 ; // 255→0
        const g = Math.round(255 - 255*t);                       // tetap hijau terang
        const b = 0;
    //   const b = Math.round(0 + 0 * t);
      return `rgb(${r},${g},${b})`;
    };

    const draw = () => {
      const ease = 0.15;
      speedMultRef.current += (targetMultRef.current - speedMultRef.current) * ease;
      fontScaleRef.current += (targetFontScaleRef.current - fontScaleRef.current) * ease;
      colorBlendRef.current += (targetColorBlendRef.current - colorBlendRef.current) * ease;

      const fontSize = BASE_FONT * fontScaleRef.current;
      reconcileRows(fontSize);

      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // blend warna berdasarkan state (hijau → merah)
      ctx.fillStyle = lerpColor(colorBlendRef.current);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < rows; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const x = xsPx[i];
        const y = i * fontSize;
        ctx.fillText(ch, x, y);

        const deltaX = dirRef.current * baseSpeedCols[i] * fontSize * speedMultRef.current;
        xsPx[i] += deltaX;

        if (Math.random() > 0.985) xsPx[i] += dirRef.current * fontSize * 0.5 * speedMultRef.current;

        if (xsPx[i] >= canvas.width) xsPx[i] -= canvas.width;
        if (xsPx[i] < 0) xsPx[i] += canvas.width;
      }
    };

    const interval = setInterval(draw, 35);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="matrix-background absolute inset-0 -z-10" />
  );
};

export default MatrixBackground;
