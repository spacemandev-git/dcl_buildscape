# Materials & Textures

## Material Component

Apply materials to primitive shapes (MeshRenderer entities):

```typescript
import { engine, MeshRenderer, Material } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'

const entity = engine.addEntity()
MeshRenderer.setBox(entity)

// Simple color material
Material.setPbrMaterial(entity, {
  albedoColor: Color4.create(1, 0, 0, 1)  // Red
})
```

## PBR Material Properties

Physically Based Rendering (PBR) materials support realistic lighting:

```typescript
Material.setPbrMaterial(entity, {
  // Base color
  albedoColor: Color4.White(),

  // Texture
  texture: Material.Texture.Common({
    src: 'assets/textures/wood.png'
  }),

  // Surface properties
  metallic: 0.0,           // 0 = non-metal, 1 = metal
  roughness: 0.5,          // 0 = smooth/shiny, 1 = rough/matte

  // Emissive (self-illumination)
  emissiveColor: Color4.Black(),
  emissiveIntensity: 0,
  emissiveTexture: Material.Texture.Common({
    src: 'assets/textures/glow.png'
  }),

  // Bump mapping
  bumpTexture: Material.Texture.Common({
    src: 'assets/textures/normal.png'
  }),

  // Transparency
  alphaTest: 0.5,          // Alpha cutoff threshold
  transparencyMode: MaterialTransparencyMode.MTM_AUTO,

  // Texture tiling
  albedoColor: Color4.White()
})
```

## Transparency Modes

```typescript
import { MaterialTransparencyMode } from '@dcl/sdk/ecs'

// Auto-detect based on texture
MaterialTransparencyMode.MTM_AUTO

// Fully opaque
MaterialTransparencyMode.MTM_OPAQUE

// Alpha test (cutout, better performance)
MaterialTransparencyMode.MTM_ALPHA_TEST

// Alpha blend (smooth transparency, expensive)
MaterialTransparencyMode.MTM_ALPHA_BLEND

// Alpha test + blend
MaterialTransparencyMode.MTM_ALPHA_TEST_AND_ALPHA_BLEND
```

## Texture Configuration

```typescript
Material.Texture.Common({
  src: 'assets/textures/image.png',

  // Wrap modes
  wrapMode: TextureWrapMode.TWM_REPEAT,  // Tile texture
  // TWM_CLAMP - Stretch edges
  // TWM_MIRROR - Mirror at edges

  // Filtering
  filterMode: TextureFilterMode.TFM_BILINEAR
  // TFM_POINT - Pixelated
  // TFM_BILINEAR - Smooth
  // TFM_TRILINEAR - Smoothest
})
```

## Unlit Material

For materials not affected by lighting:

```typescript
Material.setBasicMaterial(entity, {
  diffuseColor: Color4.White(),
  texture: Material.Texture.Common({
    src: 'assets/textures/sign.png'
  })
})
```

## Video Texture

```typescript
import { VideoPlayer, Material } from '@dcl/sdk/ecs'

const screen = engine.addEntity()
MeshRenderer.setPlane(screen)

// Create video player
VideoPlayer.create(screen, {
  src: 'assets/video/clip.mp4',
  playing: true,
  loop: true
})

// Apply video as texture
Material.setPbrMaterial(screen, {
  texture: Material.Texture.Video({
    videoPlayerEntity: screen
  }),
  emissiveTexture: Material.Texture.Video({
    videoPlayerEntity: screen
  }),
  emissiveColor: Color4.White(),
  emissiveIntensity: 1
})
```

## Modifying glTF Materials

Override materials on imported models:

```typescript
import { GltfContainerLoadingState, MaterialOverrides } from '@dcl/sdk/ecs'

// Wait for model to load
engine.addSystem(() => {
  const loadState = GltfContainerLoadingState.getOrNull(entity)
  if (loadState?.currentState === 'finished') {
    // Override material by name
    MaterialOverrides.create(entity, {
      overrides: [
        {
          materialName: 'OriginalMaterial',
          material: {
            $case: 'pbr',
            pbr: {
              albedoColor: Color4.Red()
            }
          }
        }
      ]
    })
  }
})
```

## Texture Requirements

| Property | Requirement |
|----------|-------------|
| Format | PNG, JPG |
| Size | Power of 2 (256, 512, 1024) |
| Max size | 512px (compressed by explorer) |
| Recommended | 512x512 optimal |

## Limits per Parcel

| Resource | Formula |
|----------|---------|
| Materials | log2(n+1) x 20 |
| Textures | log2(n+1) x 10 |

Where `n` = number of parcels

## Best Practices

1. **Use texture atlases**: Combine multiple textures to reduce material count
2. **Prefer Alpha Test**: Use cutout transparency over blend for performance
3. **Power of 2 textures**: Always use 256, 512, or 1024 pixel dimensions
4. **Reuse materials**: Share materials across entities when possible
5. **Optimize metallic/roughness**: Use appropriate values for material type
