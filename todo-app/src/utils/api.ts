import { getTenantId } from "./tenant";

const BASE_URL = "https://assignment-todolist-api.vercel.app/api"; 

export async function fetchTodoList() {
  const tenantId = getTenantId();
  const res = await fetch(`${BASE_URL}/${tenantId}/items`);  
  if (!res.ok) {
    throw new Error("Failed to fetch todo list");
  }
  return res.json();
}

export async function createTodoItem(todo: { name: string }) {
  const tenantId = getTenantId();
  const res = await fetch(`${BASE_URL}/${tenantId}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: todo.name }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to create todo item:", text);
    throw new Error("Failed to create todo item");
  }

  return res.json();
}

export async function fetchTodoItem(tenantId: string, itemId: string) {
  const res = await fetch(`${BASE_URL}/${tenantId}/items/${itemId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch todo item");
  }
  return res.json();
}