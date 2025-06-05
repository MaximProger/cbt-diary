import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader, Textarea } from 'flowbite-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../../store/dialogSlice';
import type { IFormData } from '../../types';
import { createEntry } from '../../store/entrySlice';
import type { TAppDispatch, TRootState } from '../../store';
import type { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/useToast';
import { useState } from 'react';

const textAreaSize = 5;

interface IProps {
  user: User;
}

const AddDialog = ({ user }: IProps) => {
  const toast = useToast();
  const isShowDialog = useSelector((state: TRootState) => state.dialogs.isOpenAddDialog);
  const dispatch: TAppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<IFormData>();
  const onSubmit: SubmitHandler<IFormData> = async (formData) => {
    setIsLoading(true);
    const entry = {
      created_at: new Date().toISOString(),
      created_by: user.id,
      worst_case: formData.worstCase,
      worst_consequences: formData.worstConsequences,
      what_can_i_do: formData.whatCanIDo,
      how_will_i_cope: formData.howWillICope,
    };

    try {
      await dispatch(createEntry(entry)).unwrap();
      handleDialogClose();
      reset();
      toast.success('Запись успешно добавлена!');
    } catch (error) {
      console.error(error);
      toast.danger('Произошла ошибка при добавлении записи!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    dispatch(closeDialog('isOpenAddDialog'));
  };

  return (
    <Modal dismissible size="3xl" show={isShowDialog} onClose={handleDialogClose}>
      <ModalHeader>Добавление записи</ModalHeader>
      <ModalBody>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="worstCase">Что самое худшее может случиться в этой ситуации</Label>
            </div>
            <Textarea
              id="worstCase"
              rows={textAreaSize}
              className="resize-none"
              {...register('worstCase', { required: true })}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="worstConsequences">Какие самые плохие последствия могут быть у этой ситуации</Label>
            </div>
            <Textarea
              id="worstConsequences"
              rows={textAreaSize}
              className="resize-none"
              {...register('worstConsequences', { required: true })}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="whatCanIDo">Что я смогу сделать в этой ситуации</Label>
            </div>
            <Textarea
              id="whatCanIDo"
              rows={textAreaSize}
              className="resize-none"
              {...register('whatCanIDo', { required: true })}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="howWillICope">Как я справлюсь</Label>
            </div>
            <Textarea
              id="howWillICope"
              rows={textAreaSize}
              className="resize-none"
              {...register('howWillICope', { required: true })}
            />
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleSubmit(onSubmit)} disabled={!isValid || isLoading}>
          {isLoading ? 'Создание...' : 'Создать'}
        </Button>
        <Button color="gray" onClick={handleDialogClose}>
          Отмена
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddDialog;
