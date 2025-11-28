# Weather Widget

Embeddable weather widget built with Vue.js, TypeScript, SCSS, Webpack.

## Requirements

- Node.js 18+
- npm or yarn

## Setup

1. Installation of dependencies:
```bash
npm install
```

2. Addition of OpenWeather API key to `.env`:
```
OPENWEATHER_API_KEY=your_api_key_here
```

## Development

```bash
npm run dev
```

Application available at http://localhost:3000

## Build

Web component build (embeddable):
```bash
npm run build:wc
```

Output: `dist/weather-widget.js`

## Usage

```html
<weather-widget api-key="YOUR_API_KEY"></weather-widget>
<script src="weather-widget.js"></script>
```

## Features

- Weather display for multiple cities
- City addition/removal
- Drag-and-drop reordering
- LocalStorage persistence
- Geolocation on first visit
