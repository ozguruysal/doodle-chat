import { useEffect } from "react";

import { getMessages } from "./features/chat/api/messages";

function App() {
  useEffect(() => {
    getMessages()
      .then((messages) => {
        console.log(messages);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, []);

  return <div>Hello Vite, React</div>;
}

export default App;
