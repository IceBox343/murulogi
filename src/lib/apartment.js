export const APARTMENTS = [1, 2, 3, 4, 5, 6];

const STORAGE_KEY = "murulogi-apartment";

// The apartment this device last used, so people don't have to pick it every time.
export function getRememberedApartment() {
  try {
    const saved = Number(localStorage.getItem(STORAGE_KEY));

    if (APARTMENTS.includes(saved)) {
      return saved;
    }
  } catch {
    // localStorage can be unavailable (e.g. private mode) - fall back to the default.
  }

  return APARTMENTS[0];
}

export function rememberApartment(apartment) {
  try {
    localStorage.setItem(STORAGE_KEY, String(apartment));
  } catch {
    // Not being able to remember the choice is not worth interrupting the user.
  }
}
