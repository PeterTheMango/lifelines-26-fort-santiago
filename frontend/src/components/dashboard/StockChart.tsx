"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Layers } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchInventory } from "@/lib/api";

// Colors from V2 Design System


export function StockChart() {
    const [data, setData] = useState<{ name: string; value: number; color: string }[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                const inventory = await fetchInventory();

                // Aggregate data by category
                const categoryMap: Record<string, number> = {};
                inventory.forEach(item => {
                    const cat = item.category || "Other";
                    // Capitalize first letter
                    const catLabel = cat.charAt(0).toUpperCase() + cat.slice(1);
                    categoryMap[catLabel] = (categoryMap[catLabel] || 0) + item.currentAmount;
                });

                // Map standard categories to colors
                const colorMap: Record<string, string> = {
                    "Construction": "#6B8B6F",
                    "Water": "#60A5FA",
                    "Fuel": "#FBBF24",
                    "Medical": "#F87171",
                    "Food": "#fbbf24",
                    "Other": "#A7C4AA"
                };

                const chartData = Object.entries(categoryMap).map(([name, value]) => ({
                    name,
                    value,
                    color: colorMap[name] || "#A7C4AA" // Default color
                }));

                setData(chartData);
            } catch (error) {
                console.error("Failed to load chart data:", error);
            }
        }
        loadData();
    }, []);

    if (data.length === 0) {
        return (
            <Card className="h-full flex flex-col group hover:border-border transition-colors">
                <CardHeader className="border-none pb-3">
                    <CardTitle className="text-sm uppercase tracking-wider text-text-secondary flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" />
                        Resource Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-[250px] flex items-center justify-center text-text-muted">
                    Loading data...
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col group hover:border-border transition-colors">
            <CardHeader className="border-none pb-3">
                <CardTitle className="text-sm uppercase tracking-wider text-text-secondary flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    Resource Distribution
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[250px] p-4 pt-0">
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
                            contentStyle={{
                                backgroundColor: '#1E2D21',
                                borderColor: '#3D5442',
                                color: '#E8F5E9',
                                borderRadius: '12px',
                                padding: '8px 12px',
                                fontSize: '12px',
                                fontFamily: 'var(--font-mono)'
                            }}
                            itemStyle={{ color: '#E8F5E9' }}
                            formatter={(value: any) => [`${value.toFixed(1)}`, '']}
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
