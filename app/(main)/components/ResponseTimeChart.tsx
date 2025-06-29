import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { ResponseTimeChartProps } from '@/app/types';
import { useThemeStore } from '@/app/store/themeStore';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ResponseTimeChart({
  data,
  selectedUsername,
  isDataPending,
}: ResponseTimeChartProps) {
  const theme = useThemeStore((state) => state.theme);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const systemDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (theme === 'dark') {
      setIsDark(true);
    } else if (theme === 'light') {
      setIsDark(false);
    } else if (theme === 'system') {
      setIsDark(systemDark);
    }

    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const handle = (e: MediaQueryListEvent) => {
        if (theme === 'system') {
          setIsDark(e.matches);
        }
      };
      mql.addEventListener('change', handle);
      return () => mql.removeEventListener('change', handle);
    }
  }, [theme]);

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
      background: '#fff0',
    },
    colors: ['#6366f1'],
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
          colors: isDark ? '#f3f4f6' : '#374151', // gray-100 for dark, gray-700 for light
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
        style: {
          color: isDark ? '#f3f4f6' : '#374151', // gray-100 for dark, gray-700 for light
          fontSize: '14px',
          fontWeight: 600,
        },
      },
      labels: {
        formatter: (value) => {
          return value.toLocaleString();
        },
        style: {
          colors: isDark ? '#f3f4f6' : '#374151', // gray-100 for dark, gray-700 for light
        },
      },
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: (value) => {
          return `${value.toLocaleString()} ms`;
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    theme: {
      mode: isDark ? 'dark' : 'light',
      palette: 'palette1',
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
