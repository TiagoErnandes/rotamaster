import type { GameClass, Game, GameMode, Rotation, RotationEntry, Skill } from '../types';
import { allSkills } from '../data';

// v2: stores only skill IDs instead of full skill objects (~16x smaller URL)
interface CompactV2 {
  v: 2;
  id: string;
  title: string;
  description: string;
  class: GameClass;
  game: Game;
  mode: GameMode;
  s: string[];
  bp?: number[];
  likes: number;
  likedBy: string[];
  createdAt: string;
  authorName: string;
}

export function encodeRotation(rotation: Rotation): string {
  const compact: CompactV2 = {
    v: 2,
    id: rotation.id,
    title: rotation.title,
    description: rotation.description,
    class: rotation.class,
    game: rotation.game,
    mode: rotation.mode,
    s: rotation.entries.map(e => e.skillId),
    ...(rotation.breakAfterIndices?.length ? { bp: rotation.breakAfterIndices } : {}),
    likes: rotation.likes,
    likedBy: rotation.likedBy,
    createdAt: rotation.createdAt,
    authorName: rotation.authorName,
  };
  return btoa(encodeURIComponent(JSON.stringify(compact)));
}

function expandV2(compact: CompactV2): Rotation | null {
  const skillMap = new Map<string, Skill>();
  Object.values(allSkills).flat().forEach((s: Skill) => skillMap.set(s.id, s));

  const entries: RotationEntry[] = compact.s
    .map((skillId) => {
      const skill = skillMap.get(skillId);
      if (!skill) return null;
      return {
        uid: Math.random().toString(36).slice(2) + Date.now().toString(36),
        skillId,
        skill,
      };
    })
    .filter((e): e is RotationEntry => e !== null);

  return {
    id: compact.id,
    title: compact.title,
    description: compact.description,
    class: compact.class,
    game: compact.game,
    mode: compact.mode,
    entries,
    breakAfterIndices: compact.bp ?? [],
    likes: compact.likes,
    likedBy: compact.likedBy,
    createdAt: compact.createdAt,
    authorName: compact.authorName,
  };
}

export function decodeRotation(encoded: string): Rotation | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(json);

    if (parsed.v === 2) {
      return expandV2(parsed as CompactV2);
    }

    // Legacy v1: full skill objects embedded — still works
    return parsed as Rotation;
  } catch {
    return null;
  }
}

export function buildShareUrl(rotation: Rotation): string {
  const encoded = encodeRotation(rotation);
  const base = window.location.origin + window.location.pathname.replace(/\/$/, '');
  return `${base}/view?r=${encoded}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  }
}
