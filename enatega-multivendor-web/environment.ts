export default function getEnv(env: "DEV" | "STAGE" | "PROD") {
  switch (env) {
    case "DEV":
      return {
        SERVER_URL: "https://v1-api-grub-pae-develop.up.railway.app/",
        WS_SERVER_URL: "wss://v1-api-grub-pae-develop.up.railway.app/",
      };
    case "STAGE":
      return {
        SERVER_URL: "https://v1-api-grub-pae-stage.up.railway.app/",
        WS_SERVER_URL: "wss://v1-api-grub-pae-stage.up.railway.app/",
      };
    case "PROD":
      return {
        SERVER_URL: "https://grub-pae-api.up.railway.app/",
        WS_SERVER_URL: "wss://grub-pae-api.up.railway.app/",
      };
    default:
      return {
        SERVER_URL: "https://grub-pae-api.up.railway.app/",
        WS_SERVER_URL: "wss://grub-pae-api.up.railway.app/",

        // SERVER_URL: "http://localhost:8001/",
        // WS_SERVER_URL: "ws://localhost:8001/",
      };
  }
}
