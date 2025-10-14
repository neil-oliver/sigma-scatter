import React from 'react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { HelpCircle, Settings as SettingsIcon, ScatterChart as ScatterChartIcon, Database, ArrowRight, ArrowUp, Tag, Image } from 'lucide-react';

interface StepCardProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  complete?: boolean;
}

function StepCard({ icon: Icon, title, children, complete = false }: StepCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card text-card-foreground p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`h-9 w-9 rounded-md flex items-center justify-center border ${complete ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border-border'}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium leading-none">{title}</h4>
            {complete && (
              <Badge variant="secondary" className="text-[10px]">Configured</Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface OnboardingProps {
  hasSource: boolean;
  hasXColumn: boolean;
  hasYColumn: boolean;
  hasLabelColumn: boolean;
  hasImageColumn: boolean;
  editMode: boolean;
  onOpenSettings: () => void;
  onOpenHelp?: () => void;
}

function Onboarding({
  hasSource,
  hasXColumn,
  hasYColumn,
  hasLabelColumn,
  hasImageColumn,
  editMode,
  onOpenSettings,
  onOpenHelp,
}: OnboardingProps) {
  return (
    <div className="h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="rounded-xl border border-border bg-card text-card-foreground p-8 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ScatterChartIcon className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold tracking-tight">Sigma Scatter Plot</h2>
                <Badge variant="secondary">Setup</Badge>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Visualize your Sigma data as an interactive scatter plot with custom images or points. 
                Configure your data source and axis columns to get started.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {onOpenHelp && (
                <Button variant="outline" size="sm" className="gap-2" onClick={onOpenHelp}>
                  <HelpCircle className="h-4 w-4" />
                  Help
                </Button>
              )}
              <Button size="sm" className="gap-2" onClick={onOpenSettings} disabled={!editMode}>
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          {!editMode && (
            <div className="mt-4 rounded-md border border-border bg-muted/30 text-muted-foreground px-4 py-3 text-sm">
              Enable Edit Mode in the Sigma properties panel to open Settings and configure the plugin.
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <StepCard icon={Database} title="Choose Source" complete={hasSource}>
              Select a Sigma element as your data source. Each row will become a point on the scatter plot.
            </StepCard>
            <StepCard icon={ArrowRight} title="X-Axis Column" complete={hasXColumn}>
              Choose a numeric column for the horizontal (X) axis positioning.
            </StepCard>
            <StepCard icon={ArrowUp} title="Y-Axis Column" complete={hasYColumn}>
              Choose a numeric column for the vertical (Y) axis positioning.
            </StepCard>
            <StepCard icon={Tag} title="Label Column" complete={hasLabelColumn}>
              Select a column to display as labels and tooltips for each data point.
            </StepCard>
          </div>

          {(hasSource && hasXColumn && hasYColumn && hasLabelColumn) && (
            <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <Image className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Optional: Image Column</h4>
                  <p className="text-sm text-muted-foreground">
                    Add an <span className="font-medium">Image URL Column</span> to display custom images instead of circle points. 
                    {hasImageColumn ? (
                      <span className="text-primary"> ✓ Image column configured</span>
                    ) : (
                      <span> Not currently configured.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;

