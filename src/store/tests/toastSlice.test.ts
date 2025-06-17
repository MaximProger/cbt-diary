import toastReducer, {
  addToast,
  removeToast,
  clearAllToasts,
  initialState,
  type IToast,
  type IToastState,
} from '../toastSlice';

describe('toastSlice', () => {
  const newToast: IToast = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    duration: initialState.defaultDuration,
    position: initialState.defaultPosition,
    animation: initialState.defaultAnimation,
    pauseOnHover: true,
    type: 'info',
    message: 'Test',
  };

  it('shuld return default state when passed an empty action', () => {
    const result = toastReducer(initialState, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should add toast with "addToast" action', () => {
    const action = { type: addToast.type, payload: newToast };
    const result = toastReducer(initialState, action);
    expect(result.toasts[0]).toStrictEqual(newToast);
  });

  it('should remove toast with "removeToast" action', () => {
    const stateWithToast: IToastState = {
      ...initialState,
      toasts: [newToast],
    };
    const action = { type: removeToast.type, payload: newToast.id };
    const result = toastReducer(stateWithToast, action);
    expect(result.toasts).toHaveLength(0);
    expect(result.toasts).toEqual([]);
    expect(result.toasts).not.toContain(newToast);
  });

  it('should clear all toasts with "clearAllToasts" action', () => {
    const stateWithToasts: IToastState = {
      ...initialState,
      toasts: [newToast, newToast, newToast],
    };
    const action = { type: clearAllToasts.type, payload: newToast.id };
    const result = toastReducer(stateWithToasts, action);
    expect(result.toasts).toHaveLength(0);
    expect(result.toasts).toEqual([]);
  });
});
