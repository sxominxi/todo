import { Todo } from '@/types/todo';

export const items: Record<string, Todo[]> = {};

export const getItems = (tenantId: string): Todo[] => {
  if (!items[tenantId]) {
    items[tenantId] = [];
  }
  return items[tenantId];
};

export const getItem = (tenantId: string, itemId: string): Todo | undefined => {
  return getItems(tenantId).find(item => item.id === itemId);
};

export const addItem = (tenantId: string, item: Todo): void => {
  getItems(tenantId).push(item);
};

export const updateItem = (tenantId: string, itemId: string, updates: Partial<Todo>): Todo | undefined => {
  const items = getItems(tenantId);
  const index = items.findIndex(item => item.id === itemId);
  if (index === -1) return undefined;

  const updatedItem = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  items[index] = updatedItem;
  return updatedItem;
};

export const deleteItem = (tenantId: string, itemId: string): boolean => {
  const items = getItems(tenantId);
  const index = items.findIndex(item => item.id === itemId);
  if (index === -1) return false;

  items.splice(index, 1);
  return true;
};
