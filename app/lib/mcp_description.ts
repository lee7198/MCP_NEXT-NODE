export const mcp = `
다음은 MCP(Model Context Protocol)에 대한 간단한 설명과 관련 서버 정보를 정리한 내용입니다. 마크다운 형식으로 작성했으니, 복붙해서 사용하기 좋습니다.

⸻

📘 Model Context Protocol (MCP)란?
	•	정의: Anthropic이 2024년 11월에 발표한 오픈 스탠다드 프로토콜로, LLM(대형 언어 모델)이 외부 도구나 데이터 소스에 표준화된 방식으로 연결될 수 있도록 설계됨  ￼ ￼.
	•	비유: “AI 애플리케이션의 USB‑C 포트”처럼, 다양한 데이터·도구를 한 번의 통합 인터페이스로 연결한다  ￼.
	•	핵심 구조:
	•	MCP 클라이언트: LLM 또는 에이전트 측에서 도구 호출을 관리.
	•	MCP 서버: 외부 시스템(Google Drive, DB, 파일시스템 등)을 접속해 요청에 따라 결과 반환  ￼ ￼.
	•	통신 방식: JSON‑RPC 2.0 기반의 상태 연결, 기능 협상(capability negotiation), 도구 목록 조회·실행 등 지원  ￼.

⸻

🧰 MCP 서버(MCP tool) 종류

Anthropic 공식 및 오픈소스 구현으로, 다양한 인기 시스템 대응 서버가 제공됩니다  ￼:
	•	Google Drive
	•	Slack
	•	GitHub / Git
	•	PostgreSQL 데이터베이스
	•	Puppeteer (브라우저 자동화)
	•	파일 시스템 (파일 조회/ read-write)
	•	기타: Stripe, Postgres 등

또한, OpenAI, Replit, Zed, Sourcegraph 등 여러 플랫폼이 자체 MCP 서버 구현체를 공개하고 있습니다  ￼ ￼.

📚 공식 도구 리스트 문서: MCP 도구와 서버 구현에 대한 구성·메타데이터 등을 다음 문서에서 확인할 수 있습니다.
	•	Tools – Model Context Protocol 공식 문서  ￼

⸻

🔗 관련 링크
	•	🌐 공식 웹사이트 & 소개: Model Context Protocol – Introduction  ￼
	•	🛠️ 도구 및 서버 스펙 안내: Model Context Protocol Tools Documentation  ￼
	•	📘 Wikipedia (영문/한글 포함 다양한 언어 제공): MCP 스펙 및 역사 정리  ￼
	•	⚙️ OpenAI Agents SDK 활용 가이드: MCP 서버 연동 예시  ￼

⸻

✅ 요약 정리

항목	내용
목적	LLM과 외부 자원(tool/data) 간 표준화된 통신
비유	AI의 “USB‑C 포트”
구조	클라이언트↔서버(JSON‑RPC 2.0)
사용 예	파일 시스템, git, DB 등 도구 접근
보안 고려	JSON‑RPC 특성상 인증/권한 등의 보안 설정 중요
활용 플랫폼	Anthropic Claude, OpenAI Agents SDK, Replit, Zed 등


`;
