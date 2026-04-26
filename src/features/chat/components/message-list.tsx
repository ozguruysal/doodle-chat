import { clsx } from "clsx";
import { useEffect, useRef } from "react";
import {
  Collection,
  GridList,
  GridListItem,
  GridListLoadMoreItem,
  ProgressBar,
} from "react-aria-components";

import { useResizeObserver } from "../../../shared/hooks/use-resize-observer";
import { handleApiError } from "../api/handle-api-error";

import type { GridListItemProps, GridListProps } from "react-aria-components";
import type { Message } from "../api/schemas";

import styles from "../chat.module.css";

type MessageListProps<T extends object> = GridListProps<T> & {
  messages: Message[];
  isLoading?: boolean;
  error: Error | null;
  hasMoreHistory: boolean;
  loadMoreHistory: any;
  isLoadingHistory?: boolean;
};

const isNearBottom = (element: HTMLElement, offset = 100) => {
  const { scrollTop, scrollHeight, clientHeight } = element;

  return scrollHeight - clientHeight - scrollTop < offset;
};

function setScrollFromBottom(element: HTMLElement, distance: number) {
  const targetScrollTop =
    element.scrollHeight - element.clientHeight - distance;

  element.scrollTo({
    top: targetScrollTop,
    behavior: "smooth", // Optional: 'auto' for instant jump
  });
}

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
      if (gridListRef.current && isNearBottom(gridListRef.current)) {
        // bottomRef.current?.scrollIntoView();
      }
    },
  });

  return (
    <div
      ref={messageListref}
      className={styles["message-list-wrapper"]}
      style={{ overflowAnchor: "none" }}
    >
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
          onLoadMore={async () => {
            if (isLoadingHistory || !hasMoreHistory) {
              return;
            }

            console.log("___onLoadMore triggerred___");

            const el = messageListref.current;

            if (!el) return;

            const prevScrollTop = el.scrollTop;
            const prevScrollHeight = el.scrollHeight;

            console.log("fetching more messages...");
            await loadMoreHistory();

            requestAnimationFrame(() => {
              const newScrollHeight = el.scrollHeight;

              el.scrollTop =
                prevScrollTop + (newScrollHeight - prevScrollHeight);
            });
          }}
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
