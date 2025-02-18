import { Card, CardContent } from "../../../ui/card";

export default function SourcesBlurb({sources,selected}) {
    function getKeywords(summary: string) {
        return summary.split(".")[0];
      }
    function lookupKeywords(title: string) {
        for (let i = 0; i < sources.length; i++) {
          if ((sources[i].title = title)) {
            return getKeywords(sources[i].summary);
          }
        }
      }

    return (
        <Card className="rounded-xl bg-cyan-400/50">
              <CardContent className="rounded-xl bg-white/50 text-md text-mono   text-center py-10 text-slate-600/90">
                <span className="font-bold font-roboto text-xl text-slate-600">
                  {selected.selected && selected.selected.length != 0
                    ? selected.selected
                    : "No Sources Selected, select from above"}
                </span>
                {selected.selectedArr.map((title, idx) => (
                  <div id={idx}>
                    <span className="font-semibold font-roboto">{title}:</span>{" "}
                    <span className="text-xs">{lookupKeywords(title)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
    )
}