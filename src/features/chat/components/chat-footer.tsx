import clsx from "clsx";
import { Button, Input, TextField } from "react-aria-components";

import type { TextFieldProps } from "react-aria-components";

import styles from "../chat.module.css";

export function ChatFooter() {
  return (
    <footer className={styles["chat-footer"]}>
      <div className={clsx(styles["chat-container"], styles["chat-form"])}>
        <ChatInput placeholder="Message" aria-label="Write a message" />
        <Button className={styles["chat-submit-button"]}>Send</Button>
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
