import { GridList, GridListItem } from "react-aria-components";

import type { GridListItemProps, GridListProps } from "react-aria-components";
import type { Message } from "../api/schemas";

type MessageListProps<T extends object> = GridListProps<T> & {
  messages: Message[];
};

export function MessageList<T extends object>(props: MessageListProps<T>) {
  return (
    <GridList {...props} aria-label="Messages" layout="stack">
      {props.messages.map((message) => (
        <MessageItem key={message._id} message={message} />
      ))}
    </GridList>
  );
}

type MessageItemProps = GridListItemProps & {
  message: Message;
};

function MessageItem({ message, ...otherProps }: MessageItemProps) {
  return <GridListItem {...otherProps}>{message.message}</GridListItem>;
}
