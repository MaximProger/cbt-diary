import { Toast, ToastToggle } from 'flowbite-react';
import { HiCheck, HiExclamation, HiInformationCircle, HiX } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { removeToast } from '../../store/toastSlice';
import { useCallback, useEffect, useState } from 'react';
import './ToastItem.css';
import type { IToast } from '@/types';

interface IProps {
  toast: IToast;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  animation?: 'slide' | 'bounce' | 'fade';
}

const ToastItem = ({ toast, animation = 'slide' }: IProps) => {
  const dispatch = useDispatch();
  const [isExiting, setIsExiting] = useState(false);
  const [showProgress, setShowProgress] = useState(true);

  const icons = {
    success: (
      <div
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
        data-testid="success_icon"
      >
        <HiCheck className="h-5 w-5" />
      </div>
    ),
    info: (
      <div
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200"
        data-testid="info_icon"
      >
        <HiInformationCircle className="h-5 w-5" />
      </div>
    ),
    warning: (
      <div
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200"
        data-testid="warning_icon"
      >
        <HiExclamation className="h-5 w-5" />
      </div>
    ),
    danger: (
      <div
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"
        data-testid="danger_icon"
      >
        <HiX className="h-5 w-5" />
      </div>
    ),
  };

  const getAnimationClass = () => {
    if (isExiting) {
      return animation === 'fade' ? 'toast-fade-exit' : 'toast-exit';
    }

    switch (animation) {
      case 'bounce':
        return 'toast-bounce-enter';
      case 'fade':
        return 'toast-fade-enter';
      default:
        return 'toast-enter';
    }
  };

  const handleClose = useCallback(() => {
    setIsExiting(true);
    // Ждем завершения анимации перед удалением
    setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, 300);
  }, [dispatch, toast.id]);

  const handleMouseEnter = () => {
    setShowProgress(false);
  };

  const handleMouseLeave = () => {
    setShowProgress(true);
  };

  // Автоматическое закрытие
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, handleClose]);

  return (
    <div
      className={`toast-container relative ${getAnimationClass()}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid="toast"
    >
      <Toast className="mb-2 shadow-lg">
        {icons[toast.type]}
        <div className="ml-3 text-sm font-normal">{toast.message}</div>
        <ToastToggle onDismiss={handleClose} />

        {/* Прогресс-бар */}
        {toast.duration && showProgress && !isExiting && (
          <div
            className="toast-progress"
            style={{
              animationDuration: `${toast.duration}ms`,
              backgroundColor:
                toast.type === 'success'
                  ? '#10b981'
                  : toast.type === 'danger'
                    ? '#ef4444'
                    : toast.type === 'warning'
                      ? '#f59e0b'
                      : '#3b82f6',
            }}
            data-testid="progress_bar"
          />
        )}
      </Toast>
    </div>
  );
};

export default ToastItem;
