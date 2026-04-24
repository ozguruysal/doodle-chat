import styles from "../chat.module.css";

export function ChatHeader() {
  return (
    <header className={styles["chat-header"]}>
      <div className={styles["chat-container"]}>
        <h1>Doodle Chat</h1>
      </div>
    </header>
  );
}
