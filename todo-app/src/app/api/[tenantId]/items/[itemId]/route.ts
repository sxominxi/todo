import { NextRequest, NextResponse } from 'next/server';
import { UpdateItemDto } from '@/types/todo';
import { getItem, updateItem as updateStoreItem, deleteItem as deleteStoreItem } from '@/lib/store';

function extractParams(request: NextRequest) {
  const segments = request.nextUrl.pathname.split('/');
  const tenantId = segments[segments.indexOf('api') + 1];
  const itemId = segments[segments.indexOf('items') + 1];
  return { tenantId, itemId };
}

// GET /api/{tenantId}/items/{itemId}
export async function GET(request: NextRequest) {
  const { tenantId, itemId } = extractParams(request);
  const item = getItem(tenantId, itemId);
  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json(item);
}

// PATCH /api/{tenantId}/items/{itemId}
export async function PATCH(request: NextRequest) {
  const { tenantId, itemId } = extractParams(request);
  const body = await request.json() as UpdateItemDto;
  const updatedItem = updateStoreItem(tenantId, itemId, body);
  if (!updatedItem) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json(updatedItem);
}

// DELETE /api/{tenantId}/items/{itemId}
export async function DELETE(request: NextRequest) {
  const { tenantId, itemId } = extractParams(request);
  const success = deleteStoreItem(tenantId, itemId);
  if (!success) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
