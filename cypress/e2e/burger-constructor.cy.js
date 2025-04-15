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

      // 1. Проверяем, что ингредиента еще нет в конструкторе
      cy.get('[data-cy="constructor"]').should('not.contain', ingredient.name);
      cy.get('.constructor-element').should('not.exist');

      // 2. Кликаем по кнопке "Добавить"
      cy.get(`[data-cy="${ingredient._id}"]`).within(() => {
        cy.get('button').click({ force: true });
      });

      // 3. Проверяем, что ингредиент появился в конструкторе
      cy.get('[data-cy="constructor"]').should('exist');
      cy.get('.constructor-element')
        .should('exist')
        .and('contain.text', ingredient.name);
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
      // Альтернативный вариант проверок для текущей структуры
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="modal"]').within(() => {
        // Проверяем что children содержит нужный ингредиент
        cy.get('*').should('contain', ingredient.name);
        // Или ищем по тексту внутри модалки
        cy.contains(ingredient.name).should('be.visible');
      });
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

describe('Успешное оформление заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'ingredients'
    );
    cy.intercept('GET', '/api/orders/all', { fixture: 'feed.json' }).as('feed');
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('user');
    cy.setCookie('accessToken', 'mockAccessTokenForJohnT');
    localStorage.setItem('refreshToken', 'mockRefreshTokenForJohnT');

    cy.visit('/');
    cy.wait(['@ingredients', '@user']);
    cy.get('#modals').should('be.empty');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Полный цикл оформления заказа', () => {
    cy.fixture('ingredients.json').then((ingredients) => {
      console.log(ingredients.data); // Проверяем фикстуру

      const bun = ingredients.data.find((i) => i.type === 'bun');
      const main = ingredients.data.find((i) => i.type === 'main');
      const sauce = ingredients.data.find((i) => i.type === 'sauce');

      // 1. Добавление булки
      cy.get(`[data-cy="${bun._id}"]`).within(() => cy.get('button').click());
      cy.wait(1000); // Даем время на обновление UI
      cy.get('[data-cy="constructor"]').should('contain', bun.name);

      // 2. Добавление начинки
      cy.get(`[data-cy="${main._id}"]`).within(() => cy.get('button').click());
      cy.wait(1000);
      cy.get('[data-cy="constructor"]').should('contain', main.name);

      // 3. Добавление соуса
      cy.get(`[data-cy="${sauce._id}"]`).within(() => cy.get('button').click());
      cy.wait(1000);
      cy.get('[data-cy="constructor-main"]').should('contain', sauce.name); // Вместо "constructor-sauce"
    });

    // 4. Оформление заказа
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as(
      'placeOrder'
    );
    cy.get('button').contains('Оформить заказ').click();
    cy.wait('@placeOrder');

    // 5. Проверка модального окна
    cy.get('#modals').should('be.visible');
    cy.get('[data-cy="order-number"]')
      .invoke('text')
      .then((orderNumber) => {
        expect(orderNumber).to.match(/^\d+$/); // Проверяем, что это только цифры
      });

    // 6. Закрытие модалки
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    // 7. Проверка очистки конструктора
    cy.wait(1000);
    cy.get('[data-cy="constructor"]').should(
      'not.contain',
      'Краторная булка N-200i'
    );
  });
});
