import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
}

export const Divider = ({ className }: DividerProps) => {
  return <div className={cn("h-4 w-px bg-primary-foreground/30", className)} />;
};
