# Publishing & Deployment

## Overview

Deploy scenes to:
- **Decentraland LAND**: Virtual parcels you own or have permissions for
- **Decentraland Worlds**: Standalone spaces (no LAND required)
- **Sepolia Testnet**: Testing without real assets

## Prerequisites

- Completed, tested scene
- For LAND: Ownership or deploy permissions
- For Worlds: DCL Name or ENS domain
- MetaMask or compatible wallet

## Deploy Commands

### Basic Deploy

```bash
npm run deploy
```

Opens browser for wallet authentication.

### Deploy to Specific Coordinates

```bash
npm run deploy -- --target-content https://peer.decentraland.org/content
```

### Deploy to Testnet

```bash
npm run deploy -- --target-content https://peer.decentraland.zone/content
```

## Deployment Types

### Deploy to LAND

1. Ensure `scene.json` has correct parcels:

```json
{
  "scene": {
    "parcels": ["0,0", "0,1", "1,0", "1,1"],
    "base": "0,0"
  }
}
```

2. Run deploy:
```bash
npm run deploy
```

3. Sign transaction in wallet

4. Wait for content server sync (~1-2 minutes)

### Deploy to Worlds

1. Configure for World deployment:

```json
{
  "worldConfiguration": {
    "name": "my-world.dcl.eth"
  }
}
```

2. Deploy:
```bash
npm run deploy -- --target-content https://worlds-content-server.decentraland.org/content
```

### Testnet Deployment

No LAND or permissions needed:

```bash
npm run deploy -- --target-content https://peer.decentraland.zone/content
```

## scene.json Configuration

```json
{
  "display": {
    "title": "My Awesome Scene",
    "description": "A Decentraland scene",
    "navmapThumbnail": "images/scene-thumbnail.png",
    "favicon": "images/favicon.png"
  },
  "owner": "0xYourWalletAddress",
  "contact": {
    "name": "Your Name",
    "email": "you@example.com"
  },
  "main": "bin/index.js",
  "scene": {
    "parcels": ["0,0"],
    "base": "0,0"
  },
  "communications": {
    "type": "webrtc",
    "signalling": "https://signalling-01.decentraland.org"
  },
  "tags": ["game", "art", "social"],
  "spawnPoints": [
    {
      "name": "spawn1",
      "default": true,
      "position": {
        "x": [0, 3],
        "y": [0, 0],
        "z": [0, 3]
      },
      "cameraTarget": {
        "x": 8,
        "y": 1,
        "z": 8
      }
    }
  ],
  "requiredPermissions": [],
  "featureToggles": {}
}
```

## Required Permissions

Request special permissions in `scene.json`:

```json
{
  "requiredPermissions": [
    "ALLOW_TO_TRIGGER_AVATAR_EMOTE",
    "ALLOW_TO_MOVE_PLAYER_INSIDE_SCENE",
    "OPEN_EXTERNAL_LINK"
  ]
}
```

Available permissions:
- `ALLOW_TO_TRIGGER_AVATAR_EMOTE`
- `ALLOW_TO_MOVE_PLAYER_INSIDE_SCENE`
- `OPEN_EXTERNAL_LINK`
- `USE_WEB3_API`
- `USE_FETCH`
- `USE_WEBSOCKET`

## Spawn Points

Configure where players appear:

```json
{
  "spawnPoints": [
    {
      "name": "main",
      "default": true,
      "position": {
        "x": [1, 15],
        "y": [0, 0],
        "z": [1, 15]
      },
      "cameraTarget": {
        "x": 8,
        "y": 0,
        "z": 8
      }
    }
  ]
}
```

- `position.x/z`: Range for random spawn
- `cameraTarget`: Where player faces on spawn

## Pre-Deployment Checklist

1. **Test locally**
   ```bash
   npm run start
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Check limits**
   - Triangle count
   - Texture sizes
   - File sizes

4. **Verify scene.json**
   - Correct parcel coordinates
   - Proper spawn points
   - Accurate metadata

5. **Test on testnet first**

## Updating Deployed Scenes

Simply redeploy:
```bash
npm run deploy
```

The content server updates automatically. Changes typically appear within 1-2 minutes.

## Deployment Troubleshooting

### "Not authorized to deploy"
- You don't own the LAND
- Check wallet is connected
- Verify parcel coordinates

### "Content too large"
- Reduce texture sizes
- Use .glb format
- Remove unused assets

### "Invalid scene.json"
- Check JSON syntax
- Verify required fields
- Ensure parcels are valid

### Content not updating
- Clear browser cache
- Wait for CDN propagation
- Check correct coordinates

## Viewing Deployed Scene

After deployment:

1. **In browser**: `https://play.decentraland.org/?position=X,Y`
2. **Desktop client**: Navigate to coordinates
3. **Worlds**: `https://play.decentraland.org/?realm=your-world.dcl.eth`

## CI/CD Deployment

For automated deployment:

```yaml
# Example GitHub Action
- name: Deploy to Decentraland
  run: |
    npm ci
    npm run build
    npm run deploy -- --target-content https://peer.decentraland.org/content
  env:
    DCL_PRIVATE_KEY: ${{ secrets.DCL_PRIVATE_KEY }}
```

## Best Practices

1. **Test on testnet first**: Avoid mainnet mistakes
2. **Use version control**: Track scene changes
3. **Document coordinates**: Keep record of your LAND
4. **Monitor after deploy**: Check scene loads correctly
5. **Backup before updates**: Save previous version
