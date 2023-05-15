# Кастомный селект

Пишем кастомный select для React приложения. Покрываем всё тестами на Jest.

## План действий

0. Определяем цель
1. Сетапим проект
2. Пишем компонент Select
3. Создаём компонент Option
4. Собираем всё в контейнере и запускаем
5. Покрываем тестами

Поехали!

## Определяем цель

Мы хотим получить простой самописный кастомный селект.

Для примера реализации возьмёмся реализовать кастомный селект для выбора месяца. Предположим, что по требованиям дизайна, он должен уметь отображаться в двух режимах - **строковый** (стандартный выпадающий список) и **плиткой**(по три месяца в ряд).

Поскольку наш селект будет частью формы, нам так же нужно предусмотреть отображение статуса этого поля: **обычный** или **с ошибкой**.

Компонент будет получать состояние из контейнера "сверху". Ровно как и сами опции для выбора. Это позволит нам легко переиспользовать компонент.

Ну и разумеется должны быть способы прокинуть наверх информацию о наступлении событий выбор опции и закрытие выпадающего списка.

## Инициализация приложения

Минимум действий: берём [create-react-app](https://create-react-app.dev/) с шаблоном typescript и разворачиваем приложение.

```bash
  npx create-react-app my-app --template typescript
```

## Пишем селект

### Интерфейс компонента

Переведём все наши требования на typescript и опишем интерфейс нашего селекта:

```typescript
type SelectProps = {
  selected: Option | null;
  options: Option[];
  placeholder?: string;
  mode?: 'rows' | 'cells';
  status?: 'default' | 'invalid';
  onChange?: (selected: Option['value']) => void;
  onClose?: () => void;
};
```

Так же нам нужно определить структуру нашего будущего option. Здесь всё просто - нам нужно будет только 2 поля на каждый вариант:

- **title** для пользовательского отображения
- **value** для отправки в форме на бэк

```typescript
type Option = { title: string; value: string };
```

### Обработчик закрытия

Так как основное назначения нашего селекта это скрывать и показывать наш выпадающий список для пользователя, то мы должны уметь управлять состоянием выпадающего списка. Для отслеживания состояния селекта и соответствующей реакции (рендеринга выпадающего списка) заведём переменную **isOpen**:

```typescript
const [isOpen, setIsOpen] = useState(false);
```

В будущем будем её использовать для реализации [условного рендеринга](https://react.dev/learn/conditional-rendering).

Лучшие практики ui (а так же здравый смысл) подсказывают, что не нужно закрывать выпадающий список по событию **hover** (пользователи нас возненавидят за такое поведение). Поэтому мы будем закрывать наш дропдаун по клику **за пределы нашего элемента**.
Для этого нам понадобится ссылка на html элемент, который будет содержать наш селект. Её (ссылку) запомним с помощью [useRef](https://react.dev/reference/react/useRef):

```typescript
const rootRef = useRef<HTMLDivElement>(null);
```

Дальше (при клике за пределы нашего элемента) будем переключать флаг **isOpen** в состояние **false** и вызывать callback **onClose**. Для этого будем слушать все события **click**, которые у нас есть на нашем **window**, а в обработчике **handleClick** уже реализуем вышеописанную логику:

```typescript
useEffect(() => {
  const handleClick = (event: MouseEvent) => {
    const { target } = event;
    if (target instanceof Node && !rootRef.current?.contains(target)) {
      isOpen && onClose?.();
      setIsOpen(false);
    }
  };

  window.addEventListener('click', handleClick);
}, []);
```

Собственно условие **!rootRef.current?.contains(target)** позволяет нам понять откуда именно пришло событие клика. А дополнительную проверку **target instanceof Node** делаем потому, что не все **event.target** являются элементами. [MDN.EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget):

> Element, and its children, as well as Document and Window, are the most common event targets, but other objects can be event targets, too. For example XMLHttpRequest, AudioNode, and AudioContext are also event targets.

Не забываем, что хорошо бы не оставлять **подвисшими** наши слушатели событий на window, чтобы не привести случайно к утечкам памяти. Для этого нам надо **вернуть** из useEffect функцию, в которой мы отпишемся от нашего события:

```typescript
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {...};

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);
```

Подробнее про связь утечек памяти и обработчиков событий можно почитать в этой неплохой статье: [Causes of Memory Leaks in JavaScript and How to Avoid Them](https://www.ditdot.hr/en/causes-of-memory-leaks-in-javascript-and-how-to-avoid-them#event-listeners)

### Собираем всё вместе

К текущему моменту наш селект выглядит следующим образом:

```typescript
type Option = { title: string; value: string };
type SelectProps = {
  selected: Option | null;
  options: Option[];
  placeholder?: string;
  mode?: 'rows' | 'cells';
  status?: 'default' | 'invalid';
  onChange?: (selected: Option['value']) => void;
  onClose?: () => void;
};

const Select = (props: SelectProps) => {
  const { onClose } = props;
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const { target } = event;
      if (target instanceof Node && !rootRef.current?.contains(target)) {
        isOpen && onClose?.();
        setIsOpen(false);
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [isOpen, onClose]);

  return <div ref={rootRef}>...</div>;
};

export default Select;
```

### Вёрстка

#### Подход к стилизации

Для стилизации будем использовать [css modules](https://github.com/css-modules/css-modules) для стилизации (поскольку в основе приложения лежит react-create-app с шаблоном typescript, то поддержка css modules у нас уже реализована из коробки).
Нам достаточно только импортировать стили и применять к элементам:

```typescript
  import Styles from './index.module.css';
  ...

  <div className={Styles.selectWrapper} ref={rootRef}>...</div>
```

#### Состояния компонента

У нас есть достаточно большое количество переменных, которые так или иначе, влияют на отображение селекта.
Пара вариантов отображения за счёт свойства **status**, зависимость от режима отображения **mode** и состояния **isOpen**. Плюс добавится ещё 2 варианта отображения во состоянии "выбран/не выбран" какой-либо элемент из выпадающего списка. Список большой (и может быть ещё больше при желании).

Для удобной стилизации всех этих состояний мы будем использовать **data-** атрибуты. Состояния выбранного **"режима"** и состояние селекта **"открыт/закрыт"** будут влиять на стилизацию всего компонента, поэтому мы разместим атрибуты **data-is-active** и **data-mode** на рутовом элементе компонента:

```typescript
const Select = (props: SelectProps) => {
  ...
  return (
    <div
      className={Styles.selectWrapper}
      ref={rootRef}
      data-is-active={isOpen}
      data-mode={mode}
    >...</div>
  );
}
```

Так же добавим иконку стрелочки, чтобы наш селект выгладел более "канонично":

```typescript
import { ReactComponent as ArrowDown } from './assets/arrow-down.svg';

const Select = (props: SelectProps) => {
  ...
  return (
    <div
      className={Styles.selectWrapper}
      ref={rootRef}
      data-is-active={isOpen}
      data-mode={mode}
    >
      <div className={Styles.arrow}>
        <ArrowDown />
      </div>
      ...
    </div>
  );
}
```

Импорт svg картинки странный, но что поделать - таковы требования [импорта svg](https://create-react-app.dev/docs/adding-images-fonts-and-files/#adding-svgs) в create-react-app.

Состояния статус и выбран/не выбран" будут влиять на отображение нашего поля ввода (плейсхолдера). Следовательно атрибуты **data-status** и **data-selected** мы добавляем к этому самому плейсхолдеру.

```typescript
const Select = (props: SelectProps) => {
  ...
  return (
  <div
    className={Styles.selectWrapper}
    ref={rootRef}
    data-is-active={isOpen}
    data-mode={mode}
  >
    <div className={Styles.arrow}>
      <ArrowDown />
    </div>
    <div
      className={Styles.placeholder}
      data-status={status}
      data-selected={!!selected?.value}
    >
      {selected?.title || placeholder}
    </div>
    ...
  </div>
  );
}
```

#### Отображение списка

Осталось только отрендерить сам выпадающий список и написать обработчики на выбор значений элементов списка и клика на плейсхолдер.

Обработчик для клика по плейсхолдеру будет максимально простым - его задача просто менять значение булевого флаг **isOpen** на противоложное.
Так же будет второй обработчик, который будет прокидываться в будущий компонент **<Option />**. Делать он будет тоже самое, что и хендлер для клика по плейсхолдеру, только в дополнение вызовет колбэк **onChange**.

Выпадающий список будет спрятан за условный рендеринг.

Немного забегая вперёд, опишем так же интерфейс нашего Option компонента:

```typescript
type OptionProps = {
  option: Option;
  onClick: (value: Option['value']) => void;
};
```

В итоге мы получаем следующий компонет Select:

```typescript
type SelectProps = {
  selected: Option | null;
  options: Option[];
  placeholder?: string;
  mode?: 'rows' | 'cells';
  status?: 'default' | 'invalid';
  onChange?: (selected: Option['value']) => void;
  onClose?: () => void;
};

const Select = (props: SelectProps) => {
  const {
    mode = 'rows',
    options,
    placeholder,
    status = 'default',
    selected,
    onChange,
    onClose,
  } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const { target } = event;
      if (target instanceof Node && !rootRef.current?.contains(target)) {
        isOpen && onClose?.();
        setIsOpen(false);
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [isOpen, onClose]);

  const handleOptionClick = (value: Option['value']) => {
    setIsOpen(false);
    onChange?.(value);
  };
  const handlePlaceHolderClick: MouseEventHandler<HTMLDivElement> = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={Styles.selectWrapper}
      ref={rootRef}
      data-is-active={isOpen}
      data-mode={mode}
    >
      <div className={Styles.arrow}>
        <ArrowDown />
      </div>
      <div
        className={Styles.placeholder}
        data-status={status}
        data-selected={!!selected?.value}
        onClick={handlePlaceHolderClick}
        role='button'
        tabIndex={0}
      >
        {selected?.title || placeholder}
      </div>
      {isOpen && (
        <ul className={Styles.select}>
          {options.map((option) => (
            <Option
              key={option.value}
              option={option}
              onClick={handleOptionClick}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
```

PS: На самом деле нам в этом кейсе не особо нужно проставлять **key**, так как элементы нашего выпадающего списка стабильны и не будут менять своё относительное положение). Но реакт вежливо просит нас проставить ключи, что мы и делаем. Подробнее можно почитать по ссылке: [why-does-react-need-keys](https://react.dev/learn/rendering-lists#why-does-react-need-keys).

## Пишем компонент Option

Минималистичный компонент, который просто отправляет выбранное значение "наверх".

```typescript
type OptionProps = {
  option: Option;
  onClick: (value: Option['value']) => void;
};
const Option = (props: OptionProps) => {
  const {
    option: { value, title },
    onClick,
  } = props;

  const handleClick =
    (clickedValue: Option['value']): MouseEventHandler<HTMLLIElement> =>
    () => {
      onClick(clickedValue);
    };

  return (
    <li
      className={Styles.option}
      value={value}
      onClick={handleClick(value)}
      tabIndex={0}
    >
      {title}
    </li>
  );
};
```

### Код

Весь код компонента можно посмотреть по ссылке [](); TODO

## Используем наш селект

Данные для селекта будем хранить в отдельном файле, под названием **options.json**:

```json
[
  { "title": "янв", "value": "01" },
  { "title": "фев", "value": "02" },
  { "title": "мар", "value": "03" },
  { "title": "апр", "value": "04" },
  { "title": "май", "value": "05" },
  { "title": "июн", "value": "06" },
  { "title": "июл", "value": "07" },
  { "title": "авг", "value": "08" },
  { "title": "сен", "value": "09" },
  { "title": "окт", "value": "10" },
  { "title": "ноя", "value": "11" },
  { "title": "дек", "value": "12" }
]
```

Затем просто импортируем этот файл в наш контейнер вместе с нашим новым компонентом и собираем всё вместе:

```typescript
import { useState } from 'react';

import options from './components/select/options.json';
import Select from './components/select';

import './App.css';

const App = () => {
  const [month, setMonthValue] = useState('');
  const handleMonthSelect = (value: string) => {
    setMonthValue(value);
  };

  const selectedMonth = options.find((item) => item.value === month);

  return (
    <div className='App'>
      <div className='Select'>
        <Select
          mode='cells'
          options={options}
          selected={selectedMonth || null}
          onChange={handleMonthSelect}
          placeholder='Выберите месяц'
        />
      </div>
    </div>
  );
};

export default App;
```

## Пишем тесты

Компонент у нас достаточно простой, поэтому тестировать будем только 3 аспекта работы нашего компонента:

перед тестированием определяем чо как будем искать

### Перед началом

проставляем

- data-testid="selectWrapper" для обёртки компонента
- data-testid="selectDropdown" для выпадающего списка
- data-testid={`select-option-${value}`} для каждого Option

Плейсхолдер будем искать просто по тексту через **screen.getByText('placeholder')**

Тестировать будем только 2 аспекта работы нашего компонента:

- проставление значений атрибутов: **data-selected**, **data-mode**, **data-status** и **data-is-active**
- открытие/закрытие выпадающего списка
- вызов коллбэков

### Проставление атрибутов

#### Фиксируем корректное проставление значений data-selected атрибута.

```javascript
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';

import Select from './index';
import options from './options.json';

describe('React component: Select', () => {
  it('Должен проставляться атрибут [data-selected="true"] для плейсхолдера, если было выбранно значение', async () => {
    render(
      <Select
        options={options}
        onChange={jest.fn()}
        selected={options[0]}
        placeholder="placeholder"
      />
    );

    const placeholder = screen.queryByText(options[0].title);
    expect(placeholder).toHaveAttribute('data-selected', 'true');
  });
  it('Должен проставляться атрибут [data-selected="false"] для плейсхолдера, если НЕ было выбранно значение селекта', async () => {
    render(
      <Select
        options={options}
        onChange={jest.fn()}
        selected={null}
        placeholder="placeholder"
      />
    );

    const placeholder = screen.queryByText('placeholder');

    expect(placeholder).toHaveAttribute('data-selected', 'false');
  });
}
```

#### Фиксируем корректное проставление значений data-mode атрибута

```javascript
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';

import Select from './index';
import options from './options.json';

describe('React component: Select', () => {
  it('Должен проставляться атрибут [data-selected="true"] для плейсхолдера, если было выбранно значение', async () => {...});
  it('Должен проставляться атрибут [data-selected="false"] для плейсхолдера, если НЕ было выбранно значение селекта', async () => {...});

  it('Должен проставляться атрибут [data-mode="rows"] для selectWrapper, если передано значение mode=rows', async () => {
    render(
      <Select
        options={options}
        onChange={jest.fn()}
        selected={null}
        placeholder="placeholder"
        mode="rows"
      />
    );

    const selectWrapper = screen.getByTestId('selectWrapper');
    expect(selectWrapper).toHaveAttribute('data-mode', 'rows');
  });
  it('Должен проставляться атрибут [data-mode="cells"] для selectWrapper, если передано значение mode=cells', async () => {
    render(
      <Select
        options={options}
        onChange={jest.fn()}
        selected={null}
        placeholder="placeholder"
        mode="cells"
      />
    );

    const selectWrapper = screen.getByTestId('selectWrapper');
    expect(selectWrapper).toHaveAttribute('data-mode', 'cells');
  });
  it('Должен проставляться атрибут [data-mode="rows"] для selectWrapper, если не свойство mode не указано', async () => {
    render(
      <Select
        options={options}
        onChange={jest.fn()}
        selected={null}
        placeholder="placeholder"
      />
    );

    const selectWrapper = screen.getByTestId('selectWrapper');
    expect(selectWrapper).toHaveAttribute('data-mode', 'rows');
  });
}
```

#### Фиксируем корректное проставление значений data-status атрибута

```javascript
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';

import Select from './index';
import options from './options.json';

describe('React component: Select', () => {
  it('Должен проставляться атрибут [data-selected="true"] для плейсхолдера, если было выбранно значение', async () => {...});
  it('Должен проставляться атрибут [data-selected="false"] для плейсхолдера, если НЕ было выбранно значение селекта', async () => {...});

  it('Должен проставляться атрибут [data-mode="rows"] для selectWrapper, если передано значение mode=rows', async () => {...});
  it('Должен проставляться атрибут [data-mode="cells"] для selectWrapper, если передано значение mode=cells', async () => {...});
  it('Должен проставляться атрибут [data-mode="rows"] для selectWrapper, если не свойство mode не указано', async () => {...});

  it('Должен проставляться атрибут [data-status="default"] для плейсхолдера, если было прокинуто свойство "status: default"', async () => {
    render(
      <Select
        options={options}
        onChange={jest.fn()}
        selected={null}
        placeholder="placeholder"
      />
    );

    const placeholder = screen.queryByText('placeholder');
    expect(placeholder).toHaveAttribute('data-status', 'default');
  });
  it('Должен проставляться атрибут [data-status="invalid"] для плейсхолдера, если было прокинуто свойство "status: invalid"', async () => {
    render(
      <Select
        options={options}
        onChange={jest.fn()}
        selected={null}
        placeholder="placeholder"
        status="invalid"
      />
    );

    const placeholder = screen.queryByText('placeholder');
    expect(placeholder).toHaveAttribute('data-status', 'invalid');
  });
  it('Должен проставляться атрибут [data-status="default"] для плейсхолдера, если свойство status не указано', async () => {
    render(
      <Select
        options={options}
        onChange={jest.fn()}
        selected={null}
        placeholder="placeholder"
      />
    );

    const placeholder = screen.queryByText('placeholder');
    expect(placeholder).toHaveAttribute('data-status', 'default');
  });
}
```

#### Фиксируем корректное проставление значений data-is-active атрибута

```javascript
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';

import Select from './index';
import options from './options.json';

describe('React component: Select', () => {
  it('Должен проставляться атрибут [data-selected="true"] для плейсхолдера, если было выбранно значение', async () => {...});
  it('Должен проставляться атрибут [data-selected="false"] для плейсхолдера, если НЕ было выбранно значение селекта', async () => {...});

  it('Должен проставляться атрибут [data-mode="rows"] для selectWrapper, если передано значение mode=rows', async () => {...});
  it('Должен проставляться атрибут [data-mode="cells"] для selectWrapper, если передано значение mode=cells', async () => {...});
  it('Должен проставляться атрибут [data-mode="rows"] для selectWrapper, если не свойство mode не указано', async () => {...});

  it('Должен проставляться атрибут [data-status="default"] для плейсхолдера, если было прокинуто свойство "status: default"', async () => {...});
  it('Должен проставляться атрибут [data-status="invalid"] для плейсхолдера, если было прокинуто свойство "status: invalid"', async () => {...});
  it('Должен проставляться атрибут [data-status="default"] для плейсхолдера, если свойство status не указано', async () => {...});

  it('Должен проставляться атрибут [data-is-active="true"] для selectWrapper, при клике на плейсхолдер', async () => {
    const handleSelect = jest.fn();

    render(
      <Select
        options={options}
        onChange={handleSelect}
        selected={null}
        placeholder="placeholder"
        status="invalid"
      />
    );

    const placeholder = screen.getByText('placeholder');
    fireEvent.click(placeholder);

    const selectWrapper = screen.getByTestId('selectWrapper');

    expect(selectWrapper).toHaveAttribute('data-is-active', 'true');
  });
  it('Должен проставляться атрибут [data-is-active="false"](при открытом dropdown) для selectWrapper, при клике на плейсхолдер', async () => {
    const handleSelect = jest.fn();

    render(
      <Select
        options={options}
        onChange={handleSelect}
        selected={null}
        placeholder="placeholder"
        status="invalid"
      />
    );

    const placeholder = screen.getByText('placeholder');
    fireEvent.click(placeholder);
    fireEvent.click(placeholder);

    const selectWrapper = screen.getByTestId('selectWrapper');
    expect(selectWrapper).toHaveAttribute('data-is-active', 'false');
  });
}
```

#### Фиксируем поведение открытия/закрытия выпадающего списка

```javascript
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';

import Select from './index';
import options from './options.json';

describe('React component: Select', () => {
  it('Должен проставляться атрибут [data-selected="true"] для плейсхолдера, если было выбранно значение', async () => {...});
  it('Должен проставляться атрибут [data-selected="false"] для плейсхолдера, если НЕ было выбранно значение селекта', async () => {...});

  it('Должен проставляться атрибут [data-mode="rows"] для selectWrapper, если передано значение mode=rows', async () => {...});
  it('Должен проставляться атрибут [data-mode="cells"] для selectWrapper, если передано значение mode=cells', async () => {...});
  it('Должен проставляться атрибут [data-mode="rows"] для selectWrapper, если не свойство mode не указано', async () => {...});

  it('Должен проставляться атрибут [data-status="default"] для плейсхолдера, если было прокинуто свойство "status: default"', async () => {...});
  it('Должен проставляться атрибут [data-status="invalid"] для плейсхолдера, если было прокинуто свойство "status: invalid"', async () => {...});
  it('Должен проставляться атрибут [data-status="default"] для плейсхолдера, если свойство status не указано', async () => {...});

  it('Должен проставляться атрибут [data-is-active="true"] для selectWrapper, при клике на плейсхолдер', async () => {...});
  it('Должен проставляться атрибут [data-is-active="false"](при открытом dropdown) для selectWrapper, при клике на плейсхолдер', async () => {...});

  it('По клику на плейсхолдер должен открываться dropdown', async () => {
    const handleSelect = jest.fn();

    render(
      <Select
        options={options}
        onChange={handleSelect}
        selected={null}
        placeholder="placeholder"
        status="invalid"
      />
    );

    const placeholder = screen.getByText('placeholder');
    fireEvent.click(placeholder);

    const selectDropdown = screen.getByTestId('selectDropdown');
    expect(selectDropdown).toBeInTheDocument();
  });
  it('По клику на плейсхолдер (при открытом dropdown) должен закрываться dropdown', async () => {
    const handleSelect = jest.fn();

    render(
      <Select
        options={options}
        onChange={handleSelect}
        selected={null}
        placeholder="placeholder"
        status="invalid"
      />
    );

    const placeholder = screen.getByText('placeholder');
    fireEvent.click(placeholder);
    fireEvent.click(placeholder);

    const selectDropdown = screen.queryByTestId('selectDropdown');
    expect(selectDropdown).not.toBeInTheDocument();
  });
  it('По клику на option должен вызываться обработчик "onChange" и закрываться dropdown', async () => {
    const handleSelect = jest.fn();

    render(
      <Select
        options={options}
        onChange={handleSelect}
        selected={null}
        placeholder="placeholder"
        status="invalid"
      />
    );

    const placeholder = screen.getByText('placeholder');
    fireEvent.click(placeholder);

    const option = screen.getByText(options[0].title);
    fireEvent.click(option);

    const optionAfterClick = screen.queryByText(options[0].title);

    expect(optionAfterClick).not.toBeInTheDocument();
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });
  it('По клику за пределами селекта должен вызываться обработчик "onClose" и закрываться dropdown', async () => {
    const handleClose = jest.fn();

    render(
      <div>
        <div data-testid="1">outer element</div>
        <Select
          options={options}
          onChange={jest.fn()}
          onClose={handleClose}
          selected={null}
          placeholder="placeholder"
          status="invalid"
        />
      </div>
    );

    const placeholder = screen.getByText('placeholder');
    fireEvent.click(placeholder);

    const outerElement = screen.getByTestId('1');
    fireEvent.click(outerElement);

    const option = screen.queryByText(options[0].title);

    expect(option).not.toBeInTheDocument();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
}
```

Тестов хоть и много, но они очень похожи друг на друга и пишутся быстро).

## Итого

Мы написали компактный и надёжный (благодаря тестам) кастомный селект.

Спасибо за чтение и удачи в написании ваших кастомных компонентов)

PS: Ссылки из статьи:

- про [условный рендеринг](https://react.dev/learn/conditional-rendering)
- про [@testing-library/react](https://testing-library.com/docs/react-testing-library/example-intro)
- про [create-react-app](https://create-react-app.dev/)
- про [useEffect](https://react.dev/reference/react/useEffect), [useState](https://react.dev/reference/react/useState) и [useRef](https://react.dev/reference/react/useRef)
- про [React.memo](https://react.dev/reference/react/memo)
- про [утечки памяти](https://www.ditdot.hr/en/causes-of-memory-leaks-in-javascript-and-how-to-avoid-them#event-listeners)
- про [css modules](https://github.com/css-modules/css-modules)
