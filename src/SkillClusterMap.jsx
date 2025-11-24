import React from "react";
import { motion } from "framer-motion";

export default function SkillClusterMap({ skills }) {
  const CLUSTERS = {
    "Experimental Physics": [
      "Laser systems", 
      "Optical alignment",
      "Cold atom trapping",
      "BEC techniques",
      "Vacuum hardware",
      "RF control"
    ],
    "Data & Imaging": [
      "Fourier optics",
      "Image reconstruction",
      "Off-axis holography",
      "Signal processing",
      "PCA / SVD analysis",
      "Noise reduction"
    ],
    "Software & Programming": [
      "Python",
      "NumPy / SciPy",
      "MATLAB",
      "React",
      "Vite",
      "Tailwind",
      "GPU compute"
    ],
    "Theory & Modeling": [
      "Quantum optics",
      "Spinor BEC theory",
      "Landau-Zener transitions",
      "Hamiltonian simulation",
      "Diffusion models"
    ],
  };

  return (
    <div className="relative w-full h-[80vh] md:h-[100vh]">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        
        {/* Map grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 max-w-5xl mx-auto p-8">
          {Object.entries(CLUSTERS).map(([cluster, items], idx) => (
            <div key={cluster} className="relative">
              {/* Cluster Title */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.7, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="text-3xl font-semibold mb-4 text-gray-800/70"
              >
                {cluster}
              </motion.h3>

              {/* Skills */}
              <div className="flex flex-wrap gap-3">
                {items.map((skill, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.6, y: 10 }}
                    whileInView={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: idx * 0.1 + i * 0.05,
                      type: "spring",
                      stiffness: 120,
                    }}
                    className="px-4 py-1.5 rounded-full text-lg font-medium 
                               bg-blue-900/10 backdrop-blur-md text-blue-900
                               shadow-sm border border-blue-900/20"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
