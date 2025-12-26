# Tweens & Movement

## Overview

Tweens provide smooth, automatic transitions for position, rotation, or scale over time. The engine handles all intermediate frames.

## Tween Component

```typescript
import { engine, Transform, Tween, EasingFunction } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
```

## Move Tween

Smoothly move an entity from one position to another:

```typescript
const entity = engine.addEntity()

Transform.create(entity, {
  position: Vector3.create(3, 0, 3)
})

Tween.create(entity, {
  mode: Tween.Mode.Move({
    start: Vector3.create(3, 0, 3),
    end: Vector3.create(8, 0, 8)
  }),
  duration: 5000,  // 5 seconds in milliseconds
  easingFunction: EasingFunction.EF_LINEAR
})
```

## Rotate Tween

Smoothly rotate an entity:

```typescript
Tween.create(entity, {
  mode: Tween.Mode.Rotate({
    start: Quaternion.fromEulerDegrees(0, 0, 0),
    end: Quaternion.fromEulerDegrees(0, 180, 0)
  }),
  duration: 2000,
  easingFunction: EasingFunction.EF_EASEOUTQUAD
})
```

## Scale Tween

Smoothly scale an entity:

```typescript
Tween.create(entity, {
  mode: Tween.Mode.Scale({
    start: Vector3.One(),
    end: Vector3.Zero()
  }),
  duration: 500,
  easingFunction: EasingFunction.EF_EASEINBOUNCE
})
```

## Easing Functions

Control the acceleration/deceleration of the tween:

```typescript
EasingFunction.EF_LINEAR           // Constant speed
EasingFunction.EF_EASEINQUAD       // Accelerate
EasingFunction.EF_EASEOUTQUAD      // Decelerate
EasingFunction.EF_EASEQUAD         // Accelerate then decelerate
EasingFunction.EF_EASEINSINE       // Gentle acceleration
EasingFunction.EF_EASEOUTSINE      // Gentle deceleration
EasingFunction.EF_EASEINEXPO       // Exponential acceleration
EasingFunction.EF_EASEOUTEXPO      // Exponential deceleration
EasingFunction.EF_EASEINELASTIC    // Elastic start
EasingFunction.EF_EASEOUTELASTIC   // Elastic end
EasingFunction.EF_EASEINBOUNCE     // Bounce start
EasingFunction.EF_EASEOUTBOUNCE    // Bounce end
```

## Tween Limitations

**Important**: An entity can only have **one Tween component** at a time, performing **one transformation type**.

### Workaround: Parented Entities

For multiple simultaneous transformations, use parent-child hierarchy:

```typescript
// Parent entity rotates
const parent = engine.addEntity()
Transform.create(parent, { position: Vector3.create(8, 0, 8) })

Tween.create(parent, {
  mode: Tween.Mode.Rotate({
    start: Quaternion.Identity(),
    end: Quaternion.fromEulerDegrees(0, 360, 0)
  }),
  duration: 3000,
  easingFunction: EasingFunction.EF_LINEAR
})

// Child entity scales
const child = engine.addEntity()
Transform.create(child, {
  parent: parent,
  position: Vector3.Zero()
})
GltfContainer.create(child, { src: 'model.glb' })

Tween.create(child, {
  mode: Tween.Mode.Scale({
    start: Vector3.One(),
    end: Vector3.create(2, 2, 2)
  }),
  duration: 3000,
  easingFunction: EasingFunction.EF_EASEOUTQUAD
})
```

## Tween Sequences

Chain tweens using callbacks:

```typescript
import { TweenSequence, TweenState } from '@dcl/sdk/ecs'

// Create a sequence of tweens
TweenSequence.create(entity, {
  sequence: [
    {
      mode: Tween.Mode.Move({
        start: Vector3.create(0, 0, 0),
        end: Vector3.create(5, 0, 0)
      }),
      duration: 1000
    },
    {
      mode: Tween.Mode.Move({
        start: Vector3.create(5, 0, 0),
        end: Vector3.create(5, 0, 5)
      }),
      duration: 1000
    }
  ],
  loop: TweenLoop.TL_YOYO  // Ping-pong back and forth
})
```

## Loop Modes

```typescript
TweenLoop.TL_NONE      // Play once
TweenLoop.TL_RESTART   // Loop from beginning
TweenLoop.TL_YOYO      // Ping-pong (reverse at end)
```

## Manual Movement with Systems

For more control, move entities manually in a system:

```typescript
function MovementSystem(dt: number) {
  for (const [entity] of engine.getEntitiesWith(Transform, MovingComponent)) {
    const transform = Transform.getMutable(entity)
    const moving = MovingComponent.get(entity)

    // Move 2 meters per second
    const speed = 2
    transform.position.x += moving.direction.x * speed * dt
    transform.position.z += moving.direction.z * speed * dt
  }
}

engine.addSystem(MovementSystem)
```

## Lerp (Linear Interpolation)

For custom smooth movement:

```typescript
function lerpSystem(dt: number) {
  for (const [entity] of engine.getEntitiesWith(Transform, LerpComponent)) {
    const transform = Transform.getMutable(entity)
    const lerp = LerpComponent.getMutable(entity)

    lerp.progress += dt / lerp.duration

    if (lerp.progress >= 1) {
      transform.position = lerp.target
      LerpComponent.deleteFrom(entity)
    } else {
      transform.position = Vector3.lerp(
        lerp.start,
        lerp.target,
        lerp.progress
      )
    }
  }
}
```

## Best Practices

1. **Use tweens for simple animations**: Less code, optimized performance
2. **Systems for complex movement**: AI, physics, player-controlled
3. **Easing for polish**: Makes movement feel more natural
4. **Consider performance**: Many simultaneous tweens can impact frame rate
5. **Clean up tweens**: Remove Tween component when done if not looping
