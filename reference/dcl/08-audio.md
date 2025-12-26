# Audio & Sounds

## Supported Formats

- `.mp3`
- `.ogg`
- `.aac`

Audio files must be placed in the project's assets folder.

## AudioSource Component

Play sounds from entities:

```typescript
import { engine, Transform, AudioSource } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

const entity = engine.addEntity()

Transform.create(entity, {
  position: Vector3.create(8, 1, 8)
})

AudioSource.create(entity, {
  audioClipUrl: 'assets/sounds/music.mp3',
  playing: true,
  loop: true,
  volume: 0.5
})
```

## AudioSource Properties

```typescript
AudioSource.create(entity, {
  audioClipUrl: 'assets/sounds/effect.mp3',  // Path to audio file

  playing: true,           // Start playing immediately
  loop: false,             // Loop the sound
  volume: 1.0,             // Volume 0.0 to 1.0
  pitch: 1.0,              // Playback speed/pitch

  // Spatial audio (default: true)
  global: false            // false = positional, true = everywhere
})
```

## Playing Sounds

### Play Once

```typescript
// Create sound effect
AudioSource.create(entity, {
  audioClipUrl: 'assets/sounds/explosion.mp3',
  playing: true,
  loop: false
})
```

### Play on Demand

```typescript
// Create audio source (not playing)
AudioSource.create(entity, {
  audioClipUrl: 'assets/sounds/click.mp3',
  playing: false,
  loop: false
})

// Play later
function playSound() {
  AudioSource.playSound(entity, 'assets/sounds/click.mp3')
}
```

### Toggle Sound

```typescript
function toggleMusic(entity: Entity) {
  const audio = AudioSource.getMutable(entity)
  audio.playing = !audio.playing
}
```

## Positional Audio

By default, sounds are positional - they appear to come from the entity's location:

```typescript
// Positional audio (sounds louder when player is closer)
AudioSource.create(entity, {
  audioClipUrl: 'assets/sounds/waterfall.mp3',
  playing: true,
  loop: true,
  global: false  // Default - positional
})

// Global audio (same volume everywhere)
AudioSource.create(entity, {
  audioClipUrl: 'assets/sounds/ambient.mp3',
  playing: true,
  loop: true,
  global: true  // Non-positional
})
```

## Background Music

For background music, use global audio attached to the scene:

```typescript
const musicEntity = engine.addEntity()

Transform.create(musicEntity, {
  position: Vector3.create(8, 0, 8)
})

AudioSource.create(musicEntity, {
  audioClipUrl: 'assets/sounds/background-music.mp3',
  playing: true,
  loop: true,
  volume: 0.3,
  global: true  // Plays at same volume everywhere
})
```

## Audio Streaming

Stream audio from external URLs:

```typescript
import { AudioStream } from '@dcl/sdk/ecs'

const streamEntity = engine.addEntity()

Transform.create(streamEntity, {
  position: Vector3.create(8, 0, 8)
})

AudioStream.create(streamEntity, {
  url: 'https://stream.example.com/radio.mp3',
  playing: true,
  volume: 0.5
})
```

### Streaming Use Cases

- Internet radio stations
- Live event audio
- Conference streaming

## Volume Control

```typescript
// Adjust volume dynamically
function setVolume(entity: Entity, volume: number) {
  const audio = AudioSource.getMutable(entity)
  audio.volume = Math.max(0, Math.min(1, volume))  // Clamp 0-1
}

// Fade out
function fadeOut(entity: Entity, duration: number) {
  const audio = AudioSource.getMutable(entity)
  const startVolume = audio.volume
  let elapsed = 0

  engine.addSystem((dt) => {
    elapsed += dt
    const progress = Math.min(elapsed / duration, 1)
    audio.volume = startVolume * (1 - progress)

    if (progress >= 1) {
      audio.playing = false
      // Remove system
    }
  })
}
```

## Sound Effects on Events

Play sounds when things happen:

```typescript
import { pointerEventsSystem, InputAction } from '@dcl/sdk/ecs'

// Play sound on click
pointerEventsSystem.onPointerDown(
  {
    entity: button,
    opts: { button: InputAction.IA_POINTER, hoverText: 'Click' }
  },
  () => {
    AudioSource.playSound(button, 'assets/sounds/click.mp3')
  }
)
```

## Play Sound Segment

To play a portion of a longer audio file, use the SDK Utils library:

```typescript
import { playSoundSegment } from '@dcl-sdk/utils'

// Play from 10s to 15s
playSoundSegment(entity, 'assets/sounds/long-audio.mp3', 10, 15)
```

## Audio Tips

1. **Optimize file size**: Use compressed formats, appropriate bitrates
2. **Positional for environment**: Waterfalls, machines, NPCs
3. **Global for music**: Background music, announcements
4. **Volume balance**: Keep music lower than effects
5. **Avoid autoplay abuse**: Respect user experience
6. **Loop ambient sounds**: Create seamless loops for backgrounds
