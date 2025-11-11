
Backend README
--------------
- Install: cd backend && npm install
- Run: cd backend && npm run dev   (requires nodemon) or npm start
- Provide MongoDB URI by creating a .env file with:
    MONGO_URI="your_mongo_uri_here"
    JWT_SECRET=your_jwt_secret_here
- If you don't provide MONGO_URI, the server will use a local JSON file (data/db.json) as a fallback database.
- Add song files to backend/public/songs and images to backend/public/images (or in frontend public folder)
