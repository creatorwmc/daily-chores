# Daily Chores - Claude Code Instructions

## Deployment Policy

**DEFAULT: Local development and GitHub commits only.**

When running or testing the application:
- Use `npm run dev` for local development server (localhost:5175)
- Commit changes to GitHub as needed
- Do NOT deploy directly to Netlify/production

**Production deployment is manual, on request:**
- There is no CI deploy — the nightly workflow was removed 2026-06-01
- Ship with a local `netlify deploy --prod`, only when explicitly asked

## Development Commands

```bash
# Local development (DEFAULT)
npm run dev              # Vite dev server on localhost:5175

# Build (for testing build locally)
npm run build            # Production build to /dist
npm run preview          # Preview production build locally

# Linting
npm run lint             # ESLint check
```

## Git Workflow

When making changes:
1. Make the code changes
2. Test locally with `npm run dev`
3. Commit to GitHub when ready
4. Production ships only when asked, via a local `netlify deploy --prod`

## Project Context

- **Purpose**: Simple daily chore tracker for two people (husband and wife)
- **Users**: Zach and Stacey (synced via Firebase household)
- **Backend**: Firebase (Auth, Firestore)
- **Hosting**: Netlify
- **CI/CD**: none, by policy — deploy on request

## Key Features

- **Household**: Create/join a household with a join code
- **Chore List**: Shared list of daily chores
- **Completion Tracking**: Check off chores, see who completed what
- **Progress Bar**: Visual progress through daily tasks
- **Real-time Sync**: Changes sync instantly between both users

## Key Directories

- `src/components/` - UI components (Dashboard, ChoreList, AddChore, etc.)
- `src/components/auth/` - Authentication components
- `src/hooks/` - React hooks (useAuth)
- `src/config/` - Firebase configuration
