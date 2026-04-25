import { useMutation } from "@tanstack/react-query";

import { createMessage } from "../api/messages";

import type { CreateMessageParams } from "../api/messages";

export function useCreateMessage(params: CreateMessageParams) {
  return useMutation({
    mutationFn: () => createMessage(params),
  });
}
