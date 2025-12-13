"use client";

import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getCountryCodeByName, getCountryFlag } from "./supplier-form.utils";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
  "#f97316",
  "#06b6d4",
  "#84cc16",
  "#d946ef",
  "#64748b",
  "#a855f7",
  "#e11d48",
];

interface CountryDistributionChartProps {
  data: Record<string, number>;
}

export const CountryDistributionChart = ({
  data,
}: CountryDistributionChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    const total = Object.values(data).reduce((sum, count) => sum + count, 0);
    const transformed = Object.entries(data).map(([country, count]) => {
      const code = getCountryCodeByName(country);
      return {
        country,
        count,
        flag: code ? getCountryFlag(code) : undefined,
      };
    });
    return transformed
      .sort((a, b) => b.count - a.count)
      .map((item, index) => ({
        ...item,
        percentage:
          total > 0 ? Number(((item.count / total) * 100).toFixed(1)) : 0,
        percentageDisplay:
          total > 0 ? ((item.count / total) * 100).toFixed(1) : "0",
        fill: COLORS[index % COLORS.length],
      }));
  }, [data]);

  const totalEntries = Object.values(data).reduce((acc, curr) => acc + curr, 0);

  if (totalEntries === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex h-[300px] items-center justify-center text-muted-foreground">
          No country data available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution across {chartData.length} countries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <div className="h-[310px] w-full hidden xl:block">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <XAxis
                  dataKey="country"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tickFormatter={(value) => `${value}%`} width={40} />
                <Bar
                  dataKey="percentage"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`bar-cell-${index}`}
                      fill={entry.fill}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        "cursor-pointer transition-opacity duration-300",
                        activeIndex !== null && activeIndex !== index
                          ? "opacity-30"
                          : "opacity-100"
                      )}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[310px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  dataKey="count"
                  isAnimationActive={false}
                  onMouseLeave={() => setActiveIndex(null)}
                  label={(props) => {
                    const value = chartData[props.index]?.percentage;
                    return value > 4 ? `${value}%` : "";
                  }}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`pie-cell-${index}`}
                      fill={entry.fill}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        "cursor-pointer transition-opacity duration-300",
                        activeIndex !== null && activeIndex !== index
                          ? "opacity-30"
                          : "opacity-100"
                      )}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <ScrollArea className="h-[310px] w-full">
              <table className="w-full min-w-[310px] text-sm">
                <thead className="bg-card sticky top-0 z-10">
                  <tr className="border-b">
                    <th className="p-3 text-left font-medium text-muted-foreground">
                      Country
                    </th>
                    <th className="p-3 text-right font-medium text-muted-foreground">
                      Count
                    </th>
                    <th className="p-3 text-right font-medium text-muted-foreground">
                      Share
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item, index) => (
                    <CountryRow
                      key={item.country}
                      item={item}
                      index={index}
                      isActive={activeIndex === index}
                      onHover={setActiveIndex}
                    />
                  ))}
                </tbody>
              </table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface CountryRowProps {
  item: {
    country: string;
    count: number;
    percentageDisplay: string;
    fill: string;
    flag: string | undefined;
  };
  isActive: boolean;
  onHover: (index: number | null) => void;
  index: number;
}

export const CountryRow = ({
  item,
  isActive,
  onHover,
  index,
}: CountryRowProps) => {
  return (
    <tr
      className={cn(
        "border-b last:border-0 transition-colors duration-200 cursor-pointer",
        isActive ? "bg-muted/60" : "hover:bg-muted/30"
      )}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      <td className="p-3">
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full shrink-0"
            style={{ backgroundColor: item.fill }}
          />
          <span className="text-lg leading-none">{item.flag}</span>
          <span
            className="font-medium truncate max-w-[120px]"
            title={item.country}
          >
            {item.country}
          </span>
        </div>
      </td>
      <td className="p-3 text-right font-medium tabular-nums">{item.count}</td>
      <td className="p-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <div className="w-16 h-1.5 bg-muted rounded-full">
            <div
              className="h-full rounded-full"
              style={{
                width: `${item.percentageDisplay}%`,
                backgroundColor: item.fill,
              }}
            />
          </div>
          <span className="w-10 text-xs text-muted-foreground text-right">
            {item.percentageDisplay}%
          </span>
        </div>
      </td>
    </tr>
  );
};
