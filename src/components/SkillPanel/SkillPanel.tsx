import { useState } from 'react';
import type { GameClass, Skill } from '../../types';
import { allSkills, classInfo, skillTypeConfig } from '../../data';
import { SkillCard } from '../SkillCard/SkillCard';

interface Props {
  selectedClass: GameClass;
  onClassChange: (c: GameClass) => void;
  onAddSkill: (skill: Skill) => void;
}

export function SkillPanel({ selectedClass, onClassChange, onAddSkill }: Props) {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const skills = allSkills[selectedClass];
  const filtered = skills.filter((s) => {
    const matchType = filter === 'all' || s.type === filter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const types = ['all', ...Array.from(new Set(skills.map((s) => s.type)))];

  return (
    <aside className="flex flex-col h-full bg-game-900 border-r border-white/5">
      <div className="p-4 border-b border-white/5 space-y-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Classe</h2>

        <div className="grid grid-cols-2 gap-2">
          {(['Gunner', 'Valkyrie'] as GameClass[]).map((cls) => {
            const info = classInfo[cls];
            const active = selectedClass === cls;
            return (
              <button
                key={cls}
                onClick={() => { onClassChange(cls); setFilter('all'); setSearch(''); }}
                className={`
                  flex flex-col items-center gap-1 p-3 rounded-lg border text-center
                  transition-all duration-200 cursor-pointer
                  ${active
                    ? `bg-gradient-to-br ${info.bgGradient} border-white/20 ${info.color}`
                    : 'bg-game-800/50 border-white/5 text-gray-400 hover:border-white/15 hover:text-gray-300'
                  }
                `}
              >
                <span className="text-xl">{cls === 'Gunner' ? '🔫' : '⚔️'}</span>
                <span className="text-xs font-semibold">{info.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-b border-white/5 space-y-2">
        <input
          type="text"
          placeholder="Buscar habilidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full px-3 py-2 rounded-lg text-sm
            bg-game-800 border border-white/10
            text-gray-200 placeholder-gray-500
            focus:outline-none focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/20
            transition-all duration-200
          "
        />

        <div className="flex flex-wrap gap-1">
          {types.map((t) => {
            const active = filter === t;
            const conf = t !== 'all' ? skillTypeConfig[t] : null;
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`
                  text-xs px-2 py-1 rounded-md border transition-all duration-150 font-medium
                  ${active
                    ? (conf ? conf.badge : 'bg-gold-600/20 text-gold-300 border-gold-600/40')
                    : 'bg-game-800/60 text-gray-500 border-white/5 hover:border-white/15 hover:text-gray-300'
                  }
                `}
              >
                {t === 'all' ? 'Todos' : skillTypeConfig[t]?.label ?? t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-8">Nenhuma habilidade encontrada</p>
        ) : (
          filtered.map((skill) => (
            <SkillCard key={skill.id} skill={skill} onAdd={onAddSkill} />
          ))
        )}
      </div>

      <div className="p-3 border-t border-white/5">
        <p className="text-xs text-gray-600 text-center">
          Arraste as habilidades ou clique em <span className="text-gold-500">+</span>
        </p>
      </div>
    </aside>
  );
}
