/*****************************
 * environment.js
 * path: '/environment.js' (root of your project)
 ******************************/

import * as Updates from "expo-updates";
import { useContext } from "react";
import { ConfigurationContext } from "./lib/context/global/configuration.context";

const getEnvVars = (env = Updates.channel) => {
  const configuration = useContext(ConfigurationContext);

  if (env === "production" || env === "staging") {
    return {
      GRAPHQL_URL: "https://grubpae-api-367067097306.europe-west1.run.app/graphql",
      WS_GRAPHQL_URL: "wss://grubpae-api-367067097306.europe-west1.run.app/graphql",
    };
  }
  return {
    GRAPHQL_URL: "http://localhost:4000/graphql",
    WS_GRAPHQL_URL: "ws://localhost:4000/graphql",
  };
};

export default getEnvVars;
