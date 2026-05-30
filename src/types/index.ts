export type SkillType = 'attack' | 'magic' | 'mobility' | 'buff' | 'ultimate' | 'support' | 'defensive';
export type GameMode = 'PvE' | 'PvP' | 'Dungeon' | 'Raid' | 'Solo' | '3x3';
export type GameClass = 'Gunner' | 'Valkyrie';
export type Game = 'TERA';

export interface Skill {
  id: string;
  name: string;
  icon: string;
  color: string;
  borderColor: string;
  type: SkillType;
  class: GameClass;
  game: Game;
  description: string;
  cooldown?: number;
  manaCost?: number;
}

export interface RotationEntry {
  uid: string;
  skillId: string;
  skill: Skill;
}

export interface Rotation {
  id: string;
  title: string;
  description: string;
  class: GameClass;
  game: Game;
  mode: GameMode;
  entries: RotationEntry[];
  breakAfterIndices?: number[];
  likes: number;
  likedBy: string[];
  createdAt: string;
  authorName: string;
}

export interface DragData {
  type: 'skill' | 'rotation-entry';
  skillId?: string;
  skill?: Skill;
  uid?: string;
}
