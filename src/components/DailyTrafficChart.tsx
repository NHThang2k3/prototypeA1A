// src/components/DailyTrafficChart.tsx
import  { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { subscribeToDailyStats } from '../services/TrafficService';

const DailyTrafficChart = () => {
  const [chartData, setChartData] = useState<number[]>(new Array(24).fill(0));
  const [totalVisits, setTotalVisits] = useState(0);

  useEffect(() => {
    // Kết nối Firebase Listener
    const unsubscribe = subscribeToDailyStats((data, total) => {
      setChartData(data);
      setTotalVisits(total);
    });

    // Cleanup khi component unmount
    return () => unsubscribe();
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const option = {
    color: ['#60a5fa'],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(22, 33, 62, 0.95)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      textStyle: { color: '#fff' },
      formatter: (params: any) => {
        const item = params[0];
        return `
          <div style="font-weight: bold; margin-bottom: 4px;">🕐 ${item.name}</div>
          <div style="color: #60a5fa;">👥 Lượt xem: <span style="color: #fff; font-size: 14px;">${item.value}</span></div>
        `;
      }
    },
    grid: {
      left: '2%', right: '3%', bottom: '3%', top: '15%', containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: hours,
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' }
      },
      axisLabel: { color: '#9ca3af' }
    },
    series: [
      {
        name: 'Traffic',
        type: 'line',
        smooth: 0.3,
        showSymbol: false,
        symbolSize: 8,
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(96, 165, 250, 0.5)',
          shadowBlur: 15
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.0)' }
          ])
        },
        data: chartData
      }
    ]
  };

  return (
    <div className="bg-[#16213e]/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-black/20 border border-white/10 animate-fade-in hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center mr-3">
            <span className="text-xl text-white">📊</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Thống kê truy cập</h2>
            <p className="text-gray-400 text-xs">Dữ liệu thực tế hôm nay</p>
          </div>
        </div>
        
        <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-right min-w-[100px]">
           <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Tổng lượt xem</p>
           <p className="text-2xl font-bold text-blue-400 leading-none mt-1">{totalVisits}</p>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ReactECharts 
          option={option} 
          style={{ height: '100%', width: '100%' }} 
          theme="dark"
          opts={{ renderer: 'svg' }}
        />
      </div>
    </div>
  );
};

export default DailyTrafficChart;