"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

export function SkillRadar({ data }: { data: { skill: string; score: number }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="hsl(240 6% 90%)" strokeOpacity={0.5} />
          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "hsl(240 4% 46%)" }} />
          <Radar dataKey="score" stroke="#de9423" fill="#de9423" fillOpacity={0.35} strokeWidth={2} />
          <Tooltip
            formatter={(value: number) => [`${Math.round(value)}%`, "Score"]}
            contentStyle={{ borderRadius: 12, border: "1px solid hsl(240 6% 90%)", fontSize: 12 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MinutesBarChart({ data }: { data: { label: string; minutes: number }[] }) {
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(240 4% 46%)" }} interval="preserveStartEnd" />
          <Tooltip
            cursor={{ fill: "hsl(240 5% 96% / 0.6)" }}
            formatter={(value: number) => [`${value} min`, "Study time"]}
            contentStyle={{ borderRadius: 12, border: "1px solid hsl(240 6% 90%)", fontSize: 12 }}
          />
          <Bar dataKey="minutes" radius={[5, 5, 2, 2]} fill="#de9423" maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
