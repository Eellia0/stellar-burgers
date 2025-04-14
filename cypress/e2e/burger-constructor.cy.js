describe('Загрузка ингредиентов', () => {
  it('Перехват запроса и проверка отображения ингредиентов', () => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.visit('/'); // Переход на страницу конструктора
    cy.wait('@getIngredients'); // Ожидание запроса

    // Проверяем, что все ингредиенты из моковых данных отображаются
    cy.fixture('ingredients.json').then((data) => {
      data.data.forEach((ingredient) => {
        cy.get(`[data-cy="${ingredient._id}"]`).should('exist');
      });
    });
  });
});

describe('Добавление ингредиента в конструктор по кнопке', () => {
  it('Клик по кнопке "Добавить" и проверка появления', () => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.visit('/');
    cy.wait('@getIngredients');

    cy.fixture('ingredients.json').then((data) => {
      const ingredient = data.data.find(
        (ingredient) => ingredient.type !== 'bun'
      );

      // Кликаем по кнопке "Добавить"
      cy.get(`[data-cy="${ingredient._id}"]`).within(() => {
        cy.get('button').click({ force: true });
      });

      // Ожидаем, пока ингредиент появится в конструкторе
      cy.get('[data-cy="constructor"]').should('exist');

      // Ожидание перед проверкой
      cy.wait(500);

      // Проверяем, что ингредиент появился в конструкторе
      cy.get('.constructor-element').should('contain.text', ingredient.name);
    });
  });
});

describe('Открытие модального окна ингредиента', () => {
  it('Клик по ингредиенту открывает модальное окно', () => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.visit('/');
    cy.wait('@getIngredients');

    cy.fixture('ingredients.json').then((data) => {
      const ingredient = data.data[0]; // Берем первый ингредиент

      // Кликаем по ингредиенту
      cy.get(`[data-cy="${ingredient._id}"] a`).click();

      // Проверяем, что модальное окно появилось
      cy.get('[data-cy="modal"]').should('exist');

      // Проверяем, что в модальном окне отображается нужный ингредиент
      cy.contains(ingredient.name).should('exist');
    });
  });
});

describe('Закрытие модального окна', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '/api/auth/user', { statusCode: 200, body: {} });
  });

  it('Закрывает модалку по крестику', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.fixture('ingredients.json').then((fixture) => {
      const ingredient = fixture.data[0];
      const ingredientId = ingredient._id;

      // Открываем модалку
      cy.get(`[data-cy="${ingredientId}"]`).click();
      cy.get('[data-cy="modal"]', { timeout: 10000 }).should('be.visible');

      // Клик по крестику
      cy.get('[data-cy="modal-close"]')
        .should('be.visible')
        .click({ force: true });

      // Проверяем что модалка удалена из DOM
      cy.get('[data-cy="modal"]').should('not.exist');

      // Дополнительная проверка через jQuery
      cy.wrap(null).should(() => {
        expect(Cypress.$('[data-cy="modal"]').length).to.eq(0);
      });
    });
  });
});

describe('Закрытие модального окна по клику на оверлей', () => {
  it('Клик на оверлей закрывает модальное окно', () => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.visit('/');
    cy.wait('@getIngredients');

    cy.fixture('ingredients.json').then((data) => {
      const ingredient = data.data[0]; // Берем первый ингредиент

      // Открываем модальное окно
      cy.get(`[data-cy="${ingredient._id}"] a`).click();
      cy.get('[data-cy="modal"]').should('exist');

      // Кликаем по оверлею
      cy.get('[data-cy="modal-overlay"]').click({ force: true });

      // Проверяем, что модальное окно исчезло
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });
});

describe('Редирект на страницу логина при оформлении заказа без авторизации', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );
    cy.intercept('GET', '/api/auth/user', { statusCode: 401, body: {} }); // Симулируем, что пользователь НЕ залогинен
  });

  it('Перенаправляет на логин при попытке оформить заказ', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.fixture('ingredients.json').then((data) => {
      const bun = data.data.find((ingredient) => ingredient.type === 'bun');
      const filling = data.data.find(
        (ingredient) => ingredient.type === 'main'
      );

      // Добавляем булку
      cy.get(`[data-cy="${bun._id}"]`).within(() => {
        cy.get('button').click();
      });

      // Добавляем начинку
      cy.get(`[data-cy="${filling._id}"]`).within(() => {
        cy.get('button').click();
      });
    });

    // Нажимаем "Оформить заказ"
    cy.get('[data-cy="constructor-button"]').click();

    // Проверяем, что произошел редирект на `/login`
    cy.url().should('include', '/login');
  });
});
