import type { Skill } from '../../types';

interface Props {
  skill: Skill;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isDragging?: boolean;
}

const sizes = {
  sm: { wrapper: 'w-8 h-8',   img: 'w-6 h-6',   emoji: 'text-lg',  ring: 'ring-1' },
  md: { wrapper: 'w-10 h-10', img: 'w-8 h-8',   emoji: 'text-xl',  ring: 'ring-1' },
  lg: { wrapper: 'w-12 h-12', img: 'w-10 h-10', emoji: 'text-2xl', ring: 'ring-2' },
  xl: { wrapper: 'w-16 h-16', img: 'w-13 h-13', emoji: 'text-3xl', ring: 'ring-2' },
};

const isUrl = (s: string) => s.startsWith('http') || s.startsWith('/') || s.startsWith('data:image/');

export function SkillIcon({ skill, size = 'md', isDragging = false }: Props) {
  const s = sizes[size];
  return (
    <div
      className={`
        ${s.wrapper} relative flex items-center justify-center rounded-lg
        bg-gradient-to-br ${skill.color}
        ${s.ring} ring-white/10
        ${isDragging ? 'ring-white/30 scale-110' : ''}
        shadow-skill overflow-hidden flex-shrink-0
        transition-transform duration-150
      `}
    >
      {isUrl(skill.icon) ? (
        <img
          src={skill.icon}
          alt={skill.name}
          className={`${s.img} object-contain select-none`}
          draggable={false}
          loading="lazy"
        />
      ) : (
        <span className={`${s.emoji} select-none leading-none`}>{skill.icon}</span>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
    </div>
  );
}
