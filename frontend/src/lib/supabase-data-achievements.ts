/**
 * @project AncestorTree
 * @file src/lib/supabase-data-achievements.ts
 * @description Supabase data functions for achievements
 * @version 1.0.0
 * @updated 2026-02-25
 */

import { supabase } from './supabase';
import type { Achievement, AchievementCategory, CreateAchievementInput, UpdateAchievementInput } from '@/types';

export async function getAchievements(category?: AchievementCategory): Promise<Achievement[]> {
  let query = supabase
    .from('achievements')
    .select('*')
    .order('year', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getAchievement(id: string): Promise<Achievement | null> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function getAchievementsByPerson(personId: string): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('person_id', personId)
    .order('year', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getFeaturedAchievements(): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('is_featured', true)
    .order('year', { ascending: false })
    .limit(6);

  if (error) throw error;
  return data || [];
}

export async function createAchievement(input: CreateAchievementInput): Promise<Achievement> {
  const { data, error } = await supabase
    .from('achievements')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAchievement(id: string, input: UpdateAchievementInput): Promise<Achievement> {
  const { data, error } = await supabase
    .from('achievements')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAchievement(id: string): Promise<void> {
  const { error } = await supabase
    .from('achievements')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
