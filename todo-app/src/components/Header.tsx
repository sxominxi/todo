"use client";

export default function Header() {

  const handleLogoClick = () => {
    window.location.href = '/';  // 페이지 새로고침과 함께 홈으로 이동
  };

  return (
    <header className="p-4 fixed top-0 left-0 right-0 bg-white z-50">
      <div className="max-w-4xl mx-auto">
        {/* 태블릿 이상용 로고 */}
        <img
          src="/Size=Large.png"
          alt="로고"
          className="hidden sm:block w-28 h-auto cursor-pointer"
          onClick={handleLogoClick}
        />

        {/* 모바일용 로고 */}
        <img
          src="/Size=Small.png"
          alt="모바일 로고"
          className="block sm:hidden w-13 h-auto cursor-pointer"
          onClick={handleLogoClick}
        />
      </div>
    </header>
  );
} 