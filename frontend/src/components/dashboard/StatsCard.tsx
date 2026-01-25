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
        <Card className="relative overflow-hidden group">
            <CardContent className="flex items-start justify-between p-5">
                <div className="z-10">
                    <p className="text-sm font-medium text-text-secondary uppercase tracking-wider">{title}</p>
                    <div className="mt-2 flex items-baseline">
                        <p className="text-3xl font-bold font-mono text-text-primary">{value}</p>
                        <p className="ml-2 text-sm text-text-muted">{label}</p>
                    </div>
                </div>

                <div className={clsx(
                    "p-3 rounded-lg border group-hover:scale-110 transition-transform",
                    status === "critical" && "text-danger bg-danger/10 border-danger/20",
                    status === "warning" && "text-warning bg-warning/10 border-warning/20",
                    status === "normal" && "text-primary bg-primary/10 border-primary/20",
                )}>
                    <Icon className="h-6 w-6" />
                </div>

                {status === "critical" && (
                    <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-danger animate-ping m-2" />
                )}
            </CardContent>
        </Card>
    );
}
