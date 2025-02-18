import { Skeleton } from "../../../ui/skeleton";

export default function PulsingDots({loading}) {


    return (
<>
        {loading === true ? (
            <div className="flex justify-center gap-2 mt-5">
              <Skeleton className="h-4 w-4 rounded-full pulsing-dot-1" />
              <Skeleton className="h-4 w-4 rounded-full pulsing-dot-2" />
              <Skeleton className="h-4 w-4 rounded-full pulsing-dot-3" />
            </div>
          ) : (
            <div />
          )}
          </>
    )
}