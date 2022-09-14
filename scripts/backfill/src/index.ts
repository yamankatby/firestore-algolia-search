#!/usr/bin/env node

import { program } from "commander";
import { parseConfig } from "./config";

const packageJson = require("../package.json");

program
  .name(packageJson.name)
  .version(packageJson.version)
  .description(packageJson.description)
  .option(
    "--non-interactive",
    "Parse all input from command line flags instead of prompting the caller.",
    false
  )
  .option("-P --project-id <project-id>", "Firebase project ID.")
  .option(
    "-C --collection-path <collection-path>",
    "Path to the Cloud Firestore collection where the extension should monitor for changes."
  )
  .option(
    "-F --fields <fields>",
    "Fields to index, a comma separated list or left blank to index all fields."
  )
  .option(
    "-A --algolia-app-id <algolia-app-id>",
    "Algolia application you want to index your data to."
  )
  .option(
    "-K --algolia-api-key <algolia-api-key>",
    "Algolia API key that has write access to the Algolia application."
  )
  .option(
    "-I --algolia-index-name <algolia-index-name>",
    "Algolia index name where the records will be persisted."
  )
  .action(run)
  .parseAsync(process.argv);

async function run(options: any) {
  const config = await parseConfig(options);
  console.log(config);
}
