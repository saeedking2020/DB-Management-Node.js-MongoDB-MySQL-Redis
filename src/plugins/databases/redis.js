import fp from "fastify-plugin";
import Redis from "ioredis";

async function redisPlugin(fastify, config) {
  let redisStatus = "disconnected";

  // TODO: Connect to Redis and update the status
try {
  const redis = new Redis(config.host, config.port);
  redisStatus = "connected";
  fastify.log.info("Connected to Redis successfully.");
  fastify.decorate("redis", redis);
} catch (error) {
  fastify.log.error("Error connecting to Redis:", error);
  throw error; // Rethrow the error to prevent the server from starting if Redis connection fails
}
  fastify.decorate("redisStatus", () => redisStatus);

  // Graceful shutdown
  fastify.addHook("onClose", async (fastifyInstance, done) => {
    redisStatus = "disconnected";
    // TODO: Close Redis connection
    await fastify.redis.quit();
    done();
  });
}

export default fp(redisPlugin, { name: "redis-plugin" }); 
