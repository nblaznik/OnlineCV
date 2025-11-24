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
src/
│
├── App.jsx # Main application file
├── PolygonCanvas.jsx # Animated background (triangle DNA renderer)
├── NavRail.jsx # Left-hand navigation rail for large screens
│
├── data/
│ ├── cv_data.json # All CV content (profile, education, skills, etc.)
│ ├── dna_face.json
│ ├── dna_uni.json
│ ├── dna_lab.json
│ ├── dna_award.json
│ ├── dna_skill.json
│ ├── dna_article.json
│ └── ... # Additional DNA files
│
├── assets/ # (optional) images, icons
└── main.jsx # Vite entry point


All editable content lives in `data/cv_data.json`, allowing easy updates without touching layout code.

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

---

## 🧭 Navigation rail

On screens larger than `md`, a floating navigation rail appears on the left side.  
Each segment corresponds to a full-screen section. The active section glows,  
and the rail responds visually on hover.

This makes long-scroll browsing intuitive without cluttering smaller screens.

---

## 📄 Content editing

All CV information is in:


You can edit:

- Profile text  
- Education  
- Experience  
- Awards  
- Skills  
- Languages  
- Publications  
- Contact and social links  

The React components read directly from this JSON, so no code needs to change.

---

## 📬 License

(C) Nejc Blaznik  
All rights reserved unless otherwise specified.

