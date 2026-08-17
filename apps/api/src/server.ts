import Fastify from "fastify";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { urlRoutes } from "./routes/url.routes";
import { authRoutes } from "./routes/auth.routes";
import jwtPlugin from "./plugins/jwt";

const server = Fastify({
  logger: true,
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(cors, {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
});

server.register(jwtPlugin);

server.get("/health", async (request, reply) => {
  return { status: "ok" };
});

server.register(authRoutes);
server.register(urlRoutes);

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || "4000", 10);
    await server.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
