import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader, Textarea } from 'flowbite-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../../store/dialogSlice';
import type { IFormData } from '../../types';
import { addEntry } from '../../store/entrySlice';

const textAreaSize = 5;

const Dialog = () => {
  const isSlowDialog = useSelector((state) => state.dialogs.isOpenDialog);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<IFormData>();
  const onSubmit: SubmitHandler<IFormData> = (data) => {
    console.log(data);
    dispatch(addEntry(data));
    onClose();
    reset();
  };

  const onClose = () => {
    dispatch(closeDialog());
  };

  return (
    <Modal dismissible size="3xl" show={isSlowDialog} onClose={onClose}>
      <ModalHeader>Добавление записи</ModalHeader>
      <ModalBody>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email">Что самое худшее может случиться в этой ситуации</Label>
            </div>
            <Textarea rows={textAreaSize} className="resize-none" {...register('worstCase', { required: true })} />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email">Какие самые плохие последствия могут быть у этой ситуации</Label>
            </div>
            <Textarea
              rows={textAreaSize}
              className="resize-none"
              {...register('worstConsequences', { required: true })}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email">Что я смогу сделать в этой ситуации</Label>
            </div>
            <Textarea rows={textAreaSize} className="resize-none" {...register('whatCanIDo', { required: true })} />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email">Как я справлюсь</Label>
            </div>
            <Textarea rows={textAreaSize} className="resize-none" {...register('howWillICope', { required: true })} />
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleSubmit(onSubmit)} disabled={!isValid}>
          Создать
        </Button>
        <Button color="gray" onClick={onClose}>
          Отмена
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default Dialog;
