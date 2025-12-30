"use client";

import { useFormContext } from "react-hook-form";
import {
  User,
  Package,
  MapPin,
  Calendar,
  Receipt,
  Contact,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { InventoryWithProduct } from "@/lib/fetchers/get-inventories";
import { Customer } from "@/prisma/client/client";
import { TransactionFormSchema } from "../transaction-form.validation";
import { format } from "date-fns";

interface TransactionSummaryStepProps {
  inventories: InventoryWithProduct[];
  customers: Customer[];
}

export const TransactionSummaryStep = ({
  inventories,
  customers,
}: TransactionSummaryStepProps) => {
  const { getValues } = useFormContext<TransactionFormSchema>();
  const formValues = getValues();

  const selectedCustomer = customers.find(
    (c) => c.id === formValues.customerId
  );

  const items = formValues.items.map((item) => {
    const productName = inventories.find((inv) => inv.id === item.productId)
      ?.product.name;

    return {
      ...item,
      productName,
    };
  });

  const totalQuantity = items.reduce((acc, curr) => acc + curr.quantity, 0);

  const currentDate = format(new Date(), "MMMM d, yyyy");

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <Card className="h-full shadow-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
              <Contact className="h-4 w-4" />
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="grid gap-0.5 w-full">
                  <span className="font-semibold text-foreground/80">
                    Customer Name
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground leading-snug">
                      {selectedCustomer?.customerName}
                    </span>
                    {selectedCustomer?.appUserId && (
                      <Badge variant="outline" className="text-xs">
                        Logi App User
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="grid gap-0.5">
                  <span className="font-semibold text-foreground/80">
                    Shipping Address
                  </span>
                  <span className="text-muted-foreground leading-snug">
                    {selectedCustomer?.addressStreet}
                    <br />
                    {selectedCustomer?.addressCity},{" "}
                    {selectedCustomer?.addressCountry}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="grid gap-0.5">
                  <span className="font-semibold text-foreground/80">Date</span>
                  <span className="text-muted-foreground leading-snug">
                    {currentDate}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-1">
        <Card className="p-0  h-full shadow-sm flex flex-col overflow-hidden">
          <CardHeader className="bg-muted/35 px-4 pt-8 mb-0 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4 text-primary" />
                Order Summary
              </CardTitle>
              <Badge variant="secondary" className="px-1.5 py-0 text-xs">
                {items.length} items
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b-0">
                  <TableHead className="pl-4 h-9 text-xs uppercase w-[70%]">
                    ProductS
                  </TableHead>
                  <TableHead className="text-right pr-4 h-9 text-xs uppercase">
                    Quantity
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow
                    key={`${item.productId}`}
                    className="border-b-muted/50"
                  >
                    <TableCell className="pl-4 py-2 font-medium text-sm">
                      {item.productName}
                    </TableCell>
                    <TableCell className="text-right pr-4 py-2">
                      <span className="font-semibold text-sm">
                        {item.quantity}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <div className="mt-auto border-t bg-muted/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Receipt className="h-4 w-4" />
                <span>Total Quantity</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                {totalQuantity}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
