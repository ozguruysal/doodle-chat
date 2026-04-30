export const chatQueryKeys = {
  all: ["messages"] as const,
  list: () => [...chatQueryKeys.all, "list"] as const,
  poll: () => [...chatQueryKeys.all, "latest"] as const,
};
