import { Button, Input, TextField } from "react-aria-components";

import type { TextFieldProps } from "react-aria-components";

export function ChatFooter() {
  return (
    <footer>
      <ChatInput placeholder="Message" aria-label="Write a message" />
      <Button>Send</Button>
    </footer>
  );
}

type ChatInputProps = TextFieldProps & {
  placeholder?: string;
};

function ChatInput({ className, placeholder, ...otherProps }: ChatInputProps) {
  return (
    <TextField className={className} {...otherProps}>
      <Input placeholder={placeholder} />
    </TextField>
  );
}
