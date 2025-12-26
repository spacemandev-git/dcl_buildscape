# Entities & Components

## Entity-Component-System Architecture

Decentraland SDK7 uses an Entity-Component-System (ECS) architecture:

- **Entities**: Abstract identifiers that group components together
- **Components**: Data containers that define entity properties
- **Systems**: Functions that process entities with specific components

## Creating Entities

```typescript
import { engine } from '@dcl/sdk/ecs'

// Create a new entity
const myEntity = engine.addEntity()

// Remove an entity
engine.removeEntity(myEntity)
```

## Built-in Components

### Core Components

| Component | Purpose |
|-----------|---------|
| `Transform` | Position, rotation, scale |
| `GltfContainer` | 3D model from glTF/glb file |
| `MeshRenderer` | Primitive shapes (cube, sphere, etc.) |
| `MeshCollider` | Collision detection |
| `Material` | Colors, textures, PBR properties |
| `Animator` | 3D model animations |
| `AudioSource` | Sound playback |
| `VideoPlayer` | Video playback |
| `TextShape` | 3D text |
| `PointerEvents` | Click/hover detection |
| `Tween` | Smooth animations |

### Adding Components

```typescript
import { engine, Transform, GltfContainer, MeshRenderer, Material } from '@dcl/sdk/ecs'
import { Vector3, Color4 } from '@dcl/sdk/math'

const entity = engine.addEntity()

// Add Transform
Transform.create(entity, {
  position: Vector3.create(8, 0, 8),
  rotation: Quaternion.fromEulerDegrees(0, 45, 0),
  scale: Vector3.One()
})

// Add 3D model
GltfContainer.create(entity, {
  src: 'assets/scene/model.glb'
})

// OR add primitive shape
MeshRenderer.setBox(entity)

// Add material to primitive
Material.setPbrMaterial(entity, {
  albedoColor: Color4.Red()
})
```

## Reading Components

```typescript
// Read-only access (better performance)
const transform = Transform.get(entity)
console.log(transform.position)

// Check if entity has component
if (Transform.has(entity)) {
  // Entity has Transform
}

// Get or null
const transform = Transform.getOrNull(entity)
if (transform) {
  // Use transform
}
```

## Modifying Components

```typescript
// Get mutable reference
const mutableTransform = Transform.getMutable(entity)
mutableTransform.position.x += 1

// Create or replace
Transform.createOrReplace(entity, {
  position: Vector3.create(0, 0, 0)
})

// Delete component
Transform.deleteFrom(entity)
```

## Component Queries

Query entities that have specific components:

```typescript
// Get all entities with Transform and GltfContainer
for (const [entity] of engine.getEntitiesWith(Transform, GltfContainer)) {
  const transform = Transform.get(entity)
  // Process entity
}

// With mutable access
for (const [entity, transform] of engine.getEntitiesWith(Transform)) {
  const mutable = Transform.getMutable(entity)
  mutable.position.y += 0.1
}
```

## Entity Naming (Scene Editor)

Reference entities created in Scene Editor by name:

```typescript
// Get entity by name (may be null)
const crate = engine.getEntityOrNullByName('Yellow Crate')

if (crate) {
  // Apply logic to the entity
  Transform.getMutable(crate).position.y += 1
}
```

## Reserved Entities

```typescript
// Player's avatar
engine.PlayerEntity

// Camera
engine.CameraEntity

// Root entity (scene origin)
engine.RootEntity
```

## Best Practices

1. **Use read-only access** (`get()`) when you don't need to modify data
2. **Query efficiently**: Use `engine.getEntitiesWith()` instead of iterating all entities
3. **Component organization**: Keep related components together
4. **Entity lifecycle**: Remove entities when no longer needed to free resources
5. **Avoid on load**: Don't access `PlayerEntity` or `CameraEntity` during initial loading
