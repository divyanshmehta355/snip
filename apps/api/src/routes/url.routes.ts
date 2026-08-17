import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { CreateUrlSchema } from "shared";
import { nanoid } from "nanoid";
import { db } from "../db";
import { urls, clicks } from "../db/schema";
import { eq } from "drizzle-orm";
import { redis } from "../plugins/redis";
import { ratelimit } from "../plugins/rate-limit";

export async function urlRoutes(server: FastifyInstance) {
  const fastify = server.withTypeProvider<ZodTypeProvider>();

  // Create Short URL
  fastify.post(
    "/api/urls",
    {
      schema: {
        body: CreateUrlSchema,
      },
    },
    async (request, reply) => {
      const ip = request.ip;
      const { success } = await ratelimit.limit(ip);

      if (!success) {
        return reply.status(429).send({ error: "Too many requests" });
      }

      let userId = null;
      try {
        await request.jwtVerify();
        userId = (request.user as any)?.id;
      } catch (e) {
        // Not logged in or invalid token
      }

      const { url } = request.body;
      const shortCode = nanoid(7);

      // Save to database
      await db.insert(urls).values({
        shortCode,
        longUrl: url,
        userId: userId || null,
      });

      // Cache in Redis for fast redirects (e.g. 24 hours)
      await redis.setex(`url:${shortCode}`, 86400, url);

      return { shortCode, originalUrl: url };
    }
  );

  // Get URLs for a specific user
  fastify.get(
    "/api/urls/me",
    { preValidation: [server.authenticate] },
    async (request, reply) => {
      const userId = (request.user as any)?.id;

      if (!userId) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const userUrls = await db
        .select()
        .from(urls)
        .where(eq(urls.userId, userId))
        .orderBy(urls.createdAt); // Needs desc(), but we'll keep it simple

      return userUrls;
    }
  );

  // Redirect Short URL
  fastify.get(
    "/:code",
    async (request, reply) => {
      const { code } = request.params as { code: string };

      // 1. Try to get from cache
      let longUrl = await redis.get<string>(`url:${code}`);
      let urlRecordId: number | null = null;

      // 2. If not in cache, query DB
      if (!longUrl) {
        const [urlRecord] = await db
          .select()
          .from(urls)
          .where(eq(urls.shortCode, code))
          .limit(1);

        if (!urlRecord) {
          return reply.status(404).send({ error: "URL not found" });
        }

        longUrl = urlRecord.longUrl;
        urlRecordId = urlRecord.id;

        // Cache it for future requests
        await redis.setex(`url:${code}`, 86400, longUrl);
      }

      // 3. Track the click asynchronously (fire and forget)
      if (longUrl) {
        // If we didn't fetch the record ID, fetch it just for tracking (or we could just use code)
        // A better design is to track by URL ID, so let's get it if missing
        if (!urlRecordId) {
          const [urlRecord] = await db
            .select({ id: urls.id })
            .from(urls)
            .where(eq(urls.shortCode, code))
            .limit(1);
          if (urlRecord) {
             urlRecordId = urlRecord.id;
          }
        }
        
        if (urlRecordId) {
          db.insert(clicks).values({
            urlId: urlRecordId,
            referrer: request.headers.referer || null,
            userAgent: request.headers["user-agent"] || null,
          }).catch(err => server.log.error("Failed to track click", err));
          
          // Increment click count on the url record
          db.execute(`UPDATE urls SET click_count = click_count + 1 WHERE id = ${urlRecordId}`).catch(err => server.log.error("Failed to update click count", err));
        }
      }

      // 4. Redirect
      return reply.redirect(longUrl);
    }
  );
}
