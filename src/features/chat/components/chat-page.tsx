import { useState } from "react";

import { useMessages } from "../hooks/use-messages";
import { isUsernameSet } from "../utils/username";
import { ChatFooter } from "./chat-footer";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";
import { RegistrationForm } from "./registration-form";

import styles from "../chat.module.css";

export const ChatPage = () => {
  const [hasUsername, setHasUsername] = useState(isUsernameSet());

  const messagesQuery = useMessages();

  return (
    <div className={styles["chat-page"]}>
      {!hasUsername ? (
        <RegistrationForm setHasUsername={setHasUsername} />
      ) : (
        <>
          <ChatHeader setHasUsername={setHasUsername} />

          <MessageList messagesQuery={messagesQuery} />

          <ChatFooter />
        </>
      )}
    </div>
  );
};
