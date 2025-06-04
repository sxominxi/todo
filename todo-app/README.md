# Todo List 애플리케이션

할 일을 관리할 수 있는 웹 애플리케이션입니다.

## 기능 체크리스트

### 공통

- [ ] **컬러 시스템 설정**: 디자인 시안에 따른 컬러 시스템이 구현되었나요?
- [ ] **공용 컴포넌트 작성**: 공통적으로 사용되는 UI 요소가 재사용 가능한 컴포넌트로 작성되었나요?
- [ ] **반응형 웹 디자인**:
  - [ ] 모바일 레이아웃에서 정상적으로 작동하나요?
  - [ ] 태블릿 레이아웃에서 정상적으로 작동하나요?
  - [ ] 데스크탑 레이아웃에서 정상적으로 작동하나요?

### 할 일 목록 페이지(`/`)

- [ ] **목록 조회 기능**:
  - [ ] 로고 버튼을 클릭했을 때 `/` 페이지로 이동(새로고침)이 되나요?
  - [ ] 진행 중인 할 일과 완료된 할 일이 구분되어 표시되나요?
- [ ] **할 일 추가 기능**:
  - [ ] 입력창에 할 일을 입력하고 `추가하기` 버튼을 클릭하거나 엔터를 눌렀을 때 새로운 할 일이 생성되나요?
- [ ] **할 일 완료 처리**:
  - [ ] 진행 중인 할 일 항목의 체크박스를 클릭했을 때 완료 상태로 변경되나요?
  - [ ] 완료된 할 일 항목의 체크박스를 클릭했을 때 다시 진행 중 상태로 변경되나요?

### 할 일 상세 페이지(`/items/{itemId}`)

- [ ] **할 일 수정 기능**:
  - [ ] 할 일 항목의 이름을 수정할 수 있나요?
  - [ ] 할 일의 진행 상태를 수정할 수 있나요?
  - [ ] 메모를 추가할 수 있나요?
  - [ ] 이미지를 첨부할 수 있나요? (이미지 파일 이름은 영어로만 이루어지고, 크기는 5MB 이하인가요?)
  - [ ] `수정 완료` 버튼을 클릭했을 때 수정 사항이 반영되고 할 일 목록 페이지로 이동되나요?
  - [ ] 다시 할 일을 클릭했을 때 추가된 메모와 이미지가 잘 보이나요?
- [ ] **할 일 삭제 기능**:
  - [ ] `삭제하기` 버튼을 클릭했을 때 할 일이 삭제되고, 할 일 목록 페이지로 이동되나요?

### 배포

- [ ] 배포한 링크가 배포한 계정이 아닌 다른 계정으로도 접근이 되나요?

## 기술 스택

- Next.js
- TypeScript
- Tailwind CSS

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## API 스펙

### Item

- `POST /api/{tenantId}/items` - 할 일 생성
- `GET /api/{tenantId}/items` - 할 일 목록 조회
- `GET /api/{tenantId}/items/{itemId}` - 할 일 상세 조회
- `PATCH /api/{tenantId}/items/{itemId}` - 할 일 수정
- `DELETE /api/{tenantId}/items/{itemId}` - 할 일 삭제

### Image

- `POST /api/{tenantId}/images/upload` - 이미지 업로드

### Schemas

```typescript
interface Item {
  id: string;
  tenantId: string;
  name: string;
  memo: string;
  imageUrl: string;
  isCompleted: boolean;
}

interface CreateItemDto {
  name: string;
}

interface UpdateItemDto {
  name?: string;
  memo?: string;
  imageUrl?: string;
  isCompleted?: boolean;
}
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
