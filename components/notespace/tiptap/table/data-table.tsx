"use client";
import { CirclePlus } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
 
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
} from "../../../ui/table";
import { useContext, useEffect, useMemo, useState } from "react";

import { EllipsisVertical } from "lucide-react";
import { Button } from "../../../ui/button";
 
import Router from "next/router";
import Link from "next/link";
import { SelectedRowsContext } from "../../../context/context";
 

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
 
} from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
 
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [open, setOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [newTitle,setNewTitle] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [newDifficulty, setNewDifficulty] = useState("");
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

  async function deleteCard(cardName: string) {
    // delete
    // toggle alert
    setOpen(false)
    await fetch("/api/flashcard/delete/" + cardName, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    await Router.push("/learn");
  }

    function editCard(name: string, difficulty: string) {
      setSelectedTitle(name);
    setSelectedDifficulty(difficulty);
      setNewTitle(name) 
      setNewDifficulty(difficulty)
    setOpen(true);
    
  } 
  async function updateCard() {
    setOpen(false)
    if(selectedTitle != newTitle || newDifficulty != selectedDifficulty) {
      const title = newTitle;
      const difficulty = newDifficulty;
      const oldTitle = selectedTitle;
      const body = { title, difficulty, oldTitle };

      await fetch("/api/flashcard/update/" , {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/learn");
    }
  }

  // async function editCards(title: string) {
  //   const res = await fetch("/api/card/get/" + title, {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   let result = await res.json();
  //   await console.log(result.cards);
  // }

  function onCellClicked(idx: number, row: any) {
    row.toggleSelected();
    let name = row.getValue("name");
    if (selectedRows.includes(name)) {
      let vals = selectedRows.filter((s) => s != name);
      setSelectedRows([...vals]);
    } else {
      setSelectedRows([...selectedRows, name]);
    }
  }

  useEffect(() => {}, [selectedRows]);

  return (
    <div className="rounded-md border">
      <Dialog modal={true} open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]  ">
          <DialogHeader>
            <DialogTitle>Edit Set</DialogTitle>
            <DialogDescription>
              Change difficulty, name, or delete set
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
       
            <div className="grid grid-cols-4 items-center gap-4 -ml-[3svw]">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" onChange={e => setNewTitle(e.currentTarget.value)} value={newTitle} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 -ml-[3svw]">
              <Label htmlFor="username" className="text-right">
                Difficulty
              </Label>
              <Select onValueChange={setNewDifficulty} value={newDifficulty}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={newDifficulty} />
                </SelectTrigger>
                <SelectContent defaultValue={newDifficulty}>
                  <SelectGroup>
                    <SelectItem value="🟩">🟩</SelectItem>
                    <SelectItem value="🟨">🟨</SelectItem>
                    <SelectItem value="🟥">🟥</SelectItem>
                  </SelectGroup>
                </SelectContent>
                <div  className="ml-[5svw]">
            <Link href={'/learn/flashcard/edit/'+selectedTitle}>
           
            <Button variant={'secondary'} >
              Edit Terms <CirclePlus className="ml-2 w-5 h-5"/>
            </Button>
            </Link></div>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant={"destructive"}
              className="mx-auto ml-0"
              type="submit"
              onClick={()=>deleteCard(selectedTitle) }
            >
              Delete Set
            </Button>
            <Button className="mx-auto" type="submit" onClick={()=>updateCard()}  >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                      {" "}
                      <EllipsisVertical
                        className="translate-x-[-5px] stroke-gray scale-110 hover:bg-zinc-200 rounded"
                        onClick={() =>
                          editCard(
                            row.getValue("name"),
                            row.getValue("difficulty")
                          )
                        }
                      />
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
