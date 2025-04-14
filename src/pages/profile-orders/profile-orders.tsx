import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getOrders, fetchUserOrders } from '../../../src/services/slices/order';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getOrders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
