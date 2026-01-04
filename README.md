# Take a Breath

A calming breathing coach web app that guides you through a 4-4-4 breathing pattern: 4 seconds inhale, 4 seconds hold, 4 seconds exhale.

## Features

- **Simple breathing guidance**: Clear visual countdown and phase labels
- **Continuous mode**: Loop the breathing sequence indefinitely
- **Responsive design**: Works beautifully on mobile and desktop
- **Accessible**: Proper focus states and keyboard navigation
- **Calming interface**: Gradient background with clean, modern UI

## How it works

1. Click **"Take a breath"** to start a single breathing cycle
2. Follow the on-screen prompts: "Breathe in" → "Hold" → "Breathe out"
3. Each phase lasts 4 seconds with a visible countdown
4. Enable **Continuous** mode to loop indefinitely
5. Use **Stop** or **Restart** buttons as needed

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173` during development.

## Deployment

This app is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup for your own repository

1. **Fork or clone this repository**
2. **Update the base path** in `vite.config.ts`:
   ```typescript
   const REPO_NAME = 'your-repo-name' // Change this to match your repo name
   ```
3. **Push to main branch** - GitHub Actions will automatically deploy to Pages

The workflow:
- Triggers on push to `main` branch
- Builds the React app using Vite
- Deploys to GitHub Pages from the `dist/` folder
- Uses the standard GitHub Pages Actions workflow

### Expected URL format

If your GitHub username is `username` and your repo name is `take-a-breath`, your app will be available at:
```
https://username.github.io/take-a-breath/
```

## Project Structure

```
src/
├── App.tsx                 # Main app layout and component orchestration
├── components/
│   ├── BreathingCoach.tsx  # Breathing state machine and timer logic
│   └── Controls.tsx        # UI buttons and toggle controls
└── styles/
    └── app.css             # Global styles, responsive design, and theming
```

## Technical Details

- **Framework**: React 18 with TypeScript
- **Build tool**: Vite
- **State management**: React hooks (useState, useEffect, useCallback)
- **Styling**: Plain CSS with responsive design
- **Timer**: Uses `setInterval` with proper cleanup to prevent memory leaks
- **Accessibility**: ARIA labels, keyboard navigation, reduced motion support

## Breathing Pattern

The app follows a simple 4-4-4 breathing pattern:
- **Inhale**: 4 seconds
- **Hold**: 4 seconds  
- **Exhale**: 4 seconds

This pattern is commonly used for relaxation and stress reduction.

## License

MIT License - feel free to use this for your own breathing apps or as a learning resource.
