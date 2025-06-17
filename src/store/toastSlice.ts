import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface IToast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  message: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  animation?: 'slide' | 'bounce' | 'fade';
  pauseOnHover?: boolean;
}

export interface IToastState {
  toasts: IToast[];
  defaultDuration: number;
  defaultPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  defaultAnimation: 'slide' | 'bounce' | 'fade';
}

export const initialState: IToastState = {
  toasts: [],
  defaultDuration: 5000,
  defaultPosition: 'top-right',
  defaultAnimation: 'slide',
};

const toastSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<IToast, 'id'>>) => {
      const toast: IToast = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        duration: state.defaultDuration,
        position: state.defaultPosition,
        animation: state.defaultAnimation,
        pauseOnHover: true,
        ...action.payload,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearAllToasts } = toastSlice.actions;

export default toastSlice.reducer;
