import Latex from "react-latex-next";
import { Card, CardHeader, CardTitle, CardContent } from "../../../ui/card";

export default function MessageList({messagesLoaded}) {



    return (
        <div className="flex flex-col justify-items-center justify-self-center  ">
        {messagesLoaded && messagesLoaded.length != 0 ? (
            messagesLoaded.map((m: any,idx) => (
              <div
              key={idx}
              id={idx}
                className={
                  m.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <Card
                  className={
                    m.role === "user"
                      ? "bg-sky-200 drop-shadow-md border-sky-400 shadow-inner min-w-[10svw]"
                      : "bg-indigo-200 drop-shadow-lg shadow-inner border-indigo-400 min-w-[10svw]"
                  }
                >
                  <div key={m.id} className="whitespace-pre-wrap">
                    <CardHeader>
                      <CardTitle className="font-bold font-mono">
                        {m.role === "user" ? "User: " : "AI: "}
                      </CardTitle>
                    </CardHeader>
                    <span className=" text-slate-600">
                      <CardContent>
                       
                        <Latex>
                       {m.content} 
                       </Latex>
                      
                        {m.role !== "user" &&
                        m.match &&
                        m.match.length != 0 ? (
                          <>
                            

                            <div className="flex flex-col gap-2 px-2 rounded-lg bg-white shadow-sm mt-5">
                              {true && (
                                <div className=" ">
                                  <div className=" bg-transparent rounded-md mb-2">
                                    <p className="text-sm text-gray-600 font-medium">
                                      Source :
                                    </p>
                                    <blockquote className="mt-1 text-xs text-black border-l-2 border-sky-800/40 pl-3 line-clamp-3">
                                      {m.match}
                                    </blockquote>
                                    <p className="mt-1 text-xs text-black">
                                      Relevance score:{" "}
                                      {Math.round(m.matchScore * 100)}%
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </CardContent>
                    </span>
                  </div>
                </Card>
              </div>
            ))
          ) : (
            <></>
          )}
          </div>
    )
}