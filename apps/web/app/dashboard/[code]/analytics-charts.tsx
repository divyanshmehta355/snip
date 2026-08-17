"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function AnalyticsCharts({ data }: { data: any }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="col-span-full rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="font-medium text-lg mb-6">Clicks over time (Last 7 Days)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: "#e5e7eb" }} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" tick={{ fill: "#e5e7eb" }} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "8px", color: "#f9fafb" }}
                itemStyle={{ color: "#f9fafb" }}
                labelStyle={{ color: "#9ca3af" }}
              />
              <Area type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="font-medium text-lg mb-6">Top Referrers</h3>
        <div className="h-[250px] w-full">
          {data.topReferrers.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No referrer data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topReferrers} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#e5e7eb" }} stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  cursor={{ fill: "#374151" }}
                  contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "8px", color: "#f9fafb" }}
                  itemStyle={{ color: "#f9fafb" }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="font-medium text-lg mb-6">Browsers</h3>
        <div className="h-[250px] w-full flex items-center justify-center">
          {data.topBrowsers.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No browser data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.topBrowsers}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.topBrowsers.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "8px", color: "#f9fafb" }}
                  itemStyle={{ color: "#f9fafb" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
          {data.topBrowsers.map((entry: any, index: number) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              <span className="text-gray-200">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="font-medium text-lg mb-6">Operating Systems</h3>
        <div className="h-[250px] w-full flex items-center justify-center">
          {data.topOs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No OS data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.topOs}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.topOs.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "8px", color: "#f9fafb" }}
                  itemStyle={{ color: "#f9fafb" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
          {data.topOs.map((entry: any, index: number) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }}></div>
              <span className="text-gray-200">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
