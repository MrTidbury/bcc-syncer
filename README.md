# Berkshire Center Caravan Club - Bookings for Fun Rally

This project is a modern admin UI and backend for managing rally/event bookings for the Berkshire Center Caravan Club. It features a React + Tailwind CSS frontend and a Flask backend, designed for a clean, user-friendly experience for rally officers.

## Features
- Modern, responsive admin UI
- Login for rally officers
- Tabbed view for Active, Pending, and Rejected bookings
- Animated transitions and polished UI/UX
- Booking details dialog with all relevant info
- Action buttons for emailing attendees and printing forms
- Toast notifications for user feedback

## Prerequisites
- **Python 3.8+** (for Flask backend)
- **Node.js 16+** and **npm** (for React frontend)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd bcc-syncer
```

### 2. Backend (Flask)
1. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask server:
   ```bash
   flask run
   ```
   The backend will be available at `http://localhost:5000` by default.

### 3. Frontend (React Admin UI)
1. Go to the admin UI directory:
   ```bash
   cd admin-ui
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` by default.

## Usage
- Visit the frontend URL in your browser.
- Log in with your rally officer email.
- Use the tabs to view and manage bookings.
- Click on a booking to view details in a modern dialog.
- Use the action icons in the top bar to copy attendee emails or print the rally form.
- Toast notifications provide feedback for actions.

## Customization
- UI components are in `admin-ui/src/components/`.
- Demo data is in `admin-ui/src/components/BookingList.tsx`.
- Tailwind CSS is used for styling; see `admin-ui/tailwind.config.js`.

## License
MIT (or your preferred license) 