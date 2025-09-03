# 3D Model Structure

This directory contains GLTF models for the rifle builder. Each part category has its own subdirectory:

## Directory Structure
```
models/
├── barrels/
│   ├── standard-16.gltf
│   ├── carbine-14.gltf
│   └── heavy-20.gltf
├── handguards/
│   ├── mlok-standard.gltf
│   ├── quad-rail.gltf
│   └── keymod.gltf
└── optics/
    ├── red-dot.gltf
    ├── scope-3-9.gltf
    └── holographic.gltf
```

## Model Requirements

### Coordinate System
- Origin (0,0,0) should be at the mounting point
- X-axis: left/right
- Y-axis: up/down  
- Z-axis: front/back of rifle

### Scale
- Models should be in real-world scale (meters)
- Use standard firearm dimensions for reference

### Format
- Use GLTF 2.0 format (.gltf + .bin + textures, or .glb)
- Include materials and textures
- Optimize for web (keep polygon count reasonable)

## Usage
The RifleBuilder3D component automatically loads these models based on user selection. Each part snaps to its predefined position using the coordinate system above.