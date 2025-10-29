import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Sequelize from "sequelize";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const require = createRequire(import.meta.url);

export function initModels(sequelize) {
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

  files.forEach((file) => {
    const modelPath = path.join(__dirname, file);
    const model = require(modelPath)(sequelize, Sequelize.DataTypes);
    initializedDb[model.name] = model;
  });

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
