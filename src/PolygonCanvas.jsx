import { useEffect, useMemo, useState } from "react";
import {
  motion as motionComponents,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import dnaIntroSource from "./data/dna_intro.json";
import dnaFace from "./data/dna_face.json";
import dnaUniversity from "./data/dna_uni.json";
import dnaLaboratorySource from "./data/dna_lab.json";
import dnaAward from "./data/dna_award.json";
import dnaSkill from "./data/dna_skill.json";
import dnaArticleSource from "./data/dna_article.json";
import { SECTION_IDS } from "./navigation";

const MotionDiv = motionComponents.div;

const dnaIntro = dnaIntroSource.map((triangle) => ({
  points: triangle.points.map(([x, y]) => [x - 200, y]),
  color: triangle.color,
}));

const dnaLaboratory = dnaLaboratorySource.map((triangle) => ({
  points: triangle.points.map(([x, y]) => [x * 0.7, y * 0.7]),
  color: triangle.color,
}));

const dnaArticle = dnaArticleSource.map((triangle) => ({
  points: triangle.points.map(([x, y]) => [x * 0.7 + 120, y * 0.7 + 120]),
  color: triangle.color,
}));

// One exact polygon state per page section. Section-derived transition points
// keep this mapping stable when a card opens or the viewport changes height.
const DNA = [
  dnaIntro,
  dnaFace,
  dnaLaboratory,
  dnaUniversity,
  dnaAward,
  dnaSkill,
  dnaArticle,
  dnaFace,
];

function createDefaultKeyframes() {
  const stops = [0];
  const shapes = [0];

  for (let index = 1; index < SECTION_IDS.length; index += 1) {
    const boundary = (index - 0.5) / (SECTION_IDS.length - 1);
    const halfWidth = 0.15 / (SECTION_IDS.length - 1);
    stops.push(boundary - halfWidth, boundary + halfWidth);
    shapes.push(index - 1, index);
  }

  stops.push(1);
  shapes.push(SECTION_IDS.length - 1);
  return { shapes, stops };
}

const DEFAULT_KEYFRAMES = createDefaultKeyframes();

function sizeOf(triangle) {
  const xs = triangle.points.map((point) => point[0]);
  const ys = triangle.points.map((point) => point[1]);
  return (
    (Math.max(...xs) - Math.min(...xs)) *
    (Math.max(...ys) - Math.min(...ys))
  );
}

function seededValue(index, salt) {
  const value = Math.sin(index * 91.17 + salt * 47.31) * 43758.5453;
  return value - Math.floor(value);
}

function PolygonTriangle({
  index,
  maxSize,
  mouseX,
  mouseY,
  prefersReducedMotion,
  scrollYProgress,
  scatter,
  keyframes,
}) {
  const triangles = keyframes.shapes.map((shapeIndex) => DNA[shapeIndex][index]);

  const coordinateValues = (vertex, axis) =>
    triangles.map((triangle, keyframeIndex) => {
      const coordinate = triangle.points[vertex][axis];
      const shapeIndex = keyframes.shapes[keyframeIndex];
      if (shapeIndex !== 0 || prefersReducedMotion) return coordinate;
      return coordinate + (axis === 0 ? scatter.x : scatter.y);
    });

  const p1x = useTransform(scrollYProgress, keyframes.stops, coordinateValues(0, 0));
  const p1y = useTransform(scrollYProgress, keyframes.stops, coordinateValues(0, 1));
  const p2x = useTransform(scrollYProgress, keyframes.stops, coordinateValues(1, 0));
  const p2y = useTransform(scrollYProgress, keyframes.stops, coordinateValues(1, 1));
  const p3x = useTransform(scrollYProgress, keyframes.stops, coordinateValues(2, 0));
  const p3y = useTransform(scrollYProgress, keyframes.stops, coordinateValues(2, 1));

  const red = useTransform(
    scrollYProgress,
    keyframes.stops,
    triangles.map((triangle) => triangle.color[0]),
  );
  const green = useTransform(
    scrollYProgress,
    keyframes.stops,
    triangles.map((triangle) => triangle.color[1]),
  );
  const blue = useTransform(
    scrollYProgress,
    keyframes.stops,
    triangles.map((triangle) => triangle.color[2]),
  );
  const alpha = useTransform(
    scrollYProgress,
    keyframes.stops,
    triangles.map((triangle) => triangle.color[3] / 255),
  );

  const firstTransition = [keyframes.stops[0], keyframes.stops[2]];
  const rotation = useTransform(
    scrollYProgress,
    firstTransition,
    [prefersReducedMotion ? 0 : scatter.rotation, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    firstTransition,
    [prefersReducedMotion ? 1 : 2, 1],
  );
  const opacity = useTransform(scrollYProgress, firstTransition, [0.3, 0.9]);

  const depth = (2 * sizeOf(triangles[0])) / maxSize;
  const parallaxX = useSpring(
    useTransform(mouseX, (value) =>
      prefersReducedMotion ? 0 : value * depth * 60,
    ),
    { stiffness: 90, damping: 15, mass: 0.02 },
  );
  const parallaxY = useSpring(
    useTransform(mouseY, (value) =>
      prefersReducedMotion ? 0 : value * depth * 60,
    ),
    { stiffness: 90, damping: 15, mass: 0.02 },
  );

  const color = useMotionTemplate`rgba(${red}, ${green}, ${blue}, ${alpha})`;
  const clipPath = useMotionTemplate`polygon(
    ${p1x}px ${p1y}px,
    ${p2x}px ${p2y}px,
    ${p3x}px ${p3y}px
  )`;

  return (
    <MotionDiv
      className="absolute inset-0"
      style={{
        backgroundColor: color,
        clipPath,
        opacity,
        rotate: rotation,
        scale,
        translateX: parallaxX,
        translateY: parallaxY,
      }}
    />
  );
}

export default function PolygonCanvas({ scrollRef }) {
  const [keyframes, setKeyframes] = useState(DEFAULT_KEYFRAMES);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const maxSize = useMemo(() => Math.max(...DNA[0].map(sizeOf)), []);
  const scatter = useMemo(() => {
    const viewportWidth = typeof window === "undefined" ? 1024 : window.innerWidth;
    const viewportHeight = typeof window === "undefined" ? 768 : window.innerHeight;

    return DNA[0].map((_, index) => ({
      x: (seededValue(index, 1) - 0.5) * viewportWidth * 0.5,
      y: (seededValue(index, 2) - 0.5) * viewportHeight * 0.5,
      rotation: seededValue(index, 3) * 100,
    }));
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return undefined;

    const updateKeyframes = () => {
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll <= 0) return;

      const sections = SECTION_IDS.map((id) => document.getElementById(id));
      if (sections.some((section) => section === null)) return;

      const nextStops = [0];
      const nextShapes = [0];
      const halfWidth = (container.clientHeight * 0.15) / maxScroll;

      for (let index = 1; index < sections.length; index += 1) {
        const boundaryScroll = sections[index].offsetTop - container.clientHeight / 2;
        const boundary = Math.min(1, Math.max(0, boundaryScroll / maxScroll));
        nextStops.push(
          Math.max(nextStops.at(-1), boundary - halfWidth),
          Math.min(1, boundary + halfWidth),
        );
        nextShapes.push(index - 1, index);
      }

      nextStops.push(1);
      nextShapes.push(SECTION_IDS.length - 1);

      setKeyframes((currentKeyframes) => {
        const unchanged = currentKeyframes.stops.every(
          (stop, index) => Math.abs(stop - nextStops[index]) < 0.0001,
        );
        return unchanged
          ? currentKeyframes
          : { shapes: nextShapes, stops: nextStops };
      });
    };

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean,
    );
    const resizeObserver = new ResizeObserver(updateKeyframes);
    resizeObserver.observe(container);
    sections.forEach((section) => resizeObserver.observe(section));
    window.addEventListener("resize", updateKeyframes);
    updateKeyframes();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateKeyframes);
    };
  }, [scrollRef]);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const handleMouseMove = (event) => {
      mouseX.set((event.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  return (
    <div className="relative h-[1024px] w-[1024px]">
      {DNA[0].map((_, index) => (
        <PolygonTriangle
          key={index}
          index={index}
          maxSize={maxSize}
          mouseX={mouseX}
          mouseY={mouseY}
          prefersReducedMotion={prefersReducedMotion}
          scrollYProgress={scrollYProgress}
          scatter={scatter[index]}
          keyframes={keyframes}
        />
      ))}
    </div>
  );
}
