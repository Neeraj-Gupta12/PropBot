# Travel Booking App

A full-stack travel booking website inspired by MakeMyTrip, built with React.js frontend and Node.js backend.

## 🎯 Features

### ✅ Core Functionality
- **Search Functionality**: Users can search for travel destinations by city name
- **Trip Packages**: Display trip packages with title, duration, price, and description
- **Hotel Listings**: Show hotels with name, price per night, rating, and images
- **City Attractions**: Display tourist places with images and descriptions
- **Chatbot Assistant**: Rule-based chatbot for travel queries

### 🏨 Hotel Features
- Hotel search by city
- Price filtering
- Rating-based sorting
- Room type selection
- Amenities display

### 🗺️ Trip Features
- Destination-based search
- Duration and price filtering
- Popular destinations showcase
- Detailed trip itineraries
- Booking management

### 🎡 Attraction Features
- City-wise attraction listings
- Category-based filtering
- Top-rated attractions
- Entry fee and visiting hours
- Location details

### 💬 Chatbot Features
- Rule-based responses
- Trip recommendations
- Hotel suggestions
- Attraction information
- General travel queries

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Database Models
- **User** - User authentication and profiles
- **Trip** - Travel packages and itineraries
- **Hotel** - Accommodation listings
- **Attraction** - Tourist places

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## 📁 Project Structure

```
Travel-app/
├── backend/
│   ├── Controllers/          # API controllers
│   ├── Modals/              # Database models
│   ├── Routes/              # API routes
│   ├── Utils/               # Utility functions
│   └── app.js               # Express app setup
├── Frontend/
│   ├── src/
│   │   ├── Components/      # React components
│   │   ├── Pages/           # Page components
│   │   ├── redux/           # Redux store and slices
│   │   └── assets/          # Images and static files
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Trips
- `GET /api/trip/trips` - Get all trips
- `GET /api/trip/trip/:id` - Get single trip
- `GET /api/trip/search/trips` - Search trips by destination
- `GET /api/trip/popular-destinations` - Get popular destinations

### Hotels
- `GET /api/hotel/hotels` - Get all hotels
- `GET /api/hotel/hotel/:id` - Get single hotel
- `GET /api/hotel/search/hotels` - Search hotels by city
- `GET /api/hotel/hotels/city/:city` - Get hotels by city

### Attractions
- `GET /api/attraction/attractions` - Get all attractions
- `GET /api/attraction/attraction/:id` - Get single attraction
- `GET /api/attraction/attractions/city/:city` - Get attractions by city
- `GET /api/attraction/top-rated-attractions` - Get top rated attractions

### Bookings
- `POST /api/booking/booking/new` - Create new booking
- `GET /api/booking/me/bookings` - Get user bookings
- `PUT /api/booking/booking/:id/cancel` - Cancel booking

### Chatbot
- `POST /api/chatbot/chat` - Chat with bot
- `GET /api/chatbot/chat/suggestions` - Get chatbot suggestions

### search
- `POST /api/search` - universalSearch for Trip Packages , Hotel and Attraction points 

## 🎨 UI/UX Features

- **Responsive Design**: Mobile and desktop compatible
- **Modern UI**: Clean and intuitive interface
- **Search Functionality**: Easy destination and hotel search
- **Filtering Options**: Price, rating, and category filters
- **Chatbot Integration**: Helpful travel assistant

## 🔐 Authentication

- JWT-based authentication
- User registration and login
- Role-based access (user/admin)
- Secure password hashing

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Configure MongoDB connection
3. Deploy to platforms like Heroku, Railway, or Vercel

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages

⚠️ Known Limitations
1. Payment Gateway integration is currently not implemented.
2. Review System for users/transactions is pending and will be added in future updates.

##screenshots
1. Home page
<img width="1895" height="865" alt="image" src="https://github.com/user-attachments/assets/c5953643-f658-46a0-930e-2070c449cbc1" />

2. Search Result Page
<img width="1898" height="867" alt="image" src="https://github.com/user-attachments/assets/f2f575d7-6b5e-4b91-874f-6d11c82e9a91" />

3 Detail page
<img width="1899" height="860" alt="image" src="https://github.com/user-attachments/assets/298376b1-4c4e-4f2f-99f6-efa827b0ebc9" />

4. Chatbot
<img width="1898" height="867" alt="image" src="https://github.com/user-attachments/assets/f2da2dfd-dd28-4f63-8289-8671eab56569" />

5. Admin dashbord 
<img width="1899" height="865" alt="image" src="https://github.com/user-attachments/assets/4d8a3570-e7f6-44b4-ac4b-1d0ee2d2686d" />




## 📄 License
