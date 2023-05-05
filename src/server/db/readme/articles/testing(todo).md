Unit и integration тесты для React приложения

Прикручиваем тесты

каждый шаг будем сопровождать соответствующим шажочком в репозитории.

##

## unit тесты

- устанавливаем тестраннер "jest": "^29.0.3",

```bash
  npm install --save-dev jest ts-jest @types/jest
```

Create a new file in the root and name it jestconfig.json:

{
"transform": {
"^.+\\.(t|j)sx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
"moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"]
}
Remove the old test script in package.json and change it to:

"test": "jest --config jestconfig.json",

пишем простой тестик на примере required валидатора или чего-то простого. Адаптируем вот это вот по сути https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c

## Настраиваем тестирование интеграционное

Под интеграционными будем подразумевать тесты, которые иммитируют пользовательское поведение, т.е. проходят определённые пользовательские сценарии затрагивая запуск нескольких модулей.

### Взять сценарий

Для поиска элементов и их оторбаражения https://www.npmjs.com/package/@testing-library/react
Для удобных ассертов - https://github.com/testing-library/jest-dom
Для иммитации пользовательских событий https://github.com/testing-library/user-event
берём заготовку страницы с инпутом и кнопкой и логикой, которую надо покрыть.
Мб взять что-то поиинтереснее типа модального окна.

### . установить ассершен либы

- "@testing-library/react": "^13.4.0", - для рендеринга без детей и поиска по дереву
- "@testing-library/jest-dom": "^5.16.5", - для удобных матчеров в expect
- "@testing-library/user-event": "^14.4.3", - для

### Покрыть тестом

## Разбор сложностей

1. херота с **await waitFor** d
   вспомнить и разобрать решение.
2. из сложного - работа с системным временем и баг там

```typescript
beforeAll(() => {
  // mocking time (timers) and date object (with random date)
  jest.useFakeTimers();
  jest.setSystemTime(1671867326199);
});
```

```typescript
/**
 * @jest-environment jsdom
 */
```

часто удобно сделать data-test-id аттрибут и таргетить элемент через getByTestId для прогона теста.

Мои выводы и рекомендации

- пилите интеграционные и unit тесты. Пробивайте на это время у ваших лидов и пиэмов.
- тесты это неплохая такая документация. Особенно когда есть выгрузки в красивенькие интерфейсы
