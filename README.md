# The Birthday Roulette

A visually appealing and interactive roulette wheel web application built with React and Vite. This project features a realistic roulette wheel simulation with physics-based animations, result tracking, and statistical analysis.

![Roulette Wheel Screenshot](./screenshot.png)

## Features

### Core Functionality
- **Interactive Roulette Wheel**: Realistic physics-based wheel animation with smooth spinning and ball movement
- **Result Tracking**: Displays the current result and maintains a history of previous spins
- **Statistics Analysis**: Visualizes the frequency distribution of results in a histogram
- **Persistent Storage**: Saves all results to cookies for retrieval on page reload

### User Interface
- **Responsive Design**: Adapts to different screen sizes for optimal viewing experience
- **Dark Theme**: Modern dark-themed interface with proper contrast
- **Grid Layout**: Stable and consistent positioning of UI elements
- **Intuitive Controls**: Prominent action buttons for spinning the wheel and viewing statistics

### Technical Features
- **Canvas Rendering**: Efficient rendering of the wheel and ball using HTML5 Canvas
- **Configurable Options**: Customizable wheel appearance, physics parameters, and UI settings
- **State Management**: Proper React state management for tracking results and application state
- **Event System**: Custom event system for component communication

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/roulette-wheel-app.git

# Navigate to the project directory
cd roulette-wheel-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

1. **Spin the Wheel**: Click the "Spin Wheel" button to start a new spin
2. **View Results**: The most recent result appears in the "Last Result" display
3. **Check History**: Previous results are shown in the history panel
4. **Analyze Statistics**: Click "Show Statistics" to see a histogram of all results

## Building for Production

```bash
# Build the application
npm run build

# Preview the production build locally
npm run preview
```

The build process will create a `dist` directory containing optimized files ready for deployment.

## Deployment

The built application can be deployed to any static hosting service:

```bash
# Using serve for a quick local deployment
npm install -g serve
serve -s dist
```

Alternatively, deploy to platforms like Netlify, Vercel, or GitHub Pages by uploading the `dist` directory.

## Project Structure

```
└── roulette-wheel-app/
    ├── src/
    │   ├── components/        # React components
    │   │   ├── RouletteWheel.jsx        # Main wheel component
    │   │   ├── ResultDisplay.jsx        # Display for current result
    │   │   ├── ResultHistory.jsx        # History of previous results
    │   │   ├── ResultsHistogram.jsx     # Statistical analysis modal
    │   │   └── ConfigPanel.jsx          # Configuration options
    │   ├── utils/             # Utility functions
    │   │   ├── physics.js              # Wheel physics calculations
    │   │   ├── wheelData.js            # Wheel numbers and colors
    │   │   ├── configLoader.js         # Default configuration
    │   │   └── cookieUtils.js          # Cookie management
    │   ├── styles/            # CSS stylesheets
    │   │   ├── app.css                 # Global styles
    │   │   ├── modal.css               # Modal styling
    │   │   ├── buttons.css             # Button styles
    │   │   ├── resultDisplay.css       # Result display styling
    │   │   └── resultHistory.css       # History section styling
    │   └── App.jsx            # Main application component
    └── public/                # Static assets
```

## Configuration

The roulette wheel can be configured via the `configLoader.js` file:

- **Appearance**: Wheel size, colors, fonts, and visual elements
- **Physics**: Spinning speed, friction, bounce factors, and timing
- **UI Options**: History size, auto-spin settings, and display preferences

## License

MIT

## Credits

Developed for Argenis' birthday celebration. Enjoy your spins and may luck be on your side!
