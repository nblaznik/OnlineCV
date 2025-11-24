import json
import random

# paths
INPUT = "dna3.json"
OUTPUT = "dna3.json"

N = 40  # number of triangles to duplicate

with open(INPUT, "r") as f:
    triangles = json.load(f)

# select the last 40
to_duplicate = triangles[-N:]

dupes = []
for tri in to_duplicate:
    new_tri = {
        "points": [p[:] for p in tri["points"]],
        "color": tri["color"][:]
    }
    new_tri["color"][3] = int(new_tri["color"][3] * 0.5)
    dupes.append(new_tri)

full = triangles + dupes

with open(OUTPUT, "w") as f:
    json.dump(full, f, indent=2)

print("Done. Original:", len(triangles), "Final:", len(full))