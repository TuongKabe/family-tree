/**
 * @project AncestorTree
 * @file src/app/(main)/people/new/page.tsx
 * @description New person creation page with parent selection
 * @version 2.0.0
 * @updated 2026-02-25
 */

'use client';

import { useState } from 'react';
import { useCreatePerson } from '@/hooks/use-people';
import { useAddPersonToParentFamily } from '@/hooks/use-families';
import { useSearchPeople } from '@/hooks/use-people';
import { PersonForm } from '@/components/people/person-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, X, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { PersonFormData } from '@/lib/validations/person';
import type { Person } from '@/types';

// ─── PersonCombobox ───────────────────────────────────────────────────────────

interface PersonComboboxProps {
  label: string;
  selected: Person | null;
  onSelect: (person: Person | null) => void;
  excludeId?: string;
}

function PersonCombobox({ label, selected, onSelect, excludeId }: PersonComboboxProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const { data: results, isFetching } = useSearchPeople(query);

  const filtered = (results || []).filter((p) => p.id !== excludeId);

  const handleSelect = (person: Person) => {
    onSelect(person);
    setQuery('');
    setOpen(false);
  };

  const handleClear = () => {
    onSelect(null);
    setQuery('');
  };

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      {selected ? (
        <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/50">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
              selected.gender === 1 ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
            }`}
          >
            {selected.display_name.slice(-1)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selected.display_name}</p>
            <p className="text-xs text-muted-foreground">Đời {selected.generation}</p>
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleClear}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Tìm ${label.toLowerCase()}...`}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(e.target.value.length >= 2);
              }}
              onFocus={() => query.length >= 2 && setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 200)}
              className="pl-9"
            />
          </div>
          {open && (
            <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
              {isFetching && (
                <p className="px-3 py-2 text-sm text-muted-foreground">Đang tìm...</p>
              )}
              {!isFetching && filtered.length === 0 && query.length >= 2 && (
                <p className="px-3 py-2 text-sm text-muted-foreground">Không tìm thấy</p>
              )}
              {filtered.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onMouseDown={() => handleSelect(person)}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                      person.gender === 1
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-pink-100 text-pink-700'
                    }`}
                  >
                    {person.display_name.slice(-1)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{person.display_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Đời {person.generation}
                      {person.birth_year ? ` · ${person.birth_year}` : ''}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── NewPersonPage ────────────────────────────────────────────────────────────

export default function NewPersonPage() {
  const router = useRouter();
  const createMutation = useCreatePerson();
  const addToParentMutation = useAddPersonToParentFamily();

  const [selectedFather, setSelectedFather] = useState<Person | null>(null);
  const [selectedMother, setSelectedMother] = useState<Person | null>(null);

  // Derived: locked generation from parent (father takes priority, fall back to mother)
  const lockedGeneration = selectedFather
    ? selectedFather.generation + 1
    : selectedMother
      ? selectedMother.generation + 1
      : undefined;

  const handleSubmit = async (data: PersonFormData) => {
    try {
      const person = await createMutation.mutateAsync(data);

      // Link to parent family if father or mother was selected
      if (selectedFather || selectedMother) {
        await addToParentMutation.mutateAsync({
          fatherId: selectedFather?.id || null,
          motherId: selectedMother?.id || null,
          childPersonId: person.id,
        });
      }

      toast.success('Đã thêm thành công');
      router.push(`/people/${person.id}`);
    } catch {
      toast.error('Lỗi khi thêm mới');
    }
  };

  const isLoading = createMutation.isPending || addToParentMutation.isPending;

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/people">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Thêm thành viên mới</h1>
      </div>

      {/* Parent selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Thuộc gia đình (tùy chọn)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Chọn cha/mẹ để xác định vị trí trong gia phả. Đời sẽ tự động = đời cha + 1.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PersonCombobox
            label="Cha"
            selected={selectedFather}
            onSelect={setSelectedFather}
            excludeId={selectedMother?.id}
          />
          <PersonCombobox
            label="Mẹ"
            selected={selectedMother}
            onSelect={setSelectedMother}
            excludeId={selectedFather?.id}
          />
        </CardContent>
      </Card>

      <PersonForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        lockedGeneration={lockedGeneration}
      />
    </div>
  );
}
