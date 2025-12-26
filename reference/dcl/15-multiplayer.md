# Multiplayer & Networking

## Overview

Decentraland scenes run locally in each player's browser. By default, players see each other but interact with the environment independently.

Two approaches for syncing state:
1. **Serverless** (built-in): Uses Decentraland's communication servers
2. **Authoritative Server**: Your own server for game logic

## Serverless Multiplayer

### Sync Entities

Mark entities to sync across all players:

```typescript
import { syncEntity } from '@dcl/sdk/network'

const door = engine.addEntity()

Transform.create(door, {
  position: Vector3.create(8, 0, 8)
})

GltfContainer.create(door, {
  src: 'assets/door.glb'
})

// Sync this entity's components
syncEntity(door, [Transform.componentId, Animator.componentId])
```

### SyncEntity Options

```typescript
syncEntity(
  entity,
  [ComponentA.componentId, ComponentB.componentId],  // Components to sync
  entityId  // Optional: Unique ID for persistence
)
```

### Check Sync Status

```typescript
import { isStateSyncronized } from '@dcl/sdk/network'

engine.addSystem(() => {
  if (isStateSyncronized()) {
    // Player is synchronized with scene state
  } else {
    // Still loading/syncing
  }
})
```

## Message Bus

Send custom messages between players:

```typescript
import { MessageBus } from '@dcl/sdk/message-bus'

const messageBus = new MessageBus()

// Send message to all players
messageBus.emit('playerAction', {
  action: 'attack',
  targetId: 'enemy-1',
  damage: 25
})

// Listen for messages
messageBus.on('playerAction', (data, sender) => {
  console.log(`Player ${sender} performed: ${data.action}`)

  if (data.action === 'attack') {
    // Handle attack
  }
})
```

### Message Types

```typescript
// Simple message
messageBus.emit('ping', { timestamp: Date.now() })

// Player-specific data
messageBus.emit('chat', {
  message: 'Hello!',
  timestamp: Date.now()
})

// Game events
messageBus.emit('gameEvent', {
  type: 'scoreUpdate',
  playerId: 'player-123',
  newScore: 500
})
```

## Realms

Players exist in separate "realms" (communication servers). Players in different realms can't interact.

```typescript
import { getRealm } from '@dcl/sdk/runtime'

async function checkRealm() {
  const realm = await getRealm()

  console.log('Realm:', realm.realmInfo?.realmName)
  console.log('Base URL:', realm.realmInfo?.baseUrl)
  console.log('Network ID:', realm.realmInfo?.networkId)
}
```

## External Server (Authoritative)

### REST API

```typescript
async function fetchGameState() {
  const response = await fetch('https://your-server.com/api/gamestate')
  const data = await response.json()
  return data
}

async function sendPlayerAction(action: string) {
  await fetch('https://your-server.com/api/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  })
}
```

### WebSocket Connection

```typescript
import { WebSocketTransport } from '@dcl/sdk/network'

let socket: WebSocket

export function main() {
  socket = new WebSocket('wss://your-server.com/game')

  socket.onopen = () => {
    console.log('Connected to server')
    socket.send(JSON.stringify({ type: 'join' }))
  }

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    handleServerMessage(data)
  }

  socket.onclose = () => {
    console.log('Disconnected from server')
  }
}

function handleServerMessage(data: any) {
  switch (data.type) {
    case 'gameState':
      updateGameState(data.state)
      break
    case 'playerJoined':
      addPlayer(data.playerId)
      break
    case 'playerLeft':
      removePlayer(data.playerId)
      break
  }
}

function sendToServer(message: object) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message))
  }
}
```

## Multiplayer Patterns

### Turn-Based Game

```typescript
let currentTurn = 0
let localPlayerId = ''

messageBus.on('nextTurn', (data) => {
  currentTurn = data.playerId

  if (currentTurn === localPlayerId) {
    enablePlayerInput()
  } else {
    disablePlayerInput()
  }
})

function endTurn() {
  messageBus.emit('endTurn', { playerId: localPlayerId })
}
```

### Real-Time Sync

```typescript
// Sync player positions more frequently
engine.addSystem((dt) => {
  const playerPos = Transform.get(engine.PlayerEntity).position

  messageBus.emit('playerPosition', {
    playerId: localPlayerId,
    position: playerPos
  })
})

messageBus.on('playerPosition', (data) => {
  if (data.playerId !== localPlayerId) {
    // Update other player's representation
    updatePlayerMarker(data.playerId, data.position)
  }
})
```

### Shared Inventory

```typescript
// Sync picked up items
function pickupItem(itemId: string) {
  messageBus.emit('itemPickup', {
    itemId,
    playerId: localPlayerId
  })
}

messageBus.on('itemPickup', (data) => {
  // Remove item for all players
  const itemEntity = getItemEntity(data.itemId)
  if (itemEntity) {
    engine.removeEntity(itemEntity)
  }
})
```

## Serverless Limitations

- No persistence (state resets when all players leave)
- No validation (trust issues with player data)
- Connection speed dependent
- No cross-realm communication

## When to Use Each Approach

| Use Case | Approach |
|----------|----------|
| Simple interactions (doors, buttons) | Serverless syncEntity |
| Chat, emotes | MessageBus |
| Competitive games | Authoritative server |
| Persistent world | Authoritative server |
| Economy/trading | Authoritative server (with blockchain) |

## Best Practices

1. **Minimize sync data**: Only sync what's necessary
2. **Throttle messages**: Don't send every frame
3. **Handle disconnects**: Gracefully handle players leaving
4. **Validate on server**: For competitive games
5. **Test with multiple players**: Use preview with multiple browser windows
