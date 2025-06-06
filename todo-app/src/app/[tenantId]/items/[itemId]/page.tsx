"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchTodoItem, updateTodoItem, deleteTodoItem, uploadImage } from "@/utils/api";
import { getTenantId } from "@/utils/tenant";
import { Todo } from "@/types/todo";
import CheckListDetail from "@/components/CheckListDetail";

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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

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
      selectedFile !== null // 이미지 변경 여부는 이걸로만 판단
    );
  };

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
      alert("파일 이름은 영문자만 사용 가능합니다.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setSelectedFile(file);
    // 미리보기 URL 생성
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
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
      router.push(`/`);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      let finalImageUrl = imageUrl;

      // 새 이미지가 선택된 경우에만 업로드
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        const result = await uploadImage(tenantId, formData);
        finalImageUrl = result.url; // ✅
      }

      await updateTodoItem(tenantId, itemId, { 
        name,
        memo,
        imageUrl: finalImageUrl
      });

      router.push(`/`);
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
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
          {/* 할일 제목 */}
          <CheckListDetail
            name={name}
            isCompleted={isCompleted}
            onChange={setName}
            onToggle={handleToggleComplete}
          />

          {/* 이미지 추가 & 메모 */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-5 mb-6">
            {/* 이미지 업로드 영역 */}
            <div className={`relative rounded-[15px] h-[250px] bg-[var(--color-slate100)] overflow-hidden flex items-center justify-center ${previewUrl || imageUrl? '': 'border-2 border-dashed border-[var(--color-slate300)]'}`}>
              {previewUrl || imageUrl ? (
                <img
                  src={previewUrl || imageUrl}
                  alt="업로드된 이미지"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/img.png"
                  alt="기본 이미지"
                  className="w-10 h-10"
                />
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-4 right-4 bg-transparent rounded-full p-0"
                title={previewUrl || imageUrl ? "이미지 변경" : "이미지 추가"}
              >
                <img
                  src={previewUrl || imageUrl ? "/Type=Edit.png" : "/Type=Plus.png"}
                  alt="이미지 버튼"
                  className="w-12 h-12"
                />
              </button>
            </div>

            {/* 메모 영역 */}
            <div className="rounded-[15px] h-[250px] flex flex-col relative overflow-hidden">
              <img
                src="/memo.png"
                alt="메모 배경"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
                <span className="text-[var(--color-amber800)]  text-16 font-semibold ">Memo</span>
              </div>

              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="p-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent border-none resize-none focus:outline-none text-center relative z-10 text-16 custom-scroll"
                placeholder="메모를 입력하세요"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-center md:justify-end">
            <button
              type="submit"
              className="focus:outline-none"
              disabled={isSubmitting || !hasChanges()}
            >
              <img
                src={
                  isSubmitting || hasChanges()
                    ? "/Type=Edit, Size=Large, State=Active.png"
                    : "/Type=Edit, Size=Large, State=Default.png"
                }
                alt="수정 완료"
                className="w-auto h-10"
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
