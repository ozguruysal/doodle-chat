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
import { formatMessageDate } from "../utils/date";
import { isCurrentUser } from "../utils/username";

import type { GridListItemProps, GridListProps } from "react-aria-components";
import type { Message } from "../api/schemas";
import type { useMessages } from "../hooks/use-messages";

import styles from "../chat.module.css";

type MessageListProps<T extends object> = GridListProps<T> & {
  messagesQuery: ReturnType<typeof useMessages>;
};

const isNearBottom = (element: HTMLElement, offset = 300) => {
  const { scrollTop, scrollHeight, clientHeight } = element;

  return scrollHeight - clientHeight - scrollTop < offset;
};

export function MessageList<T extends object>({
  messagesQuery,
  className,
  ...otherProps
}: MessageListProps<T>) {
  const messageListref = useRef<HTMLDivElement | null>(null);
  const gridListRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const {
    error,
    fetchHistory,
    hasMoreHistory,
    isFetchingHistory,
    isFetchingNewMessages,
    messages,
  } = messagesQuery;

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
    if (isFetchingHistory || !hasMoreHistory) {
      return;
    }

    const el = messageListref.current;

    if (!el) {
      return;
    }

    const prevScrollTop = el.scrollTop;
    const prevScrollHeight = el.scrollHeight;

    await fetchHistory();

    requestAnimationFrame(() => {
      const newScrollHeight = el.scrollHeight;

      el.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
    });
  }, [fetchHistory, hasMoreHistory, isFetchingHistory]);

  return (
    <div ref={messageListref} className={styles["message-list-wrapper"]}>
      {isFetchingNewMessages && messages.length === 0 && (
        <div>Loading messages...</div>
      )}

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
          isLoading={isFetchingHistory}
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
  const isAuhtor = isCurrentUser(message.author);

  return (
    <GridListItem
      {...otherProps}
      className={clsx(
        styles["message-item"],
        { [styles.sender]: isAuhtor },
        className,
      )}
    >
      {!isAuhtor && (
        <div className={styles["message-author"]}>{message.author}</div>
      )}

      <div>{message.message}</div>
      <div className={styles["message-date"]}>
        {formatMessageDate(message.createdAt)}
      </div>
    </GridListItem>
  );
}
