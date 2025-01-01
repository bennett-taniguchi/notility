"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TableRow = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  name: string;
  mastery: "beginner" | "intermediate" | "expert";
  difficulty?: "🟩" | "🟨" | "🟥";
  last_practiced: Date;
};

export const columns: ColumnDef<TableRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "last_practiced",
    header: "Last Practiced",
  },
];
