# Real-Time Chat UI Challenge

A high-performance, accessible Chat UI implementing infinite scrolling (pagination backwards in time) and polling-based updates to simulate real-time behavior without WebSockets.

## 🚀 Project Context

This project focuses on implementing a complex data-fetching pattern:

- **Infinite Scrolling:** Fetching historical messages using the `before` parameter.
- **Polling:** Periodically checking for new messages using the `after` parameter.
- **Scroll Anchoring:** Maintaining a smooth UX by preventing scroll jumps when new messages arrive or historical data is prepended.
- **Strict Type Safety:** End-to-end validation using `Zod` and `TanStack Query`.

## 🛠️ Tech Stack

- **Framework:** React (Vite)
- **Data Fetching:** `@tanstack/react-query` (v5)
- **UI Components:** `react-aria-components`
- **Validation:** `zod`
- **Styling:** CSS Modules

## ⚙️ Local Setup

### 1. Backend Dependency

This project requires the Chat API to be running. Please ensure the following service is active:
👉 [frontend-challenge-chat-api](https://github.com/DoodleScheduling/frontend-challenge-chat-api)

### 2. Installation & Running

Ensure you have `pnpm` installed, then run:

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

## 📝 TODO Checklist

- [x] Implement optimistic UI updates for sending messages
- [ ] Add unit and integration tests
- [ ] Implement a retry mechanism for messages failed to be sent
- [ ] Implement cache clearing logic on user logout
- [ ] Add toast messages for errors
- [ ] Implement "New Messages" toast/indicator when user scrolled up
