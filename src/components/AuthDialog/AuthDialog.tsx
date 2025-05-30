import { Button, HelperText, Label, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import type { TRootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../../store/dialogSlice';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { IAuthFormData } from '../../types';
import { useState } from 'react';
import { supabase } from '../../supabaseClient';

const AuthDialog = () => {
  const [loading, setLoading] = useState(false);
  const isShowDialog = useSelector((state: TRootState) => state.dialogs.isOpenAuthDialog);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAuthFormData>();

  const onClose = () => {
    dispatch(closeDialog('isOpenAuthDialog'));
  };

  const handleLogin: SubmitHandler<IAuthFormData> = async (data) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email: data.email });
    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert('Check your email for the login link!');
    }
    setLoading(false);
  };

  return (
    <Modal dismissible show={isShowDialog} size="md" onClose={onClose} popup>
      <ModalHeader />
      <ModalBody>
        <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Добро пожаловать</h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email">Адрес электронной почты</Label>
            </div>
            <TextInput
              placeholder="Введите Email"
              {...register('email', {
                required: 'Необходимо указать электронную почту',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Введенное значение не соответствует формату электронной почты',
                },
              })}
              color={errors.email ? 'failure' : ''}
            />
            {errors.email && <HelperText>{errors.email.message}</HelperText>}
          </div>
          <div className="w-full">
            <Button className="cursor-pointer" type="submit" disabled={loading}>
              Войти
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default AuthDialog;
