export const chatQueryKeys = {
  all: ["chat"] as const,
  messages: () => [...chatQueryKeys.all, "messages"] as const,
  // Key for the infinite scroll (History)
  pagination: () => [...chatQueryKeys.messages(), "pagination"] as const,
  // Key for the 3s polling (New updates)
  polling: (after?: string) =>
    [...chatQueryKeys.messages(), "polling", { after }] as const,
};
