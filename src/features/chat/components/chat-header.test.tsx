import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import * as usernameUtils from "../utils/username";
import { ChatHeader } from "./chat-header";

// Mock the username utils
vi.mock("../utils/username", () => ({
  getUsername: () => "TestUser",
  isUsernameSet: () => true,
  removeUsername: vi.fn(),
}));

describe("ChatHeader Logout", () => {
  it("should clear the query cache when logout is clicked", () => {
    const queryClient = new QueryClient();
    // Spy on the clear method
    const clearSpy = vi.spyOn(queryClient, "clear");

    const setHasUsername = vi.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <ChatHeader setHasUsername={setHasUsername} />
      </QueryClientProvider>,
    );

    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    expect(usernameUtils.removeUsername).toHaveBeenCalled();
    expect(clearSpy).toHaveBeenCalled();
    expect(setHasUsername).toHaveBeenCalledWith(false);
  });
});
