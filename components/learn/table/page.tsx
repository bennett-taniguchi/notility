import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

// async function getData(): Promise<Payment[]> {
//   // Fetch data from your API here.
//   return [
// {
//   id: "728ed52f",
//   amount: 100,
//   status: "pending",
//   email: "m@example.com",
// },
//     // ...
//   ];
// }

export default function DemoPage() {
  //const data = await getData();
  const data = [
    {
      id: "728ed52f",
      name: "German 100 Flashcards",
      status: "pending",
      email: "m@example.com",
      difficulty: "🟩",
      amount: 30,
      last_practiced: new Date("2019-09-09").toDateString(),
    },
    {
      id: "728ed52g",
      name: "Calculus Midterm I Material",
      status: "pending",
      email: "m@example.com",
      difficulty: "🟨",
      amount: 100,
      last_practiced: new Date("2024-01-03").toDateString(),
    },
    {
      id: "728ed52h",
      name: "English - To Kill a Mockingbird Summary",
      status: "pending",
      email: "m@example.com",
      difficulty: "🟥",
      amount: 50,
      last_practiced: new Date().toDateString(),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns as any} data={data} />
    </div>
  );
}
