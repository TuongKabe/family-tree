/**
 * @project AncestorTree
 * @file src/hooks/use-fund.ts
 * @description React Query hooks for fund transactions and scholarships
 * @version 1.0.0
 * @updated 2026-02-25
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFundTransactions,
  getFundBalance,
  createFundTransaction,
  deleteFundTransaction,
  getScholarships,
  createScholarship,
  updateScholarshipStatus,
  deleteScholarship,
} from '@/lib/supabase-data-fund';
import type { CreateFundTransactionInput, CreateScholarshipInput, ScholarshipStatus } from '@/types';

export const fundKeys = {
  all: ['fund'] as const,
  transactions: () => [...fundKeys.all, 'transactions'] as const,
  transactionsByYear: (year?: string) => [...fundKeys.transactions(), { year }] as const,
  balance: () => [...fundKeys.all, 'balance'] as const,
  scholarships: () => [...fundKeys.all, 'scholarships'] as const,
  scholarshipsByYear: (year?: string) => [...fundKeys.scholarships(), { year }] as const,
};

// ─── Fund Transactions ───────────────────────────────────────────────────────

export function useFundTransactions(academicYear?: string) {
  return useQuery({
    queryKey: fundKeys.transactionsByYear(academicYear),
    queryFn: () => getFundTransactions(academicYear),
  });
}

export function useFundBalance() {
  return useQuery({
    queryKey: fundKeys.balance(),
    queryFn: getFundBalance,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateFundTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFundTransactionInput) => createFundTransaction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fundKeys.all });
    },
  });
}

export function useDeleteFundTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFundTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fundKeys.all });
    },
  });
}

// ─── Scholarships ────────────────────────────────────────────────────────────

export function useScholarships(academicYear?: string) {
  return useQuery({
    queryKey: fundKeys.scholarshipsByYear(academicYear),
    queryFn: () => getScholarships(academicYear),
  });
}

export function useCreateScholarship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateScholarshipInput) => createScholarship(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fundKeys.all });
    },
  });
}

export function useUpdateScholarshipStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, approvedBy }: { id: string; status: ScholarshipStatus; approvedBy?: string }) =>
      updateScholarshipStatus(id, status, approvedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fundKeys.all });
    },
  });
}

export function useDeleteScholarship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteScholarship(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fundKeys.all });
    },
  });
}
