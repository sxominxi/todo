import { NextRequest, NextResponse } from 'next/server';
import { Todo, CreateItemDto } from '@/types/todo';
import { getItems, addItem } from '@/lib/store';

function extractTenantId(request: NextRequest): string {
  const segments = request.nextUrl.pathname.split('/');
  return segments[segments.indexOf('api') + 1];
}

// GET /api/{tenantId}/items
export async function GET(request: NextRequest) {
  const tenantId = extractTenantId(request);
  return NextResponse.json(getItems(tenantId));
}

// POST /api/{tenantId}/items
export async function POST(request: NextRequest) {
  const tenantId = extractTenantId(request);
  const body = await request.json() as CreateItemDto;

  const newItem: Todo = {
    id: crypto.randomUUID(),
    tenantId,
    name: body.name,
    memo: '',
    imageUrl: '',
    isCompleted: false
  };

  addItem(tenantId, newItem);
  return NextResponse.json(newItem, { status: 201 });
}