# Systems

## Overview

Systems are functions that run every frame (tick) of the game loop. They process entities with specific components and update game state.

- **Tick rate**: ~30 times per second
- **Delta time (dt)**: Time since last tick in seconds (~0.033s)

## Creating Systems

### Basic System

```typescript
import { engine } from '@dcl/sdk/ecs'

function MySystem(dt: number) {
  // Runs every frame
  // dt = time since last frame in seconds
}

engine.addSystem(MySystem)
```

### System with Component Query

```typescript
import { engine, Transform } from '@dcl/sdk/ecs'

function MovementSystem(dt: number) {
  // Process all entities with Transform
  for (const [entity] of engine.getEntitiesWith(Transform)) {
    const transform = Transform.getMutable(entity)
    transform.position.y += 1 * dt  // Move up 1 meter per second
  }
}

engine.addSystem(MovementSystem)
```

### Multiple Component Query

```typescript
function EnemyAISystem(dt: number) {
  // Only process entities with BOTH Transform AND EnemyComponent
  for (const [entity] of engine.getEntitiesWith(Transform, EnemyComponent)) {
    const transform = Transform.getMutable(entity)
    const enemy = EnemyComponent.get(entity)
    // AI logic here
  }
}
```

## System Priority

Control execution order with priority parameter:

```typescript
// Higher priority = runs first
engine.addSystem(PhysicsSystem, 100)    // Runs first
engine.addSystem(AISystem, 50)          // Runs second
engine.addSystem(RenderSystem, 0)       // Runs last

// Default priority is 0
engine.addSystem(MySystem)  // Priority 0
```

## Named Systems

Name systems to remove or replace them later:

```typescript
// Add named system
engine.addSystem(MySystem, 0, 'mySystemName')

// Remove by name
engine.removeSystem('mySystemName')

// Replace system
engine.addSystem(NewSystem, 0, 'mySystemName')  // Replaces existing
```

## Delta Time (dt)

Use `dt` for frame-rate independent movement:

```typescript
function MovementSystem(dt: number) {
  for (const [entity] of engine.getEntitiesWith(Transform, VelocityComponent)) {
    const transform = Transform.getMutable(entity)
    const velocity = VelocityComponent.get(entity)

    // Move based on velocity * time
    transform.position.x += velocity.x * dt
    transform.position.y += velocity.y * dt
    transform.position.z += velocity.z * dt
  }
}
```

### Why Use dt?

- Consistent behavior regardless of frame rate
- Speed measured in units per second, not per frame
- Handles performance variations gracefully

```typescript
const speed = 5  // 5 meters per second

// WRONG: Speed varies with frame rate
transform.position.x += speed  // 150 m/s at 30fps, 300 m/s at 60fps

// CORRECT: Consistent speed
transform.position.x += speed * dt  // Always 5 m/s
```

## Timer Pattern

Execute code at intervals, not every frame:

```typescript
let timer = 0
const interval = 1  // 1 second

function TimerSystem(dt: number) {
  timer += dt

  if (timer >= interval) {
    timer = 0
    // Execute every second
    console.log('One second passed')
  }
}

engine.addSystem(TimerSystem)
```

## State Machine System

```typescript
type GameState = 'menu' | 'playing' | 'paused' | 'gameover'
let currentState: GameState = 'menu'

function GameStateSystem(dt: number) {
  switch (currentState) {
    case 'menu':
      // Menu logic
      break
    case 'playing':
      // Game logic
      updateEnemies(dt)
      checkCollisions()
      break
    case 'paused':
      // Paused - do nothing
      break
    case 'gameover':
      // Game over logic
      break
  }
}

engine.addSystem(GameStateSystem)
```

## Removing Systems

```typescript
// Remove by name
engine.removeSystem('mySystemName')

// Remove by reference (if you kept it)
const systemRef = engine.addSystem(MySystem)
engine.removeSystem(systemRef)
```

## One-Time Execution

For code that should run once after initialization:

```typescript
let initialized = false

function InitSystem(dt: number) {
  if (initialized) return

  // Initialization code
  setupScene()
  spawnEntities()

  initialized = true
}

engine.addSystem(InitSystem)
```

## Performance Tips

1. **Avoid heavy calculations every frame**:
```typescript
// BAD: Expensive operation every frame
function BadSystem(dt: number) {
  const result = expensiveCalculation()  // Runs 30x/second
}

// GOOD: Use timer for periodic operations
let timer = 0
function GoodSystem(dt: number) {
  timer += dt
  if (timer >= 0.5) {  // Every 0.5 seconds
    timer = 0
    const result = expensiveCalculation()
  }
}
```

2. **Use component queries efficiently**:
```typescript
// GOOD: Query filters entities
for (const [entity] of engine.getEntitiesWith(Transform, Enemy)) {
  // Only processes enemies
}

// BAD: Checking component existence manually
for (const [entity] of engine.getEntitiesWith(Transform)) {
  if (Enemy.has(entity)) {  // Extra check every entity
    // Process enemy
  }
}
```

3. **Cache references when possible**:
```typescript
// If you need the same data repeatedly
const playerTransform = Transform.get(engine.PlayerEntity)
```

## Common System Patterns

### Cleanup System
```typescript
function CleanupSystem(dt: number) {
  for (const [entity] of engine.getEntitiesWith(LifetimeComponent)) {
    const lifetime = LifetimeComponent.getMutable(entity)
    lifetime.remaining -= dt

    if (lifetime.remaining <= 0) {
      engine.removeEntity(entity)
    }
  }
}
```

### Spawn System
```typescript
let spawnTimer = 0
const spawnInterval = 2

function SpawnSystem(dt: number) {
  spawnTimer += dt

  if (spawnTimer >= spawnInterval) {
    spawnTimer = 0
    spawnEnemy()
  }
}
```
