import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { ResponseTimeChartProps } from '@/app/types';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ResponseTimeChart({
  data,
  selectedUsername,
  isDataPending,
}: ResponseTimeChartProps) {
  const filteredData = React.useMemo(() => {
    if (!data) return [];
    if (selectedUsername === 'all') return data;
    return data.filter((item) => item.USERNAME === selectedUsername);
  }, [data, selectedUsername]);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      animations: {
        enabled: false,
      },
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories:
        filteredData?.map((item) => {
          const month = new Date(item.CREATED_AT).getMonth() + 1;
          const day = new Date(item.CREATED_AT).getDate();
          const hour = new Date(item.CREATED_AT).getHours();

          return `${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}시`;
        }) || [],
      labels: {
        style: {
          fontSize: '12px',
        },
      },
      tickAmount: 15,
      tickPlacement: 'between',
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      title: {
        text: '응답 시간 (ms)',
      },
      labels: {
        formatter: (value) => {
          return value.toLocaleString();
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => {
          return `${value.toLocaleString()} ms`;
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  const series = [
    {
      name: '응답 시간(ms)',
      data:
        filteredData?.map((item) =>
          Math.round(item.TOTAL_DURATION / 1000000)
        ) || [],
    },
  ];

  if (isDataPending) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <div className="border-primary size-16 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  return (
    typeof window !== 'undefined' && (
      <Chart options={chartOptions} series={series} type="area" height={350} />
    )
  );
}
