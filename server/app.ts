import express from "express";
import * as http from "http";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import debug from "debug";
import helmet from "helmet";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { UsersRoutes } from "./users/users.routes.config";
import { PapersRoutes } from "./papers/papers.routes.config";
import { AuthRoutes } from "./auth/auth.routes.config";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const PORT = process.env.BACKEND_PORT;
const HOST = process.env.BACKEND_HOST;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug("app");

// here we are adding middleware to parse all incoming requests as JSON
app.use(express.json());
// here we are adding middleware to allow cross-origin requests
app.use(cors());

app.use(helmet());
// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false; // when not debugging, make terse
  if (typeof global.it === "function") {
    loggerOptions.level = "http"; // for non-debug test runs, squelch entirely
  }
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// here we are adding the Routes to our array,
// after sending the Express.js application object to have the routes added to our app!
routes.push(new AuthRoutes(app));
routes.push(new UsersRoutes(app));
routes.push(new PapersRoutes(app));

// this is a simple route to make sure everything is working properly
const runningMessage = `Server running on http://${HOST}:${PORT}`;
app.get("/", (_req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

export default server.listen(PORT, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
  // our only exception to avoiding console.log(), because we
  // always want to know when the server is done starting up
  console.log(runningMessage);
});