import { vi } from 'vitest';
import * as reduxHooks from 'react-redux';
import * as toastActions from '@/store/toastSlice';
import { renderHook } from '@testing-library/react';
import useToast from './useToast';
import type { TToastType } from '@/types';

vi.mock('react-redux');

const mockedDispatch = vi.spyOn(reduxHooks, 'useDispatch');

describe('useToast', () => {
  let dispatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    dispatch = vi.fn();
    mockedDispatch.mockReturnValue(dispatch);
  });

  it('should call dispatch with correct parameters when showToast is called', () => {
    const params = {
      message: 'Hello',
      type: 'info' as TToastType,
      duration: 3000,
    };
    const mockedAddToast = vi.spyOn(toastActions, 'addToast');
    const { result } = renderHook(() => useToast());
    result.current.showToast(params.message, params.type, params.duration);
    expect(mockedAddToast).toHaveBeenCalledWith(params);
  });
  it.todo("should call showToast with 'success' type when success method is used");
  it.todo("should call showToast with 'info' type when info method is used");
  it.todo("should call showToast with 'warning' type when warning method is used");
  it.todo("should call showToast with 'danger' type when danger method is used");
  it.todo('should use default duration of 5000ms when no duration is provided');
  it.todo('should use custom duration when duration parameter is passed');
  it.todo('should return all expected methods from the hook');
});
