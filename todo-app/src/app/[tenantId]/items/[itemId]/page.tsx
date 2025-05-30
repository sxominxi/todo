import { fetchTodoItem } from "@/utils/api";
import { getTenantId } from "@/utils/tenant";

interface TodoDetailPageProps {
  params: {
    tenantId: string;
    itemId: string;
  };
}

export default async function TodoDetailPage({ params }: TodoDetailPageProps) {
  const { tenantId, itemId } = params;

  if (!tenantId) {
    return <div>tenantId is missing</div>;
  }

  const todo = await fetchTodoItem(tenantId, itemId);

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{todo.name}</h1>
      <p className="mb-2 text-gray-600">생성일: {new Date(todo.createdAt).toLocaleString()}</p>
      {todo.note && (
        <section className="mb-4">
          <h2 className="font-semibold">메모</h2>
          <p>{todo.note}</p>
        </section>
      )}
      {todo.imageUrl && (
        <img
          src={todo.imageUrl}
          alt="할 일 이미지"
          className="w-full max-h-64 object-contain rounded"
        />
      )}
      <p>
        상태:{" "}
        {todo.completed ? (
          <span className="text-green-600 font-semibold">완료됨</span>
        ) : (
          <span className="text-red-600 font-semibold">진행 중</span>
        )}
      </p>
    </main>
  );
}
