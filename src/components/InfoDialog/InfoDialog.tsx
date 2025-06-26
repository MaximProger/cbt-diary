import type { TAppDispatch, TRootState } from '@/store';
import { closeDialog } from '@/store/dialogSlice';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';

const InfoDialog = () => {
  const dispatch: TAppDispatch = useDispatch();
  const isShowDialog = useSelector((state: TRootState) => state.dialogs.isOpenInfoDialog);

  const handleDialogClose = () => {
    dispatch(closeDialog('isOpenInfoDialog'));
  };

  return (
    <Modal dismissible show={isShowDialog} onClose={handleDialogClose}>
      <ModalHeader>Дневник катастрофизации</ModalHeader>
      <ModalBody>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-(--text-quaternary)">
            Этот дневник помогает замечать и осознавать склонность к катастрофическому мышлению — привычке представлять
            худшие сценарии и преувеличивать опасности. Записывая свои мысли и оценивая их реалистичность, вы учитесь
            замечать и оспаривать искажения восприятия. Со временем это снижает уровень тревоги и помогает реагировать
            на стрессовые ситуации более спокойно и осознанно.
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleDialogClose}>Понятно</Button>
      </ModalFooter>
    </Modal>
  );
};

export default InfoDialog;
