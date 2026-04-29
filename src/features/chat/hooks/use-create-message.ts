import { useMutation } from "@tanstack/react-query";

import { createMessage } from "../api/messages";
import { chatQueryKeys } from "../api/query-keys";

import type { InfiniteData } from "@tanstack/react-query";
import type { CreateMessageParams } from "../api/messages";
import type { Message } from "../api/schemas";

export function useCreateMessage() {
  const queryKey = chatQueryKeys.pagination();

  return useMutation({
    mutationFn: (params: CreateMessageParams) => createMessage(params),

    onMutate: async (newMessage, context) => {
      await context.client.cancelQueries({ queryKey });

      const previousMessages = context.client.getQueryData(queryKey);

      // prepare optimistic payload
      const optimisticId = crypto.randomUUID();
      const optimisticMessage: Message = {
        ...newMessage,
        _id: optimisticId,
        createdAt: new Date().toISOString(),
      };

      // Update cache with optimistic payload
      context.client.setQueryData(
        queryKey,
        (old: InfiniteData<Message[], CreateMessageParams>) => {
          if (!old) {
            return old;
          }

          const updatedPages = [...old.pages[0], optimisticMessage];

          return {
            ...old,
            pages: [updatedPages, ...old.pages.slice(1)],
          };
        },
      );

      return { previousMessages, optimisticId };
    },

    onSettled: async (newMessage, error, _, onMutateResult, context) => {
      if (error) {
        // do something
      }

      context.client.setQueryData(
        queryKey,
        (old: InfiniteData<Message[], CreateMessageParams>) => {
          if (!old) {
            return old;
          }

          const newPages = old.pages[0].map((item: Message) => {
            if (item._id === onMutateResult?.optimisticId) {
              return newMessage;
            }

            return item;
          });

          return {
            ...old,
            pages: [newPages, ...old.pages.slice(1)],
          };
        },
      );
    },
  });
}
