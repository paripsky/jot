import md5 from './md5';

export const avatarTypes = {
  gravatar: 'gravatar',
  initials: 'initials',
  adventurer: 'adventurer',
  adventurerNeutral: 'adventurer-neutral',
  avataaars: 'avataaars',
  bigEars: 'big-ears',
  bigEarsNeutral: 'big-ears-neutral',
  bigSmile: 'big-smile',
  bottts: 'bottts',
  croodles: 'croodles',
  croodlesNeutral: 'croodles-neutral',
  identicon: 'identicon',
  micah: 'micah',
  miniavs: 'miniavs',
  openPeeps: 'open-peeps',
  personas: 'personas',
  pixelArt: 'pixel-art',
  pixelArtNeutral: 'pixel-art-neutral',
} as const;

export type AvatarType = keyof typeof avatarTypes;

export function getAvatarUrl(email: string, avatarType: AvatarType) {
  const seed = email.split('@')[0];
  switch (avatarType) {
    case 'gravatar':
      return `https://www.gravatar.com/avatar/${md5(seed)}?s=200&d=identicon`;
    default:
      return `https://avatars.dicebear.com/api/${avatarTypes[avatarType]}/${seed}.svg`;
  }
}

export default getAvatarUrl;
