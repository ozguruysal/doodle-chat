import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useMessages } from "../hooks/use-messages";
import { MessageList } from "./message-list";

import type { Mock } from "vitest";

// Mock the useMessages hook
vi.mock("../hooks/use-messages", () => ({
  useMessages: vi.fn(),
}));

const mockMessages = [
  {
    _id: "1",
    message: "Hello",
    author: "User1",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    message: "Hi there",
    author: "User2",
    createdAt: new Date().toISOString(),
  },
];

type UseMessagesResult = ReturnType<typeof useMessages>;

describe("MessageList", () => {
  it("should render messages correctly", () => {
    (useMessages as Mock).mockReturnValue({
      messages: mockMessages,
      isLoading: false,
      isFetchingHistory: false,
      hasMoreHistory: true,
      fetchHistory: vi.fn(),
      isFetchingNewMessages: false,
      error: undefined,
    } satisfies UseMessagesResult);

    render(<MessageList messagesQuery={useMessages() as UseMessagesResult} />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there")).toBeInTheDocument();
  });

  it("should show loading state", () => {
    (useMessages as Mock).mockReturnValue({
      messages: [],
      isLoading: true,
      isFetchingHistory: false,
      hasMoreHistory: true,
      fetchHistory: vi.fn(),
      isFetchingNewMessages: true,
      error: undefined,
    } satisfies UseMessagesResult);

    render(<MessageList messagesQuery={useMessages() as UseMessagesResult} />);

    expect(screen.getByText("Loading messages...")).toBeInTheDocument();
  });
});
