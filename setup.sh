#!/bin/bash
set -e

echo "🚀 Setting up the LMS project..."

echo "📦 Installing backend dependencies..."
cd lms-backend
npm install

if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created lms-backend/.env from .env.example"
fi

echo "📦 Installing frontend dependencies..."
cd ../lms-frontend
npm install

if [ ! -f .env ]; then
  cat > .env << EOL
VITE_API_URL=http://localhost:5000/api
EOL
  echo "✅ Created lms-frontend/.env"
fi

echo "🎉 Setup complete!"
echo "Run the backend from lms-backend with: npm run dev"
echo "Run the frontend from lms-frontend with: npm run dev"
echo "Or start the full stack using: docker compose -f ../compose.yaml up --build"
