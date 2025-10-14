// Sigma plugin configuration types
export interface SigmaConfig {
  source?: string;
  xColumn?: string;
  yColumn?: string;
  labelColumn?: string;
  imageColumn?: string;
  config?: string;
  editMode?: boolean;
}

// Sigma data structure - more specific typing
export interface SigmaData {
  [columnName: string]: (string | number | boolean | null)[];
}

export interface PluginSettingsStyling {
  theme: 'light' | 'dark' | 'custom';
  customColors: Record<string, string>; // CSS var values like "240 5% 10%" or "240 5% 10% / 1"
  enableDynamicTheming?: boolean;
}

// Scatter plot specific settings
export interface ScatterSettings {
  imageSize: number;
  pointSize: number;
  pointColor: string;
  backgroundColor: string;
  enableXDataZoom: boolean;
  enableYDataZoom: boolean;
  xAxisLabel: string;
  yAxisLabel: string;
  showGridLines: boolean;
  gridOpacity: number;
  enableTooltip: boolean;
  enableAnimation: boolean;
  animationDuration: number;
  showLegend: boolean;
  legendPosition: 'top' | 'bottom' | 'left' | 'right';
  showAxisLabels: boolean;
  fontFamily: string;
  gridLeftPadding: number;
  gridRightPadding: number;
  gridTopPadding: number;
  gridBottomPadding: number;
}

// Plugin settings interface
export interface PluginSettings {
  // Back-compat simple colors (may be overridden by styling vars)
  backgroundColor: string;
  textColor: string;

  // New styling block for theme tokens
  styling?: PluginSettingsStyling;

  // Scatter plot settings
  scatter?: ScatterSettings;
}

// Data information interface
export interface DataInfo {
  rowCount: number;
  columnName: string;
  hasData: boolean;
}

// Sigma client interface (based on @sigmacomputing/plugin)
export interface SigmaClient {
  config: {
    set: (config: Record<string, unknown>) => void;
    configureEditorPanel: (config: Array<{
      name: string;
      type: string;
      source?: string;
      allowMultiple?: boolean;
      label?: string;
      defaultValue?: string;
    }>) => void;
  };
}

// Settings component props with proper client typing (optional)
export interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: PluginSettings;
  onSave: (settings: PluginSettings) => void;
  client: SigmaClient;
}

// Error handling types
export interface ConfigParseError {
  message: string;
  originalError: unknown;
}

// Event handler types (kept for potential use)
export interface ColorChangeEvent {
  target: {
    value: string;
  };
}


