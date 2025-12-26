// Inventory and equipment state management

export interface ItemDefinition {
  name: string;
  path: string;
  type: "weapon" | "shield" | "armor" | "accessory";
  slot: "mainHand" | "offHand" | "back";
  attachBone: string;
  scale?: number;
  positionOffset?: [number, number, number];
  rotationOffset?: [number, number, number];
}

export interface EquippedItem {
  item: ItemDefinition;
  boneName: string;
}

// Item definitions with bone attachment info
// Note: Three.js strips dots from bone names, so Wrist.R becomes WristR
// Both avatar and items have 100x scale in their root, so we use 1/100 = 0.01 to compensate
// 35 degrees in radians
const DEG_35 = (35 * Math.PI) / 180;

export const ITEM_CATALOG: ItemDefinition[] = [
  {
    name: "Sword",
    path: "/assets/Ultimate RPG Items Bundle-glb/Sword.glb",
    type: "weapon",
    slot: "mainHand",
    attachBone: "WristR",
    scale: 0.5,
    positionOffset: [0, 0, 0],
    rotationOffset: [0, 0, 0],
  },
  {
    name: "Claymore",
    path: "/assets/Ultimate RPG Items Bundle-glb/Claymore.glb",
    type: "weapon",
    slot: "mainHand",
    attachBone: "WristR",
    scale: 0.5,
    positionOffset: [0, 0, 0],
    rotationOffset: [DEG_35, 0, 0],
  },
  {
    name: "Shield",
    path: "/assets/Ultimate RPG Items Bundle-glb/Shield Round.glb",
    type: "shield",
    slot: "offHand",
    attachBone: "WristL",
    scale: 0.5,
    positionOffset: [0, 0, 0],
    rotationOffset: [DEG_35, 0, 0],
  },
  {
    name: "Spear",
    path: "/assets/Ultimate RPG Items Bundle-glb/Spear.glb",
    type: "weapon",
    slot: "mainHand",
    attachBone: "WristR",
    scale: 0.5,
    positionOffset: [0, 0, 0],
    rotationOffset: [DEG_35, 0, 0],
  },
  {
    name: "Knife",
    path: "/assets/Ultimate RPG Items Bundle-glb/Knife.glb",
    type: "weapon",
    slot: "mainHand",
    attachBone: "WristR",
    scale: 0.5,
    positionOffset: [0, 0, 0],
    rotationOffset: [DEG_35, 0, 0],
  },
];

// Common bone name mappings (different rigs use different naming conventions)
export const BONE_MAPPINGS: Record<string, string[]> = {
  rightHand: [
    "WristR",
    "Wrist.R",
    "mixamorigRightHand",
    "RightHand",
    "Hand_R",
    "hand_r",
    "hand.R",
  ],
  leftHand: [
    "WristL",
    "Wrist.L",
    "mixamorigLeftHand",
    "LeftHand",
    "Hand_L",
    "hand_l",
    "hand.L",
  ],
  spine: ["Torso", "mixamorigSpine", "Spine", "spine", "Spine1"],
  head: ["Head", "mixamorigHead", "head"],
  hips: ["Hips", "mixamorigHips", "hips", "pelvis"],
};

export type EquipmentSlot = "mainHand" | "offHand" | "back";

// Create reactive inventory state
function createInventory() {
  let equipped = $state<Record<EquipmentSlot, ItemDefinition | null>>({
    mainHand: null,
    offHand: null,
    back: null,
  });

  let rotationOverride = $state<[number, number, number] | null>(null);
  let positionOverride = $state<[number, number, number] | null>(null);
  let scaleOverride = $state<number | null>(null);

  return {
    get equipped() {
      return equipped;
    },

    get rotationOverride() {
      return rotationOverride;
    },

    get positionOverride() {
      return positionOverride;
    },

    get scaleOverride() {
      return scaleOverride;
    },

    setRotationOverride(rotation: [number, number, number] | null) {
      rotationOverride = rotation;
    },

    setPositionOverride(position: [number, number, number] | null) {
      positionOverride = position;
    },

    setScaleOverride(scale: number | null) {
      scaleOverride = scale;
    },

    equip(item: ItemDefinition) {
      equipped[item.slot] = item;
    },

    unequip(slot: EquipmentSlot) {
      equipped[slot] = null;
    },

    isEquipped(item: ItemDefinition): boolean {
      return equipped[item.slot]?.path === item.path;
    },

    getEquippedItems(): EquippedItem[] {
      const items: EquippedItem[] = [];
      for (const [slot, item] of Object.entries(equipped)) {
        if (item) {
          items.push({ item, boneName: item.attachBone });
        }
      }
      return items;
    },

    clearAll() {
      equipped = {
        mainHand: null,
        offHand: null,
        back: null,
      };
    },
  };
}

export const inventory = createInventory();

// Helper to find a bone by trying common naming conventions
export function findBone(
  skeleton: Map<string, THREE.Bone>,
  targetBone: string
): THREE.Bone | null {
  // Direct match first
  if (skeleton.has(targetBone)) {
    console.log("Direct bone match:", targetBone);
    return skeleton.get(targetBone)!;
  }

  // Try common mappings
  for (const [canonical, variants] of Object.entries(BONE_MAPPINGS)) {
    if (variants.includes(targetBone)) {
      for (const variant of variants) {
        if (skeleton.has(variant)) {
          console.log(
            "Bone found via mapping:",
            variant,
            "for target:",
            targetBone
          );
          return skeleton.get(variant)!;
        }
      }
    }
  }

  // Case-insensitive partial match - look for "hand", "right", etc.
  const lowerTarget = targetBone.toLowerCase();
  const searchTerms = ["righthand", "right_hand", "hand_r", "handr"];
  const leftSearchTerms = ["lefthand", "left_hand", "hand_l", "handl"];

  for (const [name, bone] of skeleton.entries()) {
    const lowerName = name.toLowerCase();

    // Check for right hand
    if (lowerTarget.includes("right") && lowerTarget.includes("hand")) {
      if (
        searchTerms.some((term) => lowerName.includes(term)) ||
        (lowerName.includes("hand") && lowerName.includes("r"))
      ) {
        console.log("Bone found via partial match (right hand):", name);
        return bone;
      }
    }

    // Check for left hand
    if (lowerTarget.includes("left") && lowerTarget.includes("hand")) {
      if (
        leftSearchTerms.some((term) => lowerName.includes(term)) ||
        (lowerName.includes("hand") && lowerName.includes("l"))
      ) {
        console.log("Bone found via partial match (left hand):", name);
        return bone;
      }
    }

    // Generic partial match
    if (
      lowerName.includes(lowerTarget.replace("mixamorig", "").toLowerCase())
    ) {
      console.log("Bone found via generic partial match:", name);
      return bone;
    }
  }

  console.log(
    "No bone found for:",
    targetBone,
    "Available:",
    Array.from(skeleton.keys())
  );
  return null;
}
