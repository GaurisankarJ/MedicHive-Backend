// Load .env
require("dotenv").config();

// Get nodeEnv from environment variable
const nodeEnv = process.env.NODE_ENV;

if (nodeEnv === "test" || nodeEnv === "development") {
    // Get configuration
    const config = require("./config.json");

    // Set envConfiguration variable
    const envConfiguration = config[nodeEnv];

    // Set environment variables
    Object.keys(envConfiguration).forEach((key) => {
        process.env[key] = envConfiguration[key];
    });
}
