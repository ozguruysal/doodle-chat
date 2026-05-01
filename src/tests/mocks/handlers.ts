import { http, HttpResponse } from "msw";

const BASE_URL = "http://localhost:3000/api/v1";

const generateMessages = (
  count: number,
  startId: number,
  baseTime: Date,
  step: "before" | "after",
) => {
  return Array.from({ length: count }).map((_, i) => {
    const id = startId + i;
    const time = new Date(baseTime);

    if (step === "before") {
      time.setMinutes(time.getMinutes() - (i + 1));
    } else {
      time.setMinutes(time.getMinutes() + (i + 1));
    }

    return {
      _id: `msg-${id}`,
      message: `Message ${id}`,
      author: "UserA",
      createdAt: time.toISOString(),
    };
  });
};

export const handlers = [
  http.get(`${BASE_URL}/messages`, ({ request }) => {
    const url = new URL(request.url);
    const before = url.searchParams.get("before");
    const after = url.searchParams.get("after");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    let messages;

    if (before) {
      messages = generateMessages(limit, 100, new Date(before), "before");
    } else if (after) {
      messages = generateMessages(limit, 200, new Date(after), "after");
    } else {
      messages = generateMessages(limit, 0, new Date(), "before");
    }

    return HttpResponse.json(messages);
  }),

  http.post(`${BASE_URL}/messages`, async ({ request }) => {
    const body = (await request.json()) as { message: string; author: string };

    const newMessage = {
      _id: `msg-${Date.now()}`,
      message: body.message,
      author: body.author,
      createdAt: new Date().toISOString(),
    };

    return HttpResponse.json(newMessage);
  }),
];
