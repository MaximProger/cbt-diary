import { useSelector } from 'react-redux';
import type { TRootState } from '../../store';
import ToastItem from '../ToastItem/ToastItem';

interface IProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  animation?: 'slide' | 'bounce' | 'fade';
  maxToasts?: number;
}

const ToastContainer = ({ position = 'top-right', animation = 'slide', maxToasts = 5 }: IProps) => {
  const toasts = useSelector((state: TRootState) => state.toasts.toasts);

  if (toasts.length === 0) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  const getFlexDirection = () => {
    return position.includes('bottom') ? 'flex-col-reverse' : 'flex-col';
  };
  console.log(toasts);
  const visibleToasts = toasts.slice(-maxToasts);

  return (
    <div
      className={`fixed ${getPositionClasses()} z-50 flex ${getFlexDirection()} gap-2 pointer-events-none`}
      data-testid="container"
    >
      {visibleToasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            // Добавляем задержку для красивого каскадного появления
            animationDelay: `${index * 100}ms`,
          }}
          data-testid="item"
        >
          <ToastItem toast={toast} position={position} animation={animation} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
