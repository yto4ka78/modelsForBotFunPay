import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const require = createRequire(import.meta.url);

const env = process.env.NODE_ENV || "development";
const configPath = path.join(__dirname, "../config/config.json");
const configData = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const config = configData[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

export function initModels(sequelizeParam) {
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
    const model = require(modelPath)(sequelizeParam, Sequelize.DataTypes);
    initializedDb[model.name] = model;
  });

  Object.keys(initializedDb).forEach((modelName) => {
    if (initializedDb[modelName].associate) {
      initializedDb[modelName].associate(initializedDb);
    }
  });

  initializedDb.sequelize = sequelizeParam;
  initializedDb.Sequelize = Sequelize;

  return initializedDb;
}

const db = initModels(sequelize);

export default db;
export { sequelize, Sequelize };
