import { z } from "zod";

import { decodeHtml } from "../utils/decode-html";

// We also decode HTML in message using transform
const messageContentSchema = z.string().min(1).max(500).transform(decodeHtml);

const authorNameSchema = z
  .string()
  .min(1)
  .max(50)
  .regex(/^[a-zA-Z0-9\s-_]+$/);

const isoDateTimeSchema = z.iso.datetime();

export const messageSchema = z.object({
  _id: z.string(),
  message: messageContentSchema,
  author: authorNameSchema,
  createdAt: isoDateTimeSchema,
});

export const messagesSchema = z.array(messageSchema);

export const createMessageSchema = z.object({
  message: messageContentSchema,
  author: authorNameSchema,
});

// Error Schemas

export const errorResponseSchema = z.object({
  error: z.string(),
  details: z.array(
    z.object({
      msg: z.string(),
      param: z.string(),
      location: z.string(),
    }),
  ),
});

export const internalServerErrorSchema = z.object({
  error: z.object({
    message: z.string(),
    createdAt: isoDateTimeSchema,
  }),
});

// Types

export type Message = z.infer<typeof messageSchema>;
export type CreateMessage = z.infer<typeof createMessageSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
