import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

export default fp(async (server, opts) => {
  server.register(fastifyJwt, {
    secret: process.env.AUTH_SECRET || "supersecretkey1234567890",
  });

  server.decorate(
    "authenticate",
    async function (request: any, reply: any) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );
});

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}
