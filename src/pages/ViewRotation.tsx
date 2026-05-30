import { useSearchParams, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { decodeRotation, buildShareUrl, copyToClipboard } from '../utils/share';
import { SkillIcon } from '../components/SkillIcon/SkillIcon';
import { hasLiked, saveRotation, toggleLike } from '../utils/storage';
import { classInfo } from '../data';
import type { Rotation } from '../types';
import { exportAsImage } from '../utils/export';

export function ViewRotation() {
  const [searchParams] = useSearchParams();
  const encoded = searchParams.get('r');

  const rotation = useMemo<Rotation | null>(() => {
    if (!encoded) return null;
    return decodeRotation(encoded);
  }, [encoded]);

  const [liked, setLiked] = useState(() => (rotation ? hasLiked(rotation) : false));
  const [likes, setLikes] = useState(rotation?.likes ?? 0);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!rotation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="text-6xl opacity-30">⚠️</span>
        <h1 className="text-xl font-bold text-gray-300">Rotação não encontrada</h1>
        <p className="text-gray-500 text-sm">O link pode estar inválido ou expirado.</p>
        <Link to="/" className="btn-primary">← Criar nova rotação</Link>
      </div>
    );
  }

  const info = classInfo[rotation.class];
  const breakSet = new Set(rotation.breakAfterIndices ?? []);

  const handleLike = () => {
    const updated = toggleLike(rotation.id);
    if (updated) {
      setLiked(!liked);
      setLikes(updated.likes);
    } else {
      saveRotation({ ...rotation, likes, likedBy: [] });
      const updated2 = toggleLike(rotation.id);
      if (updated2) { setLiked(!liked); setLikes(updated2.likes); }
    }
  };

  const handleSaveToLib = () => {
    saveRotation({ ...rotation, likes, likedBy: rotation.likedBy ?? [] });
    setSaved(true);
  };

  const handleCopy = async () => {
    await copyToClipboard(buildShareUrl(rotation));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async () => {
    setIsExporting(true);
    await exportAsImage('view-rotation-area', `rotacao-${rotation.class.toLowerCase()}.png`);
    setIsExporting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <Link to="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          ← Criar nova rotação
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{rotation.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <span className={info.color}>⚔️ TERA {rotation.class}</span>
              <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-xs">
                {rotation.mode}
              </span>
              {rotation.authorName && <span>👤 {rotation.authorName}</span>}
              <span className="text-gray-600 text-xs">
                {new Date(rotation.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all flex-shrink-0 ${
              liked
                ? 'bg-red-900/30 text-red-400 border-red-700/50'
                : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/15'
            }`}
          >
            {liked ? '❤️' : '🤍'} {likes}
          </button>
        </div>

        {rotation.description && (
          <p className="text-sm text-gray-300 bg-game-900 border border-white/5 rounded-lg px-4 py-3">
            {rotation.description}
          </p>
        )}
      </div>

      {/* Rotation sequence */}
      <div
        id="view-rotation-area"
        className="bg-game-900 border border-white/10 rounded-xl p-5 space-y-3"
      >
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Sequência — {rotation.entries.length} passos
        </h2>

        <div className="flex flex-wrap gap-1.5">
          {rotation.entries.map((entry, i) => (
            <>
              <div
                key={entry.uid}
                className="flex flex-col items-center gap-0.5 px-1 pt-1 pb-1.5 rounded-lg bg-game-800 border border-white/10 w-[54px] flex-shrink-0"
              >
                <span className="text-[9px] font-bold text-gray-600 leading-none tabular-nums self-start pl-0.5">
                  {i + 1}
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
              </div>
              {breakSet.has(i) && i < rotation.entries.length - 1 && (
                <div key={`br-${i}`} className="w-full h-1" />
              )}
            </>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {!saved ? (
          <button onClick={handleSaveToLib} className="btn-primary flex items-center gap-2">
            💾 Salvar na minha biblioteca
          </button>
        ) : (
          <span className="btn-primary bg-green-800 border-green-600 cursor-default">✓ Salvo!</span>
        )}
        <button onClick={handleCopy} className="btn-secondary flex items-center gap-2">
          {copied ? '✓ Copiado!' : '🔗 Copiar Link'}
        </button>
        <button onClick={handleExport} disabled={isExporting} className="btn-secondary flex items-center gap-2">
          {isExporting ? '⏳ Exportando...' : '🖼️ Exportar Imagem'}
        </button>
        <Link to="/" className="btn-secondary flex items-center gap-2">
          ⚔️ Criar minha rotação
        </Link>
      </div>
    </div>
  );
}
