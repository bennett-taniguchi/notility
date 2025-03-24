import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Card, CardContent } from "../../../ui/card";
import { useEffect } from "react";

export default function SourcesBlurb({sources,selected}) {
 
    function lookupKeywords(title: string) {
     
        for (let i = 0; i < sources.length; i++) {
          if ((sources[i].title == title)) {
            console.log('title:',title,'foundtitle',sources[i].title,'returned:',sources[i].summary)
            return (sources[i].summary);
          }
        }
      }
      useEffect(() => {
// sources discrepanccy with selected
 console.log(selected)
      },[sources])
    return (
        <Card className="rounded-xl  bg-gradient-to-r from-cyan-200 to-indigo-200 border-white border-2">
              <CardContent className="rounded-xl text-md text-mono   text-center py-10 text-slate-600/90">
                <span className="[text-shadow:_0_2px_2px_rgb(132_192_241_/_.9)]   font-bold text-2xl text-black  font-roboto">
                  {selected.selected && selected.selected.length != 0
                    ? selected.selected 
                    : "No Sources Selected, select from above"}
                </span>
                {selected.selectedArr.map((title, idx) => (
                  <div id={idx}>
                    <span className="font-semibold font-roboto text-black/70">{title}:</span>{" "}
                    <span className="text-xs overflow-hidden text-ellipsis line-clamp-3 text-zinc-500/90"><ReactMarkdown>{lookupKeywords(title)}</ReactMarkdown>
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
    )
}