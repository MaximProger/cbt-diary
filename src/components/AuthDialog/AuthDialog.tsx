import { Button, HelperText, Modal, ModalBody, ModalFooter, ModalHeader, TextInput } from 'flowbite-react';
import type { TRootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../../store/dialogSlice';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { IAuthFormData } from '../../types';
import { useState } from 'react';
import { supabase } from '@/supabaseClient';
import useToast from '@/hooks/useToast/useToast';
import DialogLabel from '../DialogLabel/DialogLabel';

const AuthDialog = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isShowDialog = useSelector((state: TRootState) => state.dialogs.isOpenAuthDialog);
  const dispatch = useDispatch();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAuthFormData>();

  const onClose = () => {
    reset();
    dispatch(closeDialog('isOpenAuthDialog'));
  };

  const handleLogin: SubmitHandler<IAuthFormData> = async (data) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({ email: data.email });
      if (error) {
        toast.danger('Во время авторизации произошла ошибка!');
      } else {
        toast.success('Проверьте свой email для получения ссылки для входа!');
        onClose(); // Закрыть диалог после успешной отправки
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.danger('Произошла неожиданная ошибка!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal dismissible show={isShowDialog} size="md" onClose={onClose}>
      <ModalHeader>Добро пожаловать!</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(handleLogin)} data-testid="form">
          <div>
            <DialogLabel htmlFor="email">Адрес электронной почты</DialogLabel>
            <TextInput
              id="email"
              placeholder="Введите Email"
              {...register('email', {
                required: 'Необходимо указать электронную почту',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Введенное значение не соответствует формату электронной почты',
                },
              })}
              color={errors.email ? 'failure' : 'gray'}
            />
            {errors.email && <HelperText>{errors.email.message}</HelperText>}
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          size="md"
          className="cursor-pointer"
          type="submit"
          disabled={isLoading}
          onClick={handleSubmit(handleLogin)}
          data-testid="submit"
        >
          {isLoading ? 'Отправка...' : 'Войти'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AuthDialog;
