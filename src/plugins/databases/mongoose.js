import fp from "fastify-plugin";
import mangoose from "mongoose";
import { Item} from "../../models/mongoose/Item.js";

async function mongoosePlugin(fastify, config) {
  let mongoStatus = "disconnected";

  // Makes the current connection status available to other plugins
  // This is used to show the connection status on the home page
  fastify.decorate("mongoStatus", () => mongoStatus);

  // TODO: Connect to MongoDB
  try {
    await mangoose.connect(config.uri, config.options);
    mongoStatus = "connected";
    fastify.log.info("Connected to MongoDB");
    fastify.decorate("Item", Item); // Make the Item model available to other plugins
  } catch (err) {
    fastify.log.error("Failed to connect to MongoDB");
    throw error; // Rethrow the error to prevent the server from starting
  }

  // Graceful shutdown
  fastify.addHook("onClose", async (fastifyInstance, done) => {
    mongoStatus = "disconnected";
    // TODO: Close MongoDB connection
    mangoose.connection.close();
    fastify.log.info("Disconnected from MongoDB");
    done();
  });
}

export default fp(mongoosePlugin, { name: "mongoose-plugin" });
