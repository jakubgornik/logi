import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NumberRangeValue } from "./filters.types";

interface NumberRangeFilterProps {
  label: string;
  value?: NumberRangeValue;
  onChange: (value: NumberRangeValue) => void;
  onRemove: () => void;
}

export function NumberRangeFilter({
  label,
  value,
  onChange,
  onRemove,
}: NumberRangeFilterProps) {
  const [range, setRange] = useState<NumberRangeValue>({
    min: value?.min ?? "",
    max: value?.max ?? "",
  });

  const debouncedChange = useDebouncedCallback((newRange: NumberRangeValue) => {
    onChange(newRange);
  }, 400);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof NumberRangeValue
  ) => {
    const val = e.target.value;

    setRange((prev) => {
      const next = { ...prev, [key]: val };
      debouncedChange(next);
      return next;
    });
  };

  return (
    <div className="flex items-center gap-0 border rounded-lg bg-card shadow-sm overflow-hidden h-10">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-r">
        <Badge variant="outline" className="text-xs font-medium bg-card">
          {label}
        </Badge>
        <div className="w-px h-4 bg-border" />
        <span className="text-xs text-muted-foreground font-medium">range</span>
      </div>
      <div className="flex items-center">
        <Input
          type="number"
          placeholder="Min"
          value={range.min}
          onChange={(e) => handleInputChange(e, "min")}
          className="h-10 w-16 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm px-3 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-muted-foreground text-xs font-medium px-1">
          -
        </span>
        <Input
          type="number"
          placeholder="Max"
          value={range.max}
          onChange={(e) => handleInputChange(e, "max")}
          className="h-10 w-16 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm px-3 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={onRemove}
        className="h-10 w-10 p-0 border-l bg-card hover:bg-destructive/10 hover:text-destructive rounded-none shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
