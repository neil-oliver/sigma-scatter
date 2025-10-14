# Sigma Scatter Plot Plugin

A powerful scatter plot visualization plugin for Sigma Computing, built with React, TypeScript, ECharts v5, and shadcn/ui components.

## Features

- **Image-Based Data Points**: Use image URLs as scatter plot symbols with automatic fallback to circles
- **Interactive Zoom Controls**: Independent X and Y axis datazoom bars (enabled by default)
- **Rich Customization**: Extensive settings for symbols, axes, grids, animations, and more
- **Four Column Configuration**: X-axis, Y-axis, Label, and optional Image URL columns
- **ECharts v5 Integration**: High-performance, responsive charting with thousands of data points
- **Settings Panel**: Comprehensive configuration interface (accessible in edit mode)
- **TypeScript**: Full type safety with strict configuration
- **shadcn/ui Components**: Modern, accessible UI components built with Radix UI

## Getting Started

1. **Clone this template** to start building your own Sigma plugin
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start development server**:
   ```bash
   npm start
   ```
4. **Build for production**:
   ```bash
   npm run build
   ```
5. **Type checking**:
   ```bash
   npm run type-check
   ```
6. **Linting**:
   ```bash
   npm run lint
   ```
7. **Clean cache**:
   ```bash
   npm run clean
   ```

## Plugin Configuration

The plugin is configured with the following editor panel options:

- **Source**: Select a data source element
- **X-Axis Column**: Numeric values for the horizontal axis (required)
- **Y-Axis Column**: Numeric values for the vertical axis (required)
- **Label Column**: Text labels for tooltips and identification (required)
- **Image URL Column**: URLs for image symbols (optional, falls back to circles)
- **Settings Config**: JSON configuration for plugin settings
- **Edit Mode**: Toggle to access settings panel

## Example Data Format

The plugin expects 4 columns of data. Here's an example with NFL team statistics:

| Team Name           | Abbreviation | Win %  | Points/Game | Image URL                                           |
|---------------------|--------------|--------|-------------|-----------------------------------------------------|
| Arizona Cardinals   | ari          | 36.5   | 29.2        | https://a.espncdn.com/i/teamlogos/nfl/500/ari.png  |
| Atlanta Falcons     | atl          | 63.0   | 15.6        | https://a.espncdn.com/i/teamlogos/nfl/500/atl.png  |
| Baltimore Ravens    | bal          | 47.0   | 27.7        | https://a.espncdn.com/i/teamlogos/nfl/500/bal.png  |
| Buffalo Bills       | buf          | 53.5   | 20.9        | https://a.espncdn.com/i/teamlogos/nfl/500/buf.png  |

In this example:
- **X-Axis**: Win % (numeric)
- **Y-Axis**: Points/Game (numeric)
- **Label**: Team Name (text)
- **Image URL**: Team logo (URL string)

## Scatter Plot Settings

The plugin provides extensive customization options through the Settings panel:

### Image & Symbol Settings
- **Image Size**: Size of image symbols (10-100px, default: 30px)
- **Point Size**: Size of fallback circle symbols (5-50px, default: 10px)
- **Point Color**: Color for circle symbols (default: #5470c6)

### Axis Settings
- **X-Axis Label**: Custom label for horizontal axis
- **Y-Axis Label**: Custom label for vertical axis
- **X-Axis DataZoom**: Enable/disable horizontal zoom control (default: enabled)
- **Y-Axis DataZoom**: Enable/disable vertical zoom control (default: enabled)

### Grid Settings
- **Show Grid Lines**: Toggle grid line visibility (default: enabled)
- **Grid Opacity**: Adjust grid line transparency (0-1, default: 0.3)

### Interaction Settings
- **Enable Tooltips**: Show/hide hover tooltips (default: enabled)
- **Enable Animation**: Toggle chart animations (default: enabled)
- **Animation Duration**: Animation speed in milliseconds (default: 1000ms)
- **Show Legend**: Display chart legend (default: disabled)
- **Legend Position**: Position of legend (top/bottom/left/right)

### Theme Settings
- **Light/Dark/Custom**: Choose from preset themes or customize colors
- **Dynamic Theming**: Apply theme changes in real-time while editing

## File Structure

```
src/
├── App.tsx              # Main plugin component with data orchestration
├── Settings.tsx         # Comprehensive settings panel
├── index.tsx            # Entry point
├── types/
│   ├── sigma.ts         # Plugin and scatter settings type definitions
│   └── scatter.ts       # Scatter data processing types
├── components/
│   ├── ScatterChart.tsx # ECharts scatter plot component
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── chartUtils.ts    # Data processing and ECharts config utilities
│   └── utils.ts         # General utility functions
└── App.css              # Styling
```

## Dependencies

- **React**: UI framework (v18.3+)
- **TypeScript**: Type safety and developer experience
- **ECharts**: Powerful charting library (v5.5+)
- **echarts-for-react**: React wrapper for ECharts
- **@sigmacomputing/plugin**: Sigma plugin SDK
- **shadcn/ui**: Component library built on Radix UI
- **Tailwind CSS**: Styling framework
- **Lucide React**: Icon library

## Development Tips

1. **Data Format**: Ensure X and Y columns contain numeric values; non-numeric values will be filtered out
2. **Image URLs**: Use valid HTTPS URLs for images; invalid URLs automatically fall back to circles
3. **Performance**: The plugin efficiently handles 10,000+ data points with ECharts' canvas renderer
4. **Settings Persistence**: All settings are saved to the Sigma config JSON automatically on save
5. **Testing**: Use `npm start` to run the development server and test in Sigma
6. **Responsive Design**: Charts automatically resize to fit the container

## Image Symbol Support

The plugin uses ECharts' `image://` symbol feature:
- Valid image URLs (http/https) are displayed as symbols
- Invalid or missing URLs fall back to colored circles
- Image size is independently configurable from circle size
- Images are cached by the browser for performance

## Known Limitations

- Image URLs must be publicly accessible (CORS-enabled)
- Very large images may impact initial load time
- Image symbols don't support color customization (use the original image colors)

## License

This plugin is provided as-is for use with Sigma Computing.
