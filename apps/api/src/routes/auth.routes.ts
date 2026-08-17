import { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function authRoutes(server: FastifyInstance) {
  server.post("/api/auth/register", async (request, reply) => {
    try {
      const schema = z.object({
        name: z.string().optional(),
        email: z.string().email(),
        password: z.string().min(6),
      });

      const parsed = schema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.errors[0].message });
      }

      const { email, password, name } = parsed.data;

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser) {
        return reply.status(400).send({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [newUser] = await db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
          name: name || null,
        })
        .returning();

      const token = server.jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name });

      return { token, user: { id: newUser.id, email: newUser.email, name: newUser.name } };
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  server.post("/api/auth/login", async (request, reply) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(1),
      });

      const parsed = schema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: "Invalid credentials" });
      }

      const { email, password } = parsed.data;

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user || !user.password) {
        return reply.status(401).send({ error: "Invalid credentials" });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return reply.status(401).send({ error: "Invalid credentials" });
      }

      const token = server.jwt.sign({ id: user.id, email: user.email, name: user.name });

      return { token, user: { id: user.id, email: user.email, name: user.name } };
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  server.get("/api/auth/me", { preValidation: [server.authenticate] }, async (request, reply) => {
    return request.user;
  });
}
