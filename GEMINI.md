# GEMINI.md

## Project Overview

**Doodle Chat** is a high-performance, accessible real-time chat application built with React and Vite. It addresses complex data-fetching challenges, such as infinite scrolling for historical messages and polling-based updates for new messages, ensuring a smooth user experience without the need for WebSockets.

### Core Technologies

- **Framework:** React 19 (Vite)
- **Data Fetching & State Management:** `@tanstack/react-query` (v5)
- **UI Components:** `react-aria-components` for accessible and customizable components.
- **Validation:** `zod` for strict end-to-end type safety and API response validation.
- **Styling:** CSS Modules with `typed-css-modules` for type-safe styles.
- **Utilities:** `clsx` for conditional class joining.

### Architecture

The project follows a feature-based structure located in `src/features/`. The primary feature is `chat`:

- **`api/`**: Contains the API client, Zod schemas, and message-related services.
- **`components/`**: React components like `MessageList`, `ChatHeader`, and `RegistrationForm`.
- **`hooks/`**: Custom hooks, notably `useMessages`, which orchestrates infinite query and polling logic.
- **`utils/`**: Helper functions for dates, HTML decoding, and username management.

## Building and Running

### Prerequisites

- **Node.js** (v18+ recommended)
- **pnpm** (preferred package manager)
- **Backend Service:** The Chat API must be running locally. Repository: [frontend-challenge-chat-api](https://github.com/DoodleScheduling/frontend-challenge-chat-api)

### Key Commands

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the application for production.
- `pnpm test`: Runs Vitest unit tests.
- `pnpm test:ui`: Runs Vitest in UI mode.
- `pnpm lint`: Runs ESLint for code quality checks.
- `pnpm format`: Formats the codebase using Prettier.
- `pnpm typecss`: Generates TypeScript definitions for CSS Modules.
- `pnpm preview`: Previews the production build locally.

## Development Conventions

### Coding Style

- **Feature-First Organization:** Keep logic, components, and hooks related to a specific feature within its `src/features/[feature-name]` directory.
- **Type Safety:** Use Zod schemas to validate all external data and ensure strict TypeScript types throughout the application.
- **CSS Modules:** Prefer CSS Modules for styling to ensure scoped and maintainable styles. Use `typed-css-modules` (`pnpm typecss`) to maintain type safety for class names.

### Data Fetching Patterns

- **Infinite Scrolling:** Implemented using `useInfiniteQuery` with the `before` parameter for historical data.
- **Polling:** Implemented using a separate `useQuery` with `refetchInterval` for new messages, which manually updates the infinite query's cache.
- **Scroll Management:** `MessageList` uses `useLayoutEffect` and `ResizeObserver` to maintain scroll position when content is prepended or appended.
- **Session-Aware Data Fetching:**
  - **Cache Security:** React Query cache is automatically cleared (`queryClient.clear()`) on user logout to prevent session data persistence.
  - **Auth-Gated Queries:** All primary data-fetching and polling queries use `isUsernameSet()` as an `enabled` condition, ensuring no background network activity occurs when a user is logged out.

## Testing

- **Unit & Integration Tests:** Implemented using **Vitest**, **React Testing Library**, and **MSW**.
  - **Hooks:** `useMessages` is tested for initial load, polling, and pagination.
  - **Components:** `MessageList` is tested for rendering and loading states.
- **Mocking:** MSW intercepts API calls at `http://localhost:3000/api/v1` to simulate backend behavior.
- **Scroll Anchoring:** Currently verified manually; automated E2E tests are planned for Phase 2.
