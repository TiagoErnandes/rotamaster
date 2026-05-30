import { useDraggable } from '@dnd-kit/core';
import type { Skill } from '../../types';
import { SkillIcon } from '../SkillIcon/SkillIcon';

interface Props {
  skill: Skill;
  onAdd: (skill: Skill) => void;
}

export function SkillCard({ skill, onAdd }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `skill-${skill.id}`,
    data: { type: 'skill', skill },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        group relative flex items-center gap-3 p-3 rounded-lg cursor-grab active:cursor-grabbing
        bg-game-800 border border-white/5
        hover:border-white/15 hover:bg-game-700
        transition-all duration-200 select-none
        ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'}
      `}
    >
      <SkillIcon skill={skill} size="md" />
      <p className="flex-1 text-sm font-semibold text-gray-100 truncate leading-tight">{skill.name}</p>
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onAdd(skill); }}
        className="
          flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center
          bg-gold-600/20 text-gold-400 border border-gold-600/30
          hover:bg-gold-600/40 hover:text-gold-300
          opacity-0 group-hover:opacity-100
          transition-all duration-150 text-base leading-none
        "
        title="Adicionar à rotação"
      >
        +
      </button>
    </div>
  );
}
