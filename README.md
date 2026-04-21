<div align="center">

![NomadBase Banner](https://images.unsplash.com/photo-1528164344705-47542687000d?w=1200&h=400&fit=crop)

# 🌴 NomadBase Goa

*A community-driven platform for digital nomads in Goa*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.5-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Features

### 🏠 **Co-Working Spaces**
- Discover the best co-working spaces in Goa
- Filter by area, WiFi speed, noise level, and amenities
- View detailed information including pricing and hours
- Read reviews from other nomads

### 🏡 **Colivings**
- Find your perfect home away from home
- Browse verified coliving spaces
- Filter by area, price range, and minimum stay
- Check amenities like WiFi, AC, pool, and more

### 🤖 **AI Assistant**
- Powered by Groq for fast, intelligent responses
- Get instant answers about Goa nomad life
- Ask about budgets, areas, visa rules, coworking spots
- Streaming chat interface with modern UI

### 👥 **Community**
- Connect with other digital nomads
- Share experiences and tips
- Join community discussions
- Build your nomad network

### 🔐 **Authentication**
- Sign in with Google OAuth
- Secure credential authentication
- Protected routes for authenticated users
- User profile management

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.2** - React framework with App Router
- **TypeScript 5.0** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first styling
- **Framer Motion** - Smooth animations
- **GSAP** - Advanced animations
- **Lucide React** - Beautiful icons
- **Radix UI** - Accessible components
- **shadcn/ui** - Reusable component library

### Backend
- **Next.js API Routes** - Serverless functions
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **NextAuth v5** - Authentication
- **Groq SDK** - AI chat completions

### Deployment
- **Netlify** - Cloud hosting platform
- **Netlify Edge Functions** - Edge computing
- **Netlify Images** - Image optimization

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, yarn, or pnpm
- MongoDB connection string
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/user-synax/nomadbase-goa.git
cd nomadbase-goa
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/nomadbase-goa

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Groq AI
GROQ_API_KEY=your_groq_api_key
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
nomadbase-goa/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   └── signin/          # Sign-in page
│   ├── (root)/              # Main application routes
│   │   ├── assistant/       # AI assistant page
│   │   ├── colivings/       # Colivings listing
│   │   ├── page.tsx         # Landing page
│   │   ├── profile/         # User profiles
│   │   └── spaces/          # Co-working spaces
│   ├── api/                 # API routes
│   │   ├── assistant/       # AI assistant API
│   │   ├── auth/            # Authentication API
│   │   ├── colivings/       # Colivings API
│   │   ├── community/       # Community API
│   │   ├── spaces/          # Spaces API
│   │   └── users/           # Users API
│   └── layout.tsx           # Root layout
├── components/
│   ├── assistant/           # Assistant components
│   ├── colivings/           # Coliving components
│   ├── profile/             # Profile components
│   ├── shared/              # Shared components
│   ├── spaces/              # Space components
│   └── ui/                  # UI components
├── lib/
│   ├── auth.js              # NextAuth configuration
│   └── db.js                # MongoDB connection
├── models/
│   ├── Coliving.js          # Coliving model
│   ├── Reply.js             # Reply model
│   ├── Review.js            # Review model
│   ├── Space.js             # Space model
│   ├── Thread.js            # Thread model
│   └── User.js              # User model
├── middleware.js            # Next.js middleware
├── netlify.toml             # Netlify configuration
├── .nvmrc                   # Node version
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
└── tsconfig.json            # TypeScript configuration
```

---

## 🔐 Authentication

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://nomadbase-goa.netlify.app/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret
7. Add to environment variables

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | No |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `GROQ_API_KEY` | Groq API key for AI assistant | Yes |

---

## 🚀 Deployment

### Netlify

1. **Connect your repository**

   - Go to Netlify and add a new site
   - Import from GitHub
   - Select `nomadbase-goa` repository

2. **Configure build settings**

   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
   ```

3. **Set environment variables**

   Add all required environment variables in Netlify site settings

4. **Deploy**

   - Netlify will automatically build and deploy
   - Configure custom domain if needed

### Manual Deployment

```bash
npm run build
npm run start
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com) - Beautiful component library
- [Groq](https://groq.com) - Fast AI inference
- [MongoDB](https://mongodb.com) - NoSQL database

---

## 📞 Contact

- **Website**: [nomadbase-goa.netlify.app](https://nomadbase-goa.netlify.app)
- **GitHub**: [user-synax/nomadbase-goa](https://github.com/user-synax/nomadbase-goa)

---

<div align="center">

**Made with ❤️ for digital nomads in Goa**

[⬆ Back to Top](#-nomadbase-goa)

</div>

