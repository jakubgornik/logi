"use client";

import { useState } from "react";
import type { RowSelectionState } from "@tanstack/react-table";
import type { Transaction } from "@/prisma/client/client";
import { TransactionStatus } from "@/prisma/client/enums";
import { getSelectedIdsFromRowSelection } from "@/modules/supplier/supplier-table.utils";

interface SelectedTransactionStatus {
  status: TransactionStatus;
  updatedAt: number;
}

interface TransactionSelectionProps {
  rowSelection: RowSelectionState;
  transactions: Pick<Transaction, "id" | "status">[];
  isPlaceholderData: boolean;
  dataUpdatedAt: number;
}

export function useTransactionSelection({
  rowSelection,
  transactions,
  isPlaceholderData,
  dataUpdatedAt,
}: TransactionSelectionProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<
    Map<string, SelectedTransactionStatus>
  >(() => new Map());
  const selectedIds = getSelectedIdsFromRowSelection(rowSelection);
  const visibleTransactions = new Map(
    transactions.map((transaction) => [transaction.id, transaction]),
  );
  const nextStatuses = new Map<string, SelectedTransactionStatus>();

  for (const id of selectedIds) {
    const knownStatus = selectedStatuses.get(id);
    const transaction = visibleTransactions.get(id);
    const hasNewerStatus =
      !isPlaceholderData &&
      transaction !== undefined &&
      (knownStatus === undefined || dataUpdatedAt > knownStatus.updatedAt);

    if (hasNewerStatus) {
      nextStatuses.set(id, {
        status: transaction.status,
        updatedAt: dataUpdatedAt,
      });
    } else if (knownStatus) {
      nextStatuses.set(id, knownStatus);
    }
  }

  const hasStatusesChanged =
    nextStatuses.size !== selectedStatuses.size ||
    selectedIds.some((id) => nextStatuses.get(id) !== selectedStatuses.get(id));

  if (hasStatusesChanged) {
    setSelectedStatuses(nextStatuses);
  }

  const hasSelection = selectedIds.length > 0;
  const allSelectedAreDrafts = selectedIds.every(
    (id) => nextStatuses.get(id)?.status === TransactionStatus.DRAFT,
  );
  const canDelete = hasSelection && allSelectedAreDrafts;
  const canEdit = selectedIds.length === 1 && allSelectedAreDrafts;

  return { selectedIds, canDelete, canEdit };
}
