/**
 * Atomic & Revision-Aware State I/O Engine (AEW V3)
 * 
 * Provides concurrency-safe state persistence:
 * - Atomic file writes via tempfile + rename
 * - Optimistic concurrency control via revision/stateVersion checks
 * - Append-only event stream logging to .ai/state/events.jsonl
 */

const fs = require('fs');
const path = require('path');

const stateDir = path.join(__dirname, '../state');
const eventsPath = path.join(stateDir, 'events.jsonl');

/**
 * Append an immutable event to events.jsonl
 */
function appendEvent(eventType, payload = {}) {
  try {
    if (!fs.existsSync(stateDir)) fs.mkdirSync(stateDir, { recursive: true });
    const event = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      type: eventType,
      payload
    };
    fs.appendFileSync(eventsPath, JSON.stringify(event) + '\n', 'utf8');
    return event;
  } catch (err) {
    console.error(`[state-io] Failed to append event: ${err.message}`);
    return null;
  }
}

/**
 * Atomically write a JSON file with optional optimistic revision checking
 */
function writeJsonAtomic(filePath, data, expectedRevision = null) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (expectedRevision !== null && fs.existsSync(filePath)) {
    try {
      const current = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const currentRev = current.revision ?? current.stateVersion ?? 0;
      if (currentRev !== expectedRevision) {
        throw new Error(`Concurrency conflict in ${path.basename(filePath)}: expected revision ${expectedRevision}, found ${currentRev}`);
      }
    } catch (err) {
      if (err.message.includes('Concurrency conflict')) throw err;
      // If file parse failed, allow rewrite
    }
  }

  // Increment revision
  const currentRev = data.revision ?? data.stateVersion ?? 0;
  data.revision = (typeof currentRev === 'number' ? currentRev : 0) + 1;
  data.lastUpdated = new Date().toISOString();

  const tempPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 8)}`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');

  try {
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    // Windows fallback if rename throws EPERM/EEXIST
    fs.copyFileSync(tempPath, filePath);
    try { fs.unlinkSync(tempPath); } catch (_) {}
  }

  // Log state mutation event
  appendEvent('STATE_MUTATION', {
    file: path.basename(filePath),
    newRevision: data.revision
  });

  return data;
}

/**
 * Safely load a JSON file
 */
function readJson(filePath, defaultValue = null) {
  if (!fs.existsSync(filePath)) return defaultValue;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`[state-io] Error reading ${filePath}: ${err.message}`);
    return defaultValue;
  }
}

module.exports = {
  writeJsonAtomic,
  readJson,
  appendEvent,
  stateDir,
  eventsPath
};
