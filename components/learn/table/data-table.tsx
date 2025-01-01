"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useContext, useEffect, useMemo, useState } from "react";

import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import Router from "next/router";
import Link from "next/link";
import { SelectedRowsContext } from "../../context/context";
import { cn } from "../../lib/utils";
import {
  TableRowComponent,
  TableRowProps,
} from "react-markdown/lib/ast-to-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [toggleAlert, setToggleAlert] = useState(undefined as undefined | true);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "last_practiced", desc: true },
  ]);
  const { selectedRows, setSelectedRows, setSelectedTitles } =
    useContext(SelectedRowsContext);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  function setAlertState() {
    if (toggleAlert == undefined) {
      setToggleAlert(true);
    } else {
      setToggleAlert(undefined);
    }
  }

  async function deleteCard(cardName: string) {
    // delete
    // toggle alert

    await setAlertState();

    await fetch("/api/flashcard/delete/" + cardName, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    await Router.push("/learn");
  }

  async function editCardName() {}

  async function editCards(title: string) {
    const res = await fetch("/api/card/get/" + title, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    let result = await res.json();
    await console.log(result.cards);
  }

  function onCellClicked(idx: number, row: any) {
    if (toggleAlert) return;
    row.toggleSelected();
    let name = row.getValue("name");
    if (selectedRows.includes(name)) {
      let vals = selectedRows.filter((s) => s != name);
      setSelectedRows([...vals]);
    } else {
      setSelectedRows([...selectedRows, name]);
    }
  }

  useEffect(() => {}, [selectedRows, toggleAlert]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, idx) => {
                return (
                  <TableHead key={idx}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, num) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => onCellClicked(num, row)}
              >
                {row.getVisibleCells().map((cell, idx) =>
                  idx == 0 ? (
                    <TableCell key={cell.id} className={"flex flex-grow"}>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          {" "}
                          <DotsVerticalIcon className="translate-x-[-5px] stroke-gray scale-110 hover:bg-zinc-200 rounded" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => setAlertState()}
                          >
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => editCards(row.getValue("name"))}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <AlertDialog
                        open={toggleAlert}
                        onOpenChange={setToggleAlert as any}
                      >
                        <AlertDialogTrigger asChild></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Confirm that you want to permanately delete this
                              file.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setAlertState()}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteCard(row.getValue("name"))}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                     
                        <u className="hover:text-zinc-400">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </u>
                     
                    </TableCell>
                  ) : (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  )
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
