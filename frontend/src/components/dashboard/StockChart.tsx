"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";

// Colors from V2 Design System
const data = [
    { name: "Concrete", value: 400, color: "#6B8B6F" }, // Text Muted (Slate-ish green)
    { name: "Timber", value: 300, color: "#FBBF24" },  // Warning (Amber)
    { name: "Metal", value: 200, color: "#A7C4AA" },   // Text Secondary (Sage)
    { name: "Water", value: 550, color: "#60A5FA" },   // Info (Blue)
    { name: "Glass", value: 120, color: "#2DD4BF" },   // Primary (Teal)
];

export function StockChart() {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="border-none pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-text-secondary">Resource Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[250px] p-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1E2D21', borderColor: '#3D5442', color: '#E8F5E9', borderRadius: '0.75rem' }}
                            itemStyle={{ color: '#E8F5E9' }}
                            formatter={(value: any) => [`${value} units`, '']}
                        />
                        <Legend
                            verticalAlign="middle"
                            align="right"
                            layout="vertical"
                            iconType="circle"
                            formatter={(value) => <span className="text-text-secondary text-sm">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
