# Custom Components

## Overview

Custom components store scene-specific data on entities. They're defined using schemas and must be created outside the `main()` function.

## Defining Components

```typescript
import { engine, Schemas } from '@dcl/sdk/ecs'

// Define component with schema
export const HealthComponent = engine.defineComponent('healthComponent', {
  current: Schemas.Number,
  max: Schemas.Number,
  regenerating: Schemas.Boolean
})

// With default values
export const SpeedComponent = engine.defineComponent('speedComponent', {
  value: Schemas.Float
}, {
  value: 1.0  // Default speed
})
```

## File Organization

Recommended structure:

```
src/
├── index.ts           # main() function
├── components/
│   ├── health.ts      # HealthComponent
│   ├── enemy.ts       # EnemyComponent
│   └── inventory.ts   # InventoryComponent
└── systems/
    └── combat.ts      # Uses components
```

```typescript
// components/health.ts
import { engine, Schemas } from '@dcl/sdk/ecs'

export const HealthComponent = engine.defineComponent('healthComponent', {
  current: Schemas.Number,
  max: Schemas.Number
})
```

## Schema Types

### Basic Types

```typescript
Schemas.Boolean     // true/false
Schemas.Byte        // 0-255
Schemas.Short       // -32768 to 32767
Schemas.Int         // 32-bit integer
Schemas.Int64       // 64-bit integer
Schemas.Float       // 32-bit float
Schemas.Double      // 64-bit float
Schemas.Number      // Alias for Float
Schemas.String      // Text
Schemas.Entity      // Entity reference
```

### Vector & Math Types

```typescript
Schemas.Vector3     // { x, y, z }
Schemas.Quaternion  // { x, y, z, w }
Schemas.Color3      // { r, g, b }
Schemas.Color4      // { r, g, b, a }
```

### Complex Types

```typescript
// Array of values
Schemas.Array(Schemas.String)
Schemas.Array(Schemas.Vector3)

// Nested object (Map)
Schemas.Map({
  name: Schemas.String,
  level: Schemas.Int
})

// Enum
enum EnemyType { Goblin, Orc, Dragon }
Schemas.EnumNumber(EnemyType, Schemas.Int)

// One of multiple types
Schemas.OneOf({
  stringValue: Schemas.String,
  numberValue: Schemas.Number
})
```

## Using Components

### Create

```typescript
import { HealthComponent } from './components/health'

const entity = engine.addEntity()

HealthComponent.create(entity, {
  current: 100,
  max: 100
})
```

### Read

```typescript
// Read-only (better performance)
const health = HealthComponent.get(entity)
console.log(health.current)

// Check if has component
if (HealthComponent.has(entity)) {
  // Entity has health
}

// Get or null
const health = HealthComponent.getOrNull(entity)
if (health) {
  // Use health
}
```

### Modify

```typescript
// Get mutable reference
const health = HealthComponent.getMutable(entity)
health.current -= 10

// Create or replace
HealthComponent.createOrReplace(entity, {
  current: 50,
  max: 100
})
```

### Delete

```typescript
HealthComponent.deleteFrom(entity)
```

## Flag Components

Empty components used to tag/identify entities:

```typescript
// Define flag (empty schema)
export const IsEnemyFlag = engine.defineComponent('isEnemy', {})
export const IsPlayerFlag = engine.defineComponent('isPlayer', {})

// Usage
IsEnemyFlag.create(goblinEntity)

// Query all enemies
for (const [entity] of engine.getEntitiesWith(IsEnemyFlag, Transform)) {
  // Process enemy
}
```

## Component Change Callbacks

Subscribe to component changes:

```typescript
HealthComponent.onChange(entity, (newHealth) => {
  console.log('Health changed to:', newHealth.current)

  if (newHealth.current <= 0) {
    // Entity died
    engine.removeEntity(entity)
  }
})
```

## Example: Complete Enemy System

```typescript
// components/enemy.ts
import { engine, Schemas } from '@dcl/sdk/ecs'

export enum EnemyState { Idle, Patrol, Chase, Attack }

export const EnemyComponent = engine.defineComponent('enemy', {
  type: Schemas.String,
  health: Schemas.Number,
  maxHealth: Schemas.Number,
  damage: Schemas.Number,
  speed: Schemas.Float,
  state: Schemas.EnumNumber(EnemyState, Schemas.Int),
  target: Schemas.Entity
}, {
  health: 100,
  maxHealth: 100,
  damage: 10,
  speed: 2.0,
  state: EnemyState.Idle
})

// systems/enemyAI.ts
import { engine, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { EnemyComponent, EnemyState } from '../components/enemy'

function EnemyAISystem(dt: number) {
  for (const [entity] of engine.getEntitiesWith(EnemyComponent, Transform)) {
    const enemy = EnemyComponent.getMutable(entity)
    const transform = Transform.getMutable(entity)

    switch (enemy.state) {
      case EnemyState.Idle:
        // Check for player in range
        break

      case EnemyState.Patrol:
        // Move along patrol path
        break

      case EnemyState.Chase:
        // Move toward target
        if (enemy.target) {
          const targetPos = Transform.get(enemy.target).position
          const direction = Vector3.normalize(
            Vector3.subtract(targetPos, transform.position)
          )
          transform.position = Vector3.add(
            transform.position,
            Vector3.scale(direction, enemy.speed * dt)
          )
        }
        break

      case EnemyState.Attack:
        // Attack target
        break
    }
  }
}

engine.addSystem(EnemyAISystem)
```

## Naming Convention for Libraries

When creating reusable libraries, use namespaced names:

```typescript
// Avoid conflicts with other libraries
const MyComponent = engine.defineComponent(
  'myLibrary::myComponent',  // packageName::componentName
  { /* schema */ }
)
```

## Best Practices

1. **Define outside main()**: Components must exist before `main()` runs
2. **Organize in /components folder**: Easy to find and reuse
3. **Use descriptive names**: `HealthComponent` not `HC`
4. **Provide defaults**: Reduce boilerplate when creating
5. **Use flags for tagging**: Empty components for entity categorization
6. **Prefer read-only access**: Use `get()` when not modifying
