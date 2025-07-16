# 📱 Questagram: RPG-Themed Social Media App

**Questagram** is a gamified, RPG-themed social network inspired by Instagram, but with classes, XP, leveling, quests, and world lore. Users gain experience, level up, form parties, and explore content through a fantasy lens.

---

## 🧩 Features Overview

### ⚔️ CLASSES
Users choose a class that affects UI, quests, and content bonuses:
- **Warrior**: Sports, fitness, action content
- **Mage**: Artistic or educational posts (drawing, coding, design)
- **Rogue**: Meme creators, trendsetters, risk-takers
- **Cleric**: Supporters, commenters, kind interactions

---

### 🧠 LEVELING SYSTEM
Gain XP from:
- Uploading posts (photos, videos)
- Receiving likes/comments
- Completing quests
- Daily logins, streaks

Leveling unlocks:
- Profile skins
- New zones
- Badges
- Cosmetic gear

---

### 📜 QUESTS
Quests serve as gamified challenges:
- Daily: “Post a photo of your class in action”
- Weekly: “Make 3 people smile”
- Special Events: “Join your guild to complete a raid quest”

Quests grant XP, currency, and items.

---

### 🎒 INVENTORY SYSTEM
Users collect gear and cosmetics to customize their profile:
- Avatar skins
- Post borders
- Frames
- Equipable passive boosts:
  - Example: "Cloak of Virality" → +10% likes XP

---

### 👥 GUILDS & PARTIES
- Guilds = user communities
- Parties = temporary teams for co-op quests
- Shared XP + unique rewards for group effort

---

### 🗺️ WORLD MAP & ZONES
Posts are categorized into “zones” or “realms”:
- **Artisan’s Valley** – Art and craft zone
- **Arena of Trends** – Trending challenges
- **The Library** – Educational/insightful content
- Zones are unlockable as users level up

---

### 🧠 PVP & LEADERBOARDS
- Class leaderboards (top Mage, top Rogue, etc.)
- Post-offs: users battle with themed posts → voted by community
- Rewards for top placement

---

### 🪙 CURRENCY & ECONOMY
- **Gold**: Earned from quests, likes, activity
- **Gems**: Premium currency (daily login bonuses or IAP)
- Used to buy:
  - Cosmetic gear
  - XP boosts
  - Profile effects
  - Gifts for other users

---

### 📖 STORY & WORLD LORE
- Optional “Story Mode” where global events affect all users
- Seasons, invasions, class wars, and zone lore enrich immersion

---

## 📱 MVP FEATURES

**Must-have for v1.0:**
- Sign up / login
- Class selection
- Post photo/video
- Earn XP
- Daily quests
- Profile with level, class, inventory
- Feed system by zone
- Simple leaderboard

---

## 🛠 TECH STACK

| Layer         | Tech                               |
|--------------|------------------------------------|
| Frontend      | React Native (mobile), Kotlin/Jetpack Compose or SwiftUI (optional native support) |
| Backend       | Node.js + Express / Firebase Functions |
| Auth          | Firebase Auth / Supabase          |
| Database      | Firebase Firestore / PostgreSQL   |
| Storage       | Firebase Storage / Cloudinary     |
| Push/Realtime | Firebase Cloud Messaging / Socket.IO |
| Gamification  | Custom logic or BaaS with XP & quest engine |
| Map/Feed UI   | Google Maps (if real-world) or vector-based zones |
| Deployment    | Vercel / Render / Netlify / Firebase Hosting |

---

## 🚧 FUTURE FEATURES

- Voice & AR filters tied to gear
- NFT/crypto integration (opt-in only)
- Real-world questing / location-based events
- AI-generated lore stories
- Battle pass & seasonal content

---

## 📂 FOLDER STRUCTURE EXAMPLE

```plaintext
questagram/
├── frontend/ (React Native)
│   ├── components/
│   ├── screens/
│   ├── assets/
│   └── App.tsx
├── backend/
│   ├── functions/
│   ├── routes/
│   └── index.js
├── firestore.rules
├── .firebaserc
├── README.md
└── package.json
```