import { program } from "commander";
import inquirer, { Question } from "inquirer";

export const DEFAULT_BATCH_SIZE = 100;

const FIRESTORE_VALID_CHARACTERS = /^[^\/]+$/;
const PROJECT_ID_MAX_CHARS = 6144;
const FIRESTORE_COLLECTION_NAME_MAX_CHARS = 6144;

const validateInput = (
  value: string,
  name: string,
  regex: RegExp,
  sizeLimit: number
) => {
  if (!value || value === "" || value.trim() === "") {
    return `Please supply a ${name}`;
  }
  if (value.length >= sizeLimit) {
    return `${name} must be at most ${sizeLimit} characters long`;
  }
  if (!value.match(regex)) {
    return `The ${name} must only contain letters or spaces`;
  }
  return true;
};

const questions: Question[] = [
  {
    message: "What is your Firebase project ID.",
    name: "projectId",
    type: "input",
    validate: (value) =>
      validateInput(
        value,
        "Firebase project ID",
        FIRESTORE_VALID_CHARACTERS,
        PROJECT_ID_MAX_CHARS
      ),
  },
  {
    message:
      "What is the path to the Cloud Firestore collection where the extension should monitor for changes?",
    name: "collectionPath",
    type: "input",
    validate: (value) =>
      validateInput(
        value,
        "Cloud Firestore collection",
        FIRESTORE_VALID_CHARACTERS,
        FIRESTORE_COLLECTION_NAME_MAX_CHARS
      ),
  },
  {
    message: "What are the fields that you want to index?",
    name: "fields",
    type: "input",
  },
  {
    message: "What is your Algolia application ID?",
    name: "algoliaAppId",
    type: "input",
  },
  {
    message: "What is your Algolia API key?",
    name: "algoliaApiKey",
    type: "input",
  },
  {
    message: "What is your Algolia index name?",
    name: "algoliaIndexName",
    type: "input",
  },
  {
    message: "How many documents should be processed at once?",
    name: "batchSize",
    type: "input",
    default: DEFAULT_BATCH_SIZE,
    validate: (value) => {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed)) return "Please supply a valid number";
      else if (parsed < 1) return "Please supply a number greater than 0";
      else return true;
    },
  },
  {
    message: "Would you like to run the script across multiple threads?",
    name: "multiThreaded",
    type: "confirm",
    default: false,
  },
];

interface CliConfig {
  projectId: string;
  collectionPath: string;
  fields?: string[];
  algoliaAppId: string;
  algoliaApiKey: string;
  algoliaIndexName: string;
  batchSize: number;
  multiThreaded: boolean;
}

export const parseConfig = async (options: any): Promise<CliConfig> => {
  const {
    projectId,
    collectionPath,
    fields,
    algoliaAppId,
    algoliaApiKey,
    algoliaIndexName,
    batchSize,
    multiThreaded,
  } = options.nonInteractive ? options : await inquirer.prompt(questions);

  if (
    !projectId ||
    !collectionPath ||
    !algoliaAppId ||
    !algoliaApiKey ||
    !algoliaIndexName
  ) {
    program.help();
  }

  return {
    projectId,
    collectionPath,
    fields: fields ? fields.split(",").map((f: string) => f.trim()) : undefined,
    algoliaAppId,
    algoliaApiKey,
    algoliaIndexName,
    batchSize: parseInt(batchSize, 10),
    multiThreaded,
  };
};
