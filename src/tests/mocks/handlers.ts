import { http, HttpResponse } from "msw";

const BASE_URL = "http://localhost:3000/api/v1";

/**
 * A stateful in-memory store for messages to make testing more realistic.
 */
let messageDatabase = Array.from({ length: 150 }).map((_, i) => {
  const time = new Date();
  // Space messages out by 10 minutes each, going backwards
  // We subtract i * 10 minutes from "now"
  time.setMinutes(time.getMinutes() - i * 10);

  return {
    _id: `msg-${150 - i}`,
    message: `Historical message ${150 - i}`,
    author: i % 2 === 0 ? "UserA" : "UserB",
    createdAt: time.toISOString(),
  };
});

// Sort database globally oldest-to-newest
messageDatabase.sort(
  (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
);

export const handlers = [
  http.get(`${BASE_URL}/messages`, ({ request }) => {
    const url = new URL(request.url);
    const before = url.searchParams.get("before");
    const after = url.searchParams.get("after");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    let result;

    if (before) {
      const beforeDate = new Date(before).getTime();
      // 1. Get all messages before this date
      // 2. Sort newest first to get the "closest" ones
      // 3. Take the limit
      // 4. Sort Ascending (oldest first) to match API behavior
      result = messageDatabase
        .filter((m) => new Date(m.createdAt).getTime() < beforeDate)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, limit)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
    } else if (after) {
      const afterDate = new Date(after).getTime();
      // 1. Get all messages after this date
      // 2. Sort oldest first
      // 3. Take the limit
      result = messageDatabase
        .filter((m) => new Date(m.createdAt).getTime() > afterDate)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
        .slice(0, limit);
    } else {
      // Default (Initial load): Get latest X messages
      // 1. Sort newest first
      // 2. Take limit
      // 3. Sort Ascending to match API
      result = [...messageDatabase]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, limit)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
    }

    return HttpResponse.json(result);
  }),

  http.post(`${BASE_URL}/messages`, async ({ request }) => {
    const body = (await request.json()) as { message: string; author: string };

    const newMessage = {
      _id: `msg-new-${Date.now()}`,
      message: body.message,
      author: body.author,
      createdAt: new Date().toISOString(),
    };

    messageDatabase.push(newMessage);

    return HttpResponse.json(newMessage);
  }),
];

export const resetMessageDatabase = () => {
  messageDatabase = Array.from({ length: 150 }).map((_, i) => {
    const time = new Date();
    time.setMinutes(time.getMinutes() - i * 10);

    return {
      _id: `msg-${150 - i}`,
      message: `Historical message ${150 - i}`,
      author: i % 2 === 0 ? "UserA" : "UserB",
      createdAt: time.toISOString(),
    };
  });

  messageDatabase.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};
