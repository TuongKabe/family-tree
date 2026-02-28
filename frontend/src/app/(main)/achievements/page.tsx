/**
 * @project AncestorTree
 * @file src/app/(main)/achievements/page.tsx
 * @description Achievement honors page - Vinh danh thành tích
 * @version 1.0.0
 * @updated 2026-02-25
 */

'use client';

import { useState, useMemo } from 'react';
import { useAchievements } from '@/hooks/use-achievements';
import { usePeople } from '@/hooks/use-people';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, GraduationCap, Briefcase, Heart, Star, Search } from 'lucide-react';
import type { AchievementCategory, Achievement, Person } from '@/types';

const CATEGORIES: { value: AchievementCategory | 'all'; label: string; icon: typeof Trophy }[] = [
  { value: 'all', label: 'Tất cả', icon: Trophy },
  { value: 'hoc_tap', label: 'Học tập', icon: GraduationCap },
  { value: 'su_nghiep', label: 'Sự nghiệp', icon: Briefcase },
  { value: 'cong_hien', label: 'Cống hiến', icon: Heart },
];

function getCategoryIcon(cat: AchievementCategory) {
  switch (cat) {
    case 'hoc_tap': return <GraduationCap className="h-4 w-4" />;
    case 'su_nghiep': return <Briefcase className="h-4 w-4" />;
    case 'cong_hien': return <Heart className="h-4 w-4" />;
    default: return <Trophy className="h-4 w-4" />;
  }
}

function getCategoryLabel(cat: AchievementCategory) {
  switch (cat) {
    case 'hoc_tap': return 'Học tập';
    case 'su_nghiep': return 'Sự nghiệp';
    case 'cong_hien': return 'Cống hiến';
    default: return 'Khác';
  }
}

function AchievementCard({ achievement, person }: { achievement: Achievement; person?: Person }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            {getCategoryIcon(achievement.category)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">{achievement.title}</h3>
            {person && (
              <p className="text-sm text-muted-foreground">
                {person.display_name} · Đời {person.generation}
                {person.chi ? ` · Chi ${person.chi}` : ''}
              </p>
            )}
            {achievement.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{achievement.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {getCategoryLabel(achievement.category)}
              </Badge>
              {achievement.year && (
                <Badge variant="secondary" className="text-xs">{achievement.year}</Badge>
              )}
              {achievement.awarded_by && (
                <span className="text-xs text-muted-foreground">{achievement.awarded_by}</span>
              )}
            </div>
          </div>
          {achievement.is_featured && (
            <Star className="h-4 w-4 text-amber-500 shrink-0" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AchievementsPage() {
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const { data: achievements, isLoading } = useAchievements(
    activeCategory === 'all' ? undefined : activeCategory
  );
  const { data: people } = usePeople();

  const peopleMap = useMemo(() => {
    const map = new Map<string, Person>();
    for (const p of people || []) map.set(p.id, p);
    return map;
  }, [people]);

  const featured = useMemo(
    () => (achievements || []).filter(a => a.is_featured),
    [achievements]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return achievements || [];
    const q = search.toLowerCase();
    return (achievements || []).filter(a => {
      const person = peopleMap.get(a.person_id);
      return (
        a.title.toLowerCase().includes(q) ||
        person?.display_name.toLowerCase().includes(q) ||
        a.awarded_by?.toLowerCase().includes(q)
      );
    });
  }, [achievements, search, peopleMap]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          Vinh danh con cháu
        </h1>
        <p className="text-muted-foreground">Ghi nhận thành tích nổi bật của các thành viên trong dòng họ</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <Button
              key={cat.value}
              variant={activeCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat.value)}
            >
              <cat.icon className="h-4 w-4 mr-1" />
              {cat.label}
            </Button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              Thành tích nổi bật
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map(a => (
                <AchievementCard key={a.id} achievement={a} person={peopleMap.get(a.person_id)} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full list */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Danh sách vinh danh ({filtered.length})
        </h2>
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Trophy className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>Chưa có thành tích nào</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(a => (
              <AchievementCard key={a.id} achievement={a} person={peopleMap.get(a.person_id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
