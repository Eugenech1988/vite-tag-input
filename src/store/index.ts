import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type TTag = {
  text: string;
  special: string;
  tagValue?: string | number;
};

export type TSuggestion = {
  name: string;
  category: string;
  value: string | number;
};

type TTagsStore = {
  tagsList: TTag[];
  searchString: string;
  suggestions: TSuggestion[];
  specialCharacter: string | null;
  suggestTags: TTag[];
  addTag: (tag: TTag) => void;
  deleteTag: (tag: string) => void;
  editFinalTag: (newTag: TTag) => void;
  setStringValue: (stringValue: string) => void;
  setSuggestions: (suggestions: TSuggestion[]) => void;
  setSpecialCharacter: (specialCharacter: string) => void;
  setSuggestTags: (suggestTags: TTag[]) => void;
};

const useTagsStore = create<TTagsStore>()(
  devtools((set) => ({
    tagsList: [],
    searchString: '',
    suggestions: [],
    specialCharacter: '',
    suggestTags: [],
    setStringValue: (stringValue) => set({ searchString: stringValue }),
    setSuggestions: (suggestions) => set({ suggestions }),
    setSpecialCharacter: (specialCharacter) => set({ specialCharacter }),
    setSuggestTags: (tags: TTag[]) => set({ suggestTags: tags }),
    addTag: (tag) => set((state) => ({ tagsList: [...state.tagsList, tag] })),
    deleteTag: (tag) =>
      set((state) => ({
        tagsList: state.tagsList.filter((listTag) => listTag.text !== tag),
      })),
    editFinalTag: (newTag) =>
      set((state) => ({
        tagsList: state.tagsList.length > 0
          ? [
            ...state.tagsList.slice(0, state.tagsList.length - 1),
            { ...state.tagsList[state.tagsList.length - 1], ...newTag }
          ]
          : state.tagsList
      })),
  }))
);

export default useTagsStore;
