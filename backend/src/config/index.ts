import openMeteoConfig from "./open-meteo-config.js";
import activitiesConfig from "./activities-config.js";

const configRegistry = {
    "open-meteo-config": openMeteoConfig,
    "activities-config": activitiesConfig,
};

export { configRegistry };