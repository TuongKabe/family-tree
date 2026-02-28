/**
 * @project AncestorTree
 * @file src/lib/supabase-data-fund.ts
 * @description Supabase data functions for fund transactions and scholarships
 * @version 1.0.0
 * @updated 2026-02-25
 */

import { supabase } from './supabase';
import type {
  FundTransaction, CreateFundTransactionInput, FundBalance,
  Scholarship, CreateScholarshipInput, ScholarshipStatus,
} from '@/types';

// ═══════════════════════════════════════════════════════════════════════════
// Fund Transactions
// ═══════════════════════════════════════════════════════════════════════════

export async function getFundTransactions(academicYear?: string): Promise<FundTransaction[]> {
  let query = supabase
    .from('fund_transactions')
    .select('*')
    .order('transaction_date', { ascending: false });

  if (academicYear) {
    query = query.eq('academic_year', academicYear);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// NOTE: Client-side aggregation. For large datasets (1000+ records),
// consider replacing with a Supabase RPC: supabase.rpc('get_fund_balance')
export async function getFundBalance(): Promise<FundBalance> {
  const { data, error } = await supabase
    .from('fund_transactions')
    .select('type, amount')
    .limit(5000);

  if (error) throw error;

  let income = 0;
  let expense = 0;
  for (const tx of data || []) {
    if (tx.type === 'income') income += Number(tx.amount);
    else expense += Number(tx.amount);
  }

  return { income, expense, balance: income - expense };
}

export async function createFundTransaction(input: CreateFundTransactionInput): Promise<FundTransaction> {
  const { data, error } = await supabase
    .from('fund_transactions')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFundTransaction(id: string, input: Partial<CreateFundTransactionInput>): Promise<FundTransaction> {
  const { data, error } = await supabase
    .from('fund_transactions')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFundTransaction(id: string): Promise<void> {
  const { error } = await supabase
    .from('fund_transactions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════════════════════
// Scholarships
// ═══════════════════════════════════════════════════════════════════════════

export async function getScholarships(academicYear?: string): Promise<Scholarship[]> {
  let query = supabase
    .from('scholarships')
    .select('*')
    .order('created_at', { ascending: false });

  if (academicYear) {
    query = query.eq('academic_year', academicYear);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getScholarship(id: string): Promise<Scholarship | null> {
  const { data, error } = await supabase
    .from('scholarships')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function createScholarship(input: CreateScholarshipInput): Promise<Scholarship> {
  const { data, error } = await supabase
    .from('scholarships')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateScholarshipStatus(
  id: string,
  status: ScholarshipStatus,
  approvedBy?: string
): Promise<Scholarship> {
  const updateData: Record<string, unknown> = { status };
  if (status === 'approved') {
    updateData.approved_by = approvedBy;
    updateData.approved_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('scholarships')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteScholarship(id: string): Promise<void> {
  const { error } = await supabase
    .from('scholarships')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
