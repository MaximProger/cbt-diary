import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader, Textarea } from 'flowbite-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../../store/dialogSlice';
import type { IEntry, IFormData } from '../../types';
import { editEntry } from '../../store/entrySlice';
import type { TAppDispatch, TRootState } from '../../store';
import { useToast } from '@/hooks/useToast';
import { useEffect, useState } from 'react';

const textAreaSize = 5;

const EditDialog = () => {
  const toast = useToast();
  const isShowDialog = useSelector((state: TRootState) => state.dialogs.isOpenEditDialog);
  const editEntryId = useSelector((state: TRootState) => state.entries.editEntryId);
  const dispatch: TAppDispatch = useDispatch();
  const entries: IEntry[] = useSelector((state: TRootState) => state.entries.entries);
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
      <ModalHeader>Редактирование записи</ModalHeader>
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
        <Button onClick={handleSubmit(onSubmit)} disabled={isLoading || !isValid || !isDirty}>
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </Button>
        <Button color="gray" onClick={handleDialogClose}>
          Отмена
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditDialog;
