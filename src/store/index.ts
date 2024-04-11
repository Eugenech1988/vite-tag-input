import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// type TSuggestion = {
//   name: string,
//   category: string,
//   id: string
// }

type TTagsStore = {
  tagsList: any[],
  searchString: string,
  suggestions: any[],
  addTag: (tag: string) => void,
  deleteTag: (tag: string) => void,
  setStringValue: (stringValue: string) => void,
  setSuggestions: (suggestions: string[]) => void
}

const useTagsStore = create<TTagsStore>()(devtools((set) => ({
  tagsList: [],
  searchString: '',
  suggestions: [],
  setStringValue: (stringValue) => set(() => ({
    searchString: stringValue
  })),
  setSuggestions: (suggestions) => set(() => ({
    suggestions: [...suggestions]
  })),
  addTag: (tag) => set((state) => ({
    tagsList: [...state.tagsList, tag]
  })),
  deleteTag: (tag) => set((state) => ({
    tagsList: state.tagsList.filter(listTag => listTag !== tag)
  }))
})));

export default useTagsStore;
