import { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal
}) => (
  <section className={styles.burger_constructor} data-cy='constructor'>
    {constructorItems.bun ? (
      <div
        className={`${styles.element} mb-4 mr-4`}
        data-cy='constructor-bun-top'
      >
        <ConstructorElement
          type='top'
          isLocked
          text={`${constructorItems.bun.name} (верх)`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
        data-cy='constructor-no-bun-top'
      >
        Выберите булки
      </div>
    )}
    <ul className={styles.elements} data-cy='constructor-main'>
      {constructorItems.ingredients.length > 0 ? (
        constructorItems.ingredients.map(
          (item: TConstructorIngredient, index: number) => (
            <BurgerConstructorElement
              ingredient={item}
              index={index}
              totalItems={constructorItems.ingredients.length}
              key={item.id}
              data-cy={`constructor-ingredient-${index}`}
            />
          )
        )
      ) : (
        <div
          className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
          data-cy='constructor-no-main'
        >
          Выберите начинку
        </div>
      )}
    </ul>
    {constructorItems.bun ? (
      <div
        className={`${styles.element} mt-4 mr-4`}
        data-cy='constructor-bun-bottom'
      >
        <ConstructorElement
          type='bottom'
          isLocked
          text={`${constructorItems.bun.name} (низ)`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
        data-cy='constructor-no-bun-bottom'
      >
        Выберите булки
      </div>
    )}
    <div className={`${styles.total} mt-10 mr-4`} data-cy='constructor-total'>
      <div className={`${styles.cost} mr-10`} data-cy='constructor-price'>
        <p className={`text ${styles.text} mr-2`}>{price}</p>
        <CurrencyIcon type='primary' />
      </div>
      <Button
        data-cy='constructor-button'
        htmlType='button'
        type='primary'
        size='large'
        children='Оформить заказ'
        onClick={onOrderClick}
      />
    </div>

    {orderRequest && (
      <Modal
        onClose={closeOrderModal}
        title={'Оформляем заказ...'}
        data-cy='modal-loading'
      >
        <Preloader />
      </Modal>
    )}

    {orderModalData && (
      <Modal
        onClose={closeOrderModal}
        title={orderRequest ? 'Оформляем заказ...' : ''}
        data-cy='modal-order'
      >
        <OrderDetailsUI
          orderNumber={orderModalData.number}
          data-cy='order-number'
        />
      </Modal>
    )}
  </section>
);
