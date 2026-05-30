import { Link } from 'react-router-dom';
import type { Rotation } from '../../types';
import { SkillIcon } from '../SkillIcon/SkillIcon';
import { hasLiked, toggleLike } from '../../utils/storage';
import { buildShareUrl, copyToClipboard, encodeRotation } from '../../utils/share';
import { useState } from 'react';
import { classInfo } from '../../data';

interface Props {
  rotation: Rotation;
  rank?: number;
  onLikeToggle?: (updated: Rotation) => void;
}

export function RotationCard({ rotation, rank, onLikeToggle }: Props) {
  const [liked, setLiked] = useState(hasLiked(rotation));
  const [likes, setLikes] = useState(rotation.likes);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    const updated = toggleLike(rotation.id);
    if (updated) {
      setLiked(!liked);
      setLikes(updated.likes);
      onLikeToggle?.(updated);
    }
  };

  const handleShare = async () => {
    await copyToClipboard(buildShareUrl(rotation));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const info = classInfo[rotation.class];
  const preview = rotation.entries.slice(0, 8);

  return (
    <div className="group bg-game-900 border border-white/5 rounded-xl overflow-hidden hover:border-white/15 transition-all duration-200 shadow-game hover:shadow-game-hover">
      <div className={`h-1 bg-gradient-to-r ${info.bgGradient.replace('/40', '').replace('/30', '')}`} />

      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {rank !== undefined && (
                <span className={`text-sm font-black ${rank === 0 ? 'text-yellow-400' : rank === 1 ? 'text-gray-300' : rank === 2 ? 'text-amber-600' : 'text-gray-600'}`}>
                  #{rank + 1}
                </span>
              )}
              <h3 className="font-bold text-gray-100 truncate">{rotation.title}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
              <span className={info.color}>⚔️ {rotation.class}</span>
              <span className="bg-white/5 px-2 py-0.5 rounded-full">{rotation.mode}</span>
              {rotation.authorName && <span>👤 {rotation.authorName}</span>}
              <span className="text-gray-600">
                {new Date(rotation.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {rotation.description && (
          <p className="text-xs text-gray-400 line-clamp-2">{rotation.description}</p>
        )}

        {/* Skill preview */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {preview.map((entry, i) => (
            <div key={entry.uid} className="relative flex items-center gap-1">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[9px] text-gray-600">{i + 1}</span>
                <SkillIcon skill={entry.skill} size="sm" />
              </div>
              {i < preview.length - 1 && <span className="text-gray-700 text-xs">›</span>}
            </div>
          ))}
          {rotation.entries.length > 8 && (
            <span className="text-xs text-gray-500 ml-1">+{rotation.entries.length - 8}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
          <button
            onClick={handleLike}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              border transition-all duration-150
              ${liked
                ? 'bg-red-900/30 text-red-400 border-red-700/50'
                : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/15 hover:text-gray-200'
              }
            `}
          >
            {liked ? '❤️' : '🤍'} {likes}
          </button>

          <Link
            to={`/view?r=${encodeRotation(rotation)}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-400 border border-white/5 hover:border-white/15 hover:text-gray-200 transition-all duration-150"
          >
            👁️ Ver
          </Link>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-400 border border-white/5 hover:border-white/15 hover:text-gray-200 transition-all duration-150 ml-auto"
          >
            {copied ? '✓ Copiado' : '🔗 Copiar Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
