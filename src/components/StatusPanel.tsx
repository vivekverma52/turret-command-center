import { LucideIcon } from "lucide-react";
import NumberFlow from "@number-flow/react";

interface StatusItem {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
}

interface StatusPanelProps {
  items: StatusItem[];
}

const StatusPanel = ({ items }: StatusPanelProps) => {
  return (
    <div className="card-tactical rounded-lg p-4 md:p-6">
      <div className="flex flex-wrap justify-between gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex-1 min-w-[120px] text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-[10px] md:text-xs uppercase tracking-wider mb-2">
              <item.icon className={`w-3 h-3 md:w-4 md:h-4 ${item.iconColor || "text-primary"}`} />
              {item.label}
            </div>
            <p className={`font-display text-2xl md:text-3xl font-bold ${item.valueColor || "text-primary"}`}>
              {typeof item.value === "number" ? (
                <NumberFlow value={item.value} />
              ) : (
                item.value
              )}
              {item.subValue && (
                <span className="text-lg text-muted-foreground">{item.subValue}</span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusPanel;
