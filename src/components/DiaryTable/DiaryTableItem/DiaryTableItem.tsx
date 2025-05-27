import { TableCell, TableRow } from 'flowbite-react';

interface IProps {
  date: Date;
  worstCase: string;
  worstConsequences: string;
  whatCanIDo: string;
  howWillICope: string;
}

const DiaryTableItem = ({ date, worstCase, worstConsequences, whatCanIDo, howWillICope }: IProps) => {
  const formattedDate = date
    .toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(',', ' ');

  return (
    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{formattedDate}</TableCell>
      <TableCell>{worstCase}</TableCell>
      <TableCell>{worstConsequences}</TableCell>
      <TableCell>{whatCanIDo}</TableCell>
      <TableCell>{howWillICope}</TableCell>
    </TableRow>
  );
};

export default DiaryTableItem;
