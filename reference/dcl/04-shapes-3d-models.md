# Shapes & 3D Models

## 3D Model Formats

Decentraland supports **glTF** format (GL Transmission Format):

- `.gltf` - Human-readable JSON format (good for debugging)
- `.glb` - Binary format, smaller file size (recommended for deployment)

### Model Requirements

- All models must be in glTF/glb format
- Models can include embedded textures, materials, colliders, and animations
- Texture sizes must be power of 2 (256, 512, 1024, etc.)
- Maximum texture size: 512px (compressed by explorer)

## GltfContainer Component

Load external 3D models:

```typescript
import { engine, Transform, GltfContainer } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

const entity = engine.addEntity()

Transform.create(entity, {
  position: Vector3.create(8, 0, 8)
})

GltfContainer.create(entity, {
  src: 'assets/scene/model.glb'
})
```

### GltfContainer Properties

```typescript
GltfContainer.create(entity, {
  src: 'assets/scene/model.glb',

  // Collision settings
  visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
  invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER
})
```

### Collision Masks

- `ColliderLayer.CL_PHYSICS` - Blocks player movement
- `ColliderLayer.CL_POINTER` - Responds to pointer/click events
- `ColliderLayer.CL_CUSTOM1` through `CL_CUSTOM8` - Custom layers

## Primitive Shapes (MeshRenderer)

Create basic geometric shapes without external models:

```typescript
import { engine, MeshRenderer, MeshCollider } from '@dcl/sdk/ecs'

const entity = engine.addEntity()

// Box
MeshRenderer.setBox(entity)

// Sphere
MeshRenderer.setSphere(entity)

// Cylinder
MeshRenderer.setCylinder(entity)

// Plane
MeshRenderer.setPlane(entity)

// Add collider for physics/pointer
MeshCollider.setBox(entity)
```

### Primitive Properties

```typescript
// Box with UV mapping
MeshRenderer.setBox(entity, [
  // UV coordinates for each face (6 faces, 4 corners each)
])

// Cylinder with custom settings
MeshRenderer.setCylinder(entity, radiusTop, radiusBottom)
```

## Colliders

### Embedded Colliders (in glTF)

Models can include invisible collider meshes named `*_collider`:
- `house_collider` for a model named `house`
- Must be simpler geometry than visible mesh

### MeshCollider Component

Add primitive colliders via code:

```typescript
// Box collider
MeshCollider.setBox(entity)

// Sphere collider
MeshCollider.setSphere(entity)

// Cylinder collider
MeshCollider.setCylinder(entity)

// Plane collider
MeshCollider.setPlane(entity)
```

### Collision Layers

```typescript
MeshCollider.setBox(entity, ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER)

// Physics only (blocks movement, not clickable)
MeshCollider.setBox(entity, ColliderLayer.CL_PHYSICS)

// Pointer only (clickable, doesn't block movement)
MeshCollider.setBox(entity, ColliderLayer.CL_POINTER)
```

## Visibility Control

```typescript
import { VisibilityComponent } from '@dcl/sdk/ecs'

// Hide entity
VisibilityComponent.create(entity, { visible: false })

// Show entity
VisibilityComponent.getMutable(entity).visible = true
```

## Billboard Component

Make entity always face the camera:

```typescript
import { Billboard, BillboardMode } from '@dcl/sdk/ecs'

Billboard.create(entity, {
  billboardMode: BillboardMode.BM_Y  // Rotate only around Y axis
})

// Billboard modes:
// BM_NONE - No billboard
// BM_X - Rotate around X axis
// BM_Y - Rotate around Y axis (common for signs)
// BM_Z - Rotate around Z axis
// BM_ALL - Rotate around all axes (always face camera)
```

## 3D Text (TextShape)

```typescript
import { TextShape, Font } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'

const entity = engine.addEntity()

Transform.create(entity, {
  position: Vector3.create(8, 2, 8)
})

TextShape.create(entity, {
  text: 'Hello World',
  fontSize: 3,
  textColor: Color4.White(),
  font: Font.F_SANS_SERIF,
  textAlign: TextAlignMode.TAM_MIDDLE_CENTER
})
```

## Best Practices

1. **Use .glb for production**: Smaller file size, faster loading
2. **Optimize models**: Reduce polygon count, use texture atlases
3. **Simple colliders**: Use basic shapes for collision, not detailed meshes
4. **Check limits**: Monitor triangle/texture counts against scene limits
5. **Test visibility**: Ensure models fit within parcel boundaries
