import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { GameClass, GameMode, Rotation, RotationEntry, Skill } from '../../types';
import { SkillTopBar } from '../SkillTopBar/SkillTopBar';
import { RotationSlot } from './RotationSlot';
import { SkillIcon } from '../SkillIcon/SkillIcon';
import { ShareModal } from '../ShareModal/ShareModal';
import { exportAsImage } from '../../utils/export';
import { saveRotation, generateId } from '../../utils/storage';

const MAX_STEPS = 80;
const EXPORT_ID = 'rotation-export-area';

function DropZone({ children, hasItems }: { children: React.ReactNode; hasItems: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'rotation-drop-zone' });
  return (
    <div
      ref={setNodeRef}
      id={EXPORT_ID}
      className={`
        min-h-32 rounded-xl border-2 border-dashed p-3
        transition-all duration-200
        ${isOver
          ? 'border-gold-500/60 bg-gold-500/5'
          : hasItems ? 'border-white/10 bg-transparent' : 'border-white/10 bg-game-900/30'
        }
      `}
    >
      {children}
    </div>
  );
}

export function RotationBuilder() {
  const [selectedClass, setSelectedClass] = useState<GameClass>('Gunner');
  const [entries, setEntries] = useState<RotationEntry[]>([]);
  const [breaks, setBreaks] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [mode, setMode] = useState<GameMode>('PvE');
  const [showShare, setShowShare] = useState(false);
  const [savedRotation, setSavedRotation] = useState<Rotation | null>(null);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const addSkill = (skill: Skill) => {
    if (entries.length >= MAX_STEPS) return;
    setEntries((prev) => [...prev, { uid: generateId(), skillId: skill.id, skill }]);
  };

  const removeEntry = (uid: string) => {
    setEntries((prev) => prev.filter((e) => e.uid !== uid));
    setBreaks((prev) => { const n = new Set(prev); n.delete(uid); return n; });
  };

  const clearAll = () => { setEntries([]); setBreaks(new Set()); };

  const toggleBreak = (uid: string) => {
    setBreaks((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid); else next.add(uid);
      return next;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.type === 'skill') setActiveSkill(data.skill as Skill);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveSkill(null);
    const { active, over } = event;
    if (!over) return;
    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === 'skill') {
      if (over.id === 'rotation-drop-zone' || overData?.type === 'rotation-entry') {
        addSkill(activeData.skill as Skill);
      }
      return;
    }
    if (activeData?.type === 'rotation-entry' && active.id !== over.id) {
      setEntries((prev) => {
        const oldIdx = prev.findIndex((e) => e.uid === active.id);
        const newIdx = prev.findIndex((e) => e.uid === over.id);
        if (oldIdx < 0 || newIdx < 0) return prev;
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  };

  const buildRotation = (): Rotation => {
    const breakAfterIndices = entries
      .map((e, i) => (breaks.has(e.uid) ? i : -1))
      .filter((i) => i >= 0);
    return {
      id: savedRotation?.id ?? generateId(),
      title: title.trim() || `Rotação de ${selectedClass}`,
      description: description.trim(),
      class: selectedClass,
      game: 'TERA',
      mode,
      entries,
      breakAfterIndices,
      likes: savedRotation?.likes ?? 0,
      likedBy: savedRotation?.likedBy ?? [],
      createdAt: savedRotation?.createdAt ?? new Date().toISOString(),
      authorName: authorName.trim() || 'Anônimo',
    };
  };

  const handleSaveAndShare = () => {
    if (entries.length === 0) return;
    const rotation = buildRotation();
    saveRotation(rotation);
    setSavedRotation(rotation);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
    setShowShare(true);
  };

  const handleExport = async () => {
    setIsExporting(true);
    await exportAsImage(EXPORT_ID, `rotacao-${selectedClass.toLowerCase()}.png`);
    setIsExporting(false);
  };

  const modes: GameMode[] = ['PvE', 'PvP', 'Dungeon', 'Raid', 'Solo', '3x3'];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full">
        {/* ── Top skill bar ─────────────────────── */}
        <SkillTopBar
          selectedClass={selectedClass}
          onClassChange={(cls) => { setSelectedClass(cls); setEntries([]); setBreaks(new Set()); }}
          onAddSkill={addSkill}
        />

        {/* ── Rotation area ─────────────────────── */}
        <div className="flex-1 overflow-y-auto bg-game-950">
          <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">

            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Nome da rotação..."
                maxLength={60}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field col-span-2 text-sm"
              />
              <input
                type="text"
                placeholder="Nick (opcional)"
                maxLength={30}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="input-field text-sm"
              />
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as GameMode)}
                className="input-field text-sm"
              >
                {modes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <textarea
              placeholder="Descrição da rotação, dicas de uso..."
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={1}
              className="input-field w-full resize-none text-sm"
            />

            {/* Sequence header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Sequência
                </h2>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  entries.length >= MAX_STEPS
                    ? 'text-red-400 border-red-600/40 bg-red-900/20'
                    : 'text-gray-400 border-white/10 bg-white/5'
                }`}>
                  {entries.length}/{MAX_STEPS}
                </span>
                {breaks.size > 0 && (
                  <span className="text-[10px] text-blue-400 flex items-center gap-1">
                    ↵ {breaks.size} quebra{breaks.size > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {entries.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                >
                  🗑️ Limpar tudo
                </button>
              )}
            </div>

            {/* Hint when there are entries */}
            {entries.length > 0 && (
              <p className="text-[10px] text-gray-600 -mt-2">
                Passe o mouse sobre uma skill e clique em <span className="text-blue-400 font-bold">↵</span> para quebrar a linha naquele ponto.
              </p>
            )}

            {/* Rotation drop zone */}
            <SortableContext items={entries.map((e) => e.uid)} strategy={rectSortingStrategy}>
              <DropZone hasItems={entries.length > 0}>
                {entries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                    <span className="text-3xl opacity-20">⚔️</span>
                    <p className="text-gray-500 text-sm">Clique nas skills acima ou arraste para cá</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {entries.map((entry, i) => (
                      <>
                        <RotationSlot
                          key={entry.uid}
                          entry={entry}
                          index={i}
                          onRemove={removeEntry}
                          hasBreakAfter={breaks.has(entry.uid)}
                          onToggleBreak={toggleBreak}
                        />
                        {/* Manual line break: inserts a w-full div forcing next row */}
                        {breaks.has(entry.uid) && i < entries.length - 1 && (
                          <div key={`break-${entry.uid}`} className="w-full h-1" />
                        )}
                      </>
                    ))}
                    {entries.length < MAX_STEPS && (
                      <div className="w-[54px] h-[68px] rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center text-gray-600 text-lg flex-shrink-0">
                        +
                      </div>
                    )}
                  </div>
                )}
              </DropZone>
            </SortableContext>

            {/* Actions */}
            {entries.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button onClick={handleSaveAndShare} className="btn-primary flex items-center gap-2">
                  {saveStatus === 'saved' ? '✓ Salvo!' : '🔗 Salvar e Compartilhar'}
                </button>
                <button onClick={handleExport} disabled={isExporting} className="btn-secondary flex items-center gap-2">
                  {isExporting ? '⏳ Exportando...' : '🖼️ Exportar Imagem'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
        {activeSkill && (
          <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-game-800 border border-gold-500/40 shadow-gold w-[52px] opacity-90 rotate-2">
            <SkillIcon skill={activeSkill} size="sm" isDragging />
            <span className="text-[7px] text-gray-300 truncate w-full text-center">
              {activeSkill.name.split(' ')[0]}
            </span>
          </div>
        )}
      </DragOverlay>

      {showShare && savedRotation && (
        <ShareModal rotation={savedRotation} onClose={() => setShowShare(false)} />
      )}
    </DndContext>
  );
}
