# Scene Limitations

## Overview

Decentraland scenes have resource limits based on the number of parcels. These ensure scenes run smoothly alongside neighboring scenes.

## Parcel Dimensions

- **Single parcel**: 16m x 16m (256 sq meters)
- **Height**: log2(n+1) x 20 meters (where n = number of parcels)

| Parcels | Max Height |
|---------|------------|
| 1 | 20m |
| 2 | ~31m |
| 4 | ~46m |
| 8 | ~63m |
| 16 | 80m |

## Resource Limits

All limits scale with parcel count (n):

| Resource | Formula | 1 Parcel | 4 Parcels |
|----------|---------|----------|-----------|
| Triangles | n x 10,000 | 10,000 | 40,000 |
| Materials | log2(n+1) x 20 | 20 | ~46 |
| Textures | log2(n+1) x 10 | 10 | ~23 |
| Height | log2(n+1) x 20m | 20m | ~46m |

## Texture Requirements

### Size Limits

- **Maximum**: 512px (compressed by explorer)
- **Recommended**: 512x512 optimal
- **Required**: Power of 2 dimensions

Valid sizes: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024

```
Good: 512x512, 256x512, 1024x1024
Bad: 500x500, 300x400, 1000x1000
```

### File Size

| Parcels | Max Total File Size |
|---------|---------------------|
| 1 | 15 MB |
| 2 | 30 MB |
| 4+ | Scales with parcels |

**Per file max**: 50 MB

## Spatial Boundaries

### Horizontal

All models must fit within parcel boundaries:
- Content extending outside is cut off
- Players can't see or interact with out-of-bounds content

### Vertical

- **Minimum**: y = 0 (ground level)
- **Maximum**: Based on parcel count (see Height formula)
- No underground tunnels (players can't go below y = 0)
- Entities can be placed underground to hide them

## Entity Limits

While not strictly limited, best practices:
- Avoid thousands of entities
- Use instancing for repeated objects
- Combine meshes where possible

## Draw Call Optimization

Each material = 1 draw call per object using it

Tips:
- Use texture atlases
- Combine materials where possible
- Reuse materials across objects

## Worlds vs LAND

### Decentraland LAND
- Follows parcel-based limits
- Adjacent to other scenes
- Requires LAND ownership

### Decentraland Worlds
- Isolated scenes
- Different limits:
  - DCL Names: 100 MB minimum (expandable)
  - ENS Domains: 25 MB fixed

## Checking Limits

### In Creator Hub

The Scene Editor shows resource usage in real-time:
- Triangle count
- Texture count
- Material count
- File size

### In Code

```typescript
import { getSceneInfo } from '@dcl/sdk/runtime'

async function checkLimits() {
  const sceneInfo = await getSceneInfo()
  console.log('Parcels:', sceneInfo.scene.parcels.length)
}
```

## Common Issues

### "Content exceeds scene boundaries"
- Model extends beyond parcel limits
- Solution: Scale down or reposition

### "Texture size not power of 2"
- Invalid texture dimensions
- Solution: Resize to 256, 512, or 1024

### "File size exceeds limit"
- Scene too large for parcel count
- Solutions:
  - Compress textures
  - Use .glb instead of .gltf
  - Reduce polygon count
  - Remove unused assets

## Optimization Tips

1. **Textures**
   - Use 512x512 max
   - Compress with TinyPNG
   - Use texture atlases

2. **Models**
   - Use .glb format
   - Decimate high-poly models
   - Remove hidden faces

3. **Materials**
   - Share materials between objects
   - Combine similar materials
   - Use texture atlases

4. **Audio**
   - Use compressed formats
   - Limit simultaneous sounds

5. **Code**
   - Minimize active systems
   - Use component queries efficiently
   - Remove unused entities

## Testing Limits

```bash
# Build will warn about limit violations
npm run build

# Preview shows warnings in console
npm run start
```

## References

- Single parcel template: Start with 10,000 triangles budget
- Scene inspector: Check stats in preview mode (press P)
- Asset validation: Build process checks all limits
