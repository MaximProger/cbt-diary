import themeReducer, { toggleTheme, setTheme, initialState } from '../themeSlice';

describe('themeSlice', () => {
  describe('initial state', () => {
    it('should return initial state when passed undefined state and empty action', () => {
      const result = themeReducer(undefined, { type: '' });
      expect(result).toEqual(initialState);
    });

    it('should return current state for unknown action', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION' };
      const result = themeReducer(initialState, unknownAction);
      expect(result).toEqual(initialState);
    });
  });

  describe('toggleTheme action', () => {
    it('should toggle from light to dark mode', () => {
      const lightModeState = { isDarkMode: false };
      const action = toggleTheme();
      const result = themeReducer(lightModeState, action);

      expect(result).toEqual({ isDarkMode: true });
    });

    it('should toggle from dark to light mode', () => {
      const darkModeState = { isDarkMode: true };
      const action = toggleTheme();
      const result = themeReducer(darkModeState, action);

      expect(result).toEqual({ isDarkMode: false });
    });

    it('should toggle theme multiple times correctly', () => {
      let state = initialState;
      const originalMode = state.isDarkMode;

      // First toggle
      state = themeReducer(state, toggleTheme());
      expect(state.isDarkMode).toBe(!originalMode);

      // Second toggle (back to original)
      state = themeReducer(state, toggleTheme());
      expect(state.isDarkMode).toBe(originalMode);

      // Third toggle
      state = themeReducer(state, toggleTheme());
      expect(state.isDarkMode).toBe(!originalMode);
    });
  });

  describe('setTheme action', () => {
    it('should set theme to dark mode', () => {
      const action = setTheme(true);
      const result = themeReducer(initialState, action);

      expect(result).toEqual({ isDarkMode: true });
    });

    it('should set theme to light mode', () => {
      const action = setTheme(false);
      const result = themeReducer(initialState, action);

      expect(result).toEqual({ isDarkMode: false });
    });

    it('should set theme to dark mode when already in dark mode', () => {
      const darkModeState = { isDarkMode: true };
      const action = setTheme(true);
      const result = themeReducer(darkModeState, action);

      expect(result).toEqual({ isDarkMode: true });
    });

    it('should set theme to light mode when already in light mode', () => {
      const lightModeState = { isDarkMode: false };
      const action = setTheme(false);
      const result = themeReducer(lightModeState, action);

      expect(result).toEqual({ isDarkMode: false });
    });

    it('should change from dark to light mode', () => {
      const darkModeState = { isDarkMode: true };
      const action = setTheme(false);
      const result = themeReducer(darkModeState, action);

      expect(result).toEqual({ isDarkMode: false });
    });

    it('should change from light to dark mode', () => {
      const lightModeState = { isDarkMode: false };
      const action = setTheme(true);
      const result = themeReducer(lightModeState, action);

      expect(result).toEqual({ isDarkMode: true });
    });
  });

  describe('state immutability', () => {
    it('should not mutate original state when toggling theme', () => {
      const originalState = { ...initialState };
      const action = toggleTheme();

      themeReducer(initialState, action);

      expect(initialState).toEqual(originalState);
    });

    it('should not mutate original state when setting theme', () => {
      const originalState = { ...initialState };
      const action = setTheme(true);

      themeReducer(initialState, action);

      expect(initialState).toEqual(originalState);
    });

    it('should return new state object reference when theme changes', () => {
      const action = toggleTheme();
      const result = themeReducer(initialState, action);

      expect(result).not.toBe(initialState);
    });

    it('should return new state object even when theme value does not change', () => {
      const currentMode = initialState.isDarkMode;
      const action = setTheme(currentMode);
      const result = themeReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('action creators', () => {
    it('should create toggleTheme action with correct type', () => {
      const action = toggleTheme();
      expect(action.type).toBe('theme/toggleTheme');
    });

    it('should create setTheme action with correct type and payload', () => {
      const action = setTheme(true);
      expect(action.type).toBe('theme/setTheme');
      expect(action.payload).toBe(true);
    });
  });

  describe('integration scenarios', () => {
    it('should handle mixed toggle and set operations', () => {
      let state = { isDarkMode: false };

      // Set to dark
      state = themeReducer(state, setTheme(true));
      expect(state.isDarkMode).toBe(true);

      // Toggle to light
      state = themeReducer(state, toggleTheme());
      expect(state.isDarkMode).toBe(false);

      // Set to dark again
      state = themeReducer(state, setTheme(true));
      expect(state.isDarkMode).toBe(true);

      // Toggle to light again
      state = themeReducer(state, toggleTheme());
      expect(state.isDarkMode).toBe(false);
    });
  });
});
