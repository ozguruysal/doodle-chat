import type { GetMessagesParams } from "./messages";

export const chatQueryKeys = {
  all: ["chat"] as const,

  messages: (params: GetMessagesParams) =>
    [...chatQueryKeys.all, "messages", params] as const,

  user: () => [...chatQueryKeys.all, "user"] as const,
};
