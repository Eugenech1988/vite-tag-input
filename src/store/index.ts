import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type TTagsStore = {
  tagsList: any[],
  searchString: string,
  suggestions: any[],
  specialCharacter: string | null,
  addTag: (tag: object) => void,
  deleteTag: (tag: string) => void,
  setStringValue: (stringValue: string) => void,
  setSuggestions: (suggestions: string[]) => void,
  setSpecialCharacter: (specialCharacter: string) => void
}

const useTagsStore = create<TTagsStore>()(devtools((set) => ({
  tagsList: [],
  searchString: '',
  suggestions: [],
  specialCharacter: '',
  setStringValue: (stringValue) => set(() => ({
    searchString: stringValue
  })),
  setSuggestions: (suggestions) => set(() => ({
    suggestions: [...suggestions]
  })),
  setSpecialCharacter: (specialCharacter) => set(() => ({
    specialCharacter
  })),
  addTag: (tag) => set((state) => ({
    tagsList: [...state.tagsList, tag]
  })),
  deleteTag: (tag) => set((state) => ({
    tagsList: state.tagsList.filter(listTag => listTag !== tag)
  }))
})));

export default useTagsStore;
