import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type TTag = {
  text: string,
  special: string
}

export type TSuggestion = {
  name: string,
  category: string
}

type TTagsStore = {
  tagsList: TTag[],
  searchString: string,
  suggestions: TSuggestion[],
  specialCharacter: string | null,
  addTag: (tag: TTag) => void,
  deleteTag: (tag: string) => void,
  setStringValue: (stringValue: string) => void,
  setSuggestions: (suggestions: TSuggestion[]) => void,
  setSpecialCharacter: (specialCharacter: string) => void
}

const useTagsStore = create<TTagsStore>()(devtools((set) => ({
  tagsList: [],
  searchString: '',
  suggestions: [],
  specialCharacter: '',
  setStringValue: (stringValue) => set({searchString: stringValue}),
  setSuggestions: (suggestions: TSuggestion[]) => set({suggestions}),
  setSpecialCharacter: (specialCharacter) => set({specialCharacter}),
  addTag: (tag) => set((state) => ({tagsList: [...state.tagsList, tag]})),
  deleteTag: (tag) => set((state) => ({
    tagsList: state.tagsList.filter(listTag => listTag.text !== tag)
  }))
})));

export default useTagsStore;
