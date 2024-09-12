# Stock Post Management API

This repository provides a stock post management API built using Node.js, Express, and MongoDB. The API allows users to create, retrieve, update, delete, and comment on stock posts. It supports features such as user authentication, stock post creation, commenting, and paginated post retrieval.

## Table of contents

- [Project Features](#project-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)


## Project Features

- User Authentication: JWT-based authentication.
- Stock Post Management: Create, retrieve, update, and delete stock posts.
- Comment System: Add and delete comments to posts with full user reference.
- Likes System: Like/unlike stock posts.
- Pagination: Fetch paginated stock posts.
- Search & Filter: Filter posts based on stock symbols, tags, and more.
- Real-time Updates (Socket.io) - WebSocket Endpoint: Updates on new comments or likes for subscribed users.


## Tech Stack

- Node.js: Backend JavaScript runtime.
- Express: Web framework for Node.js.
- MongoDB: NoSQL database for data storage.
- Mongoose: ODM for MongoDB.
- JWT: For secure authentication.
- Bcrypt.js: For password hashing.
- ESLint: For code quality.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js: You need to have Node.js installed on your system. You can download it from [here](https://nodejs.org/en).
- MongoDB: Ensure MongoDB is installed locally or use a MongoDB cloud service like [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database).

## Setup

1. Clone the repository
   ```bash
     git clone https://github.com/DaaSH23/AlphaTribe_backend.git
     cd alphaTribe
   ```
2. Install dependencies
Use npm to install the required dependencies.

  ```bash
    npm install
  ```

## Environment Variables
Create a .env file in the root directory with the following variables:

  ```bash
    PORT=5000
    dbURI=<your_mongo_db_uri>
    TOKENSIGNATURE=<your_jwt_secret>
  ```
- PORT: The port where your server will run.
- dbURI: MongoDB connection string.
- TOKENSIGNATURE: A secret key used to sign JWT tokens.

## Database Setup
If you're using a local MongoDB instance, you don't need to take any additional steps. If you're using MongoDB Atlas, set up your database cluster and get the connection string for the .env file.
1. Set up a MongoDB Atlas cluster [here](https://www.mongodb.com/products/platform/atlas-database).
2. Replace <your_mongo_db_uri> in the .env file with your MongoDB Atlas URI.

## Running the Project
To run the project locally, use the following commands.

1. Development Mode
   ```bash
     npm run dev
   ```
This will start the server using nodemon, which automatically restarts the server when code changes are detected.

2. Production Mode
   ```bash
     npm start
   ```
This starts the server in production mode.

## API Endpoints

1. User Authentication and Management
User Registration -
- POST /api/auth/register
- Body Parameters: { "username": "user1", "email": "user1@example.com", "password": "password123" }

User Login -
- POST /api/auth/login
- Body Parameters: { "email": "user1@example.com", "password": "password123" }

Get User Profile - 
- GET /api/user/profile
- Headers: { Authorization: Bearer <token> }

Update User Profile -
- PUT /api/user/profile
- Headers: { Authorization: Bearer <token> }
- Body Parameters: { "username": "user1", "bio": "I'm a software engineer", "profilePicture": "pic.jpg" }

2. Stock Post Management
Create a Stock Post - 
- POST /api/posts
- Headers: { Authorization: Bearer <token> }
- Body Parameters: { "stockSymbol": "AAPL", "title": "Apple Stock", "description": "Apple stocks are rising." }

Get All Stock Posts (with filters and sorting) -
- GET /api/posts
- Query Parameters: ?page=1&limit=10&stockSymbol=AAPL

Get a Single Stock Post (with comments) -
- GET /api/posts/:postId

Delete a Stock Post -
- DELETE /api/posts/:postId
Headers: { Authorization: Bearer <token> }

3. Comments Management System
Add a Comment to a Post -
- POST /api/posts/:postId/comments
- Headers: { Authorization: Bearer <token> }
- Body Parameters: { "comment": "Great stock!" }

Delete a Comment -
- DELETE /api/posts/:postId/comments/:commentId
- Headers: { Authorization: Bearer <token> }

4. Like System
Like a Post -
- POST /api/posts/:postId/like
- Headers: { Authorization: Bearer <token> }

Unlike a Post -
- DELETE /api/posts/:postId/like
- Headers: { Authorization: Bearer <token> }

## Testing 
You can use Postman to test the API by importing the provided Postman collection.

1. Download the `Stock Post Management API.postman_collection.json` file from this repository.
2. Open Postman and click on the **Import** button.
3. Select the downloaded `.json` file to import the collection.
4. Once imported, you can test the API endpoints directly in Postman.

## Project-Structure

```bash
.
├── controllers
│   ├── authController.js
│   ├── stockController.js
|   ├── likeController.js
│   └── commentController.js
├── models
│   ├── userModel.js
│   ├── stockPostModel.js
│   ├── blacklistModel.js
│   └── commentModel.js
├── routes
│   ├── userRoutes.js
│   └── stockRoutes.js
├── middleware
│   ├── authenticate.js
│   ├── catchAsyncError.js
│   ├── socketMiddleware.js
│   └── errorMiddleware.js
├── utils
│   └── ErrorHandler.js
├── app.js
├── server.js
└── .env

```
Explanation -
- controllers/: Contains logic for handling API requests.
- models/: MongoDB models for users, posts, and comments.
- routes/: Defines API routes.
- middleware/: Contains authentication and error-handling middlewares.
- utils/: Contains utility functions such as error catching.
- app.js: Initializes the Express app.
- server.js: Starts the server.


## Contact
  email - reachtoabhisheko@gmail.com
  linkedIn - https://www.linkedin.com/in/abhishek-oraon-developer/
