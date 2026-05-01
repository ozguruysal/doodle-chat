import { http, HttpResponse } from "msw";

const BASE_URL = "http://localhost:3000/api/v1";

const createInitialMessages = () => {
  return Array.from({ length: 150 }).map((_, i) => {
    const time = new Date();
    // Ensure strict chronological order
    time.setMinutes(time.getMinutes() - (150 - i) * 10);

    return {
      _id: `msg-${i + 1}`,
      message: `Historical message ${i + 1}`,
      author: i % 2 === 0 ? "UserA" : "UserB",
      createdAt: time.toISOString(),
    };
  });
};

/**
 * A stateful in-memory store for messages.
 * Kept sorted oldest-to-newest (ascending).
 */
let messageDatabase = createInitialMessages();

export const handlers = [
  http.get(`${BASE_URL}/messages`, ({ request }) => {
    const url = new URL(request.url);
    const before = url.searchParams.get("before");
    const after = url.searchParams.get("after");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    if (before) {
      const beforeTime = new Date(before).getTime();
      const index = messageDatabase.findIndex(
        (m) => new Date(m.createdAt).getTime() >= beforeTime,
      );

      const end = index === -1 ? messageDatabase.length : index;
      const start = Math.max(0, end - limit);

      return HttpResponse.json(messageDatabase.slice(start, end));
    }

    if (after) {
      const afterTime = new Date(after).getTime();
      const index = messageDatabase.findIndex(
        (m) => new Date(m.createdAt).getTime() > afterTime,
      );

      if (index === -1) return HttpResponse.json([]);

      return HttpResponse.json(messageDatabase.slice(index, index + limit));
    }

    // Default: Return the latest N messages
    return HttpResponse.json(messageDatabase.slice(-limit));
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
  messageDatabase = createInitialMessages();
};
