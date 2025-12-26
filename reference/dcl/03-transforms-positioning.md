# Transform & Positioning

## Transform Component

The `Transform` component controls an entity's position, rotation, and scale in 3D space.

```typescript
import { engine, Transform } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'

const entity = engine.addEntity()

Transform.create(entity, {
  position: Vector3.create(8, 0, 8),
  rotation: Quaternion.fromEulerDegrees(0, 45, 0),
  scale: Vector3.create(1, 1, 1)
})
```

## Position (Vector3)

Position is measured in meters from the scene's origin (base parcel corner).

```typescript
// Create position
const pos = Vector3.create(x, y, z)

// Common positions
Vector3.Zero()      // (0, 0, 0)
Vector3.One()       // (1, 1, 1)
Vector3.Up()        // (0, 1, 0)
Vector3.Down()      // (0, -1, 0)
Vector3.Forward()   // (0, 0, 1)
Vector3.Backward()  // (0, 0, -1)
Vector3.Left()      // (-1, 0, 0)
Vector3.Right()     // (1, 0, 0)

// Vector operations
Vector3.add(v1, v2)
Vector3.subtract(v1, v2)
Vector3.scale(v1, scalar)
Vector3.normalize(v1)
Vector3.distance(v1, v2)
Vector3.lerp(v1, v2, amount)  // Linear interpolation
```

### Scene Coordinates

- Single parcel: 16m x 16m (x and z axes)
- Height: Variable based on parcels (log2(n+1) x 20 meters)
- Y-axis: Up direction
- Origin: Southwest corner of base parcel

```typescript
// Center of single parcel scene
Vector3.create(8, 0, 8)

// Center of 2x2 parcel scene
Vector3.create(16, 0, 16)
```

## Rotation (Quaternion)

```typescript
// From Euler angles (degrees)
Quaternion.fromEulerDegrees(pitch, yaw, roll)

// Identity (no rotation)
Quaternion.Identity()

// Rotate to look at target
Quaternion.fromLookAt(position, targetPosition)

// Common rotations
Quaternion.fromEulerDegrees(0, 90, 0)   // 90° around Y
Quaternion.fromEulerDegrees(45, 0, 0)   // 45° around X

// Operations
Quaternion.multiply(q1, q2)
Quaternion.slerp(q1, q2, amount)  // Spherical interpolation
```

## Scale

```typescript
// Uniform scale
Vector3.create(2, 2, 2)  // Double size

// Non-uniform scale
Vector3.create(1, 2, 1)  // Stretched vertically

// Common scales
Vector3.One()   // (1, 1, 1) - default
Vector3.Zero()  // (0, 0, 0) - invisible
```

## Parenting (Hierarchy)

Attach entities to parents for relative positioning:

```typescript
const parent = engine.addEntity()
Transform.create(parent, {
  position: Vector3.create(8, 0, 8)
})

const child = engine.addEntity()
Transform.create(child, {
  position: Vector3.create(0, 1, 0),  // 1 meter above parent
  parent: parent
})

// Child moves with parent
// Child's world position = parent position + child local position
```

### Parenting to Player/Camera

```typescript
// Attach to player (follows avatar)
Transform.create(entity, {
  position: Vector3.create(0, 0.5, 0),
  parent: engine.PlayerEntity
})

// Attach to camera (first-person HUD)
Transform.create(entity, {
  position: Vector3.create(0, 0, 1),
  parent: engine.CameraEntity
})
```

## Modifying Transform

```typescript
// Get mutable reference
const transform = Transform.getMutable(entity)

// Modify position
transform.position.x += 1
transform.position = Vector3.create(10, 0, 10)

// Modify rotation
transform.rotation = Quaternion.fromEulerDegrees(0, 90, 0)

// Modify scale
transform.scale = Vector3.create(2, 2, 2)
```

## World vs Local Coordinates

```typescript
// For parented entities, Transform stores LOCAL coordinates
// To get world coordinates, you need to calculate:

function getWorldPosition(entity: Entity): Vector3 {
  const transform = Transform.get(entity)

  if (transform.parent) {
    const parentWorld = getWorldPosition(transform.parent)
    return Vector3.add(parentWorld, transform.position)
  }

  return transform.position
}
```

## Best Practices

1. **Center your scene**: Place main content around the center of parcels
2. **Stay in bounds**: All models must fit within parcel boundaries
3. **Use parenting**: Group related entities for easier movement
4. **Avoid underground**: Players can't go below y = 0
5. **Consider scale**: Large scales increase triangle count for collision
