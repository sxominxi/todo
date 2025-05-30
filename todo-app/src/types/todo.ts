export interface Todo {
  id: string;
  name: string; 
  completed: boolean;
  createdAt?: string;
  note?: string;
  imageUrl?: string;
}