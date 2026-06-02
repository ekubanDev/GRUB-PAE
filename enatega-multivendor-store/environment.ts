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
      GRAPHQL_URL: "REPLACE_WITH_YOUR_GRUBPAE_API_URL/graphql",
      WS_GRAPHQL_URL: "REPLACE_WITH_YOUR_GRUBPAE_WS_URL/graphql",
    };
  }
  return {
    GRAPHQL_URL: "http://localhost:4000/graphql",
    WS_GRAPHQL_URL: "ws://localhost:4000/graphql",
  };
};

export default getEnvVars;
