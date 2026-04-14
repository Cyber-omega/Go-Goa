# 🌴 GO Goa - Your Ultimate Goan Companion

**GO Goa** is a high-performance, full-stack travel and transportation application designed specifically for the unique landscape of Goa. From booking reliable shuttles to exploring hidden gems through immersive VR, GO Goa is the only app you need for a perfect Goan getaway.

## 🚀 Key Features

### 1. 🚌 Smart Shuttle Booking
*   **Real-time Tracking**: Book and track your rides across Goa's winding roads.
*   **Transparent Pricing**: Fixed, fair pricing based on Goan travel standards.
*   **Driver Matching**: Automated matching with verified local drivers.

### 2. 🗺️ Interactive Explorer (AR/VR)
*   **360° VR Tours**: Experience Goa's most iconic and hidden spots in immersive Virtual Reality before you visit.
*   **Curated Categories**:
    *   **Forts**: Explore historic Portuguese fortifications like Aguada and Chapora.
    *   **Churches**: Discover spiritual marvels like the Basilica of Bom Jesus and Se Cathedral.
    *   **Nightlife**: Find the best vibes at Joseph Bar, Thalassa, and LPK.
    *   **Nature**: Trek to Dudhsagar Falls or relax at Netravali Bubbling Lake.
*   **Hidden Gems**: Discover "undiscovered" spots known only to locals.

### 3. 🌓 Modern User Experience
*   **Light & Dark Mode**: A beautiful "Natural Tones" palette that adapts to your environment.
*   **Responsive Design**: Seamless experience across mobile and desktop.
*   **Branded Interface**: A polished, distinctive UI developed by **CipherSquad**.

## 🛠️ Tech Stack

- **Frontend**: React 18+, Vite, TypeScript
- **Styling**: Tailwind CSS (Utility-first, responsive design)
- **Animations**: Framer Motion (Smooth transitions and interactive map)
- **Database & Auth**: Firebase (Firestore for real-time data, Firebase Auth for secure login)
- **Mapping**: React Simple Maps & D3-geo
- **VR Engine**: Pannellum (High-performance 360° panorama viewer)
- **Icons**: Lucide React

## 📁 Project Structure

```text
src/
├── components/       # Reusable UI components (Navbar, Footer, ThemeToggle)
├── lib/              # Utility functions and Firebase configuration
├── pages/            # Main application views
│   ├── Home.tsx      # Landing page
│   ├── Explorer.tsx  # Interactive AR/VR Map
│   ├── Dashboard.tsx # User/Driver ride management
│   └── Profile.tsx   # User profile settings
└── types.ts          # Global TypeScript definitions
```

## 🛡️ Security

The application implements strict **Firestore Security Rules** to ensure:
*   User data privacy (PII protection).
*   Secure booking transactions.
*   Role-based access control for Customers and Drivers.

---

Developed with ❤️ by **CipherSquad** for the beautiful state of Goa.
