import { create } from 'zustand'

type UiState = {
  introDone: boolean
  setIntroDone: (done: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  introDone: false,
  setIntroDone: (introDone) => set({ introDone }),
}))
