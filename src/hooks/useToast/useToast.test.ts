import { vi } from 'vitest';
import * as reduxHooks from 'react-redux';
import * as toastActions from '@/store/toastSlice';
import { renderHook } from '@testing-library/react';
import useToast from './useToast';
import type { TToastType } from '@/types';

vi.mock('react-redux');

const mockedDispatch = vi.spyOn(reduxHooks, 'useDispatch');
const params = {
  message: 'Hello',
  type: 'info' as TToastType,
  duration: 3000,
};
const mockedAddToast = vi.spyOn(toastActions, 'addToast');

describe('useToast', () => {
  let dispatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
  });

  it('should call dispatch with correct parameters when showToast is called', () => {
    const { result } = renderHook(() => useToast());
    result.current.showToast(params.message, params.type, params.duration);
    expect(mockedAddToast).toHaveBeenCalledWith(params);
  });
  it("should call showToast with 'success' type when success method is used", () => {
    const { result } = renderHook(() => useToast());
    result.current.success(params.message, params.duration);
    expect(mockedAddToast).toHaveBeenCalledWith({
      ...params,
      type: 'success',
    });
  });
  it("should call showToast with 'info' type when info method is used", () => {
    const { result } = renderHook(() => useToast());
    result.current.info(params.message, params.duration);
    expect(mockedAddToast).toHaveBeenCalledWith({
      ...params,
      type: 'info',
    });
  });
  it("should call showToast with 'warning' type when warning method is used", () => {
    const { result } = renderHook(() => useToast());
    result.current.warning(params.message, params.duration);
    expect(mockedAddToast).toHaveBeenCalledWith({
      ...params,
      type: 'warning',
    });
  });
  it("should call showToast with 'danger' type when danger method is used", () => {
    const { result } = renderHook(() => useToast());
    result.current.danger(params.message, params.duration);
    expect(mockedAddToast).toHaveBeenCalledWith({
      ...params,
      type: 'danger',
    });
  });
  it('should use default duration of 5000ms when no duration is provided', () => {
    const DEFAULT_DURATION = 5000;
    const { result } = renderHook(() => useToast());
    result.current.info(params.message);
    expect(mockedAddToast).toHaveBeenCalledWith({
      ...params,
      type: 'info',
      duration: DEFAULT_DURATION,
    });
    result.current.success(params.message);
    expect(mockedAddToast).toHaveBeenCalledWith({
      ...params,
      type: 'success',
      duration: DEFAULT_DURATION,
    });
    result.current.warning(params.message);
    expect(mockedAddToast).toHaveBeenCalledWith({
      ...params,
      type: 'warning',
      duration: DEFAULT_DURATION,
    });
    result.current.danger(params.message);
    expect(mockedAddToast).toHaveBeenCalledWith({
      ...params,
      type: 'danger',
      duration: DEFAULT_DURATION,
    });
    result.current.showToast(params.message, params.type);
    expect(mockedAddToast).toHaveBeenCalledWith({ ...params, duration: DEFAULT_DURATION });
  });
  it('should use custom duration when duration parameter is passed', () => {
    const { result } = renderHook(() => useToast());
    result.current.info(params.message, params.duration);
    expect(mockedAddToast).toHaveBeenCalledWith({
      ...params,
      type: 'info',
    });
    result.current.success(params.message, params.duration);
    expect(mockedAddToast).toHaveBeenCalledWith({
      ...params,
      type: 'success',
    });
    result.current.warning(params.message, params.duration);
    expect(mockedAddToast).toHaveBeenCalledWith({
      ...params,
      type: 'warning',
    });
    result.current.danger(params.message, params.duration);
    expect(mockedAddToast).toHaveBeenCalledWith({
      ...params,
      type: 'danger',
    });
    result.current.showToast(params.message, params.type, params.duration);
    expect(mockedAddToast).toHaveBeenCalledWith(params);
  });
  it('should return all expected methods from the hook', () => {
    const EXPECTED_METHODS = ['showToast', 'success', 'info', 'warning', 'danger'] as const;
    const { result } = renderHook(() => useToast());

    EXPECTED_METHODS.forEach((method) => {
      expect(result.current).toHaveProperty(method);
      expect(typeof result.current[method]).toBe('function');
    });

    expect(Object.keys(result.current)).toHaveLength(EXPECTED_METHODS.length);
  });
});
