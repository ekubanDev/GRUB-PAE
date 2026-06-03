import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import * as Updates from "expo-updates";
import { useContext } from "react";
import { ConfigurationContext } from "./lib/context/global/configuration.context";
const getEnvVars = (env = Updates.channel) => {
  const configuration = useContext(ConfigurationContext);
  if (__DEV__) {
    loadDevMessages();
    loadErrorMessages();
  }
  if (!__DEV__) {
    return {
      GRAPHQL_URL: "https://grubpae-api-367067097306.europe-west1.run.app/graphql",
      WS_GRAPHQL_URL: "wss://grubpae-api-367067097306.europe-west1.run.app/graphql",
      SENTRY_DSN:
        configuration?.riderAppSentryUrl ??
        "REPLACE_WITH_YOUR_SENTRY_DSN",
      GOOGLE_MAPS_KEY: configuration?.googleApiKey,
      ENVIRONMENT: "production",
    };
  }

  return {
    GRAPHQL_URL: "http://localhost:4000/graphql",
    WS_GRAPHQL_URL: "ws://localhost:4000/graphql",
    SENTRY_DSN:
      configuration?.riderAppSentryUrl ??
      "REPLACE_WITH_YOUR_SENTRY_DSN",
    GOOGLE_MAPS_KEY: configuration?.googleApiKey,
    ENVIRONMENT: "development",
  };
};

export default getEnvVars;
