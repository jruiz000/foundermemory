# FounderMemory

> A calm place to save, share, and retrieve the ideas that gave you conviction when things weren't clear.

![FounderMemory](https://img.shields.io/badge/Next.js-16-black) ![Prisma](https://img.shields.io/badge/Prisma-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## 🎯 North Star

> When I'm doubting or making an important decision, this app returns me criteria and calm by showing me how other great founders thought in similar situations.

## ✨ Features

### 🔍 The Librarian (AI Search)
Describe your situation and the AI librarian finds relevant quotes from founders who've been there. **Not a chatbot** - it retrieves real quotes, never invents or gives advice.

### 📚 The Library
A full-width masonry gallery of founder wisdom. Filter by tags, browse by popularity, hover to save quotes to your collection.

### ➕ Contribute
Share quotes that helped you. Earn XP. Build your reputation as a contributor.
- **🎤 Voice Input** - Dictate quotes using speech-to-text
- **🏷️ AI Auto-Tagging** - AI suggests relevant tags as you type

### 🏆 Leaderboard
See top contributors. The community curates quality through likes and search frequency.

### 👤 User Accounts
- **Google & Email login** via Supabase Auth
- **Personal profile** with stats (quotes, likes, views, XP)
- **Save quotes** to your personal collection
- **See who contributed** each quote

## 🎨 Design

- **Glassmorphism dark theme** inspired by Apple's Liquid Glass
- **Masonry gallery** - 2-6 columns responsive
- **Calm UX** - no infinite feeds, no dopamine tricks
- **Tags/hashtags** for categorization

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/your-username/foundermemory.git
cd foundermemory

# Install
npm install

# Configure environment
cp .env.example .env
# Add your DATABASE_URL, DIRECT_URL, and OPENAI_API_KEY

# Push database schema
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma 5
- **Styling**: TailwindCSS 4
- **AI**: OpenAI GPT-4o-mini
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── ask/              # AI librarian search
│   ├── library/          # Masonry quote gallery
│   ├── add/              # Add quote form
│   ├── leaderboard/      # Top contributors
│   └── api/              # API routes
├── components/
│   ├── navbar.tsx        # Navigation
│   ├── add-quote-form.tsx
│   ├── author-combobox.tsx
│   └── ui/               # Base components
└── lib/
    ├── prisma.ts         # Database client
    └── openai.ts         # AI configuration
```

## 📖 Philosophy

1. **The AI is a librarian, not an advisor** - Retrieves, doesn't invent
2. **Precision over motivation** - Useful quotes, not just pretty ones
3. **Calm over engagement** - No infinite feeds, no dopamine
4. **External memory** - Extension of the founder's memory
5. **Community curates quality** - Likes + search frequency = ranking

## 🚀 Roadmap

### ✅ Implemented
- **🎤 Voice Input** - Speech-to-text for adding quotes
- **🏷️ AI Auto-Tagging** - AI suggests tags based on quote content
- **📊 Personal Stats** - Profile page with contribution stats
- **🔖 Save Quotes** - Bookmark quotes to your collection
- **👤 User Accounts** - Google & email authentication
- **🌍 Language Detection** - Auto-detect quote language

### 🔜 Coming Soon
- **📁 Collections** - Organize saved quotes into folders
- **📧 Wisdom Digest** - Weekly email with relevant quotes
- **🔗 Browser Extension** - One-click save from any webpage
- **✅ Quote Verification** - Community-verified sources

## 🤝 Contributing

Open source. Contributions welcome.

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push and open PR

## 📄 License

MIT

---

*"Not a chatbot. Not a social network. A librarian."*