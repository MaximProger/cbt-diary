import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../../store/dialogSlice';
import type { IEntry, IFormData } from '../../types';
import { editEntry, selectEntries } from '../../store/entrySlice';
import type { TAppDispatch, TRootState } from '../../store';
import useToast from '@/hooks/useToast/useToast';
import { useEffect, useState } from 'react';
import DialogTextarea from '../DialogTextarea/DialogTextarea';
import DialogLabel from '../DialogLabel/DialogLabel';

const EditDialog = () => {
  const toast = useToast();
  const isShowDialog = useSelector((state: TRootState) => state.dialogs.isOpenEditDialog);
  const editEntryId = useSelector((state: TRootState) => state.entries.editEntryId);
  const dispatch: TAppDispatch = useDispatch();
  const entries: IEntry[] = useSelector(selectEntries);
  const entry = entries.find((entry) => entry.id === editEntryId) || null;
  const [isLoading, setIsLoading] = useState(false);

  const handleDialogClose = () => {
    dispatch(closeDialog('isOpenEditDialog'));
  };

  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty },
    reset,
  } = useForm<IFormData>();

  useEffect(() => {
    if (entry) {
      reset({
        worstCase: entry.worst_case,
        worstConsequences: entry.worst_consequences || '',
        whatCanIDo: entry.what_can_i_do || '',
        howWillICope: entry.how_will_i_cope || '',
      });
    }
  }, [entry, reset]);

  const onSubmit: SubmitHandler<IFormData> = async (formData) => {
    if (!entry) {
      toast.danger('Запись не найдена');
      handleDialogClose();
      return;
    }

    setIsLoading(true);

    const newEntry = {
      ...entry,
      worst_case: formData.worstCase,
      worst_consequences: formData.worstConsequences,
      what_can_i_do: formData.whatCanIDo,
      how_will_i_cope: formData.howWillICope,
    };

    try {
      await dispatch(editEntry(newEntry)).unwrap();
      handleDialogClose();
      reset();
      toast.success('Запись успешно отредактирована!');
    } catch (error) {
      console.error(error);
      toast.danger('Произошла ошибка при редактировании записи!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal dismissible size="3xl" show={isShowDialog} onClose={handleDialogClose}>
      <ModalHeader data-testid="edit_dialog_header">Редактирование записи</ModalHeader>
      <ModalBody>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} data-testid="form">
          <div>
            <DialogLabel htmlFor="worstCase">Что самое худшее может случиться в этой ситуации</DialogLabel>
            <DialogTextarea id="worstCase" registerProps={register('worstCase', { required: true })} />
          </div>
          <div>
            <DialogLabel htmlFor="worstConsequences">
              Какие самые плохие последствия могут быть у этой ситуации
            </DialogLabel>
            <DialogTextarea id="worstConsequences" registerProps={register('worstConsequences', { required: true })} />
          </div>
          <div>
            <DialogLabel htmlFor="whatCanIDo">Что я смогу сделать в этой ситуации</DialogLabel>
            <DialogTextarea id="whatCanIDo" registerProps={register('whatCanIDo', { required: true })} />
          </div>
          <div>
            <DialogLabel htmlFor="howWillICope">Как я справлюсь</DialogLabel>
            <DialogTextarea id="howWillICope" registerProps={register('howWillICope', { required: true })} />
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button size="md" onClick={handleSubmit(onSubmit)} disabled={isLoading || !isValid || !isDirty}>
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </Button>
        <Button size="md" color="gray" onClick={handleDialogClose}>
          Отмена
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditDialog;
