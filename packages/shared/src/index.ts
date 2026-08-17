import { z } from "zod";

export const CreateUrlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export type CreateUrlRequest = z.infer<typeof CreateUrlSchema>;

export const UrlResponseSchema = z.object({
  shortUrl: z.string(),
  originalUrl: z.string(),
});
