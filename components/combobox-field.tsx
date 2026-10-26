"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronsUpDown } from "lucide-react";

export interface ComboboxOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ComboboxFieldProps {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
  fieldRef?: React.Ref<HTMLButtonElement>;
  showIcons?: boolean;
  ariaInvalid?: boolean;
}

export function ComboboxField({
  options,
  value,
  onChange,
  onBlur,
  id,
  fieldRef,
  disabled = false,
  className,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  showIcons = false,
  ariaInvalid,
}: ComboboxFieldProps) {
  const [open, setOpen] = useState(false);
  const popupId = useId();
  const selectedOption = options.find((option) => option.value === value);

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowDown") return;

    event.preventDefault();
    setOpen(true);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          ref={fieldRef}
          onBlur={onBlur}
          onKeyDown={handleTriggerKeyDown}
          id={id}
          disabled={disabled}
          aria-controls={popupId}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-invalid={ariaInvalid}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md px-3 py-1 border border-input bg-transparent shadow-xs text-foreground md:text-sm cursor-pointer transition-[border-color,box-shadow] outline-none",
            "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
            "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
            "disabled:cursor-not-allowed disabled:opacity-50",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <span className="flex items-center gap-2 truncate">
            {showIcons && selectedOption?.icon && (
              <span className="shrink-0 flex items-center w-4 h-4">
                {selectedOption.icon}
              </span>
            )}
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown
            aria-hidden="true"
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        id={popupId}
        aria-label={placeholder}
        className="w-full p-0"
        style={{
          width: "var(--radix-popover-trigger-width)",
        }}
      >
        <Command label={searchPlaceholder}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <ScrollArea>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {showIcons && option.icon && (
                      <span className="mr-2 shrink-0 flex items-center w-5 h-5">
                        {option.icon}
                      </span>
                    )}
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
