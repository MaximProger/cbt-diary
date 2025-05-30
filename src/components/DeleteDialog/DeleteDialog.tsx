import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import type { TAppDispatch, TRootState } from '../../store';
import { closeDialog } from '../../store/dialogSlice';
import { clearDeleteEntryId, deleteEntry } from '../../store/entrySlice';
import { useToast } from '@/hooks/useToast';

const DeleteDialog = () => {
  const toast = useToast();
  const isShowDialog = useSelector((state: TRootState) => state.dialogs.isOpenDeleteDialog);
  const deleteEntryId = useSelector((state: TRootState) => state.entries.deleteEntryId);
  const dispatch: TAppDispatch = useDispatch();

  const handleCloseDialog = () => {
    dispatch(closeDialog('isOpenDeleteDialog'));
    dispatch(clearDeleteEntryId());
  };

  const handleDeleteEntry = async () => {
    if (deleteEntryId) {
      try {
        await dispatch(deleteEntry(deleteEntryId)).unwrap();
        toast.success('Запись успешно удалена!');
        handleCloseDialog();
      } catch (error) {
        console.error(error);
        toast.danger('Произошла ошибка при удалении записи!');
      }
    }
  };

  return (
    <Modal show={isShowDialog} size="md" onClose={handleCloseDialog} popup dismissible>
      <ModalHeader />
      <ModalBody>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Вы уверены, что хотите удалить эту запись?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteEntry} className="cursor-pointer">
              Да, я уверен
            </Button>
            <Button color="gray" onClick={handleCloseDialog} className="cursor-pointer">
              Нет, отменить
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DeleteDialog;
