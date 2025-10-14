import React, { useEffect, useState, useCallback } from 'react';
import { client, useConfig, useElementData } from '@sigmacomputing/plugin';
import { Button } from './components/ui/button';
import { Settings as SettingsIcon } from 'lucide-react';
import Settings, { DEFAULT_SETTINGS } from './Settings';
import ScatterChart from './components/ScatterChart';
import Onboarding from './Onboarding';
import { 
  SigmaConfig, 
  SigmaData, 
  PluginSettings, 
  DataInfo, 
  ConfigParseError 
} from './types/sigma';
import './App.css';

// Configure the plugin editor panel
client.config.configureEditorPanel([
  { name: 'source', type: 'element' },
  { name: 'xColumn', type: 'column', source: 'source', allowMultiple: false, label: 'X-Axis Column' },
  { name: 'yColumn', type: 'column', source: 'source', allowMultiple: false, label: 'Y-Axis Column' },
  { name: 'labelColumn', type: 'column', source: 'source', allowMultiple: false, label: 'Label Column' },
  { name: 'imageColumn', type: 'column', source: 'source', allowMultiple: false, label: 'Image URL Column (Optional)' },
  { name: 'config', type: 'text', label: 'Settings Config (JSON)', defaultValue: "{}" },
  { name: 'editMode', type: 'toggle', label: 'Edit Mode' }
]);

// Mirror of theme presets for applying CSS variables after save
const PRESET_THEMES: Record<string, { name: string; colors: Record<string, string> }> = {
  light: {
    name: 'Light',
    colors: {
      '--background': '0 0% 100%',
      '--foreground': '240 10% 3.9%',
      '--card': '0 0% 100%',
      '--card-foreground': '240 10% 3.9%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '240 10% 3.9%',
      '--primary': '240 9% 10%',
      '--primary-foreground': '0 0% 98%',
      '--secondary': '240 4.8% 95.9%',
      '--secondary-foreground': '240 5.9% 10%',
      '--muted': '240 4.8% 95.9%',
      '--muted-foreground': '240 3.8% 46.1%',
      '--accent': '240 4.8% 95.9%',
      '--accent-foreground': '240 5.9% 10%',
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '240 5.9% 90%',
      '--input': '240 5.9% 90%',
      '--ring': '240 5.9% 10%',
    },
  },
  dark: {
    name: 'Dark',
    colors: {
      '--background': '240 10% 3.9%',
      '--foreground': '0 0% 98%',
      '--card': '240 10% 3.9%',
      '--card-foreground': '0 0% 98%',
      '--popover': '240 10% 3.9%',
      '--popover-foreground': '0 0% 98%',
      '--primary': '0 0% 98%',
      '--primary-foreground': '240 5.9% 10%',
      '--secondary': '240 3.7% 15.9%',
      '--secondary-foreground': '0 0% 98%',
      '--muted': '240 3.7% 15.9%',
      '--muted-foreground': '240 5% 64.9%',
      '--accent': '240 3.7% 15.9%',
      '--accent-foreground': '0 0% 98%',
      '--destructive': '0 62.8% 30.6%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '240 3.7% 15.9%',
      '--input': '240 3.7% 15.9%',
      '--ring': '240 4.9% 83.9%',
    },
  },
};

const applyThemeFromSettings = (settings: PluginSettings): void => {
  const theme = settings.styling?.theme || 'light';
  const colors = theme === 'custom'
    ? (settings.styling?.customColors || PRESET_THEMES.light.colors)
    : (PRESET_THEMES[theme]?.colors || PRESET_THEMES.light.colors);
  Object.entries(colors).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });
};

const App: React.FC = (): React.JSX.Element => {
  const config: SigmaConfig = useConfig();
  const sigmaData: SigmaData = useElementData(config.source || '');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [settings, setSettings] = useState<PluginSettings>(DEFAULT_SETTINGS);

  // Parse config JSON and load settings
  useEffect(() => {
    if (config.config?.trim()) {
      try {
        const parsedConfig = JSON.parse(config.config) as Partial<PluginSettings>;
        const newSettings: PluginSettings = { ...DEFAULT_SETTINGS, ...parsedConfig };
        setSettings(newSettings);
      } catch (err) {
        const error: ConfigParseError = {
          message: 'Invalid config JSON',
          originalError: err
        };
        console.error('Config parse error:', error);
        setSettings(DEFAULT_SETTINGS);
      }
    } else {
      setSettings(DEFAULT_SETTINGS);
    }
  }, [config.config]);

  // Apply saved styling whenever settings change
  useEffect(() => {
    if (settings?.styling) {
      applyThemeFromSettings(settings);
    }
  }, [settings]);

  const handleSettingsSave = useCallback((newSettings: PluginSettings): void => {
    setSettings(newSettings);
    setShowSettings(false);
  }, []);

  const handleShowSettings = useCallback((): void => {
    setShowSettings(true);
  }, []);

  const handleCloseSettings = useCallback((): void => {
    setShowSettings(false);
  }, []);

  // Get data information
  const getDataInfo = useCallback((): DataInfo | null => {
    if (!sigmaData || !config.xColumn || !config.yColumn || !config.labelColumn) {
      return null;
    }

    const xColumnData = sigmaData[config.xColumn];
    const yColumnData = sigmaData[config.yColumn];
    const labelColumnData = sigmaData[config.labelColumn];

    if (!xColumnData || !yColumnData || !labelColumnData) {
      return null;
    }

    const rowCount = Math.min(xColumnData.length, yColumnData.length, labelColumnData.length);

    return {
      rowCount: rowCount,
      columnName: 'Scatter Plot Data',
      hasData: rowCount > 0
    };
  }, [sigmaData, config.xColumn, config.yColumn, config.labelColumn]);

  const dataInfo = getDataInfo();

  // Show onboarding if configuration is incomplete
  const isConfigurationComplete = config.source && config.xColumn && config.yColumn && config.labelColumn;
  
  if (!isConfigurationComplete) {
    return (
      <Onboarding
        hasSource={!!config.source}
        hasXColumn={!!config.xColumn}
        hasYColumn={!!config.yColumn}
        hasLabelColumn={!!config.labelColumn}
        hasImageColumn={!!config.imageColumn}
        editMode={config.editMode || false}
        onOpenSettings={handleShowSettings}
      />
    );
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ 
        backgroundColor: String(settings.backgroundColor) || 'white',
        color: String(settings.textColor) || 'black'
      }}
    >
      {config.editMode && (
        <Button 
          className="absolute top-5 right-5 z-10 gap-2"
          onClick={handleShowSettings}
          size="sm"
        >
          <SettingsIcon className="h-4 w-4" />
          Settings
        </Button>
      )}
      
      <div className="w-full h-screen p-5 box-border">
        {dataInfo && dataInfo.hasData ? (
          <ScatterChart
            xData={sigmaData[config.xColumn!] || []}
            yData={sigmaData[config.yColumn!] || []}
            labelData={sigmaData[config.labelColumn!] || []}
            imageData={config.imageColumn ? sigmaData[config.imageColumn] : undefined}
            settings={settings.scatter!}
            xColumnName={config.xColumn}
            yColumnName={config.yColumn}
            width="100%"
            height="100%"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center max-w-xl">
              <h3 className="text-lg font-semibold mb-4">Scatter Plot</h3>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <h4 className="text-md font-medium mb-2">No Data Available</h4>
                  <p className="text-muted-foreground">
                    The selected columns contain no valid data. Please ensure your data source has numeric values for X and Y axes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Settings
        isOpen={showSettings}
        onClose={handleCloseSettings}
        currentSettings={settings}
        onSave={handleSettingsSave}
        client={client}
      />
    </div>
  );
};

export default App;


