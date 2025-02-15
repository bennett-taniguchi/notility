import { createContext } from "react";

export const SelectedRowsContext = createContext({
    selectedRows:[] as any[],
    setSelectedRows:null as any,
    selectedTitles: [] as string[],
    setSelectedTitles:null as any,
})

export const SlugContext = createContext({
    slug:''as string
})

export const UpdateUploadsContext = createContext({
    updateFunction: null as any
})

export const NotesContext = createContext({
    notes: [] as string[]
})

 
 