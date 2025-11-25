import React, { useMemo, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
  useMotionValue
} from "framer-motion";

import dna1 from "./data/dna_face.json";  // face
import dna2 from "./data/dna_uni.json";  // university
import dna3 from "./data/dna_lab.json";  // 
// import dna3 from "./data/dna_face.json";  //    
import dna4 from "./data/dna_award.json";
import dna5 from "./data/dna_skill.json";
import dna6 from "./data/dna_article.json";



// Compute approximate triangle size for parallax depth
function sizeOf(poly) {
  const xs = poly.points.map(p => p[0]);
  const ys = poly.points.map(p => p[1]);
  return (Math.max(...xs) - Math.min(...xs)) *
         (Math.max(...ys) - Math.min(...ys));
}


const dna_intro = dna1.map(tri => ({
  points: tri.points.map(([x,y]) => [x - 200, y]),
  color: tri.color
}));

const dna_lab = dna3.map(tri => ({
  points: tri.points.map(([x,y]) => [x * 0.7, y * 0.7]),
  color: tri.color
}));

const dna_article = dna6.map(tri => ({
  points: tri.points.map(([x,y]) => [x * 0.7+120, y * 0.7+120]),
  color: tri.color
}));

const DNA = [dna_intro, dna1, dna_lab, dna2, dna4, dna5, dna_article, dna1];

export default function PolygonCanvas({ scrollRef }) {
  // Find actual canvas center offset based on CSS transform
    const [centerOffset, setCenterOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
    const updateOffset = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;

        // your wrapper shifts to 65% on md+
        const leftShift = window.innerWidth >= 768 ? w * 0.65 : w * 0.5;

        setCenterOffset({
        x: leftShift - w * 0.5, // difference from normal center
        y: 0                    // vertical stays centered
        });
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
    }, []);

    const width = 1024;
    const height = 848;
    const { scrollYProgress } = useScroll({ container: scrollRef });

  // ------------------------------------------------------------
  // 1. STARTING POSITIONS
  // ------------------------------------------------------------
    const SCATTER = 0.5; // 250% of viewport width

    const starting = useMemo(() =>
    DNA[0].map(() => ({
        x: (Math.random() - 0.5) * window.innerWidth * SCATTER,
        y: (Math.random() - 0.5) * window.innerHeight * SCATTER,
        rot: Math.random() * 100,
        delay: Math.random() * 0.8
    }))
    , [centerOffset]);

  // ------------------------------------------------------------
  // 2. PARALLAX MOUSE
  // ------------------------------------------------------------
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = e => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  
  const maxSize = useMemo(() => Math.max(...DNA[0].map(sizeOf)), []);
  const PARALLAX = 60;

  // ------------------------------------------------------------
  // 3. BUILD THE TIMELINE
  // ------------------------------------------------------------

  const MORPH = 20;  // fast transition
  const HOLD  = 20;  // stay on shape
  const ranges = [];
  let t = 0;

  for (let i = 0; i < DNA.length - 1; i++) {
    ranges.push({ type: "morph",  start: t, end: t + MORPH, from: i, to: i+1 });
    t += MORPH;
    ranges.push({ type: "hold",   start: t, end: t + HOLD,  from: i+1, to: i+1 });
    t += HOLD;
  }

  const total = t - 1;
  const timeline = ranges.map(r => ({
    ...r,
    start: r.start / total,
    end: r.end / total
  }));


  function getStage(progress) {
    for (let i = 0; i < timeline.length; i++) {
      if (progress >= timeline[i].start && progress <= timeline[i].end) {
        return timeline[i];
      }
    }
    return timeline[timeline.length - 2];
  }

const [progress, setProgress] = useState(0);

useEffect(() => {
  return scrollYProgress.on("change", (v) => setProgress(v));
}, [scrollYProgress]);

  // ------------------------------------------------------------
  // RENDER TRIANGLES
  // ------------------------------------------------------------
  return (
    <div
      className="fixed top-1/2 left-1/2 pointer-events-none -z-10"
      style={{
        transform: "translate(-50%, -50%)",
        width: `${width}px`,
        height: `${height}px`
      }}
    >
      {DNA[0].map((tri, idx) => {
        const stageObj = getStage(progress);
        const isScatterStage = stageObj.from === 0 && stageObj.to === 1;
        const size = sizeOf(tri);
        const depth = 2 * size / maxSize;
        const start = starting[idx];

        // ------------------------------------------------------
        // Find which part of the timeline we are in
        // ------------------------------------------------------

        // ------------------------------------------------------
        // We need: shape A → shape B during morph, or static shape during hold
        // ------------------------------------------------------
        const shapeA = DNA[stageObj.from];
        const shapeB = DNA[stageObj.to];

        const f = shapeA[idx].points;
        const u = shapeB[idx].points;

        const [rf,gf,bf,af] = shapeA[idx].color;
        const [ru,gu,bu,au] = shapeB[idx].color;


        // ------------------------------------------------------
        // Vertex morphing - with springs
        // ------------------------------------------------------
        // const p1x = useSpring(useTransform(scrollYProgress, [stageObj.start, stageObj.end], [f[0][0], u[0][0]]), { stiffness: 50, damping: 20 });
        // const p1y = useSpring(useTransform(scrollYProgress, [stageObj.start, stageObj.end], [f[0][1], u[0][1]]), { stiffness: 50, damping: 20 });

        // const p2x = useSpring(useTransform(scrollYProgress, [stageObj.start, stageObj.end], [f[1][0], u[1][0]]), { stiffness: 50, damping: 20 });
        // const p2y = useSpring(useTransform(scrollYProgress, [stageObj.start, stageObj.end], [f[1][1], u[1][1]]), { stiffness: 50, damping: 20 });

        // const p3x = useSpring(useTransform(scrollYProgress, [stageObj.start, stageObj.end], [f[2][0], u[2][0]]), { stiffness: 50, damping: 20 });
        // const p3y = useSpring(useTransform(scrollYProgress, [stageObj.start, stageObj.end], [f[2][1], u[2][1]]), { stiffness: 50, damping: 20 });

        // // Color morphing
        // const r = useSpring(useTransform(scrollYProgress, [stageObj.start, stageObj.end], [rf, ru]), { stiffness: 50, damping: 20 });
        // const g = useSpring(useTransform(scrollYProgress, [stageObj.start, stageObj.end], [gf, gu]), { stiffness: 50, damping: 20 });
        // const b = useSpring(useTransform(scrollYProgress, [stageObj.start, stageObj.end], [bf, bu]), { stiffness: 50, damping: 20 });
        // const alpha = useSpring(useTransform(scrollYProgress, [stageObj.start, stageObj.end], [af/255, au/255]), { stiffness: 50, damping: 20 });
        
        function ease(t) {
        return t * t * t * (t * (6 * t - 15) + 10); // cubic smoothstep
        }

        function lerp(a, b, t) { return a + (b - a) * t; }

        // use scrollYProgress mapped to [0..1] inside stage
        const localT = useTransform(
        scrollYProgress,
        [stageObj.start, stageObj.end],
        [0.2, 0.85]
        );

        // ---- P1 ----
        const p1x = useTransform(localT, t => {
        const e = ease(t);
        return isScatterStage
            ? lerp(start.x + f[0][0], u[0][0], e)
            : lerp(f[0][0], u[0][0], e);
        });

        const p1y = useTransform(localT, t => {
        const e = ease(t);
        return isScatterStage
            ? lerp(start.y + f[0][1], u[0][1], e)
            : lerp(f[0][1], u[0][1], e);
        });

        // ---- P2 ----
        const p2x = useTransform(localT, t => {
        const e = ease(t);
        return isScatterStage
            ? lerp(start.x + f[1][0], u[1][0], e)
            : lerp(f[1][0], u[1][0], e);
        });

        const p2y = useTransform(localT, t => {
        const e = ease(t);
        return isScatterStage
            ? lerp(start.y + f[1][1], u[1][1], e)
            : lerp(f[1][1], u[1][1], e);
        });

        // ---- P3 ----
        const p3x = useTransform(localT, t => {
        const e = ease(t);
        return isScatterStage
            ? lerp(start.x + f[2][0], u[2][0], e)
            : lerp(f[2][0], u[2][0], e);
        });

        const p3y = useTransform(localT, t => {
        const e = ease(t);
        return isScatterStage
            ? lerp(start.y + f[2][1], u[2][1], e)
            : lerp(f[2][1], u[2][1], e);
        });

        // Color morphing
        const r = useTransform(scrollYProgress, [stageObj.start, stageObj.end], [rf, ru]);
        const g = useTransform(scrollYProgress, [stageObj.start, stageObj.end], [gf, gu]);
        const b = useTransform(scrollYProgress, [stageObj.start, stageObj.end], [bf, bu]);
        const alpha = useTransform(scrollYProgress, [stageObj.start, stageObj.end], [af/255, au/255]);
        const color = useMotionTemplate`rgba(${r}, ${g}, ${b}, ${alpha})`;


        // ------------------------------------------------------
        // Rotation & opacity during build
        // ------------------------------------------------------
        // const rotate = useSpring(
        //   useTransform(scrollYProgress, [0, timeline[0].end], [start.rot, 0]),
        //   { stiffness: 180, damping: 100 }
        // );

        // const opacity = useSpring(
        //   useTransform(scrollYProgress, [0, timeline[0].end], [0.3, 0.9]),
        //   { stiffness: 180, damping: 500 }
        // );

        const rotate =  useTransform(scrollYProgress, [0, timeline[0].end], [start.rot, 0]);
        const scale =  useTransform(scrollYProgress, [0, timeline[0].end], [2, 1]);
        const opacity = useTransform(scrollYProgress, [0, timeline[0].end], [0.3, 0.9]);

        // ------------------------------------------------------
        // Parallax
        // ------------------------------------------------------
        const rawPX = useMotionValue(0);
        const rawPY = useMotionValue(0);

        rawPX.set(mouse.x * depth * PARALLAX);
        rawPY.set(mouse.y * depth * PARALLAX);

        const parallaxX = useSpring(rawPX, { stiffness: 90, damping: 15, mass: 0.02 });
        const parallaxY = useSpring(rawPY, { stiffness: 90, damping: 15, mass: 0.02 });


        // ------------------------------------------------------
        // Dynamic clip-path
        // ------------------------------------------------------
        const clipPath = useMotionTemplate`
          polygon(
            ${p1x}px ${p1y}px,
            ${p2x}px ${p2y}px,
            ${p3x}px ${p3y}px
          )
        `;


        return (
          <motion.div
            key={idx}
            className="absolute inset-0"
            style={{
              backgroundColor: color,
              clipPath,
              rotate,
              opacity,
              scale,
              translateX: parallaxX,
              translateY: parallaxY
            }}
            transition={{ delay: start.delay, type: "spring", stiffness: 50, damping: 20 }}
          />
        );
      })}
    </div>
  );
}
