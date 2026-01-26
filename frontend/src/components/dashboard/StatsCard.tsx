import { clsx } from "clsx";
import { DivideIcon as LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/Card";

interface StatsCardProps {
    title: string;
    value: string | number;
    label: string;
    icon: typeof LucideIcon;
    status?: "normal" | "warning" | "critical";
}

export function StatsCard({ title, value, label, icon: Icon, status = "normal" }: StatsCardProps) {
    return (
        <Card className="relative overflow-hidden group hover:border-border transition-all duration-200">
            <CardContent className="flex items-start justify-between p-4">
                <div className="z-10 flex-1">
                    <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                        {title}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold font-mono text-text-primary leading-none">
                            {value}
                        </p>
                    </div>
                    <p className="mt-1.5 text-xs text-text-muted">{label}</p>
                </div>

                <div className={clsx(
                    "p-2.5 rounded-lg border transition-all duration-200 group-hover:scale-110",
                    status === "critical" && "text-danger bg-danger/10 border-danger/20 animate-pulse-warning",
                    status === "warning" && "text-warning bg-warning/10 border-warning/20",
                    status === "normal" && "text-primary bg-primary/10 border-primary/20",
                )}>
                    <Icon className="h-5 w-5" />
                </div>

                {status === "critical" && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger animate-pulse-active" />
                )}

                {status === "warning" && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-warning animate-pulse-slow" />
                )}
            </CardContent>
        </Card>
    );
}
