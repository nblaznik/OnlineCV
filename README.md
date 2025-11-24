# Nejc Blaznik – Interactive Online CV

This repository contains the source code for my interactive online CV.  
It is built with **React**, **Vite**, **Tailwind CSS**, and **Framer Motion**, and features a dynamic triangle-based background renderer powered by custom polygon DNA files.

The site presents my academic and professional profile as a sequence of full-screen sections, with smooth scrolling, animated transitions, and a navigation rail for quick access on larger screens.

---

## ✨ Features

- Full-screen snap-scroll CV layout  
- Animated polygon background rendered from triangle “DNA” JSON files  
- Shape-morphing controlled by scroll progress  
- Responsive navigation rail (visible on screens `md` and up)  
- Clean separation between content (`cv_data.json`) and layout  
- Smooth parallax and hover interactions powered by Framer Motion  
- Fully responsive design using Tailwind CSS

---

## 📁 Project structure
<pre>
```
src/
│
├── App.jsx                     # Main application (scroll layout + all sections)
├── main.jsx                    # Vite entry point
│
├── PolygonCanvas.jsx           # Animated triangle background (DNA morph engine)
├── NavRail.jsx                 # Left-side navigation rail for large screens
│
├── data/
│   ├── cv_data.json            # All CV text content
│   │
│   ├── dna_face.json           # Triangle DNA for "face" shape
│   ├── dna_uni.json            # DNA for "university" shape
│   ├── dna_lab.json            # DNA for "lab" shape
│   ├── dna_award.json          # DNA for "awards" shape
│   ├── dna_skill.json          # DNA for "skills" shape
│   ├── dna_article.json        # DNA for "article" shape
│   └── ...                     # Any additional DNA files
│
├── assets/                     # (optional) Icons, images, etc.
│
├── index.css                   # Tailwind base + global styles
└── tailwind.config.js          # Tailwind configuration
```
</pre>
All editable content lives in `data/cv_data.json`, allowing easy updates without touching layout code. In the future, I want to also be abel to compile a pdf using just the json file, so that I have a sinlge editable document, which then can be translated into multi-media documents. 

## 🧩 Customizing the polygon background

The animated background is produced from polygon DNA files.  
Each DNA file is a simple JSON list of triangles:
[
    {
    "points": [[x1, y1], [x2, y2], [x3, y3]],
    "color": [r, g, b, a]
    },
...
]


To add or replace a shape:

1. Place a new DNA JSON file in `src/data/`.
2. Import it in `PolygonCanvas.jsx`.
3. Add it to the `DNA` array that defines the morphing timeline.

Scrolling through the site dynamically transitions between these shapes.

DNA JSON files are created using the code available at [Genetic Programming](https://github.com/nblaznik/Genetic-Programming/tree/main) repository. 

---

## 📬 License

(C) Nejc Blaznik  
All rights reserved unless otherwise specified.

