import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/people - List all people
// GET /api/people?generation=1&gender=1 - Filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const generation = searchParams.get('generation');
    const gender = searchParams.get('gender');
    const isLiving = searchParams.get('is_living');

    let query = supabase.from('people').select('*');

    if (id) {
      query = query.eq('id', id).single();
      const { data, error } = await query;
      if (error) return NextResponse.json({ error: error.message }, { status: 404 });
      return NextResponse.json(data);
    }

    if (generation) query = query.eq('generation', parseInt(generation));
    if (gender) query = query.eq('gender', parseInt(gender));
    if (isLiving !== null) query = query.eq('is_living', isLiving === 'true');

    const { data, error } = await query.order('generation', { ascending: true }).order('display_name');
    
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/people - Create new person
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('people')
      .insert([body])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
