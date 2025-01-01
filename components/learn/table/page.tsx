import { TableRow, columns } from "./columns";
import { DataTable } from "./data-table";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
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

export default function TablePage({ cards }) {
  //const data = await getData();

  //cards : [ {index Int @id @default(autoincrement())
  // authorId String
  // title String
  // description String
  // rating Int
  // practiceCount Int?

  // cards Card[]}]
  console.log(cards);
  let cardsUsed = [] as any;

  if (!cards) {
    return <div></div>;
  }

  for (let i = 0; i < cards.length; i++) {
    cardsUsed.push({
      id: "" + i,
      name: cards[i].title,
      status: "pending",
      email: "a@gmail.com",
      difficulty: "🟩",
      amount: cards[i].length,
      last_practiced: new Date("2019-09-09").toDateString(),
    });
  }

  // const data = [
  //   {
  //     id: "728ed52f",
  //     name: "German 100 Flashcards",
  //     status: "pending",
  //     email: "m@example.com",
  //     difficulty: "🟩",
  //     amount: 30,
  //     last_practiced: new Date("2019-09-09").toDateString(),
  //   },
  //   {
  //     id: "728ed52g",
  //     name: "Calculus Midterm I Material",
  //     status: "pending",
  //     email: "m@example.com",
  //     difficulty: "🟨",
  //     amount: 100,
  //     last_practiced: new Date("2024-01-03").toDateString(),
  //   },
  //   {
  //     id: "728ed52h",
  //     name: "English - To Kill a Mockingbird Summary",
  //     status: "pending",
  //     email: "m@example.com",
  //     difficulty: "🟥",
  //     amount: 50,
  //     last_practiced: new Date().toDateString(),
  //   },
  // ];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns as any} data={cardsUsed} />
    </div>
  );
}
