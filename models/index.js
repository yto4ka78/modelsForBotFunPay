import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pathToFileURL } from "url";
import Sequelize from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

export async function initModels(sequelize) {
  if (!sequelize) {
    throw new Error("Sequelize instance is required");
  }

  const initializedDb = {};

  const files = fs.readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  });

  for (const file of files) {
    const modelPath = path.join(__dirname, file);
    const modelUrl = pathToFileURL(modelPath).href;
    try {
      const modelModule = await import(modelUrl);
      const modelFactory = modelModule.default;

      if (typeof modelFactory !== "function") {
        throw new Error(
          `Model ${file} does not export a default function. ` +
            `Received: ${typeof modelFactory}. ` +
            `Module keys: ${Object.keys(modelModule).join(", ")}`
        );
      }

      const model = modelFactory(sequelize, Sequelize.DataTypes);
      if (!model || !model.name) {
        throw new Error(
          `Model ${file} factory did not return a valid Sequelize model`
        );
      }

      initializedDb[model.name] = model;
    } catch (error) {
      console.error(`Error loading model ${file}:`, error.message);
      throw error;
    }
  }

  Object.keys(initializedDb).forEach((modelName) => {
    if (initializedDb[modelName].associate) {
      initializedDb[modelName].associate(initializedDb);
    }
  });

  initializedDb.sequelize = sequelize;
  initializedDb.Sequelize = Sequelize;

  return initializedDb;
}

export { Sequelize };
