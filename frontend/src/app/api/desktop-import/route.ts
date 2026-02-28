/**
 * @project AncestorTree
 * @file src/app/api/desktop-import/route.ts
 * @description ZIP import engine for desktop mode.
 *              Reads manifest.json from ZIP, validates format, clears existing
 *              data and restores all tables. Profiles table is skipped (CTO Obs 3).
 * @version 1.0.0
 * @updated 2026-02-26
 */

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import os from 'os';
import AdmZip from 'adm-zip';
import { getDatabase, flushToDisk } from '../desktop-db/sqlite-db';

const IMPORT_TABLES = [
  // Order matters for FK constraints
  'people',
  'families',
  'children',
  'contributions',
  'events',
  'media',
  'achievements',
  'fund_transactions',
  'scholarships',
  'clan_articles',
  'cau_duong_pools',
  'cau_duong_assignments',
] as const;

function guardDesktopOnly(): NextResponse | null {
  if (process.env.NEXT_PUBLIC_DESKTOP_MODE !== 'true' && process.env.DESKTOP_MODE !== 'true') {
    return NextResponse.json({ error: 'Desktop-only endpoint' }, { status: 404 });
  }
  return null;
}

export async function POST(request: NextRequest) {
  const guard = guardDesktopOnly();
  if (guard) return guard;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const zip = new AdmZip(Buffer.from(arrayBuffer));

    // ── Read and validate manifest ─────────────────────────────────────────
    const manifestEntry = zip.getEntry('manifest.json');
    if (!manifestEntry) {
      return NextResponse.json({ error: 'Invalid ZIP: missing manifest.json' }, { status: 400 });
    }

    const manifest = JSON.parse(manifestEntry.getData().toString('utf-8'));
    if (!manifest.version || !manifest.tables) {
      return NextResponse.json({ error: 'Invalid manifest format' }, { status: 400 });
    }

    const db = await getDatabase();

    // ── Clear existing data (reverse FK order) ─────────────────────────────
    const deleteOrder = [...IMPORT_TABLES].reverse();
    for (const table of deleteOrder) {
      db.run(`DELETE FROM "${table}"`);
    }

    // ── Insert rows per table ──────────────────────────────────────────────
    let totalInserted = 0;
    const errors: string[] = [];

    for (const table of IMPORT_TABLES) {
      const rows = manifest.tables[table] as Record<string, unknown>[] | undefined;
      if (!rows || rows.length === 0) continue;

      for (const row of rows) {
        try {
          const columns = Object.keys(row);
          const values = Object.values(row);
          const placeholders = columns.map(() => '?').join(', ');
          const sql = `INSERT OR IGNORE INTO "${table}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders})`;
          db.run(sql, values);
          totalInserted++;
        } catch (err) {
          errors.push(`${table}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }

    // ── Restore media files (if inline) ───────────────────────────────────
    let mediaRestored = 0;
    if (manifest.include_media === 'inline') {
      const mediaRoot = path.join(
        process.env.DESKTOP_DATA_DIR || path.join(os.homedir(), 'AncestorTree'),
        'media'
      );
      for (const entry of zip.getEntries()) {
        if (entry.entryName.startsWith('media/') && !entry.isDirectory) {
          const destPath = path.join(mediaRoot, entry.entryName.slice('media/'.length));
          const destDir = path.dirname(destPath);
          if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
          fs.writeFileSync(destPath, entry.getData());
          mediaRestored++;
        }
      }
    }

    flushToDisk();

    return NextResponse.json({
      ok: true,
      tables: Object.fromEntries(
        IMPORT_TABLES.map(t => [t, (manifest.tables[t] as unknown[] | undefined)?.length ?? 0])
      ),
      total_inserted: totalInserted,
      media_restored: mediaRestored,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Import failed' },
      { status: 500 }
    );
  }
}
