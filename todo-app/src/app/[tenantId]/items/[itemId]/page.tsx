"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchTodoItem, updateTodoItem, deleteTodoItem, uploadImage } from "@/utils/api";
import { getTenantId } from "@/utils/tenant";
import { Todo } from "@/types/todo";
import TodoToggle from "@/components/TodoToggle";

export default function TodoEditPage() {
  const router = useRouter();
  const params = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalTodo, setOriginalTodo] = useState<Todo | null>(null);

  const rawTenantId = params?.tenantId;
  const rawItemId = params?.itemId;
  const tenantId = Array.isArray(rawTenantId) ? rawTenantId[0] : rawTenantId || getTenantId();
  const itemId = Array.isArray(rawItemId) ? rawItemId[0] : rawItemId || "";

  const [name, setName] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [memo, setMemo] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantId || !itemId) {
      setError("잘못된 접근입니다.");
      setLoading(false);
      return;
    }

    fetchTodoItem(tenantId, itemId)
      .then((data) => {
        setName(data.name);
        setIsCompleted(data.isCompleted);
        setMemo(data.memo || "");
        setImageUrl(data.imageUrl || "");
        setOriginalTodo(data);
      })
      .catch((err) => {
        console.error("❌ fetchTodoItem 실패:", err);
        setError("할 일 정보를 불러오는 데 실패했습니다.");
      })
      .finally(() => setLoading(false));
  }, [tenantId, itemId]);

  const hasChanges = () => {
    if (!originalTodo) return false;
    return (
      name !== originalTodo.name ||
      memo !== (originalTodo.memo || "") ||
      imageUrl !== (originalTodo.imageUrl || "")
    );
  };

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 이름 검증
    if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
      setError("파일 이름은 영문자만 사용 가능합니다.");
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await uploadImage(tenantId, formData);
      setImageUrl(result.imageUrl);
      setError(null);
    } catch (err) {
      console.error("❌ 이미지 업로드 실패:", err);
      setError("이미지 업로드에 실패했습니다.");
    }
  }

  async function handleDelete() {
    if (!confirm("정말로 삭제하시겠습니까?")) return;

    try {
      await deleteTodoItem(tenantId, itemId);
      router.push("/"); // ✅ 홈으로 이동
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
      setError("삭제에 실패했습니다.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasChanges()) {
      router.push(`/${tenantId}/items/${itemId}`);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await updateTodoItem(tenantId, itemId, { 
        name,
        memo,
        imageUrl
      });

      router.push(`/${tenantId}/items/${itemId}`);
    } catch (err) {
      console.error("❌ 수정 실패:", err);
      setError("수정에 실패했습니다.");
      setIsSubmitting(false);
    }
  }

  async function handleToggleComplete(e: React.MouseEvent) {
    e.preventDefault(); // 이벤트 전파 중단
    console.log("토글 버튼 클릭됨", { isCompleted });
    
    try {
      const updatedTodo = await updateTodoItem(tenantId, itemId, {
        isCompleted: !isCompleted
      });
      console.log("상태 업데이트 성공", updatedTodo);
      setIsCompleted(updatedTodo.isCompleted);
    } catch (err) {
      console.error("❌ 상태 업데이트 실패:", err);
      setError("상태 업데이트에 실패했습니다.");
    }
  }

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="h-full">
      <div className="max-w-4xl mx-auto bg-[var(--color-header)] min-h-screen pt-[56px]">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
          <div className="flex justify-center mb-6">
            <div className={`flex items-center w-full sm:w-[500px] border-2 border-black ${
              isCompleted ? 'bg-[var(--color-violet100)]' : 'bg-[var(--color-header)]'
            } h-10 rounded-[30px]`}>
              <div className="flex items-center justify-center w-full px-6 gap-2">
                <TodoToggle
                  isCompleted={isCompleted}
                  onToggle={handleToggleComplete}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`bg-transparent border-0 border-b-2 border-black focus:outline-none focus:border-b-[var(--color-slate800)] text-base text-center w-full ${
                    isCompleted ? 'line-through text-gray-400' : ''
                  }`}
                  placeholder="제목을 입력하세요"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[300px] bg-[#f8fafc] flex items-center justify-center">
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="업로드된 이미지"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-4 right-4 bg-transparent rounded-full p-0"
                    title="이미지 변경"
                  >
                    <img
                      src="/Type=Edit.png"
                      alt="이미지 변경"
                      className="w-12 h-12"
                    />
                  </button>
                </>
              ) : (
                <>
                  <img src="/img.png" alt="이미지 추가" className="w-16 h-16 opacity-60" />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-4 right-4 bg-transparent rounded-full p-0"
                    title="이미지 추가"
                  >
                    <img
                      src="/Type=Plus.png"
                      alt="이미지 추가"
                      className="w-12 h-12"
                    />
                  </button>
                </>
              )}
            </div>

            <div className="bg-[#FFFBEB] rounded-lg p-4 min-h-[300px] flex flex-col relative">
              <div className="absolute top-4 left-4 flex items-center gap-1">
                <img src="/memo.png" alt="메모" className="w-4 h-4" />
                <span className="text-[#B45309] text-sm">Memo</span>
              </div>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full flex-1 bg-transparent border-none resize-none focus:outline-none text-center pt-12"
                placeholder="메모를 입력하세요"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #E7E5E4 31px, #E7E5E4 32px)',
                  lineHeight: '32px',
                  padding: '0 8px'
                }}
              />
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              className="focus:outline-none"
              disabled={isSubmitting || !hasChanges()}
            >
              <img
                src={isSubmitting ? "/Type=Edit, Size=Large, State=Active.png" : "/Type=Edit, Size=Large, State=Default.png"}
                alt="수정 완료"
                className={`w-auto h-10 ${!hasChanges() ? 'opacity-50' : ''}`}
              />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="focus:outline-none"
              disabled={isSubmitting}
            >
              <img
                src="/Type=Delete, Size=Large, State=Default.png"
                alt="삭제하기"
                className="w-auto h-10"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
