import { apiClient } from "./api-client";
import { createMessageSchema, messageSchema, messagesSchema } from "./schemas";

export type GetMessagesParams =
  | {
      limit?: number;
      after?: string;
      before?: never;
    }
  | {
      limit?: number;
      before?: string;
      after?: never;
    };

export async function getMessages(params: GetMessagesParams = {}) {
  const searchParams = new URLSearchParams();

  searchParams.append("limit", params.limit?.toString() || "50");

  if (params.before) {
    searchParams.append("before", params.before);
  }

  if (params.after) {
    searchParams.append("after", params.after);
  }

  const url = "/messages?" + searchParams.toString();

  return apiClient(url, messagesSchema);
}

export type CreateMessageParams = {
  message: string;
  author: string;
};

export async function createMessage(payload: CreateMessageParams) {
  const validatedPayload = createMessageSchema.parse(payload);

  return apiClient("/messages", messageSchema, {
    method: "POST",
    body: JSON.stringify(validatedPayload),
  });
}
