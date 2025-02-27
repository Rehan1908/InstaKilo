# InstaKilo

## Overview
InstaKilo is a modern photo-sharing application inspired by Instagram but with unique features and a focus on clean, minimalist design. The platform allows users to share, discover, and interact with images while providing an intuitive and seamless user experience.

## Features
- **User Authentication**: Secure signup, login, and profile management
- **Photo Uploads**: Easy-to-use interface for uploading, editing, and sharing photos
- **Social Interaction**: Like, comment, and share functionality
- **Discover Feed**: Algorithm-based content discovery tailored to user preferences
- **User Profiles**: Customizable profiles with galleries and activity history
- **Real-time Notifications**: Instant alerts for interactions and mentions
- **Mobile-Responsive Design**: Optimized experience across all devices

## Tech Stack
- **Frontend**: React.js with Redux for state management
- **Backend**: Node.js with Express framework
- **Database**: MongoDB for flexible data storage
- **Authentication**: JWT (JSON Web Tokens) for secure user sessions
- **Image Storage**: AWS S3 for scalable image hosting
- **Real-time Features**: Socket.io for instant notifications and updates
- **Styling**: SCSS with a modular architecture for maintainable styling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Setup Instructions
1. Clone the repository
   ```
   git clone https://github.com/Rehan1908/InstaKilo.git
   cd InstaKilo
   ```

2. Install dependencies
   ```
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Environment setup
   - Create a `.env` file in the server directory
   - Add the following variables:
     ```
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     AWS_ACCESS_KEY=your_aws_access_key
     AWS_SECRET_KEY=your_aws_secret_key
     AWS_BUCKET_NAME=your_s3_bucket_name
     ```

4. Start the application
   ```
   # Start the server (from server directory)
   npm run dev

   # Start the client (from client directory)
   npm start
   ```

5. Access the application at `http://localhost:3000`

## API Documentation
The API endpoints are organized by resource:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user
- `GET /api/auth/profile` - Get authenticated user profile

### Posts
- `GET /api/posts` - Get posts feed
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### Comments
- `GET /api/posts/:id/comments` - Get comments for a post
- `POST /api/posts/:id/comments` - Add a comment to a post
- `DELETE /api/comments/:id` - Delete a comment

### Likes
- `POST /api/posts/:id/like` - Like/unlike a post

### Users
- `GET /api/users/:username` - Get user profile
- `GET /api/users/:username/posts` - Get user's posts
- `POST /api/users/follow/:id` - Follow/unfollow a user

## Project Structure
```
instakilo/
├── client/               # Frontend React application
│   ├── public/           # Static files
│   ├── src/              # React source code
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Application pages
│   │   ├── redux/        # State management
│   │   ├── services/     # API service calls
│   │   └── utils/        # Utility functions
│   └── package.json      # Frontend dependencies
│
├── server/               # Backend Node.js API
│   ├── controllers/      # API request handlers
│   ├── middleware/       # Custom middleware
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── config/           # Configuration files
│   ├── app.js            # Express app setup
│   └── package.json      # Backend dependencies
│
└── README.md             # Project documentation
```

## Contribution Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Inspired by popular photo-sharing platforms
- Thanks to all contributors who have helped shape InstaKilo
