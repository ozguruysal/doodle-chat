import { clsx } from "clsx";
import { useCallback, useLayoutEffect, useRef } from "react";
import {
  Collection,
  GridList,
  GridListItem,
  GridListLoadMoreItem,
} from "react-aria-components";

import { useResizeObserver } from "../../../shared/hooks/use-resize-observer";
import { handleApiError } from "../api/handle-api-error";

import type {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import type { GridListItemProps, GridListProps } from "react-aria-components";
import type { Message } from "../api/schemas";

import styles from "../chat.module.css";

type MessageListProps<T extends object> = GridListProps<T> & {
  messages: Message[];
  isLoading?: boolean;
  error: Error | null;
  hasMoreHistory: boolean;
  loadMoreHistory: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult>;
  isLoadingHistory?: boolean;
};

const isNearBottom = (element: HTMLElement, offset = 300) => {
  const { scrollTop, scrollHeight, clientHeight } = element;

  return scrollHeight - clientHeight - scrollTop < offset;
};

export function MessageList<T extends object>({
  messages,
  isLoading,
  error,
  className,
  hasMoreHistory,
  loadMoreHistory,
  isLoadingHistory,
  ...otherProps
}: MessageListProps<T>) {
  const messageListref = useRef<HTMLDivElement | null>(null);
  const gridListRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useResizeObserver({
    ref: gridListRef,

    onResize: () => {
      const container = messageListref.current;

      if (!container) {
        return;
      }

      if (isNearBottom(container)) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    },
  });

  // Minimizes scroll flicker on initial page load
  const hasInitialized = useRef(false);
  useLayoutEffect(() => {
    if (messages.length > 0 && !hasInitialized.current) {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
        hasInitialized.current = true;
      });
    }
  }, [messages.length]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingHistory || !hasMoreHistory) {
      return;
    }

    console.log("___onLoadMore triggerred___");

    const el = messageListref.current;

    if (!el) {
      return;
    }

    const prevScrollTop = el.scrollTop;
    const prevScrollHeight = el.scrollHeight;

    console.log("fetching more messages...");

    await loadMoreHistory();

    requestAnimationFrame(() => {
      const newScrollHeight = el.scrollHeight;

      el.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
    });
  }, [hasMoreHistory, isLoadingHistory, loadMoreHistory]);

  return (
    <div ref={messageListref} className={styles["message-list-wrapper"]}>
      {isLoading && messages.length === 0 && <div>Loading messages...</div>}

      {error && messages.length === 0 && <div>{handleApiError(error)}</div>}

      <GridList
        ref={gridListRef}
        {...otherProps}
        className={clsx(
          styles["message-list"],
          styles["chat-container"],
          className,
        )}
        aria-label="Messages"
        layout="stack"
        orientation="vertical"
        renderEmptyState={() => <div>Loading...</div>}
      >
        <GridListLoadMoreItem
          onLoadMore={handleLoadMore}
          isLoading={isLoadingHistory}
        />

        <Collection items={messages}>
          {(message) => (
            <MessageItem
              textValue={message.message}
              id={message._id}
              key={message._id}
              message={message}
            />
          )}
        </Collection>
      </GridList>
      <div ref={bottomRef} />
    </div>
  );
}

type MessageItemProps = GridListItemProps & {
  message: Message;
};

function MessageItem({ message, className, ...otherProps }: MessageItemProps) {
  return (
    <GridListItem
      {...otherProps}
      className={clsx(styles["message-item"], className)}
    >
      <div>{message.message}</div>
      <div>
        {message.author} - {message.createdAt}
      </div>
    </GridListItem>
  );
}
