# Input Events & Interactions

## Overview

Decentraland SDK7 provides systems for detecting player input:
- Pointer events (clicks, hover)
- Button events (keyboard, controller)
- Global input (not targeting specific entities)

## Pointer Events System

The recommended way to handle clicks on entities:

```typescript
import { engine, pointerEventsSystem, InputAction } from '@dcl/sdk/ecs'

// Register click handler
pointerEventsSystem.onPointerDown(
  {
    entity: myEntity,
    opts: {
      button: InputAction.IA_POINTER,
      hoverText: 'Click me'
    }
  },
  function () {
    console.log('Entity clicked!')
  }
)
```

## Pointer Event Types

```typescript
// Mouse/pointer down
pointerEventsSystem.onPointerDown(options, callback)

// Mouse/pointer up
pointerEventsSystem.onPointerUp(options, callback)

// Hover enter (start pointing at entity)
pointerEventsSystem.onPointerHover(options, callback)
```

## Pointer Options

```typescript
{
  entity: myEntity,
  opts: {
    button: InputAction.IA_POINTER,    // Which button triggers event
    hoverText: 'Interact',             // Text shown on hover
    maxDistance: 10,                   // Max interaction distance (meters)
    hideFeedback: false                // Hide hover hint and highlight
  }
}
```

## Input Actions

```typescript
InputAction.IA_POINTER    // Left mouse / primary click
InputAction.IA_PRIMARY    // E key
InputAction.IA_SECONDARY  // F key
InputAction.IA_ACTION_3   // Key 1
InputAction.IA_ACTION_4   // Key 2
InputAction.IA_ACTION_5   // Key 3
InputAction.IA_ACTION_6   // Key 4
InputAction.IA_JUMP       // Space
InputAction.IA_WALK       // Shift
InputAction.IA_FORWARD    // W
InputAction.IA_BACKWARD   // S
InputAction.IA_LEFT       // A
InputAction.IA_RIGHT      // D
```

## Collider Requirements

**Important**: Entities must have a collider to receive pointer events:

```typescript
import { MeshCollider, ColliderLayer } from '@dcl/sdk/ecs'

// Add pointer-responsive collider
MeshCollider.setBox(entity, ColliderLayer.CL_POINTER)

// For glTF models, configure in GltfContainer
GltfContainer.create(entity, {
  src: 'model.glb',
  visibleMeshesCollisionMask: ColliderLayer.CL_POINTER
})
```

## PointerEvents Component

For more control, use the PointerEvents component directly:

```typescript
import { PointerEvents, PointerEventType } from '@dcl/sdk/ecs'

PointerEvents.create(entity, {
  pointerEvents: [
    {
      eventType: PointerEventType.PET_DOWN,
      eventInfo: {
        button: InputAction.IA_POINTER,
        hoverText: 'Pick up',
        maxDistance: 5
      }
    },
    {
      eventType: PointerEventType.PET_HOVER_ENTER,
      eventInfo: {
        button: InputAction.IA_ANY,
        hoverText: 'Looking at item'
      }
    }
  ]
})
```

## System-Based Input Checking

Check input state every frame in a system:

```typescript
import { inputSystem, InputAction, PointerEventType } from '@dcl/sdk/ecs'

function InputCheckSystem() {
  // Check if button was just pressed this frame
  if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
    console.log('E key pressed')
  }

  // Check if button is currently held
  if (inputSystem.isPressed(InputAction.IA_POINTER)) {
    console.log('Mouse button held')
  }

  // Get hit info for targeted entity
  const hitInfo = inputSystem.getInputCommand(
    InputAction.IA_POINTER,
    PointerEventType.PET_DOWN
  )

  if (hitInfo && hitInfo.hit) {
    console.log('Hit entity:', hitInfo.hit.entityId)
    console.log('Hit position:', hitInfo.hit.position)
  }
}

engine.addSystem(InputCheckSystem)
```

## Global Input (No Target)

Detect input anywhere, not just on entities:

```typescript
import { inputSystem } from '@dcl/sdk/ecs'

engine.addSystem(() => {
  // E key pressed anywhere
  if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
    // Open inventory, toggle menu, etc.
  }

  // Movement keys
  if (inputSystem.isPressed(InputAction.IA_FORWARD)) {
    // W key held
  }
})
```

## Pointer Hit Data

When an entity is clicked, you get detailed hit information:

```typescript
pointerEventsSystem.onPointerDown(
  { entity: myEntity, opts: { button: InputAction.IA_POINTER } },
  (event) => {
    console.log('Hit entity:', event.hit?.entityId)
    console.log('Hit position:', event.hit?.position)  // World coordinates
    console.log('Hit normal:', event.hit?.normalHit)   // Surface normal
    console.log('Ray origin:', event.hit?.origin)      // Camera position
    console.log('Ray direction:', event.hit?.direction)
  }
)
```

## Remove Event Handlers

```typescript
// Remove specific handler
pointerEventsSystem.removeOnPointerDown(entity)
pointerEventsSystem.removeOnPointerUp(entity)

// Or delete the PointerEvents component
PointerEvents.deleteFrom(entity)
```

## Example: Interactive Button

```typescript
const button = engine.addEntity()

Transform.create(button, {
  position: Vector3.create(8, 1, 8)
})

MeshRenderer.setBox(button)
MeshCollider.setBox(button, ColliderLayer.CL_POINTER)

Material.setPbrMaterial(button, {
  albedoColor: Color4.Red()
})

let isOn = false

pointerEventsSystem.onPointerDown(
  {
    entity: button,
    opts: { button: InputAction.IA_POINTER, hoverText: 'Toggle' }
  },
  () => {
    isOn = !isOn
    Material.setPbrMaterial(button, {
      albedoColor: isOn ? Color4.Green() : Color4.Red()
    })
  }
)
```

## Best Practices

1. **Always add colliders**: No collider = no pointer events
2. **Set maxDistance**: Prevent interactions from far away
3. **Clear hover text**: Help players understand what they can do
4. **Use appropriate buttons**: IA_POINTER for main actions, IA_PRIMARY/SECONDARY for alternatives
5. **Global vs targeted**: Use systems for global input, pointerEventsSystem for entity-specific
