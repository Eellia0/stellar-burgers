import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchFeeds,
  selectOrders,
  selectIsLoading
} from '../../services/slices/feeds';
import { Route, Routes, useLocation } from 'react-router-dom';
import { OrderInfo } from '../../components/order-info/order-info';
import { Outlet } from 'react-router-dom';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectIsLoading);
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  return (
    <>
      <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
      <Outlet /> {/* Для вложенных маршрутов */}
      <Routes location={location.state?.backgroundLocation || location}>
        <Route path='/feed/:number' element={<OrderInfo />} />
      </Routes>
    </>
  );
};
