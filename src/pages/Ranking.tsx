import { useState, useEffect } from 'react';
import type { GameClass, GameMode, Rotation } from '../types';
import { getRanking } from '../utils/storage';
import { RotationCard } from '../components/RotationCard/RotationCard';
import { Link } from 'react-router-dom';

const CLASS_FILTERS: Array<{ value: '' | GameClass; label: string }> = [
  { value: '', label: 'Todas as classes' },
  { value: 'Gunner', label: '🔫 Gunner' },
  { value: 'Valkyrie', label: '⚔️ Valkyrie' },
];

const MODE_FILTERS: Array<{ value: '' | GameMode; label: string }> = [
  { value: '', label: 'Todos os modos' },
  { value: 'PvE', label: 'PvE' },
  { value: 'PvP', label: 'PvP' },
  { value: 'Dungeon', label: 'Dungeon' },
  { value: 'Raid', label: 'Raid' },
  { value: 'Solo', label: 'Solo' },
  { value: '3x3', label: '3x3' },
];

export function Ranking() {
  const [rotations, setRotations] = useState<Rotation[]>([]);
  const [classFilter, setClassFilter] = useState<'' | GameClass>('');
  const [modeFilter, setModeFilter] = useState<'' | GameMode>('');
  const [sort, setSort] = useState<'likes' | 'recent'>('likes');

  useEffect(() => {
    setRotations(getRanking());
  }, []);

  const filtered = rotations
    .filter((r) => !classFilter || r.class === classFilter)
    .filter((r) => !modeFilter || r.mode === modeFilter)
    .sort((a, b) => {
      if (sort === 'likes') return b.likes - a.likes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleLikeToggle = (updated: Rotation) => {
    setRotations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">🏆 Ranking de Rotações</h1>
        <p className="text-gray-400 text-sm">
          Rotações criadas e salvas neste dispositivo, ordenadas por popularidade.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-1 bg-game-900 border border-white/5 rounded-lg p-1">
          <button
            onClick={() => setSort('likes')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              sort === 'likes' ? 'bg-gold-600/20 text-gold-400' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            ❤️ Curtidas
          </button>
          <button
            onClick={() => setSort('recent')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              sort === 'recent' ? 'bg-gold-600/20 text-gold-400' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            🕐 Recentes
          </button>
        </div>

        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value as '' | GameClass)}
          className="input-field text-sm py-1.5 px-3"
        >
          {CLASS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <select
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value as '' | GameMode)}
          className="input-field text-sm py-1.5 px-3"
        >
          {MODE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <span className="text-5xl opacity-20">🏆</span>
          <h2 className="text-lg font-semibold text-gray-400">Nenhuma rotação encontrada</h2>
          <p className="text-sm text-gray-500">
            {rotations.length === 0
              ? 'Crie e salve sua primeira rotação para ela aparecer aqui!'
              : 'Tente ajustar os filtros acima.'}
          </p>
          {rotations.length === 0 && (
            <Link to="/" className="btn-primary mt-2">⚔️ Criar rotação</Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((rotation, idx) => (
            <RotationCard
              key={rotation.id}
              rotation={rotation}
              rank={sort === 'likes' ? idx : undefined}
              onLikeToggle={handleLikeToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
