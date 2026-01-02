#!/bin/bash

echo "🚀 Setting up MERN Stack Expert Development Environment..."

# Backend setup
echo "📦 Installing backend dependencies..."
cd lms-backend
npm install

# Frontend setup
echo "📦 Installing frontend dependencies..."
cd ../lms-frontend
npm install

# Create environment files
echo "⚙️ Creating environment files..."
cd ../lms-backend
if [ ! -f .env ]; then
    cat > .env << EOL
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/lms
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
CORS_ORIGIN=http://localhost:5173
EOL
    echo "✅ Backend .env file created"
fi

cd ../lms-frontend
if [ ! -f .env ]; then
    cat > .env << EOL
VITE_API_URL=http://localhost:5000/api
EOL
    echo "✅ Frontend .env file created"
fi

echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Start MongoDB:"
echo "   mongod"
echo ""
echo "2. Start the backend (in lms-backend folder):"
echo "   npm run dev"
echo ""
echo "3. Start the frontend (in lms-frontend folder):"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "📚 Check out LEARNING_PATH.md and PRACTICE_EXERCISES.md for your journey to MERN mastery!"