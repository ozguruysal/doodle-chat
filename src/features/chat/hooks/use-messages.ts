import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { getMessages } from "../api/messages";
import { chatQueryKeys } from "../api/query-keys";

import type { InfiniteData } from "@tanstack/react-query";
import type { Message } from "../api/schemas";

const PAGE_SIZE = 50;

export const useMessages = () => {
  const queryClient = useQueryClient();

  // Initial loading and pagination
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: chatQueryKeys.list(),

      initialPageParam: new Date().toISOString(),

      queryFn: async ({ pageParam }) => {
        const res = await getMessages({ limit: PAGE_SIZE, before: pageParam });

        return res;
      },

      getNextPageParam: (lastPage) => {
        if (!lastPage || lastPage.length === 0) {
          return undefined;
        }

        return lastPage[0].createdAt;
      },

      select: (data) => {
        const messages = [...data.pages];

        return messages.reverse().flat();
      },
    });

  // In case cold start (no messages on page load), we will use this timestamp for polling.
  const mountTimestamp = useRef(new Date().toISOString());

  // Polling query for fetching new messages
  const { data: newMessages, isFetching: isFetchingNewMessages } = useQuery({
    queryKey: chatQueryKeys.poll(),

    queryFn: async () => {
      // Get the latest message from cache
      const data = queryClient.getQueryData<InfiniteData<Message[]>>(
        chatQueryKeys.list(),
      );
      const lastPage = data?.pages[0];
      const lastMessage =
        lastPage && lastPage.length > 0
          ? lastPage[lastPage?.length - 1]
          : undefined;

      const after = lastMessage
        ? lastMessage.createdAt
        : mountTimestamp.current;

      const res = await getMessages({ after });

      return res;
    },

    refetchInterval: 3000,
  });

  useEffect(() => {
    if (!newMessages || newMessages.length == 0) {
      return;
    }

    // Update cache with new messages
    queryClient.setQueryData<InfiniteData<Message[]>>(
      chatQueryKeys.list(),
      (old) => {
        if (!old) {
          return old;
        }

        // Build a lookup of page message IDs to prevent duplicates
        const existingIds = new Set(old.pages[0].map((i) => i._id));

        const filteredNewMessages = newMessages.filter(
          (i) => !existingIds.has(i._id),
        );

        if (filteredNewMessages.length === 0) {
          return old;
        }

        const lastPageUpdated = [...old.pages[0], ...filteredNewMessages];

        return {
          ...old,
          pages: [lastPageUpdated, ...old.pages.slice(1)],
        };
      },
    );
  }, [newMessages, queryClient]);

  return {
    isLoading,
    messages: data || [],
    fetchHistory: fetchNextPage,
    hasMoreHistory: hasNextPage,
    isFetchingHistory: isFetchingNextPage,
    error: undefined,
    isFetchingNewMessages,
  };
};
