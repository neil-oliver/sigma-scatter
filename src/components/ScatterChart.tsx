import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { processScatterData, buildEChartsOptions } from '../lib/chartUtils';
import { ScatterSettings } from '../types/sigma';

interface ScatterChartProps {
  xData: (string | number | boolean | null)[];
  yData: (string | number | boolean | null)[];
  labelData: (string | number | boolean | null)[];
  imageData?: (string | number | boolean | null)[];
  settings: ScatterSettings;
  xColumnName?: string;
  yColumnName?: string;
  width?: string | number;
  height?: string | number;
}

const ScatterChart: React.FC<ScatterChartProps> = ({
  xData,
  yData,
  labelData,
  imageData,
  settings,
  xColumnName,
  yColumnName,
  width = '100%',
  height = '100%',
}) => {
  // Process data and build options
  const chartOption = useMemo(() => {
    const processedData = processScatterData(
      xData,
      yData,
      labelData,
      imageData,
      settings
    );

    // Use column names if provided, otherwise fall back to settings
    const effectiveSettings = {
      ...settings,
      xAxisLabel: xColumnName || settings.xAxisLabel,
      yAxisLabel: yColumnName || settings.yAxisLabel,
    };

    return buildEChartsOptions(processedData, effectiveSettings);
  }, [xData, yData, labelData, imageData, settings, xColumnName, yColumnName]);

  // Handle empty data
  if (!xData.length || !yData.length) {
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p className="text-muted-foreground">
            Please ensure your data source contains valid numeric values.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ReactECharts
      option={chartOption}
      style={{ width, height }}
      opts={{
        renderer: 'canvas',
        locale: 'EN',
      }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};

export default ScatterChart;

