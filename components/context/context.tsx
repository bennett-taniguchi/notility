import { createContext } from "react";

export const SelectedRowsContext = createContext({
    selectedRows:[] as any[],
    setSelectedRows:null as any,
    selectedTitles: [] as string[],
    setSelectedTitles:null as any,
})