# Animations

## Overview

Decentraland supports two types of 3D model animations:

- **Skeletal Animations**: Use bone structures to animate meshes (most common)
- **Vertex Animations**: Directly animate vertex positions (no skeleton needed)

Animations must be embedded in the glTF/glb model file.

## Animator Component

Control animations with the `Animator` component:

```typescript
import { engine, Transform, GltfContainer, Animator } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

const entity = engine.addEntity()

Transform.create(entity, {
  position: Vector3.create(8, 0, 8)
})

GltfContainer.create(entity, {
  src: 'assets/scene/character.glb'
})

Animator.create(entity, {
  states: [
    {
      clip: 'idle',
      playing: true,
      loop: true
    },
    {
      clip: 'walk',
      playing: false,
      loop: true
    },
    {
      clip: 'attack',
      playing: false,
      loop: false
    }
  ]
})
```

## Animation State Properties

```typescript
{
  clip: 'animationName',   // Name of animation clip in model
  playing: true,           // Is animation playing? (default: false)
  loop: true,              // Should animation loop? (default: true)
  speed: 1.0,              // Playback speed (0.5 = half, 2 = double)
  weight: 1.0,             // Blend weight 0-1 (for layered animations)
  shouldReset: false       // Reset to first frame when non-looping ends
}
```

## Playing Animations

### Play Single Animation

```typescript
// Play one animation, stop all others
Animator.playSingleAnimation(entity, 'walk')

// Play from beginning
Animator.playSingleAnimation(entity, 'walk', true)

// Resume from pause point
Animator.playSingleAnimation(entity, 'walk', false)
```

### Stop Animations

```typescript
// Stop all animations
Animator.stopAllAnimations(entity)

// Stop and reset to first frame
Animator.stopAllAnimations(entity, true)

// Stop but keep current pose
Animator.stopAllAnimations(entity, false)
```

### Get Animation Clip

```typescript
// Get mutable animation state
const walkClip = Animator.getClip(entity, 'walk')

if (walkClip) {
  walkClip.playing = true
  walkClip.speed = 2.0
}
```

## Animation Blending

Multiple animations can play simultaneously on different bones:

```typescript
Animator.create(entity, {
  states: [
    {
      clip: 'walk',
      playing: true,
      loop: true,
      weight: 0.5  // 50% influence
    },
    {
      clip: 'wave',
      playing: true,
      loop: true,
      weight: 0.5  // 50% influence
    }
  ]
})
```

**Important**: Total weight of all active animations affecting the same bones should not exceed 1.0. Remaining weight shows the armature's default pose.

## Smooth Transitions

For natural transitions between animations:

```typescript
function transitionAnimation(entity: Entity, from: string, to: string, duration: number) {
  const fromClip = Animator.getClip(entity, from)
  const toClip = Animator.getClip(entity, to)

  if (!fromClip || !toClip) return

  toClip.playing = true
  toClip.weight = 0

  let elapsed = 0

  engine.addSystem((dt) => {
    elapsed += dt
    const progress = Math.min(elapsed / duration, 1)

    fromClip.weight = 1 - progress
    toClip.weight = progress

    if (progress >= 1) {
      fromClip.playing = false
      // Remove this system
    }
  })
}
```

## Animation Events

Trigger actions when animations complete:

```typescript
import { Animator, AnimatorEvent } from '@dcl/sdk/ecs'

// Subscribe to animation events
Animator.onChange(entity, (animator) => {
  const attackClip = animator.states.find(s => s.clip === 'attack')
  if (attackClip && !attackClip.playing) {
    // Attack animation finished
    Animator.playSingleAnimation(entity, 'idle')
  }
})
```

## Checking Model Animations

Before using animations, verify they exist:

1. **VS Code**: Install "GLTF Tools" extension
2. **Babylon Sandbox**: Drag model to https://sandbox.babylonjs.com/
3. **Text Editor**: Open .gltf file and search for `"animations":`

## Animation Tips

1. **Name clips clearly**: Use descriptive names in your 3D modeling software
2. **Embed animations**: Animations must be inside the glTF file
3. **Loop settings**: Configure loop in code, not just the model
4. **Performance**: Limit active animations for better performance
5. **Weight management**: Always ensure weights sum to ≤ 1.0
6. **Speed variations**: Use speed property for slow-motion or fast-forward effects

## Example: Animation State Machine

```typescript
type AnimState = 'idle' | 'walk' | 'run' | 'attack'

function setAnimState(entity: Entity, state: AnimState) {
  Animator.stopAllAnimations(entity)

  const clip = Animator.getClip(entity, state)
  if (clip) {
    clip.playing = true
    clip.loop = state !== 'attack'  // Attack doesn't loop
  }
}

// Usage
setAnimState(character, 'walk')
```
