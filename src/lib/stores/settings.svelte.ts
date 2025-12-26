// Settings state management

function createSettings() {
  let persistInventory = $state(true);

  return {
    get persistInventory() {
      return persistInventory;
    },

    setPersistInventory(value: boolean) {
      persistInventory = value;
    },
  };
}

export const settings = createSettings();
