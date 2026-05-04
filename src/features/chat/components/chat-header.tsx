import { useQueryClient } from "@tanstack/react-query";
import { Button } from "react-aria-components";

import { getUsername, isUsernameSet, removeUsername } from "../utils/username";

import styles from "../chat.module.css";

export function ChatHeader({
  setHasUsername,
}: {
  setHasUsername: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();

  return (
    <header className={styles["chat-header"]}>
      <div className={styles["chat-container"]}>
        {isUsernameSet() && (
          <div>
            <span>Welcome, {getUsername()}!</span>

            <span> - </span>
            <Button
              className={styles["logout-button"]}
              onClick={() => {
                removeUsername();
                queryClient.clear();
                setHasUsername(false);
              }}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
