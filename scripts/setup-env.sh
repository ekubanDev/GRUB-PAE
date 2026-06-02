#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  GRUB-PAE — Environment Setup"
echo "  Tesseract Holdings"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ─── Node.js version check ────────────────────────────────────────────────────
check_node_version() {
  if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Install Node.js 18–20 from https://nodejs.org${NC}"
    exit 1
  fi

  NODE_VERSION=$(node -e "console.log(process.versions.node.split('.')[0])")
  if [ "$NODE_VERSION" -lt 18 ] || [ "$NODE_VERSION" -gt 20 ]; then
    echo -e "${YELLOW}⚠ Node.js version $NODE_VERSION detected. GRUB-PAE requires Node.js 18–20.${NC}"
    echo "  Use nvm: nvm install 20 && nvm use 20"
  else
    echo -e "${GREEN}✓ Node.js $NODE_VERSION detected${NC}"
  fi
}

# ─── Copy .env.example → .env ─────────────────────────────────────────────────
copy_env() {
  local module="$1"
  local src="$REPO_ROOT/$module/.env.example"
  local dest="$REPO_ROOT/$module/.env"

  if [ ! -f "$src" ]; then
    echo "  [SKIP] $module — no .env.example found"
    return
  fi

  if [ -f "$dest" ]; then
    echo -e "  ${YELLOW}[EXISTS]${NC} $module/.env — skipping (delete to reset)"
  else
    cp "$src" "$dest"
    echo -e "  ${GREEN}[CREATED]${NC} $module/.env"
  fi
}

check_node_version
echo ""

echo "Copying .env files..."
copy_env "enatega-multivendor-api-custom"
copy_env "enatega-multivendor-admin"
copy_env "enatega-multivendor-web"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  CHECKLIST — Keys that require real values"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  The following must be replaced before the app can run."
echo "  All are in enatega-multivendor-api-custom/.env"
echo ""
echo -e "  ${RED}REQUIRED — app will not start without these:${NC}"
echo "  □ MONGODB_URI          — MongoDB Atlas connection string"
echo "  □ JWT_SECRET           — 64+ char random string"
echo "  □ FIREBASE_PROJECT_ID  — GRUB-PAE Firebase project"
echo "  □ FIREBASE_CLIENT_EMAIL"
echo "  □ FIREBASE_PRIVATE_KEY"
echo "  □ PAYSTACK_SECRET_KEY  — Paystack secret key"
echo "  □ GOOGLE_MAPS_API_KEY  — Google Maps Platform key"
echo ""
echo -e "  ${YELLOW}REQUIRED for full functionality:${NC}"
echo "  □ PAYSTACK_PUBLIC_KEY  — Paystack publishable key"
echo "  □ TWILIO_ACCOUNT_SID   — Twilio (SMS OTP)"
echo "  □ TWILIO_AUTH_TOKEN"
echo "  □ TWILIO_PHONE_NUMBER"
echo "  □ SENDGRID_API_KEY     — SendGrid (transactional email)"
echo "  □ CLOUDINARY_UPLOAD_URL"
echo "  □ CLOUDINARY_API_KEY"
echo "  □ CLOUDINARY_API_SECRET"
echo ""
echo -e "  ${YELLOW}REQUIRED in mobile app.json (before EAS build):${NC}"
echo "  □ Google Maps API key in enatega-multivendor-app/app.json"
echo "  □ Google Maps API key in enatega-multivendor-rider/app.json"
echo "  □ EAS project IDs in all 3 mobile app.json files"
echo "  □ Replace google-services.json in all 3 mobile modules"
echo "  □ Expo account owner in enatega-multivendor-app/app.json"
echo ""
echo -e "  ${YELLOW}OPTIONAL (dev works without these):${NC}"
echo "  □ SENTRY_DSN"
echo ""
echo "  After setting values, start dev environment:"
echo "  docker-compose -f docker-compose.dev.yml up"
echo ""
echo "  For mobile apps (Expo — run natively, not in Docker):"
echo "  cd enatega-multivendor-app && npx expo start"
echo "  cd enatega-multivendor-rider && npx expo start"
echo "  cd enatega-multivendor-store && npx expo start"
echo ""
echo "  See docs/ENV_SETUP.md for full documentation."
echo ""
