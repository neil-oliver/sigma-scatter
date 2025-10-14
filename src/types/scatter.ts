// Scatter plot data types

export interface ScatterDataPoint {
  x: number;
  y: number;
  label: string;
  imageUrl?: string;
  value: [number, number]; // [x, y] for ECharts
  symbol?: string; // 'circle' or 'image://url'
  symbolSize?: number;
}

export interface ProcessedScatterData {
  data: ScatterDataPoint[];
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  hasImages: boolean;
}

export interface EChartsScatterOption {
  backgroundColor?: string;
  tooltip?: any;
  grid?: any;
  xAxis?: any;
  yAxis?: any;
  dataZoom?: any[];
  series?: any[];
  animation?: boolean;
  animationDuration?: number;
  legend?: any;
}

