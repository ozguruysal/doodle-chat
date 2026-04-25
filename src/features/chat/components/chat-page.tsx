import { useMessages } from "../hooks/use-messages";
import { ChatFooter } from "./chat-footer";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";

import styles from "../chat.module.css";

export const ChatPage = () => {
  const { data, isLoading, error } = useMessages({});

  return (
    <div className={styles["chat-page"]}>
      <ChatHeader />
      <MessageList messages={data || []} isLoading={isLoading} error={error} />
      <ChatFooter />
    </div>
  );
};
