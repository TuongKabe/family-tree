/**
 * @project AncestorTree
 * @file src/lib/supabase-data-charter.ts
 * @description Supabase data functions for clan articles (hương ước)
 * @version 1.0.0
 * @updated 2026-02-25
 */

import { supabase } from './supabase';
import type { ClanArticle, ClanArticleCategory, CreateClanArticleInput, UpdateClanArticleInput } from '@/types';

export async function getClanArticles(category?: ClanArticleCategory): Promise<ClanArticle[]> {
  let query = supabase
    .from('clan_articles')
    .select('*')
    .order('sort_order', { ascending: true });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getClanArticle(id: string): Promise<ClanArticle | null> {
  const { data, error } = await supabase
    .from('clan_articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function getFeaturedArticles(): Promise<ClanArticle[]> {
  const { data, error } = await supabase
    .from('clan_articles')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createClanArticle(input: CreateClanArticleInput): Promise<ClanArticle> {
  const { data, error } = await supabase
    .from('clan_articles')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClanArticle(id: string, input: UpdateClanArticleInput): Promise<ClanArticle> {
  const { data, error } = await supabase
    .from('clan_articles')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClanArticle(id: string): Promise<void> {
  const { error } = await supabase
    .from('clan_articles')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
