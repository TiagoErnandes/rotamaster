import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { GameClass, Skill } from '../../types';
import { allSkills, classInfo } from '../../data';
import { SkillIcon } from '../SkillIcon/SkillIcon';

function SkillChip({ skill, onAdd }: { skill: Skill; onAdd: (s: Skill) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `skill-${skill.id}`,
    data: { type: 'skill', skill },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      title={skill.name}
      className={`
        group relative flex flex-col items-center gap-0.5 p-1.5 rounded-lg
        bg-game-800 border border-white/5 hover:border-white/20 hover:bg-game-700
        cursor-grab active:cursor-grabbing select-none flex-shrink-0 w-[52px]
        transition-all duration-150
        ${isDragging ? 'opacity-30 scale-95' : 'opacity-100'}
      `}
    >
      <SkillIcon skill={skill} size="sm" isDragging={isDragging} />
      <span className="text-[7px] text-gray-500 group-hover:text-gray-300 leading-none w-full text-center truncate">
        {skill.name.split(' ')[0]}
      </span>
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onAdd(skill); }}
        className="absolute inset-0 rounded-lg"
        aria-label={`Adicionar ${skill.name}`}
      />
    </div>
  );
}

interface Props {
  selectedClass: GameClass;
  onClassChange: (c: GameClass) => void;
  onAddSkill: (skill: Skill) => void;
}

export function SkillTopBar({ selectedClass, onClassChange, onAddSkill }: Props) {
  const [search, setSearch] = useState('');

  const skills = allSkills[selectedClass];
  const filtered = search
    ? skills.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : skills;

  return (
    <div className="flex-shrink-0 bg-game-900 border-b border-white/5">
      {/* Controls row */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.04]">
        {/* Class buttons */}
        <div className="flex gap-1.5">
          {(['Gunner', 'Valkyrie'] as GameClass[]).map((cls) => {
            const info = classInfo[cls];
            const active = selectedClass === cls;
            return (
              <button
                key={cls}
                onClick={() => { onClassChange(cls); setSearch(''); }}
                className={`
                  flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold
                  border transition-all duration-200
                  ${active
                    ? `bg-gradient-to-br ${info.bgGradient} border-white/20 ${info.color}`
                    : 'bg-game-800/50 border-white/5 text-gray-400 hover:border-white/15 hover:text-gray-300'}
                `}
              >
                <span>{cls === 'Gunner' ? '🔫' : '⚔️'}</span>
                {cls}
              </button>
            );
          })}
        </div>

        <div className="w-px h-4 bg-white/10" />

        <input
          type="text"
          placeholder="Buscar skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field py-0.5 text-xs w-36"
        />

        <span className="text-[10px] text-gray-600 ml-auto hidden sm:block">
          Clique ou arraste para a sequência ↓
        </span>
      </div>

      {/* Skills strip */}
      <div className="flex items-end gap-1.5 px-4 py-2 overflow-x-auto scrollbar-thin min-h-[60px]">
        {filtered.length === 0 ? (
          <p className="text-xs text-gray-600 py-1">Nenhuma skill encontrada</p>
        ) : (
          filtered.map((skill) => (
            <SkillChip key={skill.id} skill={skill} onAdd={onAddSkill} />
          ))
        )}
      </div>
    </div>
  );
}
