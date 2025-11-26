"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Option } from "@/lib/types/common.types";
import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";

interface MultiSelectProps {
  options: Option[];
  onChange: (value: string[]) => void;
  value?: string[];
  placeholder?: string;
  ariaInvalid?: boolean;
}

export const MultiSelectField = ({
  value = [],
  options,
  onChange,
  placeholder,
  ariaInvalid,
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUnselect = useCallback(
    (optionValue: string) => {
      onChange(value.filter((v) => v !== optionValue));
    },
    [onChange, value]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && value.length > 0) {
            handleUnselect(value[value.length - 1]);
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [handleUnselect, value]
  );

  const remainingOptions = options.filter(
    (option) =>
      !value.includes(option.value) &&
      option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div
        aria-invalid={ariaInvalid}
        className={cn(
          "h-9 flex rounded-md border border-input px-3 py-1 shadow-xs text-sm transition-[border-color,box-shadow] outline-none",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          ariaInvalid && "ring-destructive/20 border-destructive"
        )}
      >
        {value.map((selectedValue) => (
          <SelectedOptionItem
            key={selectedValue}
            selectedValue={selectedValue}
            options={options}
            handleUnselect={handleUnselect}
          />
        ))}
        <CommandPrimitive.Input
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          placeholder={value.length > 0 ? undefined : placeholder}
          className="flex-1 bg-transparent placeholder:text-muted-foreground cursor-pointer outline-none"
        />
      </div>
      <OptionsList
        remainingOptions={remainingOptions}
        open={open}
        value={value}
        onChange={onChange}
        setInputValue={setInputValue}
      />
    </Command>
  );
};

interface OptionsListProps {
  remainingOptions: Option[];
  open: boolean;
  value: string[];
  onChange: (value: string[]) => void;
  setInputValue: (value: string) => void;
}

const OptionsList = ({
  remainingOptions,
  onChange,
  value,
  open,
  setInputValue,
}: OptionsListProps) => {
  return (
    <div className="relative mt-1">
      {open && remainingOptions.length > 0 && (
        <div className="absolute z-10 w-full rounded-md border bg-popover">
          <CommandList>
            <CommandGroup>
              {remainingOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onSelect={() => {
                    setInputValue("");
                    onChange([...value, option.value]);
                  }}
                  className="cursor-default"
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </div>
      )}
    </div>
  );
};

interface SelectedOptionItemProps {
  selectedValue: string;
  options: Option[];
  handleUnselect: (optionValue: string) => void;
}

const SelectedOptionItem = ({
  selectedValue,
  options,
  handleUnselect,
}: SelectedOptionItemProps) => {
  const option = options.find((o) => o.value === selectedValue);

  return (
    <Badge key={selectedValue} variant="outline" className="mr-1 text-sm">
      {option?.label || selectedValue}
      <button
        className="cursor-pointer"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleUnselect(selectedValue);
          }
        }}
        onClick={() => handleUnselect(selectedValue)}
      >
        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
      </button>
    </Badge>
  );
};
