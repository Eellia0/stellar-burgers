import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { clearConstructor } from '../../services/slices/burger';
import { createOrder, closeOrderModal } from '../../services/slices/order';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получаем данные из хранилища
  const { burger, order, user } = useSelector((state) => ({
    burger: state.burger,
    order: state.order,
    user: state.user
  }));

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
      navigate('/login');
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
    dispatch(clearConstructor());
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
