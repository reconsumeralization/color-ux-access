import create from 'zustand';
import { ColorblindType } from '@/types';

interface TestConfigState {
  url: string;
  colorblindTypes: ColorblindType[];
  testComponents: {
    static: boolean;
    interactive: boolean;
    forms: boolean;
  };
  setUrl: (url: string) => void;
  toggleColorblindType: (type: ColorblindType) => void;
  toggleComponent: (component: keyof TestConfigState['testComponents']) => void;
  reset: () => void;
}

export const useTestConfig = create<TestConfigState>((set) => ({
  url: '',
  colorblindTypes: [],
  testComponents: {
    static: false,
    interactive: false,
    forms: false,
  },
  setUrl: (url) => set({ url }),
  toggleColorblindType: (type) => 
    set((state) => ({
      colorblindTypes: state.colorblindTypes.includes(type)
        ? state.colorblindTypes.filter(t => t !== type)
        : [...state.colorblindTypes, type]
    })),
  toggleComponent: (component) =>
    set((state) => ({
      testComponents: {
        ...state.testComponents,
        [component]: !state.testComponents[component]
      }
    })),
  reset: () => set({
    url: '',
    colorblindTypes: [],
    testComponents: {
      static: false,
      interactive: false,
      forms: false,
    }
  })
})); 