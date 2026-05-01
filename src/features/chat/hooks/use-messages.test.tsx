import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { resetMessageDatabase } from "../../../tests/mocks/handlers";
import { createMessage } from "../api/messages";
import { chatQueryKeys } from "../api/query-keys";
import { useMessages } from "./use-messages";

// Mock VITE_API_URL for the api-client
vi.stubEnv("VITE_API_URL", "http://localhost:3000/api/v1");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  return {
    queryClient,
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  };
};

describe("useMessages", () => {
  beforeEach(() => {
    resetMessageDatabase();
  });

  it("should fetch the latest 50 messages initially", async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useMessages(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.messages).toHaveLength(50);
    // latest is msg-150, oldest in this page is msg-101
    expect(
      result.current.messages[result.current.messages.length - 1]._id,
    ).toBe("msg-150");
    expect(result.current.messages[0]._id).toBe("msg-101");
  });

  it("should fetch history when fetchHistory is called", async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useMessages(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const initialCount = result.current.messages.length;

    await result.current.fetchHistory();

    await waitFor(() => {
      expect(result.current.messages.length).toBe(initialCount + 50);
    });

    // Older messages (msg-51 to msg-100) should be prepended
    expect(result.current.messages[0]._id).toBe("msg-51");
  });

  it("should receive new messages via polling", async () => {
    const { wrapper, queryClient } = createWrapper();
    const { result } = renderHook(() => useMessages(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const countBeforePolling = result.current.messages.length;

    // Simulate someone else sending a message
    await createMessage({
      message: "External new message",
      author: "OtherUser",
    });

    // Instead of waiting for 3s, we manually trigger the polling query to refetch
    // This is a reliable way to test the CACHE UPDATE logic in useMessages
    await queryClient.refetchQueries({ queryKey: chatQueryKeys.poll() });

    // Verify the new message appeared in the list (hook's useEffect should have updated the cache)
    await waitFor(() => {
      expect(result.current.messages.length).toBe(countBeforePolling + 1);
    });

    expect(
      result.current.messages[result.current.messages.length - 1].message,
    ).toBe("External new message");
  });
});
