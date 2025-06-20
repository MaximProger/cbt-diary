import toastReducer, { addToast, removeToast, clearAllToasts, initialState, type IToast } from '../../toastSlice';

describe('toastSlice', () => {
  const createToast = (overrides?: Partial<IToast>): IToast => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    duration: 5000,
    position: 'top-right',
    animation: 'fade',
    pauseOnHover: true,
    type: 'info',
    message: 'Test message',
    ...overrides,
  });

  const newToast = createToast();

  it('should return default state when passed an empty action', () => {
    const result = toastReducer(initialState, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('addToast', () => {
    it('should add toast to empty state', () => {
      const action = addToast(newToast);
      const result = toastReducer(initialState, action);

      expect(result.toasts).toHaveLength(1);
      expect(result.toasts[0]).toMatchObject(newToast);
    });

    it('should add toast to existing toasts', () => {
      const firstToast = createToast({ id: 'first' });
      const state = { ...initialState, toasts: [firstToast] };

      const action = addToast(newToast);
      const result = toastReducer(state, action);

      expect(result.toasts).toHaveLength(2);
      expect(result.toasts).toContainEqual(firstToast);
      expect(result.toasts).toContainEqual(newToast);
    });

    it('should use default values when properties are missing', () => {
      const minimalToast: Partial<IToast> = {
        id: 'minimal-toast',
        message: 'Minimal valid toast',
      };

      const action = addToast(minimalToast as IToast);
      const result = toastReducer(initialState, action);

      expect(result.toasts[0]).toMatchObject({
        duration: initialState.defaultDuration,
        position: initialState.defaultPosition,
        animation: initialState.defaultAnimation,
        pauseOnHover: true,
        ...minimalToast,
      });
    });
  });

  describe('removeToast', () => {
    it('should remove existing toast', () => {
      const state = {
        ...initialState,
        toasts: [newToast, createToast({ id: 'another-toast' })],
      };

      const action = removeToast(newToast.id);
      const result = toastReducer(state, action);

      expect(result.toasts).toHaveLength(1);
      expect(result.toasts).not.toContainEqual(newToast);
      expect(result.toasts[0].id).toBe('another-toast');
    });

    it('should handle removal of non-existent toast', () => {
      const state = { ...initialState, toasts: [newToast] };
      const action = removeToast('non-existent-id');
      const result = toastReducer(state, action);

      expect(result.toasts).toHaveLength(1);
      expect(result.toasts).toContainEqual(newToast);
    });

    it('should not modify state when removing from empty list', () => {
      const action = removeToast('any-id');
      const result = toastReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('clearAllToasts', () => {
    it('should remove all toasts', () => {
      const state = {
        ...initialState,
        toasts: [createToast({ id: 'toast-1' }), createToast({ id: 'toast-2' }), createToast({ id: 'toast-3' })],
      };

      const result = toastReducer(state, clearAllToasts());

      expect(result.toasts).toEqual([]);
    });

    it('should handle empty state', () => {
      const result = toastReducer(initialState, clearAllToasts());
      expect(result).toEqual(initialState);
    });
  });
});
