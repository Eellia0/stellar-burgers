import { FC } from 'react';
import { useSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';
import {
  selectDoneOrders,
  selectPendingOrders,
  selectTotal,
  selectTotalToday
} from '../../services/slices/feeds';

export const FeedInfo: FC = () => {
  const readyOrders = useSelector(selectDoneOrders);
  const pendingOrders = useSelector(selectPendingOrders);
  const total = useSelector(selectTotal);
  const totalToday = useSelector(selectTotalToday);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
