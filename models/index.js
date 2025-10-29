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
    const modelModule = await import(modelUrl);
    const modelFactory = modelModule.default;
    const model = modelFactory(sequelize, Sequelize.DataTypes);
    initializedDb[model.name] = model;
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
