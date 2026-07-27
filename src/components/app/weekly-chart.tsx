"use client";

import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";

interface WeeklyChartProps {
  data: { day: string; minutes: number; xp: number }[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(240 4% 46%)" }} />
          <Tooltip
            cursor={{ fill: "hsl(240 5% 96% / 0.6)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid hsl(240 6% 90%)",
              fontSize: 12,
              boxShadow: "0 8px 24px -8px rgb(0 0 0 / 0.12)",
            }}
            formatter={(value: number, name: string) => [name === "minutes" ? `${value} min` : `${value} XP`, name === "minutes" ? "Study time" : "XP"]}
          />
          <Bar dataKey="minutes" radius={[6, 6, 2, 2]} fill="#de9423" maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
