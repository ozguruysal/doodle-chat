import { useQuery } from "@tanstack/react-query";

import { getMessages } from "../api/messages";
import { chatQueryKeys } from "../api/query-keys";

import type { GetMessagesParams } from "../api/messages";

export function useMessages(params: GetMessagesParams = {}) {
  return useQuery({
    queryKey: chatQueryKeys.messages(params),
    queryFn: () => getMessages(params),
  });
}
