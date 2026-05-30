import { useState } from 'react';
import type { Rotation } from '../../types';
import { buildShareUrl, copyToClipboard } from '../../utils/share';

interface Props {
  rotation: Rotation;
  onClose: () => void;
}

export function ShareModal({ rotation, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl = buildShareUrl(rotation);

  const handleCopy = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md mx-4 bg-game-900 border border-white/10 rounded-2xl shadow-game-hover animate-slide-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-base font-bold text-white">Compartilhar Rotação</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Rotation summary */}
          <div className="p-4 rounded-xl bg-game-800 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-100">{rotation.title}</p>
              <span className="text-xs text-gray-500 bg-game-700 px-2 py-0.5 rounded-full">
                {rotation.mode}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>⚔️ {rotation.class}</span>
              <span>📋 {rotation.entries.length} passos</span>
              {rotation.authorName && <span>👤 {rotation.authorName}</span>}
            </div>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Link para compartilhar
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 input-field text-xs text-gray-400 cursor-text"
                onFocus={(e) => e.target.select()}
              />
              <button onClick={handleCopy} className={`btn-primary px-4 flex-shrink-0 ${copied ? 'bg-green-700 border-green-600' : ''}`}>
                {copied ? '✓' : '📋'}
              </button>
            </div>
            {copied && (
              <p className="text-xs text-green-400 animate-fade-in">Link copiado para a área de transferência!</p>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center">
            Qualquer pessoa com o link pode visualizar esta rotação.
            A rotação também ficará disponível no <strong className="text-gray-400">Ranking</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
