import { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusTextMap: Record<string, string> = {
  done: 'Выполнен',
  pending: 'Готовится',
  created: 'Создан'
};

const statusColorMap: Record<string, string> = {
  done: '#00CCCC',
  pending: '#E52B1A',
  created: '#F2F2F3'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => (
  <OrderStatusUI
    textStyle={statusColorMap[status] || '#F2F2F3'}
    text={statusTextMap[status] || status}
  />
);
