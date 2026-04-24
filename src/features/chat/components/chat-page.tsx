import { handleApiError } from "../api/handle-api-error";
import { useMessages } from "../hooks/use-messages";
import { ChatFooter } from "./chat-footer";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";

import styles from "../chat.module.css";

export const ChatPage = () => {
  const { data, isLoading, error } = useMessages({});

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    const errorMessage = handleApiError(error);

    return <div>{errorMessage}</div>;
  }

  return (
    <div className={styles["chat-page"]}>
      <ChatHeader />
      <MessageList messages={data || []} />
      <ChatFooter />
    </div>
  );
};
