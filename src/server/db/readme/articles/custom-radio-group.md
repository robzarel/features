Делаем кастомный RadioGroup в 99 строк для React

Пишем минималистичный кастомный RadioGroup компонент для React приложения и парочку unit тестов на Jest.

## План действий

Общий план действий состоит из 6 этапов:

1. Понять, что хотим получить
2. Реализовать компонент Option
3. Написать компонент RadioGroup
4. Собрать всё в контейнере и запустить
5. Сделать поддержку ввода с клавиатуры
6. Покрыть тестами

Поехали!

## Целевой результат

Нам нужна кастомная радио группа для выбора одного из множества вариантов. Для удобства
предположим, что у нас есть некая форма и в ней нужна "выбиралка" периода, для выгрузки какой-либо статистики/контента за определённый период времени.

Сделаем компонент в виде горизонтальной плашки, с набором вариантов в виде кнопок. В целом нет никаких ограничений в том, чтобы изменить ui компонента так, как вам это будет требоваться. Feel free to edit, как говорится.

По итогу получим вот такой минималистичный компонент. Демо: [codesandbox.custom-radio](https://codesandbox.io/s/robzare-custom-radio-jte0kj)

PS: в данной статье не будет описания работы с формами и валидацией. Решений подобных задач очень много, стоит только погуглить). Например один из вариантов я описываю в статье [Валидация форм без зависимостей](https://habr.com/ru/articles/732690/).

Поехали!

## Пишем компонент Option

### Интерфейсы

Начнём с того, что определим структуру нашего варианта выбора. Он будет минималистичен и включать 2 параметра:

```typescript
type OptionType = { value: string; title: string };
```

Сам же компонент Options должен уметь делать несколько вещей:

- **отображать** один вариант выбора
- промечать **выбранный** элемент отличным от других
- вызывать **onChange** при выборе клике на элемент

При переводе на typescript интерфейс компонента Option выглядит следующим образом:

```typescript
type OptionProps = {
  value: OptionType['value'];
  title: OptionType['title'];
  selected: OptionType['value'];
  groupName: string;
  onChange?: (value: string) => void;
};
```

### Верстка

Для стилизации будем использовать css modules для стилизации (поскольку в основе приложения лежит react-create-app с шаблоном ts, то поддержка css modules у нас уже реализована из коробки).
Нам достаточно только импортировать стили и применять к элементам:

```typescript
  import Styles from './index.module.css';
  ...
  <div className={Styles.paginator}>...</div>
```

Сам же компонент выглядит очень просто:

```typescript
const Option = (props: OptionProps) => {
  const { value, title, selected, groupName, onChange } = props;

  const handleChange = () => onChange?.(value);

  const inputId = `${groupName}_radio_item_with_value__${value}`;

  return (
    <div className={Styles.item} key={value} data-checked={value === selected}>
      <input
        className={Styles.input}
        type='radio'
        name={groupName}
        id={inputId}
        value={value}
        onChange={handleChange}
      />
      <label className={Styles.label} htmlFor={inputId}>
        {title}
      </label>
    </div>
  );
};
```

Простановка data-checked в **true** закрывает требование "промечать выбранный элемент отличным от других". Затем просто рендерим title и вешаем handleChange на onChange нашего инпута.

## Пишем компонент RadioGroup

### Интерфейсы

Компонент RadioGroup должен принимать список options, коллбэк onChange и значение выбранного элемента. Ну и поскольку мы делаем именно [Radio group](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#defining_a_radio_group), а не что-то другое, нам нужно проставлять имя этой группы.

В итоге получаем интерфейс, состоящий из 4х пропсов:

```typescript
type RadioGroupProps = {
  name: string;
  options: OptionType[];
  selected: OptionType['value'];
  onChange?: (value: string) => void;
};
```

### Вёрстка

В компоненте нам надо отрендерить список option и объявить handleChange для обработки выбранного элемента. Плюс для оптимизации обернём компонент в [React.memo](https://react.dev/reference/react/memo).

```typescript
const RadioGroup = (props: RadioGroupProps) => {
  const { name, options, selected, onChange } = props;

  const handleChange = (value: string) => onChange?.(value);

  return (
    <div className={Styles.group}>
      {options.map(({ value, title }) => (
        <Option
          key={value}
          groupName={name}
          value={value}
          title={title}
          selected={selected}
          onChange={handleChange}
        />
      ))}
    </div>
  );
};

export default React.memo(RadioGroup);
```

## Собираем всё в контейнере и запускаем

```typescript
import { useState } from 'react';

import options from './components/radio/options.json';
import Radio from './components/radio';

import './styles.css';

export default function App() {
  const [period, setPeriod] = useState('');

  const handlePeriodChange = (val: string) => {
    setPeriod(val);
  };

  return (
    <div className='App'>
      <h1>Custom RadioGroup component example</h1>
      <h3>Выбрать период</h3>
      <div className='Radio'>
        <Radio
          selected={period}
          name='radio'
          onChange={handlePeriodChange}
          options={options}
        />
      </div>
    </div>
  );
}
```

## Поддержка ввода с клавиатуры

Для реализации возможности взаимодействия с RadioGroup с клавиатуры, нам потребуется немного доработать наш Option компонент. А именно:

- в **Option** нам нужно слушать событие нажатия, но при этом проверять находится ли наш option в фокусе или нет. Если option в фокусе, то вызываем обработчик **onClick**
- немного поколдовать с tabindex.

В итоге получаем следующие доработки:

```typescript
import { useEffect, useRef } from 'react';

const Option = (props: OptionProps) => {
  const optionRef = useRef<HTMLDivElement>(null);
  ...
  useEffect(() => {
    const option = optionRef.current;

    if (!option) return;

    const handleEnterKeyDown = (event: KeyboardEvent) => {
      if ((document.activeElement === option) && event.key === 'Enter') {
        onChange?.(value);
      }
    }

    option.addEventListener('keydown', handleEnterKeyDown);

    return () => {
      option.removeEventListener('keydown', handleEnterKeyDown);
    };
  }, [value, onChange]);

  return (
    <div
      className={Styles.item}
      { /* rest props */ }
      ref={optionRef}
      tabIndex={0}
    >
      <input className={Styles.input} { /* rest props */ } tabIndex={-1} />
      ...
    </div>
  );
}
```

Мы исключаем input из обхода элементов при использовании клавиши tab, проставляя tabindex в отрицательное значение. И включаем в этот обходи div обёртку всего нашего кастомного option.
Таким образом дефолтное поведение браузера при фокусе на элемент будет работать для всего нашего компонента. Потом можем через css добавить псевдоклассов focus-visible.

activeElement содержит в себе ссылку на элемент документа, который находится в фокусе. Подробнее можно прочитать на MDN: [document.activeElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement).

Есть тонкости в разнице focus и focus-visible, про которые можно почитать в статье [Doka:focus-visible](https://doka.guide/css/focus-visible/)

## Пишем пару unit тестов

Перед началом проставляем атрибут **data-testid** для каждого Option, для того, чтобы было проще искать элементы в тестах.

```typescript
const Option = (props: OptionProps) => {
  ...
  const inputId = `${groupName}_radio_item_with_value__${value}`;

  return (
    <div className={Styles.item} { /* rest props */ } data-testid={inputId}>...</div>
  );
};
```

Про структуру теста и используемые методы можно прочитать в другой моей статье про [пагинацию в React приложении](https://habr.com/ru/articles/734980/) в разделе **Структура теста**.

Всё первоначальные настройки для запуска тестов у нас уже есть из коробки [create-react-app](https://create-react-app.dev/docs/running-tests/).

Для нашего мини компонента напишем парочку мини тестов. Проверим, что атрибут **data-checked** проставляется при выборе элемента и корректно вызывается **onChange**:

```javascript
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import RadioGroup from './index';
import options from './options.json';

describe('React component: RadioGroup', () => {
  it('Должен проставляться атрибут [data-checked="true"] на option, если было выбрано его значение', async () => {
    render(
      <RadioGroup
        selected={options[2].value}
        name='id'
        onChange={jest.fn()}
        options={options}
      />
    );

    const radioItem = screen.getByTestId(
      `radio_item_with_value__${options[2].value}`
    );
    expect(radioItem).toHaveAttribute('data-checked', 'true');
  });

  it('Должен вызываться обработчик "onChange" при клике на option', async () => {
    const handleChange = jest.fn();

    render(
      <RadioGroup
        selected={options[2].value}
        name='id'
        onChange={handleChange}
        options={options}
      />
    );

    const label = screen.getByLabelText(options[2].title);
    fireEvent.click(label);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
```

PS:
Про фронтовые тесты есть **отличная** статья из блога Samokat.tech [Как тестировать современный фронтенд](https://habr.com/ru/companies/samokat_tech/articles/704342/).

## Итого

Спасибо за чтение и удачи в написании ваших кастомных компонентов)

PS: Ссылки из статьи:

- Код и демо: [codesandbox.custom-radio](https://codesandbox.io/s/robzare-custom-radio-jte0kj)
- другие статьи
  - про [Пагинацию в React приложении](https://habr.com/ru/articles/734980/)
  - про [Кастомный select для React](https://habr.com/ru/articles/735224/)
  - про [Валидацию форм без зависимостей](https://habr.com/ru/articles/732690/)
  - про то, [Как тестировать современный фронтенд](https://habr.com/ru/companies/samokat_tech/articles/704342/)
- про React
  - про [create-react-app](https://create-react-app.dev/docs/running-tests/)
  - про [React.memo](https://react.dev/reference/react/memo)
- про вёрстку
  - про [Radio group](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#defining_a_radio_group) на MDN
  - про [document.activeElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement)
  - про разницу [:focus vs :focus-visible](https://doka.guide/css/focus-visible/)
