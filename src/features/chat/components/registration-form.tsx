import clsx from "clsx";
import {
  Button,
  FieldError,
  Form,
  Input,
  Text,
  TextField,
} from "react-aria-components";

import styles from "../chat.module.css";

export function RegistrationForm({
  setHasUsername,
}: {
  setHasUsername: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  function validate(value: string) {
    if (value.length === 0) {
      return "Username is required.";
    }

    if (value.length > 50) {
      return "Username must be less than 50 characters.";
    }

    if (!/^[\w\s-]+$/.test(value)) {
      return "Username can only contain letters, numbers, spaces, hyphens, and underscores.";
    }

    return null;
  }

  function submitForm(formData: FormData) {
    const username = formData.get("username");

    localStorage.setItem("username", String(username));
    setHasUsername(true);
  }

  return (
    <div className={clsx(styles.register, styles["chat-container"])}>
      <h1>Doodle Chat</h1>

      <p>
        Please enter your name to join. Your name will be displayed in the chat.
      </p>

      <Form action={submitForm}>
        <TextField
          className={styles["register-textfield"]}
          name="username"
          aria-label="Enter your name"
          isRequired
          validate={validate}
          validationBehavior="native"
        >
          <Text slot="description">
            Can be max 50 characters. Only letters, numbers, spaces, hyphens,
            and underscores are allowed.
          </Text>
          <Input placeholder="Enter your name" />
          <FieldError className={styles.register} />
        </TextField>

        <Button
          className={clsx(styles["register-submit-button"], styles.button)}
          type="submit"
        >
          Join Chat
        </Button>
      </Form>
    </div>
  );
}
