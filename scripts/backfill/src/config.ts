import inquirer, { Question } from "inquirer";

const questions: Question[] = [
  {
    message: "What is your Firebase project ID.",
    name: "projectId",
    type: "input",
  },
  {
    message:
      "What is the path to the collection that contains the strings that you want to translate?",
    name: "collectionPath",
    type: "input",
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
];

interface CliConfig {}

export const parseConfig = async (options: any): Promise<CliConfig> => {
  const {
    projectId,
    collectionPath,
    fields,
    algoliaAppId,
    algoliaApiKey,
    algoliaIndexName,
  } = options.nonInteractive ? options : await inquirer.prompt(questions);

  return {
    projectId,
    collectionPath,
    fields,
    algoliaAppId,
    algoliaApiKey,
    algoliaIndexName,
  };
};
