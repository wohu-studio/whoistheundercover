/**
 * Generates animal avatars for players using Arcticons animal icons
 * Returns an icon name and background color
 */

// Arcticons animal icon names (iconify format)
const animalIcons = [
  'arcticons:emoji-cat',
  'arcticons:emoji-dog',
  'arcticons:emoji-bird',
  'arcticons:emoji-fish',
  'arcticons:emoji-bunny',
  'arcticons:emoji-cow',
  'arcticons:emoji-chicken',
  'arcticons:emoji-duck',
  'arcticons:emoji-dolphin',
  'arcticons:emoji-hamster',
  'arcticons:emoji-hedgehog',
  'arcticons:emoji-horse-face',
  'arcticons:emoji-owl',
  'arcticons:emoji-panda-face',
  'arcticons:emoji-tiger',
  'arcticons:emoji-wolf',
  'arcticons:fox',
  'arcticons:goat',
  'arcticons:flamingo',
  'arcticons:peacock',
  'arcticons:otter',
  'arcticons:capybara',
  'arcticons:alligator',
  'arcticons:bird',
] as const;

const animalColors = [
  '#8d4f11', '#944925', '#c47a52', '#006d3d', '#b08050', '#7a9e6d',
];

export interface AvatarConfig {
  name: string;
  color: string;
}

export function generateRandomAvatar(): AvatarConfig {
  const name = animalIcons[Math.floor(Math.random() * animalIcons.length)];
  const color = animalColors[Math.floor(Math.random() * animalColors.length)];
  return { name, color };
}

export function getAvatarById(id: string): AvatarConfig {
  // Deterministic avatar based on player ID
  const nameIndex = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = id.split('').reverse().reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return {
    name: animalIcons[nameIndex % animalIcons.length],
    color: animalColors[colorIndex % animalColors.length],
  };
}

export function parseAvatar(avatar: string | AvatarConfig | undefined): AvatarConfig {
  if (!avatar) {
    return { name: 'arcticons:emoji-cat', color: '#8d4f11' };
  }

  if (typeof avatar === 'string') {
    try {
      const parsed = JSON.parse(avatar);
      if (parsed.name && parsed.color) {
        return parsed;
      }
    } catch (e) {
      // Not JSON, treat as legacy format
    }
    return { name: 'arcticons:emoji-cat', color: '#8d4f11' };
  }

  return avatar;
}
