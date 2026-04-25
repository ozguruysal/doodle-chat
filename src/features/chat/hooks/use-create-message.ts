import { useMutation } from "@tanstack/react-query";

import { createMessage } from "../api/messages";

import type { CreateMessageParams } from "../api/messages";

export function useCreateMessage() {
  return useMutation({
    mutationFn: (params: CreateMessageParams) => createMessage(params),
  });
}
