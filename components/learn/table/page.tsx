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

export default function TablePage({ sets,cards }) {
  //const data = await getData();

  //cards : [ {index Int @id @default(autoincrement())
  // authorId String
  // title String
  // description String
  // rating Int
  // practiceCount Int?

  // cards Card[]}]
  
  let cardsUsed = [] as any;

  if (!sets) {
    return <div></div>;
  }

  function ratingToDifficulty(rating:number) {
    if(rating==0)
      return"🟩"
    if(rating==1)
      return"🟨"
    if(rating==2)
      return"🟥"
    return"🟩"
  }

  function getCardAmt(title:string){
    let arr = cards.filter((card) => card.title==title)
    return arr.length
  }

  console.log(sets)
  for (let i = 0; i < sets.length; i++) {
    cardsUsed.push({
      id: "" + i,
      name: sets[i].title,
      status: "pending",
      email: "a@gmail.com",
      difficulty: ratingToDifficulty(sets[i].rating),
      amount: getCardAmt(sets[i].title),
      last_practiced: (sets[i].last_practiced ) ,
    });
  }



  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns as any} data={cardsUsed} />
    </div>
  );
}
