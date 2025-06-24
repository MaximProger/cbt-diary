import { useDispatch } from 'react-redux';
import { addToast } from '@/store/toastSlice';

const useToast = () => {
  const dispatch = useDispatch();

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'danger', duration: number = 5000) => {
    dispatch(addToast({ message, type, duration }));
  };

  // Удобные методы для разных типов
  const success = (message: string, duration?: number) => showToast(message, 'success', duration);
  const info = (message: string, duration?: number) => showToast(message, 'info', duration);
  const warning = (message: string, duration?: number) => showToast(message, 'warning', duration);
  const danger = (message: string, duration?: number) => showToast(message, 'danger', duration);

  return {
    showToast,
    success,
    info,
    warning,
    danger,
  };
};

export default useToast;
