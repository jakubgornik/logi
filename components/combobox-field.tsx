"use client";

import { useState } from "react";
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
  fieldRef?: React.Ref<HTMLDivElement>;
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
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  showIcons = false,
  ariaInvalid,
}: ComboboxFieldProps) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          ref={fieldRef}
          onBlur={onBlur}
          id={id}
          aria-invalid={ariaInvalid}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md px-3 py-1 border border-input bg-transparent shadow-xs text-base text-foreground md:text-sm cursor-pointer outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            !value && "text-muted-foreground"
          )}
          onClick={() => setOpen(true)}
        >
          <span className="flex items-center gap-2 truncate">
            {showIcons && selectedOption?.icon && (
              <span className="shrink-0 flex items-center w-4 h-4">
                {selectedOption.icon}
              </span>
            )}
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        style={{
          width: "var(--radix-popover-trigger-width)",
        }}
      >
        <Command>
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
                        value === option.value ? "opacity-100" : "opacity-0"
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
