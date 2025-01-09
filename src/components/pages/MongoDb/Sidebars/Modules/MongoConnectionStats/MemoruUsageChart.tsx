import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { IMongoConnectionServerStats } from "@shared";
import { useTheme } from "@mui/material";

export const MemoryUsageChart: React.FC<
  IMongoConnectionServerStats["memory"]
> = ({ total: _total, used, free }) => {
  const theme = useTheme();
  const data = [
    {
      name: "Memory",
      Used: used / _total,
      Free: free / _total,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={10}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        stackOffset="wiggle"
      >
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" hide />
        <Bar dataKey="Used" stackId="a" fill={theme.palette.primary.dark} />
        <Bar dataKey="Free" stackId="a" fill={theme.palette.primary.main} />
      </BarChart>
    </ResponsiveContainer>
  );
};
