import clsx from "clsx";
import { useState } from "react";
import { Button, Form, Input, TextField } from "react-aria-components";

import { useCreateMessage } from "../hooks/use-create-message";
import { getUsername } from "../utils/username";

import type { TextFieldProps } from "react-aria-components";

import styles from "../chat.module.css";

export function ChatFooter() {
  const [message, setMessage] = useState("");
  const author = getUsername() || "";

  const mutation = useCreateMessage();

  const isEmpty = message.trim().length === 0;
  const isMessageTooLong = message.length > 500;
  const isAuthorMissing = !author;
  const isInvalid = isEmpty || isMessageTooLong || isAuthorMissing;

  const errorMessage = (() => {
    if (isMessageTooLong) {
      return "Message is too long (max 500 chars)";
    }

    if (isAuthorMissing) {
      return "Please log in to send a message";
    }

    return null;
  })();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isInvalid) {
      mutation.mutate({ author, message: message.trim() });
      setMessage("");
    }
  }

  return (
    <footer className={styles["chat-footer"]}>
      <div className={styles["chat-container"]}>
        {errorMessage !== null && (
          <div className={styles["chat-footer-error"]}>{errorMessage}</div>
        )}
        <Form
          className={styles["chat-form"]}
          onSubmit={handleSubmit}
          validationBehavior="aria"
        >
          <ChatInput
            placeholder="Message"
            aria-label="Write a message"
            name="message"
            value={message}
            onChange={setMessage}
          />

          <Button
            type="submit"
            className={clsx(styles["chat-submit-button"], styles.button)}
            isDisabled={isInvalid}
          >
            Send
          </Button>
        </Form>
      </div>
    </footer>
  );
}

type ChatInputProps = TextFieldProps & {
  placeholder?: string;
};

function ChatInput({ className, placeholder, ...otherProps }: ChatInputProps) {
  return (
    <TextField
      className={clsx(styles["chat-text-field"], className)}
      {...otherProps}
    >
      <Input placeholder={placeholder} />
    </TextField>
  );
}
