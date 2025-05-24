import morgan from "morgan";
import chalk from "chalk";
import { format } from "date-fns";

// Custom formatting of date
const getFormattedDate = () => { return format(new Date(), "dd-MM-yyyy | HH:mm:ss"); };

// Token for displaying the origin of the request
morgan.token("origin", (req) => {
  return req.headers.origin || "same-origin";
});

// Custom token for formatted date
morgan.token("customDate", getFormattedDate);

// Custom token for colored logs
morgan.token("coloredLogs", (_req, res) => {
  const status = res.statusCode;

  if (status >= 500) { return chalk.redBright.bold(status); } // Server Errors in Red
  if (status >= 400) { return chalk.yellowBright.bold(status); } // Client Errors in Yellow
  if (status >= 200) { return chalk.greenBright.bold(status); } // Success
});

// Defining console logging format
const consoleLogFormat =
  chalk.blue("[LOG]") +
  " :customDate " +
  chalk.magenta(":method") + " " +
  chalk.cyan(":url") + " " +
  ":coloredLogs " +
  ":origin " +
  chalk.yellow(":response-time ms");

// Morgan middleware for console logging
export const consoleLogger = morgan(consoleLogFormat, { stream: process.stdout });
