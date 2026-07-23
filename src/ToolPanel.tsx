import React, { useState, useCallback, useMemo } from 'react';
import { ArrowRightLeft, Ruler, Thermometer, Weight, FlaskConical, Copy, Check } from 'lucide-react';

interface Unit {
  value: string;
  label: string;
}

type ConversionType = 'length' | 'temperature' | 'weight' | 'volume';

const PRIMARY_COLOR = '#059669';

const conversionCategories: { type: ConversionType; label: string; icon: React.ReactNode }[] = [
  { type: 'length', label: '长度', icon: <Ruler className="w-4 h-4" /> },
  { type: 'temperature', label: '温度', icon: <Thermometer className="w-4 h-4" /> },
  { type: 'weight', label: '重量', icon: <Weight className="w-4 h-4" /> },
  { type: 'volume', label: '体积', icon: <FlaskConical className="w-4 h-4" /> },
];

const lengthUnits: Unit[] = [
  { value: 'm', label: '米 (m)' },
  { value: 'km', label: '千米 (km)' },
  { value: 'cm', label: '厘米 (cm)' },
  { value: 'mm', label: '毫米 (mm)' },
  { value: 'ft', label: '英尺 (ft)' },
  { value: 'in', label: '英寸 (in)' },
  { value: 'yd', label: '码 (yd)' },
  { value: 'mi', label: '英里 (mi)' },
];

const temperatureUnits: Unit[] = [
  { value: 'c', label: '摄氏度 (°C)' },
  { value: 'f', label: '华氏度 (°F)' },
  { value: 'k', label: '开尔文 (K)' },
];

const weightUnits: Unit[] = [
  { value: 'kg', label: '千克 (kg)' },
  { value: 'g', label: '克 (g)' },
  { value: 'mg', label: '毫克 (mg)' },
  { value: 't', label: '吨 (t)' },
  { value: 'lb', label: '磅 (lb)' },
  { value: 'oz', label: '盎司 (oz)' },
];

const volumeUnits: Unit[] = [
  { value: 'l', label: '升 (L)' },
  { value: 'ml', label: '毫升 (mL)' },
  { value: 'm3', label: '立方米 (m³)' },
  { value: 'cm3', label: '立方厘米 (cm³)' },
  { value: 'gal', label: '加仑 (gal)' },
  { value: 'qt', label: '夸脱 (qt)' },
  { value: 'pt', label: '品脱 (pt)' },
];

const getUnits = (type: ConversionType): Unit[] => {
  switch (type) {
    case 'length': return lengthUnits;
    case 'temperature': return temperatureUnits;
    case 'weight': return weightUnits;
    case 'volume': return volumeUnits;
    default: return lengthUnits;
  }
};

const convertLength = (value: number, from: string, to: string): number => {
  const toMeters: Record<string, number> = {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    ft: 0.3048,
    in: 0.0254,
    yd: 0.9144,
    mi: 1609.34,
  };
  const meters = value * toMeters[from];
  return meters / toMeters[to];
};

const convertTemperature = (value: number, from: string, to: string): number => {
  if (from === to) return value;
  
  let celsius: number;
  switch (from) {
    case 'c': celsius = value; break;
    case 'f': celsius = (value - 32) * 5 / 9; break;
    case 'k': celsius = value - 273.15; break;
    default: celsius = value;
  }
  
  switch (to) {
    case 'c': return celsius;
    case 'f': return celsius * 9 / 5 + 32;
    case 'k': return celsius + 273.15;
    default: return celsius;
  }
};

const convertWeight = (value: number, from: string, to: string): number => {
  const toGrams: Record<string, number> = {
    kg: 1000,
    g: 1,
    mg: 0.001,
    t: 1000000,
    lb: 453.592,
    oz: 28.3495,
  };
  const grams = value * toGrams[from];
  return grams / toGrams[to];
};

const convertVolume = (value: number, from: string, to: string): number => {
  const toLiters: Record<string, number> = {
    l: 1,
    ml: 0.001,
    m3: 1000,
    cm3: 0.001,
    gal: 3.78541,
    qt: 0.946353,
    pt: 0.473176,
  };
  const liters = value * toLiters[from];
  return liters / toLiters[to];
};

const convert = (value: number, from: string, to: string, type: ConversionType): number => {
  switch (type) {
    case 'length': return convertLength(value, from, to);
    case 'temperature': return convertTemperature(value, from, to);
    case 'weight': return convertWeight(value, from, to);
    case 'volume': return convertVolume(value, from, to);
    default: return value;
  }
};

const formatNumber = (value: number): string => {
  if (isNaN(value)) return '';
  if (Math.abs(value) < 0.000001 && value !== 0) {
    return value.toExponential(6);
  }
  if (Math.abs(value) >= 1000000) {
    return value.toExponential(6);
  }
  return value.toLocaleString('zh-CN', {
    maximumFractionDigits: 10,
    minimumFractionDigits: 0,
  });
};

const ToolPanel: React.FC = () => {
  const [conversionType, setConversionType] = useState<ConversionType>('length');
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [copied, setCopied] = useState(false);

  const currentUnits = useMemo(() => getUnits(conversionType), [conversionType]);

  const result = useMemo(() => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) return '';
    const converted = convert(numValue, fromUnit, toUnit, conversionType);
    return formatNumber(converted);
  }, [inputValue, fromUnit, toUnit, conversionType]);

  const handleSwap = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }, [fromUnit, toUnit]);

  const handleClear = useCallback(() => {
    setInputValue('');
  }, []);

  const handleConversionTypeChange = useCallback((type: ConversionType) => {
    setConversionType(type);
    const units = getUnits(type);
    setFromUnit(units[0].value);
    setToUnit(units.length > 1 ? units[1].value : units[0].value);
    setInputValue('');
  }, []);

  const handleCopyResult = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  }, [result]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ backgroundColor: `${PRIMARY_COLOR}1A` }}>
          <ArrowRightLeft className="w-4 h-4" style={{ color: PRIMARY_COLOR }} />
        </div>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">单位换算</h2>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {conversionCategories.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => handleConversionTypeChange(type)}
            className={`flex-1 flex flex-col items-center gap-0.5 px-2 py-2 transition-colors ${
              conversionType === type
                ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {icon}
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              输入值
            </label>
            <div className="flex gap-1.5">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-base font-medium focus:outline-none focus:border-green-500"
                placeholder="数值"
              />
              <button
                onClick={handleClear}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs font-medium text-gray-600 dark:text-gray-300"
                title="清除"
              >
                清除
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                从
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:border-green-500"
              >
                {currentUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSwap}
              className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="交换单位"
            >
              <ArrowRightLeft className="w-4 h-4" style={{ color: PRIMARY_COLOR }} />
            </button>

            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                到
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:border-green-500"
              >
                {currentUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              结果
            </label>
            <div className="flex items-center justify-between px-3 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex-1">
                <div className="text-lg font-bold" style={{ color: PRIMARY_COLOR }}>
                  {result || '-'}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {currentUnits.find((u) => u.value === toUnit)?.label}
                </div>
              </div>
              <button
                onClick={handleCopyResult}
                className="ml-3 p-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                title="复制结果"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {inputValue && result && (
            <div className="text-center text-xs text-gray-400 dark:text-gray-500">
              {inputValue} {currentUnits.find((u) => u.value === fromUnit)?.label.split(' ')[0]}
              {' = '}
              {result} {currentUnits.find((u) => u.value === toUnit)?.label.split(' ')[0]}
            </div>
          )}
        </div>
      </div>

      <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <span>实时换算</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full" />
          <span>支持多单位转换</span>
        </div>
      </div>
    </div>
  );
};

export default ToolPanel;