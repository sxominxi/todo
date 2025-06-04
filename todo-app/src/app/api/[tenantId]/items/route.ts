import { NextRequest, NextResponse } from 'next/server';
import { Todo, CreateItemDto } from '@/types/todo';
import { getItems, addItem } from '@/lib/store';

// GET /api/{tenantId}/items
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  const { tenantId } = params;
  return NextResponse.json(getItems(tenantId));
}

// POST /api/{tenantId}/items
export async function POST(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  const { tenantId } = params;
  const body = await request.json() as CreateItemDto & { tenantId: string };

  // 새 아이템 생성
  const newItem: Todo = {
    id: crypto.randomUUID(),
    tenantId,
    name: body.name,
    memo: '',
    imageUrl: '',
    isCompleted: false,
    createdAt: new Date().toISOString()
  };

  // items 배열에 추가
  addItem(tenantId, newItem);

  return NextResponse.json(newItem, { status: 201 });
}
