# 🧘 Yoga Anatomy — Muscle Activator

A React + TypeScript app for yoga teacher training students to explore which muscles are activated in each yoga pose.

## Tech Stack

- **React 18** + **TypeScript** — type-safe UI
- **Vite** — fast dev server and build tool
- **Zustand** — lightweight global state management
- **Tailwind CSS** — utility-first styling
- **React Router v6** — client-side routing

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Layout/         # App shell, nav bar
│   ├── MuscleCard/     # Sidebar muscle button
│   ├── PoseCard/       # Pose card with activation level
│   ├── SearchBar/      # Reusable search input
│   └── FilterPanel/    # Region filter buttons
├── data/
│   ├── muscles.ts      # All muscle data
│   └── poses.ts        # All pose data
├── pages/
│   ├── Explorer/       # Main muscle explorer page
│   └── PoseDetail/     # Poses browser page
├── store/
│   └── useAppStore.ts  # Zustand global store
├── types/
│   └── index.ts        # TypeScript interfaces
└── styles/
    └── index.css       # Tailwind + custom classes
```

## Data Model

### Muscle
```typescript
{
  id, name, latinName?,
  region, area,
  origin: string[],
  insertion: string[],
  actions: string[],
  innervation?,
  description, teachingTip,
  poseActivations: { poseId, activation, cue }[]
}
```

### Pose
```typescript
{
  id, name, sanskrit,
  category, level,
  description, breathCue?,
  contraindications?: string[],
  muscleActivations: { muscleId, activation, notes }[]
}
```

## Roadmap

- [ ] Add remaining 50+ muscles
- [ ] Add 40+ poses
- [ ] Quiz mode for YTT students
- [ ] Supabase backend for user accounts
- [ ] Bookmark favourite muscles/poses
- [ ] Deploy to Vercel
