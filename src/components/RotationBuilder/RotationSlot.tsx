import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { RotationEntry } from '../../types';
import { SkillIcon } from '../SkillIcon/SkillIcon';

interface Props {
  entry: RotationEntry;
  index: number;
  onRemove: (uid: string) => void;
  hasBreakAfter: boolean;
  onToggleBreak: (uid: string) => void;
}

export function RotationSlot({ entry, index, onRemove, hasBreakAfter, onToggleBreak }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.uid,
    data: { type: 'rotation-entry', uid: entry.uid },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group/slot relative flex-shrink-0 pb-3
        transition-opacity duration-200
        ${isDragging ? 'opacity-30 scale-95' : 'opacity-100'}
      `}
    >
      {/* Skill card */}
      <div
        {...listeners}
        {...attributes}
        className={`
          relative flex flex-col items-center gap-0.5 px-1 pt-1 pb-1.5 rounded-lg
          bg-game-800 border border-white/10
          hover:border-white/25 hover:bg-game-700
          cursor-grab active:cursor-grabbing
          transition-all duration-200 w-[54px]
          ${hasBreakAfter ? 'border-b-2 border-b-blue-500/60' : ''}
        `}
      >
        <span className="text-[9px] font-bold text-gray-600 leading-none tabular-nums self-start pl-0.5">
          {index + 1}
        </span>
        <SkillIcon skill={entry.skill} size="sm" />
        <span
          className="text-[7px] text-gray-400 text-center leading-tight w-full px-0.5 min-h-[1.6em]"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word',
          }}
        >
          {entry.skill.name}
        </span>

        {/* Remove button */}
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onRemove(entry.uid); }}
          className="
            absolute -top-1 -right-1 w-4 h-4 rounded-full
            bg-red-700 border border-red-500 text-white text-[10px]
            items-center justify-center leading-none
            hidden group-hover/slot:flex
            hover:bg-red-600 transition-all duration-150 z-10
          "
          title="Remover"
        >
          ×
        </button>
      </div>

      {/* Break line toggle button — appears below the slot */}
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onToggleBreak(entry.uid); }}
        title={hasBreakAfter ? 'Remover quebra de linha' : 'Quebrar linha após esta skill'}
        className={`
          absolute bottom-0 left-1/2 -translate-x-1/2
          w-[36px] h-[10px] rounded-sm text-[7px] leading-none font-bold
          border flex items-center justify-center gap-0.5
          transition-all duration-150 z-20
          ${hasBreakAfter
            ? 'bg-blue-700/80 text-blue-200 border-blue-500/80 opacity-100'
            : 'bg-game-800 text-gray-600 border-white/10 opacity-0 group-hover/slot:opacity-100 hover:border-white/30 hover:text-gray-300'
          }
        `}
      >
        ↵
      </button>
    </div>
  );
}
