# Decentraland SDK7 Reference Documentation

This directory contains reference documentation for Decentraland SDK7, compiled for use by subagents when architecting DCL projects.

## Documentation Index

### Getting Started
- [00-overview.md](./00-overview.md) - SDK7 overview, core concepts, and project structure
- [01-installation-cli.md](./01-installation-cli.md) - Installation, CLI commands, and project setup

### Core Architecture
- [02-entities-components.md](./02-entities-components.md) - Entity-Component-System (ECS) architecture
- [03-transforms-positioning.md](./03-transforms-positioning.md) - Transform component, Vector3, Quaternion, parenting
- [10-systems.md](./10-systems.md) - Systems, game loop, delta time
- [11-custom-components.md](./11-custom-components.md) - Defining custom components with schemas

### 3D Content
- [04-shapes-3d-models.md](./04-shapes-3d-models.md) - GltfContainer, MeshRenderer, primitives
- [05-materials-textures.md](./05-materials-textures.md) - Materials, textures, PBR properties
- [06-animations.md](./06-animations.md) - Animator component, skeletal/vertex animations
- [07-tweens-movement.md](./07-tweens-movement.md) - Tween component, easing functions

### Interactivity
- [08-audio.md](./08-audio.md) - AudioSource, positional audio, streaming
- [09-input-events.md](./09-input-events.md) - Pointer events, button input, click handling
- [13-colliders-raycasting.md](./13-colliders-raycasting.md) - Colliders, collision layers, raycasting

### Player & UI
- [12-ui.md](./12-ui.md) - 2D UI with ReactEcs, buttons, inputs, styling
- [14-player-data.md](./14-player-data.md) - Player/camera position, profile data, avatar

### Networking & Deployment
- [15-multiplayer.md](./15-multiplayer.md) - Serverless sync, MessageBus, external servers
- [16-scene-limitations.md](./16-scene-limitations.md) - Parcel limits, resource constraints
- [17-publishing.md](./17-publishing.md) - Deployment to LAND, Worlds, testnet

## Quick Reference

### Essential Imports

```typescript
// Core ECS
import { engine, Transform, GltfContainer, MeshRenderer, Material } from '@dcl/sdk/ecs'

// Math utilities
import { Vector3, Quaternion, Color4 } from '@dcl/sdk/math'

// Input
import { pointerEventsSystem, InputAction } from '@dcl/sdk/ecs'

// Networking
import { syncEntity } from '@dcl/sdk/network'
import { MessageBus } from '@dcl/sdk/message-bus'

// UI (in .tsx files)
import { ReactEcsRenderer, UiEntity, Label, Button } from '@dcl/sdk/react-ecs'
```

### Basic Scene Template

```typescript
import { engine, Transform, GltfContainer } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

export function main() {
  // Create entity
  const entity = engine.addEntity()

  // Add transform
  Transform.create(entity, {
    position: Vector3.create(8, 0, 8)
  })

  // Add 3D model
  GltfContainer.create(entity, {
    src: 'assets/scene/model.glb'
  })
}
```

### CLI Commands

```bash
npx @dcl/sdk-commands init  # Initialize project
npm run start               # Preview locally
npm run build               # Build for production
npm run deploy              # Deploy to Decentraland
```

## Official Resources

- **Documentation**: https://docs.decentraland.org/creator/sdk7/
- **Examples**: https://docs.decentraland.org/creator/sdk7/examples/7/
- **Playground**: https://playground.decentraland.org/
- **Discord**: #sdk channel in Decentraland Discord
- **GitHub**: https://github.com/decentraland/sdk

## Version

This documentation was compiled for **Decentraland SDK7** (December 2025).
