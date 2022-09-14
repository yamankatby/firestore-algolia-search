#!/usr/bin/env node

import algoliaSearch from "algoliasearch";
import { program } from "commander";
import admin from "firebase-admin";
import { DEFAULT_BATCH_SIZE, parseConfig } from "./config";

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
  .option(
    "--batch-size <batch-size>",
    "The number of documents to process in each batch.",
    `${DEFAULT_BATCH_SIZE}`
  )
  .option(
    "--multi-threaded <multi-threaded>",
    "Whether to run the script across multiple threads.",
    false
  )
  .action(run)
  .parseAsync(process.argv);

async function run(options: any) {
  const config = await parseConfig(options);

  // todo: remove this
  console.log(config);

  const {
    projectId,
    collectionPath,
    algoliaAppId,
    algoliaApiKey,
    algoliaIndexName,
  } = config;

  const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${projectId}.firebaseio.com`,
  });

  const db = app.firestore();
  const collection = db.collection(collectionPath);
  const snapshot = await collection.get();
  const docs = snapshot.docs;

  // todo: remove this
  console.log(docs.map((doc) => doc.data()));

  const client = algoliaSearch(algoliaAppId, algoliaApiKey);

  const index = client.initIndex(algoliaIndexName);

  try {
    await index.saveObjects(
      docs.map((doc) => ({ objectID: doc.id, ...doc.data() }))
    );
  } catch (e) {
    console.error(e);
  }
  console.log("Done!");
}
