import clsx from "clsx";
import { Button, Form, Input, TextField } from "react-aria-components";

import { useCreateMessage } from "../hooks/use-create-message";
import { getUsername } from "../utils/username";

import type { TextFieldProps } from "react-aria-components";

import styles from "../chat.module.css";

export function ChatFooter() {
  const mutation = useCreateMessage();

  function validate(value: string) {
    if (value.length > 500) {
      return "Message must be less than 500 characters.";
    }

    return null;
  }

  function submitForm(formData: FormData) {
    const author = getUsername();
    const message = formData.get("message");

    if (!author) {
      throw new Error(
        "Username is not set. Cannot send message without a username.",
      );
    }

    mutation.mutate({ author, message: String(message) });
  }

  return (
    <footer className={styles["chat-footer"]}>
      <Form
        className={clsx(styles["chat-container"], styles["chat-form"])}
        action={submitForm}
      >
        <ChatInput
          placeholder="Message"
          aria-label="Write a message"
          validate={validate}
          name="message"
          isRequired
        />

        <Button
          type="submit"
          className={clsx(styles["chat-submit-button"], styles.button)}
        >
          Send
        </Button>
      </Form>
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
