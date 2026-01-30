import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface ToggleGroupOption {
    value: string;
    label: string;
}

interface ToggleGroupProps {
    options: ToggleGroupOption[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
    className?: string;
}

export function ToggleGroup({ options, value, onChange, label, className }: ToggleGroupProps) {
    return (
        <div className={twMerge("space-y-2", className)}>
            {label && (
                <label className="text-xs text-text-muted uppercase tracking-wide font-medium">
                    {label}
                </label>
            )}
            <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const isActive = value === option.value;
                    return (
                        <button
                            key={option.value}
                            onClick={() => onChange(option.value)}
                            className={clsx(
                                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                "border border-border-default",
                                "hover:border-primary/50",
                                "focus:outline-none focus:ring-2 focus:ring-primary/30",
                                isActive
                                    ? "bg-primary text-text-inverse border-primary"
                                    : "bg-surface-elevated text-text-secondary hover:text-text-primary"
                            )}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
