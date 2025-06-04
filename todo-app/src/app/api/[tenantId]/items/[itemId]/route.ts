import { NextRequest, NextResponse } from 'next/server';
import { Item, UpdateItemDto } from '@/types/todo';
import { getItem, updateItem as updateStoreItem, deleteItem as deleteStoreItem } from '@/lib/store';

// GET /api/{tenantId}/items/{itemId}
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string; itemId: string } }
) {
  const { tenantId, itemId } = params;

  const item = getItem(tenantId, itemId);
  if (!item) {
    return NextResponse.json(
      { error: 'Item not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(item);
}

// PATCH /api/{tenantId}/items/{itemId}
export async function PATCH(
  request: NextRequest,
  { params }: { params: { tenantId: string; itemId: string } }
) {
  const { tenantId, itemId } = params;
  const body = await request.json() as UpdateItemDto & { tenantId: string };

  const updatedItem = updateStoreItem(tenantId, itemId, body);
  if (!updatedItem) {
    return NextResponse.json(
      { error: 'Item not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(updatedItem);
}

// DELETE /api/{tenantId}/items/{itemId}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tenantId: string; itemId: string } }
) {
  const { tenantId, itemId } = params;

  const success = deleteStoreItem(tenantId, itemId);
  if (!success) {
    return NextResponse.json(
      { error: 'Item not found' },
      { status: 404 }
    );
  }

  return new NextResponse(null, { status: 204 });
} 