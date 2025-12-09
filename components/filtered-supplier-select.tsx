"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Scope, Supplier } from "@/prisma/client/client";
import { SCOPES, SCOPE_OPTIONS } from "@/lib/shared/consts";
import { useMemo, useState } from "react";
import { mapCountryCodeToName } from "@/modules/supplier/supplier-form.utils";
import { Badge } from "./ui/badge";
import { filterSuppliers } from "@/modules/contract/contract-form.utils";
import { useDebounce } from "use-debounce";

interface SupplierSelectProps {
  suppliers: Supplier[];
  placeholder: string;
  value: string;
  onValueChange: (supplierId: string) => void;
  ariaInvalid: boolean;
  userScopes: Scope[];
}

export function FilteredSupplierSelect({
  suppliers,
  value,
  onValueChange,
  placeholder,
  ariaInvalid,
  userScopes,
}: SupplierSelectProps) {
  const [openFilter, setOpenFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [selectedScopes, setSelectedScopes] = useState<Scope[]>([]);

  const selectedSupplier = suppliers.find((s) => s.id === value);

  const filteredSuppliers = useMemo(() => {
    return filterSuppliers(suppliers, debouncedSearch, selectedScopes);
  }, [suppliers, debouncedSearch, selectedScopes]);

  const handleScopeToggle = (scope: Scope) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const handleSelect = (id: string) => {
    if (value === id) {
      onValueChange?.("");
    } else {
      onValueChange?.(id);
    }
    setOpenFilter(false);
  };

  return (
    <Popover open={openFilter} onOpenChange={setOpenFilter}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-invalid={ariaInvalid}
          className={cn(
            "w-full justify-between bg-transparent",
            "aria-invalid:ring-destructive/20 aria-invalid:border-destructive"
          )}
        >
          {selectedSupplier ? (
            <span className="truncate">{selectedSupplier.name}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <div className="flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="border-b">
            <FilterHeader title="Filter by active scope" />
            <ScrollArea className="h-[100px]">
              <div className="px-3 py-2 flex flex-col gap-2">
                {SCOPE_OPTIONS.filter((option) =>
                  userScopes.includes(option.value)
                ).map((scope) => (
                  <div key={scope.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`scope-${scope.value}`}
                      checked={selectedScopes.includes(scope.value)}
                      onCheckedChange={() => handleScopeToggle(scope.value)}
                    />
                    <Label htmlFor={`scope-${scope.value}`} className="text-sm">
                      {scope.label}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div>
            <FilterHeader title={`Suppliers (${filteredSuppliers.length})`} />
            <ScrollArea
              className={`${filteredSuppliers.length === 0 ? "h-24" : "h-44"}`}
            >
              <div className="px-1 py-2 space-y-1">
                {filteredSuppliers.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No suppliers found.
                  </div>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <SupplierOptionItem
                      key={supplier.id}
                      supplier={supplier}
                      isSelected={value === supplier.id}
                      onSelect={() => handleSelect(supplier.id)}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface FilterHeaderProps {
  title: string;
}

const FilterHeader = ({ title }: FilterHeaderProps) => {
  return (
    <div className="px-3 py-2">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {title}
      </span>
    </div>
  );
};

interface SupplierItemProps {
  supplier: Supplier;
  isSelected: boolean;
  onSelect: () => void;
}

const SupplierOptionItem = ({
  supplier,
  isSelected,
  onSelect,
}: SupplierItemProps) => {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full flex items-start gap-3 p-2 rounded-md text-left transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isSelected && "bg-accent"
      )}
    >
      <div
        className={cn(
          "h-4 w-4 rounded-md border border-primary flex items-center justify-center",
          isSelected ? "bg-primary text-primary-foreground" : "bg-transparent"
        )}
      >
        {isSelected && <Check className="h-3 w-3" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{supplier.name}</div>
        <div className="text-xs text-muted-foreground">
          {supplier.addressCity},{mapCountryCodeToName(supplier.addressCountry)}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {supplier.scopes.map((scope) => (
            <Badge key={scope} variant="secondary" className="px-1">
              {SCOPES[scope]}
            </Badge>
          ))}
        </div>
      </div>
    </button>
  );
};
