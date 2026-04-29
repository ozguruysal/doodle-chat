import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getMessages } from "../api/messages";
import { chatQueryKeys } from "../api/query-keys";

const PAGE_SIZE = 50;

export const useMessages = () => {
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: chatQueryKeys.pagination(),

    // We give a future date to get the latest N messages
    initialPageParam: new Date("2200-01-01").toISOString(),

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
  });

  const historicalMessages = useMemo(() => {
    return infiniteData?.pages.flat() ?? [];
  }, [infiniteData]);

  // We need the timestamp of the very last message we have
  const latestTimestamp = useMemo(() => {
    return historicalMessages.length > 0
      ? historicalMessages[historicalMessages.length - 1].createdAt
      : undefined;
  }, [historicalMessages]);

  const {
    data: newMessages,
    isLoading,
    error,
  } = useQuery({
    queryKey: chatQueryKeys.polling(latestTimestamp),
    queryFn: () => getMessages({ after: latestTimestamp }),
    // Only poll if we have at least one message
    enabled: Boolean(latestTimestamp),
    // Polling
    refetchInterval: 2000,
  });

  const allMessages = useMemo(() => {
    const combined = [...historicalMessages, ...(newMessages ?? [])];

    // Remove duplicates by ID in case a message appears in both feeds
    return Array.from(new Map(combined.map((m) => [m._id, m])).values());
  }, [historicalMessages, newMessages]);

  return {
    isLoading,
    error,
    messages: allMessages,
    loadMoreHistory: fetchNextPage,
    hasMoreHistory: hasNextPage,
    isLoadingHistory: isFetchingNextPage,
  };
};
