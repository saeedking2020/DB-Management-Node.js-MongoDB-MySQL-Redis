import fp from "fastify-plugin";
import { Sequelize } from "sequelize";
import { readdir } from "fs/promises";
import path from "path";
import { pathToFileURL } from 'url';

async function sequelizePlugin(fastify, config) {
  let mysqlStatus = "disconnected";
  let sequelize = null;

  // TODO: Connect to MySQL via Sequelize and update the status
  try {
    sequelize = new Sequelize(config.uri, config.options);
    await sequelize.authenticate();
    fastify.log.info("Connected to MySQL via Sequelize");
    mysqlStatus = "connected";
    fastify.decorate("sequelize", sequelize); // Make the Sequelize instance available to other plugins

    // Dynamically import all models and set up associations
    const models = {};
    const modelsPath = path.resolve("src/models/sequelize");
    const modelFiles = await readdir(modelsPath);
    for (const file of modelFiles) {
      if (file.endsWith('.js')) {
        // 1. Resolve the absolute path
        const absolutePath = path.join(modelsPath, file);
        
        // 2. Convert to a file:// URL string
        const fileUrl = pathToFileURL(absolutePath).href;

        // 3. Use the URL for dynamic import
        const modelModule = await import(fileUrl);
        const model = modelModule.default(sequelize, Sequelize.DataTypes);
        
        // Store your model
        models[model.name] = model;
        fastify.log.info(`Loaded Sequelize model: ${model.name}`);
      }
    }
    // Set up associations
    Object.values(models).forEach(model => {
      if (model.associate) {
        model.associate(models);
      }
    });

    await sequelize.sync({ alter: false }); // Sync models with the database
    fastify.log.info("Sequelize models synchronized with MySQL database");
    
    fastify.decorate("models", models); // Make the models available to other plugins

  } catch (error) {
    fastify.log.error("Failed to connect to MySQL via Sequelize");
    throw error; // Rethrow the error to prevent the server from starting
  }


  fastify.decorate("mysqlStatus", () => mysqlStatus);

  // Graceful shutdown
  fastify.addHook("onClose", async (fastifyInstance, done) => {
    mysqlStatus = "disconnected";
    // TODO: Close Sequelize connection
    if (sequelize) {
      await sequelize.close();
    }
    done();
  });
}

export default fp(sequelizePlugin, { name: "sequelize-plugin" });
