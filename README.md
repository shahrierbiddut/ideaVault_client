# IdeaVault Client

Frontend for IdeaVault, a startup idea sharing platform where users can publish ideas, discover trending concepts, comment, interact, and manage their personal profile.

## Live URLs

- Frontend: add your deployed frontend URL
- Backend API: add your deployed backend URL

## Key Features

- JWT-based authentication (register, login, logout, session restore)
- Google login integration through Firebase
- Protected routes for authenticated user actions
- Browse ideas with search, filtering, sorting, and pagination
- Add idea workflow and personal dashboard pages
- Comment and interaction features (like, bookmark, comment activity)
- Profile update and password change support
- Responsive UI with loading states and motion transitions

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Axios
- Firebase Client SDK
- HeroUI
- Tailwind CSS 4
- Framer Motion
- React Hot Toast

## Project Structure

```txt
client/
├── src/
│   ├── app/
│   │   ├── page.js
│   │   ├── ideas/
│   │   ├── add-idea/
│   │   ├── my-ideas/
│   │   ├── my-interactions/
│   │   ├── profile/
│   │   ├── login/
│   │   └── register/
│   ├── components/
│   ├── context/
│   └── lib/
├── middleware.js
└── package.json
```

## Prerequisites

- Node.js 18 or newer
- npm or pnpm
- Running IdeaVault backend server

## Environment Variables

Create `.env.local` inside `client`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

## Installation

```bash
npm install
```

or

```bash
pnpm install
```

## Development

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Scripts

- `npm run dev` - start development server
- `npm run build` - build for production
- `npm run start` - run production build
- `npm run lint` - run ESLint
- `npm run guard:jsx` - check JSX corruption guard script

## Backend API Contracts Used by Client

### Auth

- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/google`
- GET `/auth/me`
- POST `/auth/logout`

### Users

- GET `/users/profile`
- PUT `/users/profile`
- POST `/users/change-password`
- DELETE `/users/profile`

### Ideas

- GET `/ideas`
- GET `/ideas/trending`
- GET `/ideas/:id`
- GET `/ideas/my-ideas/:email`
- POST `/ideas`
- PATCH `/ideas/:id`
- DELETE `/ideas/:id`

### Comments

- GET `/comments/:ideaId`
- POST `/comments`
- PATCH `/comments/:id`
- DELETE `/comments/:id`

### Interactions

- GET `/interactions/:email`
- POST `/interactions`

### Public

- GET `/public/home-content`

## Verification Checklist

Run these before deployment:

```bash
npm run guard:jsx
npm run lint
npm run build
```

Manual checks:

- Login and register flow
- Google login flow
- Protected route redirects
- Add idea and my ideas flow
- Comments and interactions flow
- Session expiry handling

## Deployment Notes

- Set all `NEXT_PUBLIC_*` variables in your frontend host.
- Ensure backend CORS includes your frontend origin.
- Ensure backend API URL is set correctly in `NEXT_PUBLIC_API_URL`.

## Troubleshooting

- If API calls fail, verify backend is running and CORS is configured.
- If Google login fails, verify all Firebase env values.
- If protected routes misbehave, check token presence in local storage and backend token validation.
