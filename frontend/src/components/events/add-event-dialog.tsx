/**
 * @project AncestorTree
 * @file src/components/events/add-event-dialog.tsx
 * @description Dialog form for adding new events
 * @version 1.1.0
 * @updated 2026-02-26
 */

'use client';

import { useState } from 'react';
import { useCreateEvent } from '@/hooks/use-events';
import { useSearchPeople } from '@/hooks/use-people';
import { parseLunarString } from '@/lib/lunar-calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { EVENT_TYPE_LABELS } from './event-constants';
import type { EventType, Person } from '@/types';
import { toast } from 'sonner';
import { Search, X } from 'lucide-react';

interface AddEventDialogProps {
  onClose: () => void;
}

export function AddEventDialog({ onClose }: AddEventDialogProps) {
  const createEvent = useCreateEvent();
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('gio');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [personQuery, setPersonQuery] = useState('');
  const [personDropOpen, setPersonDropOpen] = useState(false);
  const [eventLunar, setEventLunar] = useState('');
  const [lunarError, setLunarError] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [recurring, setRecurring] = useState(true);

  // Server-side search — same hook as trang Thành viên
  const { data: searchResults, isFetching } = useSearchPeople(personQuery);

  // Only show deceased people for Giỗ
  const filteredResults = (searchResults || []).filter(p => !p.is_living);

  const validateLunar = (value: string) => {
    setEventLunar(value);
    if (!value) { setLunarError(''); return; }
    setLunarError(parseLunarString(value) ? '' : 'Sai định dạng. VD: 15/7 (ngày/tháng)');
  };

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setPersonQuery('');
    setPersonDropOpen(false);
    // Auto-fill title + lunar date
    if (eventType === 'gio') {
      setTitle(`Giỗ ${person.display_name}`);
      if (person.death_lunar) {
        setEventLunar(person.death_lunar);
        setLunarError('');
      }
    }
  };

  const handleClearPerson = () => {
    setSelectedPerson(null);
    setPersonQuery('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Vui lòng nhập tiêu đề'); return; }
    if (eventLunar && !parseLunarString(eventLunar)) {
      toast.error('Ngày âm lịch không hợp lệ');
      return;
    }
    try {
      await createEvent.mutateAsync({
        title: title.trim(),
        event_type: eventType,
        person_id: selectedPerson?.id,
        event_lunar: eventLunar || undefined,
        event_date: eventDate || undefined,
        location: location || undefined,
        description: description || undefined,
        recurring,
      });
      toast.success('Đã thêm sự kiện');
      onClose();
    } catch {
      toast.error('Lỗi khi thêm sự kiện');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Loại sự kiện</Label>
        <Select value={eventType} onValueChange={v => setEventType(v as EventType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(EVENT_TYPE_LABELS).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {eventType === 'gio' && (
        <div className="space-y-2">
          <Label>Người được giỗ</Label>
          {selectedPerson ? (
            <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/50">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                selectedPerson.gender === 1 ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
              }`}>
                {selectedPerson.display_name.slice(-1)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedPerson.display_name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedPerson.death_lunar ? `Giỗ ${selectedPerson.death_lunar} ÂL` : `Đời ${selectedPerson.generation}`}
                </p>
              </div>
              <Button variant="ghost" size="sm" type="button" className="h-7 w-7 p-0 shrink-0" onClick={handleClearPerson}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên... (gõ tối thiểu 2 ký tự)"
                value={personQuery}
                onChange={e => {
                  setPersonQuery(e.target.value);
                  setPersonDropOpen(e.target.value.length >= 2);
                }}
                onFocus={() => personQuery.length >= 2 && setPersonDropOpen(true)}
                onBlur={() => setTimeout(() => setPersonDropOpen(false), 150)}
                className="pl-9"
              />
              {personDropOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-52 overflow-y-auto">
                  {isFetching ? (
                    <p className="p-3 text-sm text-muted-foreground">Đang tìm...</p>
                  ) : filteredResults.length === 0 ? (
                    <p className="p-3 text-sm text-muted-foreground">
                      {personQuery.length >= 2 ? 'Không tìm thấy thành viên đã mất' : 'Gõ tối thiểu 2 ký tự'}
                    </p>
                  ) : (
                    filteredResults.map(person => (
                      <button
                        key={person.id}
                        type="button"
                        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-accent transition-colors"
                        onMouseDown={e => {
                          e.preventDefault();
                          handleSelectPerson(person);
                        }}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                          person.gender === 1 ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                        }`}>
                          {person.display_name.slice(-1)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{person.display_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Đời {person.generation}{person.death_lunar ? ` · Giỗ ${person.death_lunar} ÂL` : ''}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Tiêu đề</Label>
        <Input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="VD: Giỗ Ông Nội"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lunar">Ngày âm lịch (DD/MM)</Label>
          <Input
            id="lunar"
            value={eventLunar}
            onChange={e => validateLunar(e.target.value)}
            placeholder="15/7"
            className={lunarError ? 'border-destructive' : ''}
          />
          {lunarError && <p className="text-xs text-destructive">{lunarError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Ngày dương lịch</Label>
          <Input
            id="date"
            type="date"
            value={eventDate}
            onChange={e => setEventDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Địa điểm</Label>
        <Input
          id="location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="VD: Nhà thờ họ"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="desc">Ghi chú</Label>
        <Textarea
          id="desc"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="recurring"
          checked={recurring}
          onChange={e => setRecurring(e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="recurring" className="font-normal">Lặp lại hàng năm</Label>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
        <Button type="submit" disabled={createEvent.isPending}>
          {createEvent.isPending ? 'Đang lưu...' : 'Thêm sự kiện'}
        </Button>
      </DialogFooter>
    </form>
  );
}
