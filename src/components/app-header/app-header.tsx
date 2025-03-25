import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { selectUser } from '../../../src/services/slices/user';
import { useSelector } from '../../../src/services/store';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);
  return <AppHeaderUI userName={user?.name} />;
};
