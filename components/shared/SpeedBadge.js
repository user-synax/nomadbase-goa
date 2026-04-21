import { cn } from "@/lib/utils";

export function SpeedBadge({ speed }) {
  let badgeColor, badgeText, icon;

  if (speed >= 150) {
    badgeColor = "bg-[#3ecf8e]/10 border-[#3ecf8e] text-[#3ecf8e]";
    badgeText = "Excellent";
    icon = "⚡";
  } else if (speed >= 80) {
    badgeColor = "bg-yellow-500/10 border-yellow-500 text-yellow-500";
    badgeText = "Good";
    icon = "📶";
  } else {
    badgeColor = "bg-red-500/10 border-red-500 text-red-500";
    badgeText = "Slow";
    icon = "⚠";
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border", badgeColor)} style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
      {icon} {speed} Mbps — {badgeText}
    </span>
  );
}
