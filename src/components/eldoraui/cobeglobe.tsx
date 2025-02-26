/* eslint-disable */
"use client";
import { useMediaQuery } from 'usehooks-ts'
import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export function Cobe() {
  const matches = useMediaQuery('(min-width: 768px)')
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    let globe: ReturnType<typeof createGlobe> | undefined;

    if (canvasRef.current) {
      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.3,
        dark: 1,
        diffuse: 0.5, // Reduce this value for less light spread
        mapSamples: 16000,
        mapBrightness: 1.2,
        baseColor: [0.4, 0.8, 0.4], // Softer green
        markerColor: [0, 0.8, 0.2], // Subtle green markers
        glowColor: [1, 1, 1],
        markers: [],
        onRender: (state: any) => {
          state.phi = phi;
          phi += 0.005;
          state.width = width * 2;
          state.height = width * 2;
        },
      });
    }

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }, 0);

    return () => {
      globe?.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        maxWidth: `${matches ? 520 : 300}px`,
        aspectRatio: "1",
        // margin: "auto",
        position: "relative",
        padding: "auto",
        placeItems: "center",
        justifyContent: "center",
        ...{
          "@media (minwidth: 768px)": {
            maxWidth: 500, // For medium devices and above
          },
        }
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
