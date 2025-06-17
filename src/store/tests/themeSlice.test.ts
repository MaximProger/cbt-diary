import themeReducer, { toggleTheme, setTheme, initialState } from '../themeSlice';

describe('themeSlice', () => {
  it('should return default state when passed an empty action', () => {
    const result = themeReducer(initialState, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should toggle theme with "toggleTheme" action', () => {
    const action = { type: toggleTheme.type };
    const result = themeReducer(initialState, action);
    expect(result.isDarkMode).toBe(!initialState.isDarkMode);
  });

  it('should set theme with "setTheme" action', () => {
    const action = { type: setTheme.type, payload: true };
    const result = themeReducer(initialState, action);
    expect(result.isDarkMode).toBeTruthy();
  });
});
