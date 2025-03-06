import { Quiz } from "@prisma/client";
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

export const QuizzesContext = createContext({
   quizzes: [] as Quiz[] | null,
   selectedQuiz:[],
   setSelectedQuiz:null
 
})


 export const UserContext = createContext({
    url: '',
    email: '',
 })
 

 export const CollapseContext = createContext({
    collapse: 'none',
    setCollapse: null,
 })

//  export const GraphViewContext = createContext({
//     view: false,
//     setView: null,
//  })

//  export const GraphNodesContext = createContext({
//     nodes: [],
//     setNodes: null
//  })

 
 export const TiptapContext = createContext({
    title: '',
    setTitle: null,
    content: '',
    setContent: null,
 })