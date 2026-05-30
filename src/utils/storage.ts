import type { Rotation } from '../types';

const DB_KEY = 'rotamaster_db';
const SESSION_KEY = 'rotamaster_session';

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function loadAll(): Rotation[] {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? (JSON.parse(raw) as Rotation[]) : [];
  } catch {
    return [];
  }
}

function saveAll(rotations: Rotation[]): void {
  localStorage.setItem(DB_KEY, JSON.stringify(rotations));
}

export function saveRotation(rotation: Rotation): void {
  const all = loadAll();
  const idx = all.findIndex((r) => r.id === rotation.id);
  if (idx >= 0) {
    all[idx] = rotation;
  } else {
    all.unshift(rotation);
  }
  saveAll(all);
}

export function getRotations(): Rotation[] {
  return loadAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getRotationById(id: string): Rotation | null {
  return loadAll().find((r) => r.id === id) ?? null;
}

export function deleteRotation(id: string): void {
  saveAll(loadAll().filter((r) => r.id !== id));
}

export function toggleLike(rotationId: string): Rotation | null {
  const all = loadAll();
  const idx = all.findIndex((r) => r.id === rotationId);
  if (idx < 0) return null;
  const rotation = { ...all[idx] };
  const sessionId = getSessionId();
  if (rotation.likedBy.includes(sessionId)) {
    rotation.likedBy = rotation.likedBy.filter((s) => s !== sessionId);
    rotation.likes = Math.max(0, rotation.likes - 1);
  } else {
    rotation.likedBy = [...rotation.likedBy, sessionId];
    rotation.likes += 1;
  }
  all[idx] = rotation;
  saveAll(all);
  return rotation;
}

export function hasLiked(rotation: Rotation): boolean {
  return rotation.likedBy.includes(getSessionId());
}

export function getRanking(): Rotation[] {
  return loadAll().sort((a, b) => b.likes - a.likes);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
