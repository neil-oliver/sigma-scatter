import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { PluginSettings } from './types/sigma';

export const DEFAULT_SETTINGS: PluginSettings = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
  styling: {
    theme: 'light',
    customColors: {},
    enableDynamicTheming: false,
  },
  scatter: {
    imageSize: 30,
    pointSize: 10,
    pointColor: '#5470c6',
    backgroundColor: '#ffffff',
    enableXDataZoom: false,
    enableYDataZoom: false,
    xAxisLabel: 'X Axis',
    yAxisLabel: 'Y Axis',
    showGridLines: true,
    gridOpacity: 0.3,
    enableTooltip: true,
    enableAnimation: true,
    animationDuration: 1000,
    showLegend: false,
    legendPosition: 'top',
    showAxisLabels: true,
    fontFamily: 'Geist',
    gridLeftPadding: 60,
    gridRightPadding: 20,
    gridTopPadding: 40,
    gridBottomPadding: 50,
  },
};

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: PluginSettings;
  onSave: (settings: PluginSettings) => void;
  client: any; // Keep any for simplicity in template
}

const Settings: React.FC<SettingsProps> = ({ 
  isOpen, 
  onClose, 
  currentSettings, 
  onSave, 
  client 
}) => {
  const [tempSettings, setTempSettings] = useState<PluginSettings>(currentSettings);

  // Update temp settings when current settings change
  useEffect(() => {
    const settingsWithDefaults: PluginSettings = {
      ...DEFAULT_SETTINGS,
      ...currentSettings,
      styling: {
        ...DEFAULT_SETTINGS.styling!,
        ...(currentSettings.styling || {}),
      },
      scatter: {
        ...DEFAULT_SETTINGS.scatter!,
        ...(currentSettings.scatter || {}),
      },
    };
    setTempSettings(settingsWithDefaults);
  }, [currentSettings]);

  const handleSave = useCallback((): void => {
    const configJson = JSON.stringify(tempSettings, null, 2);
    try {
      client.config.set({ config: configJson });
      onSave(tempSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [tempSettings, client, onSave]);

  const handleCancel = useCallback((): void => {
    setTempSettings(currentSettings);
    onClose();
  }, [currentSettings, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Plugin Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Image Settings */}
          <div className="space-y-2">
            <Label htmlFor="imageSize">Image Size (px)</Label>
              <div className="flex items-center gap-3">
                <input
                  id="imageSize"
                  type="range"
                  min="10"
                  max="100"
                  value={tempSettings.scatter?.imageSize || 30}
                  onChange={(e) => setTempSettings((prev) => ({
                    ...prev,
                    scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), imageSize: parseInt(e.target.value) },
                  }))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">{tempSettings.scatter?.imageSize || 30}</span>
              </div>
              <p className="text-sm text-muted-foreground">Size of image symbols when image URLs are provided</p>
            </div>

            {/* Point Settings */}
            <div className="space-y-2">
              <Label htmlFor="pointSize">Point Size (px)</Label>
              <div className="flex items-center gap-3">
                <input
                  id="pointSize"
                  type="range"
                  min="5"
                  max="50"
                  value={tempSettings.scatter?.pointSize || 10}
                  onChange={(e) => setTempSettings((prev) => ({
                    ...prev,
                    scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), pointSize: parseInt(e.target.value) },
                  }))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">{tempSettings.scatter?.pointSize || 10}</span>
              </div>
              <p className="text-sm text-muted-foreground">Size of circle symbols (fallback when no image URL)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pointColor">Point Color</Label>
              <div className="flex items-center gap-3">
                <input
                  id="pointColor"
                  type="color"
                  value={tempSettings.scatter?.pointColor || '#5470c6'}
                  onChange={(e) => setTempSettings((prev) => ({
                    ...prev,
                    scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), pointColor: e.target.value },
                  }))}
                />
                <Input
                  type="text"
                  value={tempSettings.scatter?.pointColor || '#5470c6'}
                  onChange={(e) => setTempSettings((prev) => ({
                    ...prev,
                    scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), pointColor: e.target.value },
                  }))}
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-muted-foreground">Color for circle symbols</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex items-center gap-3">
                <input
                  id="backgroundColor"
                  type="color"
                  value={tempSettings.scatter?.backgroundColor || '#ffffff'}
                  onChange={(e) => setTempSettings((prev) => ({
                    ...prev,
                    scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), backgroundColor: e.target.value },
                  }))}
                />
                <Input
                  type="text"
                  value={tempSettings.scatter?.backgroundColor || '#ffffff'}
                  onChange={(e) => setTempSettings((prev) => ({
                    ...prev,
                    scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), backgroundColor: e.target.value },
                  }))}
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-muted-foreground">Background color for the scatter plot</p>
            </div>

            {/* Axis Settings */}
            <div className="space-y-2">
              <Label htmlFor="xAxisLabel">X-Axis Label</Label>
              <Input
                id="xAxisLabel"
                type="text"
                value={tempSettings.scatter?.xAxisLabel || ''}
                onChange={(e) => setTempSettings((prev) => ({
                  ...prev,
                  scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), xAxisLabel: e.target.value },
                }))}
                placeholder="X Axis"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yAxisLabel">Y-Axis Label</Label>
              <Input
                id="yAxisLabel"
                type="text"
                value={tempSettings.scatter?.yAxisLabel || ''}
                onChange={(e) => setTempSettings((prev) => ({
                  ...prev,
                  scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), yAxisLabel: e.target.value },
                }))}
                placeholder="Y Axis"
              />
            </div>

            {/* Axis Label Visibility */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  id="showAxisLabels"
                  type="checkbox"
                  checked={tempSettings.scatter?.showAxisLabels ?? true}
                  onChange={(e) => setTempSettings((prev) => ({
                    ...prev,
                    scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), showAxisLabels: e.target.checked },
                  }))}
                />
                <Label htmlFor="showAxisLabels" className="font-normal">Show Axis Labels</Label>
              </div>
              <p className="text-sm text-muted-foreground">Display axis name labels on the chart</p>
            </div>

            {/* DataZoom Controls */}
            <div className="space-y-2">
              <Label>DataZoom Controls</Label>
              <div className="flex items-center gap-2">
                <input
                  id="enableXDataZoom"
                  type="checkbox"
                  checked={tempSettings.scatter?.enableXDataZoom ?? false}
                  onChange={(e) => setTempSettings((prev) => ({
                    ...prev,
                    scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), enableXDataZoom: e.target.checked },
                  }))}
                />
                <label htmlFor="enableXDataZoom" className="text-sm">Enable X-Axis Zoom</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="enableYDataZoom"
                  type="checkbox"
                  checked={tempSettings.scatter?.enableYDataZoom ?? false}
                  onChange={(e) => setTempSettings((prev) => ({
                    ...prev,
                    scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), enableYDataZoom: e.target.checked },
                  }))}
                />
                <label htmlFor="enableYDataZoom" className="text-sm">Enable Y-Axis Zoom</label>
              </div>
              <p className="text-sm text-muted-foreground">Show zoom controls for axes</p>
            </div>

            {/* Grid Settings */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  id="showGridLines"
                  type="checkbox"
                  checked={tempSettings.scatter?.showGridLines ?? true}
                  onChange={(e) => setTempSettings((prev) => ({
                    ...prev,
                    scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), showGridLines: e.target.checked },
                  }))}
                />
                <Label htmlFor="showGridLines" className="font-normal">Show Grid Lines</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gridOpacity">Grid Opacity</Label>
              <div className="flex items-center gap-3">
                <input
                  id="gridOpacity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={tempSettings.scatter?.gridOpacity ?? 0.3}
                  onChange={(e) => setTempSettings((prev) => ({
                    ...prev,
                    scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), gridOpacity: parseFloat(e.target.value) },
                  }))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">{tempSettings.scatter?.gridOpacity ?? 0.3}</span>
              </div>
            </div>

            {/* Other Settings */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  id="enableTooltip"
                  type="checkbox"
                  checked={tempSettings.scatter?.enableTooltip ?? true}
                  onChange={(e) => setTempSettings((prev) => ({
                    ...prev,
                    scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), enableTooltip: e.target.checked },
                  }))}
                />
                <Label htmlFor="enableTooltip" className="font-normal">Enable Tooltips</Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  id="enableAnimation"
                  type="checkbox"
                  checked={tempSettings.scatter?.enableAnimation ?? true}
                  onChange={(e) => setTempSettings((prev) => ({
                    ...prev,
                    scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), enableAnimation: e.target.checked },
                  }))}
                />
                <Label htmlFor="enableAnimation" className="font-normal">Enable Animation</Label>
              </div>
            </div>

            {tempSettings.scatter?.enableAnimation && (
              <div className="space-y-2">
                <Label htmlFor="animationDuration">Animation Duration (ms)</Label>
                <Input
                  id="animationDuration"
                  type="number"
                  min="0"
                  max="5000"
                  step="100"
                  value={tempSettings.scatter?.animationDuration || 1000}
                  onChange={(e) => setTempSettings((prev) => ({
                    ...prev,
                    scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), animationDuration: parseInt(e.target.value) },
                  }))}
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  id="showLegend"
                  type="checkbox"
                  checked={tempSettings.scatter?.showLegend ?? false}
                  onChange={(e) => setTempSettings((prev) => ({
                    ...prev,
                    scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), showLegend: e.target.checked },
                  }))}
                />
                <Label htmlFor="showLegend" className="font-normal">Show Legend</Label>
              </div>
            </div>

            {tempSettings.scatter?.showLegend && (
              <div className="space-y-2">
                <Label htmlFor="legendPosition">Legend Position</Label>
                <select
                  id="legendPosition"
                  value={tempSettings.scatter?.legendPosition || 'top'}
                  onChange={(e) => setTempSettings((prev) => ({
                    ...prev,
                    scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), legendPosition: e.target.value as 'top' | 'bottom' | 'left' | 'right' },
                  }))}
                  className="block w-full border rounded px-3 py-2 text-sm bg-background text-foreground"
                >
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
            )}

            {/* Font Settings */}
            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font Family</Label>
              <select
                id="fontFamily"
                value={tempSettings.scatter?.fontFamily || 'Geist'}
                onChange={(e) => setTempSettings((prev) => ({
                  ...prev,
                  scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), fontFamily: e.target.value },
                }))}
                className="block w-full border rounded px-3 py-2 text-sm bg-background text-foreground"
              >
                <option value="Geist">Geist</option>
                <option value="Roboto">Roboto</option>
                <option value="Inter">Inter</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                <option value="Space Grotesk">Space Grotesk</option>
              </select>
              <p className="text-sm text-muted-foreground">Font used for axis labels and chart text</p>
            </div>

            {/* Chart Padding Settings */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold">Chart Padding</h3>
              <p className="text-sm text-muted-foreground">
                Adjust spacing around the chart area. Values are automatically increased when axis labels or zoom controls are enabled.
              </p>

              <div className="space-y-2">
                <Label htmlFor="gridLeftPadding">Left Padding (px)</Label>
                <div className="flex items-center gap-3">
                  <input
                    id="gridLeftPadding"
                    type="range"
                    min="20"
                    max="150"
                    value={tempSettings.scatter?.gridLeftPadding ?? 60}
                    onChange={(e) => setTempSettings((prev) => ({
                      ...prev,
                      scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), gridLeftPadding: parseInt(e.target.value) },
                    }))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12 text-right">{tempSettings.scatter?.gridLeftPadding ?? 60}</span>
                </div>
                <p className="text-sm text-muted-foreground">Space for Y-axis labels and zoom control</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gridRightPadding">Right Padding (px)</Label>
                <div className="flex items-center gap-3">
                  <input
                    id="gridRightPadding"
                    type="range"
                    min="10"
                    max="100"
                    value={tempSettings.scatter?.gridRightPadding ?? 20}
                    onChange={(e) => setTempSettings((prev) => ({
                      ...prev,
                      scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), gridRightPadding: parseInt(e.target.value) },
                    }))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12 text-right">{tempSettings.scatter?.gridRightPadding ?? 20}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gridTopPadding">Top Padding (px)</Label>
                <div className="flex items-center gap-3">
                  <input
                    id="gridTopPadding"
                    type="range"
                    min="10"
                    max="100"
                    value={tempSettings.scatter?.gridTopPadding ?? 40}
                    onChange={(e) => setTempSettings((prev) => ({
                      ...prev,
                      scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), gridTopPadding: parseInt(e.target.value) },
                    }))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12 text-right">{tempSettings.scatter?.gridTopPadding ?? 40}</span>
                </div>
                <p className="text-sm text-muted-foreground">Space for legend if enabled</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gridBottomPadding">Bottom Padding (px)</Label>
                <div className="flex items-center gap-3">
                  <input
                    id="gridBottomPadding"
                    type="range"
                    min="20"
                    max="150"
                    value={tempSettings.scatter?.gridBottomPadding ?? 50}
                    onChange={(e) => setTempSettings((prev) => ({
                      ...prev,
                      scatter: { ...(prev.scatter || DEFAULT_SETTINGS.scatter!), gridBottomPadding: parseInt(e.target.value) },
                    }))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12 text-right">{tempSettings.scatter?.gridBottomPadding ?? 50}</span>
                </div>
                <p className="text-sm text-muted-foreground">Space for X-axis labels and zoom control</p>
              </div>
            </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
