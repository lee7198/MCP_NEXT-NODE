# Types 폴더 구조

이 폴더는 애플리케이션에서 사용되는 모든 TypeScript 타입과 인터페이스를 체계적으로 관리합니다.

## 파일 구조

### 📁 `index.ts`

- 모든 타입 파일들을 통합 export하는 메인 파일
- 다른 파일에서 `@/app/types`로 import할 때 사용

### 📁 `common.ts`

- 공통으로 사용되는 기본 타입들
- **서버 상태**: `ServerStatus`, `PingStatus`
- **API 응답**: `ApiResponse<T>`, `ApiError`
- **편집 상태**: `EditState<T>`
- **폼 데이터**: `FormData`
- **페이지네이션**: `PaginationParams`, `PaginatedResponse<T>`
- **반응형 디자인**: `Breakpoint`, `BreakpointConfig`
- **UI 컴포넌트**: `GridHeaderProps`, `LoadingSkeletonProps`, `EditableInputProps`, `ActionButtonProps`

### 📁 `message.ts`

- 채팅 메시지 관련 타입들
- **메시지**: `Message`, `ChatReq`, `ChatRes`
- **AI 응답**: `AIResponse`, `AIResponseResponse`, `SaveAIResponseRes`
- **대화방**: `RoomInfo`
- **통계**: `DurationData`
- **페이지네이션**: `MessagesResponse`

### 📁 `components.ts`

- React 컴포넌트 Props 타입들
- **채팅**: `ChatMessageProps`, `ChatInputProps`, `MessageListProps`, `AIResponseChatProps`, `MessageInputProps`
- **네비게이션**: `DateDividerProps`, `DateNavigationProps`, `RoomNavigationProps`
- **서버**: `StatusPingProps`, `ServerCardProps`, `ServerCardSkeletonProps`, `ServerCardWrapperProps`, `ServerListProps`, `ServerStatusProps`
- **MCP**: `McpToolProps`, `McpToolSettingProps`, `McpSettingsModalProps`
- **차트**: `ResponseTimeChartProps`

### 📁 `api.ts`

- API 관련 타입들과 NextAuth 타입 확장
- **NextAuth 확장**: Session, JWT 인터페이스 확장
- **채팅 API**: `SaveChatRes`, `AIChatRes`
- **서버 API**: `ServerRes`, `ServerDetail`
- **MCP API**: `McpRes`, `McpParamsRes`
- **사용자 API**: `UserListRes`

### 📁 `store.ts`

- 상태 관리 관련 타입들
- **사용자 상태**: `UserState`
- **테마 상태**: `Theme`, `ThemeState`

### 📁 `dashboard.ts`

- 대시보드 관련 타입들
- **사용량**: `UsageCardProps`, `UsageTableProps`
- **서버 상태**: `ServerStatusCardProps`
- **응답 시간**: `ResponseTimeSectionProps`
- **에이전트 상태**: `AgentStatusSectionProps`
- **플로우**: `FlowSectionProps`, `FlowNodeDataType`, `CustomNode`, `CustomEdge`
- **MCP 링크**: `McpLinkArticle`

### 📁 `management.ts`

- 관리 기능 관련 타입들
- **사용자 관리**: `UserFormData`, `UserTableProps`, `AddUserFormProps`
- **MCP 도구 관리**: `McpToolRes`, `McpTableProps`, `AddMcpFormProps`

### 📁 `server.ts`

- 서버 관리 관련 타입들
- **서버 폼**: `SaveServerForm`
- **서버 페이지**: `ServerDetailPageProps`
- **서버 컴포넌트**: `ServerHeaderProps`, `ServerDescriptionProps`, `ServerInfoProps`

### 📁 `socket.ts`

- WebSocket 관련 타입들
- **클라이언트 정보**: `ClientInfo`, `ResponseClient`

## 사용 가이드

### 1. 새로운 타입 추가 시

- 적절한 카테고리 파일에 추가
- `index.ts`에서 export 확인
- 다른 파일에서 `@/app/types`로 import

### 2. 타입 분류 기준

- **common.ts**: 여러 곳에서 공통으로 사용되는 기본 타입
- **components.ts**: React 컴포넌트 Props 타입
- **api.ts**: API 요청/응답 및 외부 라이브러리 타입 확장
- **store.ts**: 상태 관리 관련 타입
- **기능별 파일**: 특정 기능에 특화된 타입들

### 3. 네이밍 컨벤션

- **인터페이스**: PascalCase (예: `UserState`, `ServerStatus`)
- **타입**: PascalCase (예: `Theme`, `Breakpoint`)
- **Props 인터페이스**: 컴포넌트명 + Props (예: `ChatInputProps`)

### 4. 중복 방지

- 동일한 타입은 한 곳에서만 정의
- 다른 파일에서 재사용 시 import 사용
- 타입 확장 시 extends 또는 intersection types 활용
