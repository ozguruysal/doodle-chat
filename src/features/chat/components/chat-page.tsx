import { useEffect, useState } from "react";

import { getMessages } from "../api/messages";
import { ChatFooter } from "./chat-footer";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";

import type { Message } from "../api/schemas";

export const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    getMessages()
      .then((messages) => {
        setMessages(messages);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, []);

  return (
    <div>
      <ChatHeader />
      <MessageList messages={messages} />
      <ChatFooter />
    </div>
  );
};
