#!/usr/bin/env bash
# Run this after `railway link` to push all env vars to Railway in one shot.
# Usage: ./scripts/railway-env-set.sh
# Requires: railway CLI installed and authenticated (railway login)

set -euo pipefail

ENV_FILE="$(dirname "$0")/../enatega-multivendor-api-custom/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env file not found at $ENV_FILE"
  exit 1
fi

echo "Setting Railway environment variables from .env..."
echo ""

# Read each line of .env, skip comments and blank lines
while IFS= read -r line; do
  # Skip blank lines, comments, and comment-only lines
  [[ -z "$line" || "$line" =~ ^# ]] && continue

  # Extract key=value
  key="${line%%=*}"
  value="${line#*=}"

  # Skip placeholder values
  if [[ "$value" == *"REPLACE_WITH"* ]]; then
    echo "  SKIP (placeholder): $key"
    continue
  fi

  echo "  Setting: $key"
  railway variables set "$key=$value"
done < "$ENV_FILE"

echo ""
echo "Done. Run 'railway up' to deploy."
