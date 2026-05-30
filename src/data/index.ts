import { gunnerSkills } from './skills/gunner';
import { valkyrieSkills } from './skills/valkyrie';
import type { GameClass, Skill } from '../types';

export const allSkills: Record<GameClass, Skill[]> = {
  Gunner: gunnerSkills,
  Valkyrie: valkyrieSkills,
};

export const classes: GameClass[] = ['Gunner', 'Valkyrie'];

export const classInfo: Record<GameClass, { label: string; description: string; color: string; bgGradient: string }> = {
  Gunner: {
    label: 'Gunner',
    description: 'Especialista em combate à distância com armas de fogo mágicas',
    color: 'text-orange-400',
    bgGradient: 'from-orange-900/40 to-red-900/30',
  },
  Valkyrie: {
    label: 'Valkyrie',
    description: 'Guerreira com poderes rúnicos nórdicos e lança poderosa',
    color: 'text-violet-400',
    bgGradient: 'from-violet-900/40 to-indigo-900/30',
  },
};

export const skillTypeConfig: Record<string, { label: string; color: string; badge: string }> = {
  attack:    { label: 'Ataque',   color: 'text-red-400',    badge: 'bg-red-900/50 text-red-300 border-red-700' },
  magic:     { label: 'Magia',    color: 'text-blue-400',   badge: 'bg-blue-900/50 text-blue-300 border-blue-700' },
  mobility:  { label: 'Mobilidade', color: 'text-green-400', badge: 'bg-green-900/50 text-green-300 border-green-700' },
  buff:      { label: 'Buff',     color: 'text-yellow-400', badge: 'bg-yellow-900/50 text-yellow-300 border-yellow-700' },
  ultimate:  { label: 'Ultimate', color: 'text-orange-400', badge: 'bg-orange-900/50 text-orange-300 border-orange-700' },
  support:   { label: 'Suporte',  color: 'text-cyan-400',   badge: 'bg-cyan-900/50 text-cyan-300 border-cyan-700' },
  defensive: { label: 'Defesa',   color: 'text-teal-400',   badge: 'bg-teal-900/50 text-teal-300 border-teal-700' },
};
