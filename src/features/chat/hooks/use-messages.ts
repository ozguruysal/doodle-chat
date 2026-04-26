import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import { getMessages } from "../api/messages";
import { chatQueryKeys } from "../api/query-keys";

export const useMessages = () => {
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: chatQueryKeys.pagination(),

    initialPageParam: new Date("2200-01-01").toISOString(), // We give a future date to get the latest N messages

    queryFn: async ({ pageParam }) => {
      console.log("FETCH before =", pageParam);

      const res = await getMessages({ limit: 10, before: pageParam });

      console.log("RESULT length =", res.length);

      return res;
    },

    getNextPageParam: (lastPage) => {
      console.log("lastPage", lastPage);
      if (!lastPage || lastPage.length === 0) {
        return undefined;
      }

      return lastPage[0].createdAt;
    },
  });

  const historicalMessages = useMemo(() => {
    return (infiniteData?.pages.flat() ?? []).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
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
    enabled: !!latestTimestamp, // Only poll if we have at least one message
    refetchInterval: 3000, // Polling every 3 seconds
  });

  // 3. COMBINE & DEDUPLICATE
  const allMessages = useMemo(() => {
    const combined = [...historicalMessages, ...(newMessages ?? [])];
    // Map helps remove duplicates by ID in case a message appears in both feeds
    return Array.from(new Map(combined.map((m) => [m._id, m])).values());
  }, [historicalMessages, newMessages]);

  useEffect(() => {
    console.log(
      "useMessages re-rendered. infiniteData changed:",
      !!infiniteData,
    );
  }, [infiniteData]);

  useEffect(() => {
    console.log("useMessages re-rendered. newMessages changed:", !!newMessages);
  }, [newMessages]);

  useEffect(() => {
    if (infiniteData?.pages) {
      console.log(
        "Data successfully updated. Last page:",
        infiniteData.pages[infiniteData.pages.length - 1],
      );
    }
  }, [infiniteData]); // Only runs when data actually changes, not on every internal transition

  return {
    isLoading,
    error,
    messages: allMessages,
    loadMoreHistory: fetchNextPage,
    hasMoreHistory: hasNextPage,
    isLoadingHistory: isFetchingNextPage,
  };
};
