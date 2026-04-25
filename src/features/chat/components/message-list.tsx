import { clsx } from "clsx";
import { GridList, GridListItem } from "react-aria-components";

import { handleApiError } from "../api/handle-api-error";

import type { GridListItemProps, GridListProps } from "react-aria-components";
import type { Message } from "../api/schemas";

import styles from "../chat.module.css";

type MessageListProps<T extends object> = GridListProps<T> & {
  messages: Message[];
  isLoading?: boolean;
  error: Error | null;
};

export function MessageList<T extends object>({
  messages,
  isLoading,
  error,
  className,
  ...otherProps
}: MessageListProps<T>) {
  return (
    <div className={styles["message-list-wrapper"]}>
      {isLoading && messages.length === 0 && <div>Loading messages...</div>}

      {error && messages.length === 0 && <div>{handleApiError(error)}</div>}

      <GridList
        {...otherProps}
        className={clsx(
          styles["message-list"],
          styles["chat-container"],
          className,
        )}
        aria-label="Messages"
        layout="stack"
      >
        {messages.map((message) => (
          <MessageItem key={message._id} message={message} />
        ))}
      </GridList>
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
      {message.message}
    </GridListItem>
  );
}
