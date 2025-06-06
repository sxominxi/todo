export interface Todo {
  id: string;
  tenantId: string;
  name: string;
  isCompleted: boolean;
  memo?: string;
  imageUrl?: string;
}

// API 요청/응답을 위한 타입들
export interface CreateItemDto {
  name: string;
}

export interface UpdateItemDto {
  name?: string;
  memo?: string;
  imageUrl?: string;
  isCompleted?: boolean;
}