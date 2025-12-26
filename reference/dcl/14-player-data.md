# Player Data

## Reserved Entities

SDK7 provides special entities for player and camera:

```typescript
engine.PlayerEntity   // The player's avatar
engine.CameraEntity   // The camera
engine.RootEntity     // Scene root (origin)
```

## Player Position & Rotation

```typescript
import { engine, Transform } from '@dcl/sdk/ecs'

function getPlayerData() {
  // Always access inside main() or a system
  if (!Transform.has(engine.PlayerEntity)) return

  const playerTransform = Transform.get(engine.PlayerEntity)

  // Position (at chest height, ~0.88m above ground)
  const position = playerTransform.position
  console.log(`Player at: ${position.x}, ${position.y}, ${position.z}`)

  // Rotation (direction facing)
  const rotation = playerTransform.rotation
}

engine.addSystem(getPlayerData)
```

## Camera Position & Rotation

```typescript
function getCameraData() {
  if (!Transform.has(engine.CameraEntity)) return

  const cameraTransform = Transform.get(engine.CameraEntity)

  // 1st person: Eye level (~1.75m above ground)
  // 3rd person: Varies based on camera movement
  const cameraPos = cameraTransform.position
  const cameraRot = cameraTransform.rotation
}
```

## Camera Mode

Detect first/third person camera:

```typescript
import { CameraMode, CameraType } from '@dcl/sdk/ecs'

function checkCameraMode() {
  const cameraMode = CameraMode.get(engine.CameraEntity)

  if (cameraMode.mode === CameraType.CT_FIRST_PERSON) {
    console.log('First person view')
  } else if (cameraMode.mode === CameraType.CT_THIRD_PERSON) {
    console.log('Third person view')
  }
}
```

## Player Profile Data

Get player account information:

```typescript
import { getPlayer } from '@dcl/sdk/src/players'

export function main() {
  const player = getPlayer()

  if (player) {
    console.log('Name:', player.name)
    console.log('User ID:', player.userId)
    console.log('Is Guest:', player.isGuest)

    // Avatar appearance
    console.log('Body Shape:', player.avatar?.bodyShapeUrn)
    console.log('Skin Color:', player.avatar?.skinColor)
    console.log('Eye Color:', player.avatar?.eyesColor)
    console.log('Hair Color:', player.avatar?.hairColor)

    // Equipped items
    console.log('Wearables:', player.wearables)
    console.log('Emotes:', player.emotes)
  }
}
```

## Pointer/Cursor Position

Track cursor movement:

```typescript
import { PrimaryPointerInfo } from '@dcl/sdk/ecs'

function getCursorInfo() {
  const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)

  // Screen coordinates (0-1)
  const screenPos = pointerInfo.screenCoordinates

  // Screen delta (movement since last frame)
  const delta = pointerInfo.screenDelta

  // World ray direction
  const rayDir = pointerInfo.worldRayDirection

  // Pointer type
  const type = pointerInfo.pointerType
}
```

## Pointer Lock Status

```typescript
import { PointerLock } from '@dcl/sdk/ecs'

function isPointerLocked() {
  const lockState = PointerLock.get(engine.CameraEntity)
  return lockState.isPointerLocked
}
```

## Attach to Player/Camera

### Follow Player

```typescript
const followingEntity = engine.addEntity()

Transform.create(followingEntity, {
  position: Vector3.create(0, 2, 0),  // 2 meters above player
  parent: engine.PlayerEntity
})

GltfContainer.create(followingEntity, {
  src: 'assets/floating-icon.glb'
})
```

### First-Person HUD

```typescript
const hudElement = engine.addEntity()

Transform.create(hudElement, {
  position: Vector3.create(0.3, -0.2, 1),  // Bottom-right of view
  scale: Vector3.create(0.1, 0.1, 0.1),
  parent: engine.CameraEntity
})

GltfContainer.create(hudElement, {
  src: 'assets/gun-model.glb'
})
```

## Camera Mode Areas

Force camera mode in specific areas:

```typescript
import { CameraModeArea, CameraType } from '@dcl/sdk/ecs'

const cameraZone = engine.addEntity()

Transform.create(cameraZone, {
  position: Vector3.create(8, 2, 8),
  scale: Vector3.create(10, 4, 10)  // Area size
})

CameraModeArea.create(cameraZone, {
  mode: CameraType.CT_FIRST_PERSON,  // Force first person
  area: Vector3.create(10, 4, 10)
})
```

## Avatar Modifier Areas

Modify avatar behavior in areas:

```typescript
import { AvatarModifierArea, AvatarModifierType } from '@dcl/sdk/ecs'

const modifierZone = engine.addEntity()

Transform.create(modifierZone, {
  position: Vector3.create(8, 2, 8)
})

AvatarModifierArea.create(modifierZone, {
  area: Vector3.create(10, 4, 10),
  modifiers: [
    AvatarModifierType.AMT_HIDE_AVATARS,      // Hide other players
    AvatarModifierType.AMT_DISABLE_PASSPORTS  // Disable clicking on avatars
  ]
})
```

## All Players in Scene

Get data for all connected players:

```typescript
import { PlayerIdentityData, AvatarBase } from '@dcl/sdk/ecs'

function getAllPlayers() {
  for (const [entity] of engine.getEntitiesWith(PlayerIdentityData, Transform)) {
    const identity = PlayerIdentityData.get(entity)
    const transform = Transform.get(entity)

    console.log('Player:', identity.address)
    console.log('Position:', transform.position)

    if (AvatarBase.has(entity)) {
      const avatar = AvatarBase.get(entity)
      console.log('Name:', avatar.name)
    }
  }
}
```

## Important Notes

1. **Avoid on load**: Don't access `PlayerEntity`/`CameraEntity` during initial loading
2. **Use in systems**: Always access inside `main()` or systems
3. **Check existence**: Use `Transform.has()` before accessing
4. **Position timing**: Values update each frame
5. **Realm isolation**: Players in different realms can't see each other
