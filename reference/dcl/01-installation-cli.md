# Installation & CLI

## Prerequisites

- **Node.js**: Version 8 or later
- **Visual Studio Code** or **Cursor**: For code editing
- **Creator Hub**: Download from decentraland.org (optional but recommended)

## Installation Methods

### Method 1: Creator Hub (Recommended)

1. Download Creator Hub from https://decentraland.org/download
2. Open Creator Hub → Select Scenes tab → Click Create Scene
3. Choose a template (Empty Scene for beginners)
4. Visual Studio Code opens automatically for coding

### Method 2: CLI

```bash
# Create new project in empty folder
npx @dcl/sdk-commands init

# Follow prompts:
# - Select project type (scene, workspace, or smart wearable)
# - Choose base project template
```

## CLI Commands

### Initialize Project
```bash
npx @dcl/sdk-commands init
```

### Install Dependencies
```bash
npm install
```

### Update SDK Version
```bash
npm i @dcl/sdk@latest
```
Verify update by checking `@dcl/sdk` version in `package.json`.

### Run Preview
```bash
npm run start
```
Launches local preview in browser. Auto-refreshes on file changes.

### Build Project
```bash
npm run build
```
Compiles TypeScript to minified JavaScript. Runs more rigorous type checks than preview mode.

### Deploy Scene
```bash
npm run deploy
```
Opens browser for wallet authentication to authorize deployment.

## Project Structure

After initialization, your project will contain:

```
my-scene/
├── src/
│   └── index.ts        # Main scene code
├── assets/
│   └── scene/          # 3D models, textures, audio files
├── node_modules/       # Dependencies
├── scene.json          # Scene metadata (parcels, name, description)
├── package.json        # NPM configuration
└── tsconfig.json       # TypeScript configuration
```

## scene.json Configuration

```json
{
  "display": {
    "title": "My Scene",
    "description": "A Decentraland scene",
    "navmapThumbnail": "images/scene-thumbnail.png"
  },
  "scene": {
    "parcels": ["0,0"],
    "base": "0,0"
  },
  "main": "bin/index.js",
  "tags": [],
  "runtimeVersion": "7"
}
```

### Key Fields

- **parcels**: Array of parcel coordinates the scene occupies
- **base**: Base parcel (origin point for coordinates)
- **main**: Compiled JavaScript entry point
- **runtimeVersion**: SDK version (use "7" for SDK7)

## Tips

- The Creator Hub runs the same CLI commands behind the scenes
- Use CLI for automated workflows and CI/CD pipelines
- Preview mode is faster but less strict than build mode
- Always test with `npm run build` before deploying
