import { FC, useMemo, useEffect } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { clearConstructor } from '../../services/slices/burger';
import { createOrder, closeOrderModal } from '../../services/slices/order';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { burger, order, user } = useSelector((state) => ({
    burger: state.burger,
    order: state.order,
    user: state.user
  }));

  // Сбрасываем состояние при монтировании компонента
  useEffect(() => {
    dispatch(closeOrderModal());
  }, [dispatch]);

  // Очищаем конструктор при успешном заказе
  useEffect(() => {
    if (order.orderModalData) {
      dispatch(clearConstructor());
    }
  }, [order.orderModalData, dispatch]);

  const price = useMemo(
    () =>
      (burger.bun ? burger.bun.price * 2 : 0) +
      burger.ingredients.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [burger]
  );

  const onOrderClick = () => {
    if (!burger.bun || order.orderRequest) return;

    if (!user.isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const ingredients = [
      burger.bun._id,
      ...burger.ingredients.map((item: TConstructorIngredient) => item._id),
      burger.bun._id
    ];

    dispatch(createOrder(ingredients));
  };

  const handleCloseModal = () => {
    dispatch(closeOrderModal());
    navigate(location.pathname, { replace: true }); // Обновляем URL
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={order.orderRequest}
      constructorItems={burger}
      orderModalData={order.orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
};
