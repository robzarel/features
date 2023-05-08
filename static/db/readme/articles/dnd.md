# Крошечный рецепт приготовления react-dnd

Прикручиваем react-dnd за 5 минут.

Появилась однажды задача - сделать область для загрузки файлов, с помощью drag-and-drop.

Была выбрана библиотека **react-dnd**, по причине её простоты, минималистичности и низкого порога входа.

Фича реализуется с помощью это либы и двух кастомных компонентов:

- **DndContainer** - компонент обёртка, для того, чтобы прокидывать вниз контекст для работы react-dnd
- **DropTarget** - компонент для непосредственной реализации drag-and-drop функционала

Итак, рецепт!

## **react-dnd**

- Документация: [react-dnd](https://react-dnd.github.io/react-dnd/about).
- Примеры использования: [раз](https://react-dnd.github.io/react-dnd/examples/other/native-files) и [два](https://codesandbox.io/s/react-dnd-file-upload-fywjwh)

Просто ставим её в зависимости и идём дальше.

## **DndContainer**

Объявляем провайдер и пробрасываем в children наш будущий компонент DropTarget.

```typescript
import React from 'react';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import DropTarget from '../drop-target';

const DndContainer = (props: {
  onDrop: (files: File[]) => void;
  disabled: boolean;
  title?: string;
  hoverTitle?: string;
}) => {
  const {
    onDrop,
    disabled,
    title = 'Перетащите сюда файлы',
    hoverTitle = 'Отпустите для загрузки',
  } = props;

  return (
    <DndProvider backend={HTML5Backend}>
      <DropTarget
        onDrop={onDrop}
        disabled={disabled}
        title={title}
        hoverTitle={hoverTitle}
      />
    </DndProvider>
  );
};

export default DndContainer;
```

## **DropTarget**

Компонент для реализации drag-and-drop функционала

```typescript
import React from 'react';

import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

import Styles from './index.css';

const DropTarget = (props: {
  onDrop: (files: File[]) => void;
  disabled: boolean;
  title: string;
  hoverTitle: string;
}) => {
  const { onDrop, disabled, title, hoverTitle } = props;
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop: (item: { files: File[] }) => {
        onDrop(item.files);
      },
      canDrop: () => !disabled,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [onDrop]
  );
  const isActive = canDrop && isOver;

  return (
    <div ref={drop} className={Styles.wrapper} data-disabled={disabled}>
      <div className={Styles.dropTarget} data-active={isActive}>
        {isActive ? hoverTitle : title}
      </div>
    </div>
  );
};

export default DropTarget;
```

Стили кастомные, но для примера оставлю:

```css
.wrapper {
  position: relative;
}
.wrapper[data-disabled='true'] {
  cursor: not-allowed;
}
.wrapper[data-disabled='true']::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.35);
}

.dropTarget {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  margin: 20px 0;
  border: 1px dashed black;
  border-radius: 5px;
  user-select: none;
  color: black;
}

.dropTarget[data-active='true'] {
  border: 1px dashed #0022f5;
  color: #0022f5;
}
```

## Применение

Используем как совершенно обычный компонент:

```typescript
type Props = {
  handleFilesDrop: (files: File[]) => void;
  title?: string;
}
const DnD = (props: Props) => {
  const { handleFilesDrop, title = 'Перетащите сюда медиафайлы' } = props;

  const shouldBeDisabled = /* some condition, based on state/props or whatever you need */;

  return (
    <div className={Styles.dnd}>
      <DndContainer
        title={title}
        onDrop={handleFilesDrop}
        disabled={shouldBeDisabled}
      />
    </div>
  );
};
```

## Итого

Выводов не планировалось, это просто минималистичный рецептик приготовления для быстрого сетапа функционала dnd в приложении))

Спасибо за чтение и удачи в реализации ваших dnd фич)

PS: ссылки из статьи

- про [react-dnd](https://react-dnd.github.io/react-dnd/about)
- Примеры использования: [раз](https://react-dnd.github.io/react-dnd/examples/other/native-files) и [два](https://codesandbox.io/s/react-dnd-file-upload-fywjwh)
