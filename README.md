SellSmart Frontend
The frontend for SellSmart is a user-friendly application built to allow users to manage their inventory, sales, and damaged goods seamlessly. It communicates with the SellSmart backend REST API for all data operations and authentication.

Features
User Authentication: Login and registration are integrated with JWT tokens.

Inventory Management: View, add, edit, and delete inventory items.

Sales Management: Record sales, update, and delete sales entries.

Damaged Goods Reporting: Report damaged items and view history.

Real-time Data Display: Fetches and displays live data from the backend.

Secure Token Handling: Stores JWT tokens securely and includes them in API requests.

Responsive UI: Designed for mobile (React Native) or web (React) for easy navigation.

Technologies
React Native (or React.js)

Axios or Fetch API for network requests

React Navigation (for React Native) or React Router (for React Web)

State management with React hooks / Context API / Redux (whichever you use)

JWT for authentication token handling

Setup Instructions
Prerequisites
Node.js and npm/yarn installed

React Native CLI or Expo (for mobile)

Or React environment setup (for web)

Installation
bash
Copy
git clone <your-frontend-repo-url>
cd sellsmart-frontend
npm install
Running the App
React Native (Expo)

bash
Copy
expo start
React Web

bash
Copy
npm start
Configuration
Configure the backend API base URL in your environment or config files.


Authentication Flow
User registers or logs in via the frontend form.

Backend returns a JWT token on successful login.

Token is stored securely (e.g., AsyncStorage in React Native or localStorage in React web).

All subsequent API requests include the token in the Authorization header as Bearer <token>.

On logout, token is removed from storage.
