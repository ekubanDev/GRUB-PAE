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
      GRAPHQL_URL: "REPLACE_WITH_YOUR_GRUBPAE_API_URL/graphql",
      WS_GRAPHQL_URL: "REPLACE_WITH_YOUR_GRUBPAE_WS_URL/graphql",
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
