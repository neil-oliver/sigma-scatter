import { ScatterDataPoint, ProcessedScatterData, EChartsScatterOption } from '../types/scatter';
import { ScatterSettings } from '../types/sigma';

/**
 * Validates if a string is a valid URL
 */
export function validateImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Determines symbol configuration for a data point
 */
export function getSymbolConfig(
  imageUrl: string | null | undefined,
  settings: ScatterSettings
): { symbol: string; symbolSize: number } {
  if (validateImageUrl(imageUrl)) {
    return {
      symbol: `image://${imageUrl}`,
      symbolSize: settings.imageSize,
    };
  }
  return {
    symbol: 'circle',
    symbolSize: settings.pointSize,
  };
}

/**
 * Processes Sigma column data into ECharts scatter format
 */
export function processScatterData(
  xData: (string | number | boolean | null)[],
  yData: (string | number | boolean | null)[],
  labelData: (string | number | boolean | null)[],
  imageData: (string | number | boolean | null)[] | undefined,
  settings: ScatterSettings
): ProcessedScatterData {
  const dataPoints: ScatterDataPoint[] = [];
  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;
  let hasImages = false;

  const rowCount = Math.min(xData.length, yData.length, labelData.length);

  for (let i = 0; i < rowCount; i++) {
    const xVal = xData[i];
    const yVal = yData[i];
    const label = labelData[i];
    const imageUrl = imageData?.[i];

    // Convert to numbers, skip invalid data
    const x = typeof xVal === 'number' ? xVal : parseFloat(String(xVal));
    const y = typeof yVal === 'number' ? yVal : parseFloat(String(yVal));

    if (isNaN(x) || isNaN(y)) continue;

    // Update min/max
    xMin = Math.min(xMin, x);
    xMax = Math.max(xMax, x);
    yMin = Math.min(yMin, y);
    yMax = Math.max(yMax, y);

    // Get symbol configuration
    const symbolConfig = getSymbolConfig(
      typeof imageUrl === 'string' ? imageUrl : null,
      settings
    );

    if (symbolConfig.symbol.startsWith('image://')) {
      hasImages = true;
    }

    dataPoints.push({
      x,
      y,
      label: String(label ?? `Point ${i + 1}`),
      imageUrl: typeof imageUrl === 'string' ? imageUrl : undefined,
      value: [x, y],
      symbol: symbolConfig.symbol,
      symbolSize: symbolConfig.symbolSize,
    });
  }

  return {
    data: dataPoints,
    xMin: isFinite(xMin) ? xMin : 0,
    xMax: isFinite(xMax) ? xMax : 100,
    yMin: isFinite(yMin) ? yMin : 0,
    yMax: isFinite(yMax) ? yMax : 100,
    hasImages,
  };
}

/**
 * Builds complete ECharts options object
 */
export function buildEChartsOptions(
  processedData: ProcessedScatterData,
  settings: ScatterSettings
): EChartsScatterOption {
  const { data } = processedData;

  const fontFamily = settings.fontFamily || 'Geist';
  
  // Calculate dynamic padding based on enabled features
  // Base padding from settings
  let leftPadding = settings.gridLeftPadding || 60;
  let rightPadding = settings.gridRightPadding || 20;
  let topPadding = settings.gridTopPadding || 40;
  let bottomPadding = settings.gridBottomPadding || 50;

  // Add space for Y-axis dataZoom control (left side)
  if (settings.enableYDataZoom) {
    leftPadding = Math.max(leftPadding, leftPadding + 30);
  }

  // Add space for X-axis dataZoom control (bottom)
  if (settings.enableXDataZoom) {
    bottomPadding = Math.max(bottomPadding, bottomPadding + 30);
  }

  // Add space for legend if enabled
  if (settings.showLegend) {
    const legendPos = settings.legendPosition;
    if (legendPos === 'top') {
      topPadding = Math.max(topPadding, topPadding + 20);
    } else if (legendPos === 'bottom') {
      bottomPadding = Math.max(bottomPadding, bottomPadding + 20);
    } else if (legendPos === 'left') {
      leftPadding = Math.max(leftPadding, leftPadding + 80);
    } else if (legendPos === 'right') {
      rightPadding = Math.max(rightPadding, rightPadding + 80);
    }
  }
  
  const option: EChartsScatterOption = {
    backgroundColor: settings.backgroundColor,
    animation: settings.enableAnimation,
    animationDuration: settings.animationDuration,
    tooltip: settings.enableTooltip
      ? {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          borderColor: 'rgba(0, 0, 0, 0.08)',
          borderWidth: 1,
          borderRadius: 12,
          padding: 0,
          textStyle: {
            color: '#1e293b',
            fontSize: 13,
            fontFamily: fontFamily,
          },
          shadowBlur: 16,
          shadowColor: 'rgba(0, 0, 0, 0.12)',
          shadowOffsetX: 0,
          shadowOffsetY: 4,
          formatter: (params: any) => {
            const point = params.data as ScatterDataPoint;
            const xLabel = settings.xAxisLabel || 'X';
            const yLabel = settings.yAxisLabel || 'Y';
            const pointColor = params.color || settings.pointColor || '#3b82f6';
            
            return `
              <div style="
                min-width: 180px;
                font-family: ${fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              ">
                <div style="
                  padding: 12px 14px 10px;
                  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
                  background: linear-gradient(180deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%);
                  border-radius: 12px 12px 0 0;
                ">
                  <div style="
                    font-size: 14px;
                    font-weight: 600;
                    color: #0f172a;
                    letter-spacing: -0.01em;
                  ">${point.label}</div>
                </div>
                <div style="padding: 10px 14px 12px;">
                  <div style="display: flex; align-items: center; margin-bottom: 6px;">
                    <span style="
                      display: inline-block;
                      width: 10px;
                      height: 10px;
                      background: ${pointColor};
                      border-radius: 2px;
                      margin-right: 8px;
                      flex-shrink: 0;
                    "></span>
                    <span style="
                      color: #64748b;
                      font-size: 13px;
                      margin-right: 6px;
                    ">${xLabel}</span>
                    <span style="
                      color: #0f172a;
                      font-weight: 600;
                      font-size: 14px;
                      margin-left: auto;
                    ">${typeof point.x === 'number' ? point.x.toLocaleString() : point.x}</span>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <span style="
                      display: inline-block;
                      width: 10px;
                      height: 10px;
                      background: ${pointColor};
                      border-radius: 2px;
                      margin-right: 8px;
                      flex-shrink: 0;
                      opacity: 0.7;
                    "></span>
                    <span style="
                      color: #64748b;
                      font-size: 13px;
                      margin-right: 6px;
                    ">${yLabel}</span>
                    <span style="
                      color: #0f172a;
                      font-weight: 600;
                      font-size: 14px;
                      margin-left: auto;
                    ">${typeof point.y === 'number' ? point.y.toLocaleString() : point.y}</span>
                  </div>
                </div>
              </div>
            `;
          },
        }
      : undefined,
    grid: {
      left: leftPadding,
      right: rightPadding,
      top: topPadding,
      bottom: bottomPadding,
      containLabel: true,
      show: settings.showGridLines,
      borderWidth: 0,
      backgroundColor: 'transparent',
    },
    xAxis: {
      type: 'value',
      name: settings.showAxisLabels ? (settings.xAxisLabel || 'X Axis') : '',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        fontFamily: fontFamily,
        fontSize: 14,
      },
      axisLabel: {
        fontFamily: fontFamily,
      },
      splitLine: {
        show: settings.showGridLines,
        lineStyle: {
          opacity: settings.gridOpacity,
        },
      },
    },
    yAxis: {
      type: 'value',
      name: settings.showAxisLabels ? (settings.yAxisLabel || 'Y Axis') : '',
      nameLocation: 'middle',
      nameGap: 40,
      nameTextStyle: {
        fontFamily: fontFamily,
        fontSize: 14,
      },
      axisLabel: {
        fontFamily: fontFamily,
      },
      splitLine: {
        show: settings.showGridLines,
        lineStyle: {
          opacity: settings.gridOpacity,
        },
      },
    },
    series: [
      {
        type: 'scatter',
        data: data,
        itemStyle: {
          color: settings.pointColor,
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderColor: '#333',
            borderWidth: 2,
          },
        },
      },
    ],
  };

  // Add dataZoom components if enabled
  const dataZoom: any[] = [];
  
  if (settings.enableXDataZoom) {
    dataZoom.push({
      type: 'slider',
      xAxisIndex: 0,
      filterMode: 'none',
      bottom: 5,
      height: 20,
    });
  }

  if (settings.enableYDataZoom) {
    dataZoom.push({
      type: 'slider',
      yAxisIndex: 0,
      filterMode: 'none',
      left: 5,
      width: 20,
    });
  }

  if (dataZoom.length > 0) {
    option.dataZoom = dataZoom;
  }

  // Add legend if enabled
  if (settings.showLegend) {
    option.legend = {
      show: true,
      [settings.legendPosition]: '5%',
      data: ['Data Points'],
      textStyle: {
        fontFamily: fontFamily,
      },
    };
  }

  return option;
}

