import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface CategoryFilterState {
  selectedCategoryIds: number[];
  toggleCategory: (id: number) => void;
  clearAll: () => void;
}

export const useCategoryFilterStore = create<CategoryFilterState>()(
  immer((set) => ({
    selectedCategoryIds: [],
    toggleCategory: (id) =>
      set((state) => {
        const idx = state.selectedCategoryIds.indexOf(id);
        if (idx === -1) {
          state.selectedCategoryIds.push(id);
        } else {
          state.selectedCategoryIds.splice(idx, 1);
        }
      }),
    clearAll: () =>
      set((state) => {
        state.selectedCategoryIds = [];
      }),
  })),
);
