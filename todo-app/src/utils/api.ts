import { getTenantId } from "./tenant";

const BASE_URL = "https://assignment-todolist-api.vercel.app/api";

// GET /api/{tenantId}/items
export async function fetchTodoList() {
  const tenantId = getTenantId();
  const res = await fetch(`${BASE_URL}/${tenantId}/items`);
  if (!res.ok) {
    const text = await res.text();
    console.error("할일 목록 조회 실패:", text);
    throw new Error("할일 목록을 불러오는데 실패했습니다.");
  }
  return res.json();
}

// POST /api/{tenantId}/items
export async function createTodoItem(name: string) {
  const tenantId = getTenantId();
  const res = await fetch(`${BASE_URL}/${tenantId}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("할일 생성 실패:", text);
    throw new Error("할일 생성에 실패했습니다.");
  }

  return res.json();
}

// GET /api/{tenantId}/items/{itemId}
export async function fetchTodoItem(tenantId: string, itemId: string) {
  const res = await fetch(`${BASE_URL}/${tenantId}/items/${itemId}`);
  if (!res.ok) {
    const text = await res.text();
    console.error("할일 상세 조회 실패:", text);
    throw new Error("할일 상세 정보를 불러오는데 실패했습니다.");
  }
  return res.json();
}

// PATCH /api/{tenantId}/items/{itemId}
export async function updateTodoItem(
  tenantId: string,
  itemId: string,
  updates: {
    name?: string;
    memo?: string;
    imageUrl?: string;
    isCompleted?: boolean;
  }
) {
  // API 스펙에 맞는 필드만 포함
  const filteredUpdates: Record<string, unknown> = {};
  
  if (typeof updates.name === "string") {
    filteredUpdates.name = updates.name;
  }
  if (typeof updates.memo === "string") {
    filteredUpdates.memo = updates.memo;
  }
  if (typeof updates.imageUrl === "string") {
    filteredUpdates.imageUrl = updates.imageUrl;
  }
  if (typeof updates.isCompleted === "boolean") {
    filteredUpdates.isCompleted = updates.isCompleted;
  }

  const res = await fetch(`${BASE_URL}/${tenantId}/items/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filteredUpdates),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("할일 수정 실패:", text);
    throw new Error("할일 수정에 실패했습니다.");
  }

  return res.json();
}

// DELETE /api/{tenantId}/items/{itemId}
export async function deleteTodoItem(tenantId: string, itemId: string) {
  const res = await fetch(`${BASE_URL}/${tenantId}/items/${itemId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("할일 삭제 실패:", text);
    throw new Error("할일 삭제에 실패했습니다.");
  }

  return res.json();
}

// POST /api/{tenantId}/images/upload
export async function uploadImage(tenantId: string, formData: FormData) {
  const res = await fetch(`${BASE_URL}/${tenantId}/images/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("이미지 업로드 실패:", text);
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  return res.json();
}