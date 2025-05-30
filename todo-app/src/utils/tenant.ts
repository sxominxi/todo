export function getTenantId(): string {
  if (typeof window === "undefined") return ""; // 서버 환경 대비
  let tenantId = localStorage.getItem("tenantId");
  if (!tenantId) {
    tenantId = "user-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("tenantId", tenantId);
  }
  return tenantId;
}
