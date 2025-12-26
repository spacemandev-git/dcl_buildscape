# Decentraland SDK7 Overview

## What is Decentraland SDK7?

Decentraland SDK7 is the official development kit for creating interactive 3D experiences in Decentraland's virtual world. It uses TypeScript as the primary programming language and follows an Entity-Component-System (ECS) architecture.

## Key Features

- **TypeScript-based**: Write scenes in TypeScript, compiled to JavaScript for deployment
- **Entity-Component-System (ECS)**: Modern game development architecture for efficient scene management
- **Visual Editor Integration**: Creator Hub provides visual editing alongside code
- **3D Model Support**: Import glTF/glb format models with animations, materials, and colliders
- **Multiplayer**: Built-in serverless multiplayer with optional custom server support
- **UI System**: 2D UI overlay using React-like JSX syntax
- **Cross-platform**: Runs in browser and desktop clients

## Core Concepts

### Entity-Component-System (ECS)

- **Entities**: Abstract identifiers that group components together. Everything in a scene is an entity
- **Components**: Store data about entities. Built-in components like `Transform` and `GltfContainer` are interpreted by the engine
- **Systems**: Functions executed once per tick (~30 times/second) that read component data and update values

### Scene Structure

```
my-scene/
├── src/
│   ├── index.ts      # Main entry point with main() function
│   ├── components/   # Custom components
│   └── ui.tsx        # UI definitions
├── assets/
│   └── scene/        # 3D models, textures, audio
├── scene.json        # Scene metadata
└── package.json      # Dependencies
```

### Main Function

The `main()` function is the entry point for your scene:

```typescript
import { engine, Transform, GltfContainer } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

export function main() {
  // Create entity
  let entity = engine.addEntity()

  // Add Transform component
  Transform.create(entity, {
    position: Vector3.create(8, 0, 8),
  })

  // Add 3D model
  GltfContainer.create(entity, {
    src: 'assets/scene/model.glb',
  })
}
```

## Development Workflow

1. **Setup**: Install Creator Hub and Visual Studio Code
2. **Create Scene**: Use Creator Hub or `npx @dcl/sdk-commands init`
3. **Develop**: Edit code in VS Code, add assets in Creator Hub
4. **Preview**: Run `npm run start` to test locally
5. **Build**: Run `npm run build` for production
6. **Deploy**: Run `npm run deploy` to publish to Decentraland

## Essential Imports

```typescript
// Core ECS
import { engine, Transform, GltfContainer, MeshRenderer, Material } from '@dcl/sdk/ecs'

// Math utilities
import { Vector3, Quaternion, Color4 } from '@dcl/sdk/math'

// Networking
import { syncEntity } from '@dcl/sdk/network'
import { MessageBus } from '@dcl/sdk/message-bus'
```

## Resources

- **Official Docs**: https://docs.decentraland.org/creator/sdk7/
- **Examples**: https://docs.decentraland.org/creator/sdk7/examples/7/
- **Playground**: https://playground.decentraland.org/
- **Discord**: #sdk channel in Decentraland Discord
