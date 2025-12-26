# Colliders & Raycasting

## Colliders Overview

Colliders define invisible boundaries for:
- **Physics**: Blocking player movement
- **Pointer**: Enabling click/hover detection
- **Raycasting**: Detecting line intersections

## Collision Layers

```typescript
import { ColliderLayer } from '@dcl/sdk/ecs'

ColliderLayer.CL_NONE       // No collision
ColliderLayer.CL_POINTER    // Responds to pointer events
ColliderLayer.CL_PHYSICS    // Blocks player movement
ColliderLayer.CL_CUSTOM1    // Custom layer 1
ColliderLayer.CL_CUSTOM2    // Custom layer 2
// ... through CL_CUSTOM8
```

Combine layers with bitwise OR:
```typescript
ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER
```

## MeshCollider Component

Add primitive colliders to entities:

```typescript
import { engine, MeshCollider, ColliderLayer } from '@dcl/sdk/ecs'

const entity = engine.addEntity()

// Box collider
MeshCollider.setBox(entity)

// Sphere collider
MeshCollider.setSphere(entity)

// Cylinder collider
MeshCollider.setCylinder(entity)

// Plane collider
MeshCollider.setPlane(entity)

// With specific layer
MeshCollider.setBox(entity, ColliderLayer.CL_POINTER)

// Multiple layers
MeshCollider.setBox(entity, ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER)
```

## glTF Model Colliders

### Embedded Colliders

Models can include collider meshes named `*_collider`:

```
model.glb
├── visible_mesh
└── visible_mesh_collider (invisible collider geometry)
```

### Collision Masks in GltfContainer

```typescript
GltfContainer.create(entity, {
  src: 'model.glb',

  // Use visible geometry as collider
  visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,

  // Use embedded _collider meshes
  invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER
})
```

## Raycasting

Cast invisible lines through space to detect collisions.

### Raycast System Registration

```typescript
import { engine, raycastSystem, RaycastQueryType, ColliderLayer } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

// Cast ray in local direction (relative to entity rotation)
raycastSystem.registerLocalDirectionRaycast(
  {
    entity: sourceEntity,
    opts: {
      queryType: RaycastQueryType.RQT_HIT_FIRST,
      direction: Vector3.Forward(),
      maxDistance: 16,
      collisionMask: ColliderLayer.CL_PHYSICS
    }
  },
  (hit) => {
    if (hit.hits.length > 0) {
      console.log('Hit entity:', hit.hits[0].entityId)
      console.log('Hit position:', hit.hits[0].position)
    }
  }
)
```

### Raycast Types

```typescript
// Local direction (relative to entity)
raycastSystem.registerLocalDirectionRaycast(opts, callback)

// Global direction (world space)
raycastSystem.registerGlobalDirectionRaycast(opts, callback)

// To global position
raycastSystem.registerGlobalTargetRaycast(opts, callback)

// To another entity
raycastSystem.registerTargetEntityRaycast(opts, callback)
```

### Raycast Options

```typescript
{
  entity: sourceEntity,
  opts: {
    // Ray behavior
    queryType: RaycastQueryType.RQT_HIT_FIRST,  // First hit only
    queryType: RaycastQueryType.RQT_QUERY_ALL,  // All hits

    // Direction/target (depends on raycast type)
    direction: Vector3.Forward(),
    targetPosition: Vector3.create(10, 0, 10),
    targetEntity: targetEntity,

    // Distance
    maxDistance: 16,  // Default: 16 meters

    // Origin offset from entity
    originOffset: Vector3.create(0, 1, 0),

    // Collision filtering
    collisionMask: ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER,

    // Continuous vs one-time
    continuous: false  // true = every frame (expensive!)
  }
}
```

### Raycast Hit Data

```typescript
hit.hits[0].entityId    // Entity that was hit
hit.hits[0].position    // World position of intersection
hit.hits[0].length      // Distance from origin to hit
hit.hits[0].meshName    // Name of mesh hit
hit.hits[0].normalHit   // Surface normal (as Quaternion)
```

### One-Time Raycast

For single raycasts (not continuous):

```typescript
raycastSystem.registerGlobalDirectionRaycast(
  {
    entity: sourceEntity,
    opts: {
      queryType: RaycastQueryType.RQT_HIT_FIRST,
      direction: Vector3.Forward(),
      maxDistance: 50,
      continuous: false  // Run once
    }
  },
  (hit) => {
    // Handle result
  }
)
```

### Continuous Raycast (Use Sparingly)

```typescript
raycastSystem.registerLocalDirectionRaycast(
  {
    entity: sourceEntity,
    opts: {
      queryType: RaycastQueryType.RQT_HIT_FIRST,
      direction: Vector3.Forward(),
      continuous: true  // Runs every frame - expensive!
    }
  },
  (hit) => {
    // Updated every frame
  }
)
```

## Example: Shooting Mechanic

```typescript
import { engine, raycastSystem, RaycastQueryType, ColliderLayer, Transform } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'

function shoot(fromEntity: Entity) {
  const transform = Transform.get(fromEntity)

  raycastSystem.registerGlobalDirectionRaycast(
    {
      entity: fromEntity,
      opts: {
        queryType: RaycastQueryType.RQT_HIT_FIRST,
        direction: getForwardDirection(transform.rotation),
        maxDistance: 100,
        originOffset: Vector3.create(0, 1.5, 0),  // Eye level
        collisionMask: ColliderLayer.CL_PHYSICS,
        continuous: false
      }
    },
    (result) => {
      if (result.hits.length > 0) {
        const hit = result.hits[0]
        console.log('Shot hit:', hit.entityId)

        // Apply damage to hit entity
        if (HealthComponent.has(hit.entityId)) {
          const health = HealthComponent.getMutable(hit.entityId)
          health.current -= 25
        }
      }
    }
  )
}

function getForwardDirection(rotation: Quaternion): Vector3 {
  // Convert quaternion to forward vector
  return Vector3.rotate(Vector3.Forward(), rotation)
}
```

## Performance Tips

1. **Avoid continuous raycasts**: Run every frame = expensive
2. **Use intervals**: Raycast every 0.2s instead of every frame
3. **Limit max distance**: Shorter rays = faster
4. **Simple colliders**: Use basic shapes, not detailed meshes
5. **Filter with collision masks**: Only check relevant layers
