# Загрузчик файлов для react

Пишем drag-and-drop загрузчик файлов для React приложения

## Предисловие:

Оригинальная продуктовая задача, помимо непосредственной загрузки файлов и dnd, включала в себя ещё 2 больших куска логики:

1. Динамическая галерея для отображения загружаемых и загруженных файлов с их статусами
2. Резолв конфликтов дубликатов имён файлов при загрузке. Т.е. надо было при загрузке файлов дать пользователю возможность **выбрать** один из возможных сценариев загрузки:

- переименовать загружемые файлы
- переименовать уже загруженные файлы
- остановить загрузку.

Реализация функционала резолва конфликтов сликшом объёмная для этой статьи. Поэтому данный функционал оставлен за пределами этой публикации. Если вам, дорогие читатели, будет интересно, намекните в комментариях - оформим отдельной публикацией как будет минутка времени)

Итак, поехали!

## Требования

В данной статье описано как написать **загрузчик файлов**, который удовлетворяет следующим требованиям:

**Функциональные требования**

- загрузчик умеет валидировать загружаемые файлы (не более 10мб и разрешением не более 25МП)
- загрузчик должен предоставлять 2 элемента для инициации загрузки (кнопку "загрузить" и dnd область для загрузки)
- загрузчик умеет отслеживать и предоставлять как общие статусы загрузки, так и статусы загрузки каждого конкретного файла

**Нефункциональные требования**

- загрузчик должен заниматься только загрузкой файлов. Отображение и любой другой функционал должны быть вынесены за скобки этого компонента
- должна быть возможность располагать элементы управления загрузчиком на разных уровнях вложенности

## Зависимости фичи:

Прежде чем перейдём к реализации фичи, обговорим зависимости (т.е. уже реализованные решения, которые помогут упростить реализацию этой фичи). Их в данном случае 2 штуки:

1. Валидатор [fileMaxSize](https://github.com/robzarel/react-form-hooks/blob/main/src/validators/file-max-size.ts) в связке с утилиткой [imageMaxResolution](https://github.com/robzarel/react-form-hooks/blob/main/src/validators/image-max-resolution.ts)
2. хук [useFilesFormField](https://github.com/robzarel/react-form-hooks/blob/main/src/form-validation-hooks/useFilesFormField.ts)

Комбинация этих зависимостей поможет нам легко и быстро реализовать функциональные требования, связанные с валидацией загружаемых файлов в контексте react приложения.

Подробнее про реализацию валидации можно прочитать в моей статье про [Валидацию форм без зависимостей](https://habr.com/ru/articles/732690/).

## План действий

Загрузчик будет представлять из себя компонент обёртку, которая внутри себя определяет **React.Context** и отдаёт его вниз для всех своих **children**. При реализации мы будем использовать подход [Compound components](https://habr.com/ru/company/alfa/blog/647013/) для того, чтобы не раскидывать загрузчик и элементы управления загрузчиком по множеству каталогов/файлов.

План реализации компонента выглядит следующим образом:

1. **Создать контекст**, который сделает доступным интерфейс загрузчика для его children
2. **Описать сущности**, с которыми будем работать
3. **Описать интерфейс компонента**, через который будем отдавать информацию по текущим статусам загрузки
4. Реализовать **загрузку файлов**
5. Реализовать **обработчик выбора файлов**
6. Создать **компонент Input** для инициации загрузки
7. Создать **компонент Dnd** для инициации загрузки
8. Собрать всё вместе и проверить, что закрыли все функциональные/нефункциональные требования

## Создаём контекст

Будем использовать **react контекст** для того, чтобы можно было использовать несколько элементов инициации загрузки (кнопка и dnd). А так же это даёт возможность расположить элементы управления загрузчиком на любом уровне вложенности компонентов.

```typescript
import type { FilesField } from '../../../utils/form/hooks/types';

const UploaderContext = React.createContext<
  | {
      isUpLoading: boolean;
      selectedFiles: FilesField; // тип FilesField объявлен в хуке 'useFilesFormField'
      handleFilesChange: (event: ChangeEvent<HTMLInputElement>) => void;
      fileInputRef: React.RefObject<HTMLInputElement>;
    }
  | undefined
>(undefined);
```

Затем пишем небольшой кастомный хук, который позволит удобно юзать наш контекст и будет контролировать корректные условия запуска (элемент управления загрузчиком не может быть использован вне контекста загрузчика).

```typescript
const useFilesUploader = () => {
  const context = useContext(UploaderContext);

  if (!context) {
    throw new Error(
      'This component must be used within a <FileUploader> component.'
    );
  }

  return context;
};
```

Для использования контекста загрузчика файлов нам просто нужно будет использовать хук **useFilesUploader**

## Определяем сущности

В общей сложности имеется только 2 сущности, которыми загрузчику файлов нужно оперировать:

1. загружаемый файл
2. результат загрузки

Перед тем, как перейдём к описанию корневых сущностей опишем статусы (состояния), в которых может находится наш загружаемый файл:

```typescript
const STATUS = {
  initial: 'initial',
  pending: 'pending',
  uploaded: 'uploaded',
  error: 'error',
} as const;
```

Затем определим интерфейсы непосредственно загружаемого файла **UploadEntry** и результат загрузки **UploadResult**

```typescript
type UploadEntry = {
  name: string;
  status: keyof typeof STATUS;
  error: string | null;
  uploaded?: MediaFilesResponse['data'][number];
};

type UploadResult = {
  status: 'fulfilled' | 'rejected';
  value?: {
    status: UploadEntry['status'];
    uploaded?: UploadEntry['uploaded'];
    error?: UploadEntry['error'];
  };
  reason?: any;
};
```

Поля **name**, **status**, **error** в пояснении не нуждаются. А вот в **uploaded** мы будем хранить информацию по нашему успешно загруженному файлу (ответ от нашей ручки api). Часто это может быть полезно, так как в момент добавления файла в хранилище на сервере, ему могут быть даны уникальные признаки (идентификаторы), которые возможно будет нужно использовать на клиентской части (например в кейсах, когда потребуется разрешать конфликты дубликатов загружаемых файлов)

**MediaFilesResponse** может быть любым. Этот тип описывает возвращаемое значение от вашего api endpoint. В моём конкретно случае, ответ имеет следующую структуру:

```typescript
type MediaFilesResponse = {
  data: {
    datetimeUpdated: string;
    datetimeUpload: string;
    filename: string;
    files: {
      original: {
        filepath: string;
        height: number;
        width: number;
        mimeType: string;
        resourceType: string;
      };
    };
    metadata: { width: number; height: number };
    id: string;
    namespace: string;
    originalBasename: string;
    originalFilesize: number;
  }[];
  count: number;
};
```

PS:

- директива [as const](https://blog.logrocket.com/complete-guide-const-assertions-typescript/) используется в typescript для сообщения транспилятору, о том, что ключи данного объекта не будут изменятся. Это даёт возможность нам сделать [union type](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html) по ключам этого объекта с помощью комбинации операторов [keyof typeof](https://stackoverflow.com/questions/55377365/what-does-keyof-typeof-mean-in-typescript/62764510#62764510)
- структура **UploadResult** по сути описывает результат [Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

## Интерфейс компонента

В наших функциональных требованиях мы указывали, что наш компонент, должен уметь сообщать о состоянии процесса загрузки.
В данной реализации, помимо стандартных "начали/закончили" загрузку, мы предусмотрим возможность отслеживания окончания загрузки каждого конкретного файла, а так же возможность сделать что-то перед стартом загрузки (но уже после выбора файлов).

```typescript
type UploaderProps = {
  /* срабатывает в момент выбора файлов */
  onFilesSelected?: () => void;
  /* срабатывает в момент сброса файлов */
  onFilesCleared?: () => void;
  /* срабатывает, когда стартует процесс загрузки всех файлов */
  onUploadStart?: (uploadEntries: UploadEntry[]) => void;
  /* срабатывает, когда процесс загрузки всех файлов завершён */
  onUploadEnd?: (uploadResult: UploadResult[]) => void;
  /* срабатывает, когда процесс загрузки одного файла завершён */
  onFileUploadEnd?: (file: File, obj: Partial<UploadEntry>) => void;
  children?: React.ReactNode;
};
```

## Обработчик выбора файлов

Совершенно типовой хендлер, который

- подхватывает загруженные пользователем файлы,
- создаёт на их основе массив файлов (ведь по умолчанию из <input type='file' multiple /> мы получаем [FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList))
- отправляет эти данные в **handleChange** хука [useFilesFormField](https://github.com/robzarel/react-form-hooks/blob/main/src/form-validation-hooks/useFilesFormField.ts)

```typescript
const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
  const files: File[] = event.target.files
    ? Array.from(event.target.files)
    : [];
  selectedFiles.handleChange(files);
  onFilesSelected?.();

  fileInputRef.current && (fileInputRef.current.value = '');
};
```

Стоит обратить внимание на строчку

```typescript
fileInputRef.current && (fileInputRef.current.value = '');
```

Таким оборазом мы сбрасываем input value, для того, чтобы не блокировать повторный выбор (и загрузку) файлов с одинаковыми именами.
Это может показаться несущественным, но реализация этого функционала в итоге может значительно облегчить конечному пользователю флоу работы с загрузчиком - у него будет возможность редактировать файлы на локальной машине и грузить их повторно.

## Загрузка файлов

Загрузку файлов будем реализовывать через **useEffect**.
При каждом изменении значений или итогов валидации наших загружаемых файлов, мы будем пытаться загрузить все валидные файлы.
Ну и не забываем завести фаложок **isUpLoading** для отображения индикации процесса загрузки.

```typescript
const [isUpLoading, setUpLoading] = useState(false);
const selectedFiles = useFilesFormField('files', validators);

// берём ссылку на функцию clearSelectedFiles,
// для того, чтобы избежать лишних триггеров для useEffect
const { clear: clearSelectedFiles } = selectedFiles;

const resetUploader = useCallback(() => {
  setUpLoading(false);
  clearSelectedFiles();

  onFilesCleared?.();
}, [clearSelectedFiles, onFilesCleared]);

useEffect(() => {
  const uploadMediaFiles = async () => {
    if (selectedFiles.value.length === 0) {
      return;
    }

    setUpLoading(true);

    onUploadStart?.(
      formatToUploadEntries(selectedFiles.value, selectedFiles.error)
    );

    const allPromises = selectedFiles.value
      .filter((item, index) => !selectedFiles.error[index])
      .map(async (file) => {
        const options: MediaFileRequestOptions = { source: file };

        const uploadPromise = api.post.mediaFile(options);
        let uploadResult: Partial<UploadEntry> = {};

        try {
          const uploaded = await uploadPromise;
          uploadResult = {
            status: STATUS.uploaded,
            uploaded,
          };
        } catch (err) {
          const msg =
            err instanceof Error
              ? err.message
              : 'Unknown Error: api.post.mediaFiles';
          uploadResult = {
            status: STATUS.error,
            error: msg,
          };
        } finally {
          onFileUploadEnd?.(file, uploadResult);
        }

        return uploadPromise;
      });

    const uploadingResult = await Promise.allSettled(allPromises);
    onUploadEnd?.(uploadingResult);

    resetUploader();
  };

  uploadMediaFiles();
}, [
  selectedFiles.value,
  selectedFiles.error,
  clearSelectedFiles,
  resetUploader,
  onFileUploadEnd,
  onUploadStart,
  onUploadEnd,
]);
```

PS: **formatToUploadEntries** это функция, которая трансформирует (подготавливает) данные к отправке наверх, согласно нашим типам:

```typescript
const formatToUploadEntries = (
  files: File[],
  errors: ValidationResult[]
): UploadEntry[] =>
  files.map((file, index) => ({
    name: file.name,
    status: errors[index] ? STATUS.error : STATUS.pending,
    item: undefined,
    error: errors[index],
  }));
```

## Кнопка загрузки файлов

Инпут для загрузки файлов штука совсем тривиальная, суть которой сводится к тому, чтобы подхватить контекст (через уже объявленный в **FilesUploader** хук **useFilesUploader**) и использовать данные оттуда для управления загрузчиком.

```typescript
FilesUploader.Input = function Input({ label = '+ Загрузить' }) {
  const { fileInputRef, handleFilesChange } = useFilesUploader();

  return (
    <div className={Styles.download} id={CONTROL_ID.INPUT}>
      <input
        ref={fileInputRef}
        className={Styles.downloadInput}
        type='file'
        multiple
        onChange={handleFilesChange}
        id='file-uploader-input-button'
      />
      <label
        className={Styles.downloadLabel}
        htmlFor='file-uploader-input-button'
      >
        {label}
      </label>
    </div>
  );
};
```

## DND область для загрузки файлов

Мы уже запилили всё самое сложное. Осталось сделать перетягивалку для файлов, чтобы наши пользователи имели привычный многим интерфейс загрузки.

Непосредственная реализация DND описна в [Крошечном рецепте приготовления react-dnd](https://habr.com/ru/articles/732742/). Здесь мы просто соединяем нашу DND фичу с загрузчиком файлов.

Первое, что нам понадобится это добавить обработчик для dnd функционала в наш контекст

```typescript
const UploaderContext = React.createContext<
  | {
      isUpLoading: boolean;
      selectedFiles: FilesField; // тип FilesField объявлен в хуке 'useFilesFormField'
      handleFilesChange: (event: ChangeEvent<HTMLInputElement>) => void;
      fileInputRef: React.RefObject<HTMLInputElement>;

      // добавляем обработчик для dnd функционала в наш контекст
      handleFilesDrop: (droppedFiles: File[]) => void;
    }
  | undefined
>(undefined);
```

Затем нужно написать реализацию обработчика уже в самом компоненте:

```typescript
const { onFilesSelected } = props;
const { handleChange: handleSelectedFilesChange } = selectedFiles;

const handleFilesDrop = useCallback(
  (droppedFiles: File[]) => {
    onFilesSelected?.();
    handleSelectedFilesChange(droppedFiles);
  },
  [onFilesSelected, handleSelectedFilesChange]
);
```

И в итоге осталось создать немного разметки и подсоединить наш dnd контейнер к нашему загрузчику через **useFilesUploader**

```typescript
FilesUploader.DnD = function DnD({ title = 'Перетащите сюда медиафайлы' }) {
  const { isUpLoading, selectedFiles, handleFilesDrop } = useFilesUploader();
  const isScenarioActive = isUpLoading || selectedFiles.value.length > 0;

  return (
    <div className={Styles.dnd}>
      <DndContainer
        title={title}
        onDrop={handleFilesDrop}
        disabled={isScenarioActive}
      />
    </div>
  );
};
```

Таким образом вместе с загрузчиком, мы поставляем 2 элемента управления: **FilesUploader.Input** и **FilesUploader.DnD**.
Они могут быть расположены где угодно в рамках нашего контекста **FilesUploader**

В теории мы можем по этому же паттерну сгенерировать сколько угодно элементов управления.

## Собираем всё вместе

Наш компонент FilesUploader (вернее файл, его содержащий) будет по итогу выглядеть следующим образом:

```typescript
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from 'react';
import type { ChangeEvent } from 'react';

import { fileMaxSize, imageMaxResolution } from 'some-path/validators';
import type { ValidationResult } from 'some-path/validators';

import { useFilesFormField } from 'some-path/hooks';
import type { FilesField } from 'some-path/hooks/types';

import api from 'some-path/api'; // самописный модуль, вызов методов которого возвращает промисы
import type { Response as MediaFilesResponse } from 'some-path/api/handlers/media-files/get-media-files';
import type { RequestOptions as MediaFileRequestOptions } from 'some-path/api/handlers/media-files/post-media-files';

import DndContainer from '../dnd-container';

import Styles from './index.css';

const UploaderContext = React.createContext<
  | {
      isUpLoading: boolean;
      fileInputRef: React.RefObject<HTMLInputElement>;
      selectedFiles: FilesField; // тип FilesField объявлен в хуке 'useFilesFormField'
      handleFilesDrop: (droppedFiles: File[]) => void;
      handleFilesChange: (event: ChangeEvent<HTMLInputElement>) => void;
    }
  | undefined
>(undefined);

const useFilesUploader = () => {
  const context = useContext(UploaderContext);

  if (!context) {
    throw new Error(
      'This component must be used within a <FileUploader> component.'
    );
  }

  return context;
};

const STATUS = {
  initial: 'initial',
  pending: 'pending',
  uploaded: 'uploaded',
  error: 'error',
} as const;

type UploadEntry = {
  name: string;
  status: keyof typeof STATUS;
  error: string | null;
  uploaded?: MediaFilesResponse['data'][number];
};

type UploadResult = {
  status: 'fulfilled' | 'rejected';
  value?: {
    status: UploadEntry['status'];
    uploaded?: UploadEntry['uploaded'];
    error?: UploadEntry['error'];
  };
  reason?: any;
};

const validators = [fileMaxSize(), imageMaxResolution()];
const formatToUploadEntries = (
  files: File[],
  errors: ValidationResult[]
): UploadEntry[] =>
  files.map((file, index) => ({
    name: file.name,
    status: errors[index] ? STATUS.error : STATUS.pending,
    item: undefined,
    error: errors[index],
  }));

type UploaderProps = {
  onFilesSelected?: () => void;
  onFilesCleared?: () => void;
  onUploadStart?: (uploadEntries: UploadEntry[]) => void;
  onUploadEnd?: (uploadResult: UploadResult[]) => void;
  onFileUploadEnd?: (file: File, obj: Partial<UploadEntry>) => void;
  children?: React.ReactNode;
};

const FilesUploader = (props: UploaderProps) => {
  const {
    onUploadStart,
    onUploadEnd,
    onFileUploadEnd,
    onFilesSelected,
    onFilesCleared,
    children,
  } = props;

  const [isUpLoading, setUpLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedFiles = useFilesFormField('files', validators);

  // сохраняем ссылки на функции, чтобы не тригерить useEffect, так как
  // ссылка на selectedFiles будет изменятся между ре-рендерами,
  // но внутренние ссылки на объекты будут стабильны
  const { clear: clearSelectedFiles, handleChange: handleSelectedFilesChange } =
    selectedFiles;

  const resetUploader = useCallback(() => {
    setUpLoading(false);
    clearSelectedFiles();

    onFilesCleared?.();
  }, [clearSelectedFiles, onFilesCleared]);

  const handleFilesDrop = useCallback(
    (droppedFiles: File[]) => {
      onFilesSelected?.();
      handleSelectedFilesChange(droppedFiles);
    },
    [onFilesSelected, handleSelectedFilesChange]
  );

  useEffect(() => {
    const uploadMediaFiles = async () => {
      if (selectedFiles.value.length === 0) {
        return;
      }

      setUpLoading(true);

      onUploadStart?.(
        formatToUploadEntries(selectedFiles.value, selectedFiles.error)
      );

      const allPromises = selectedFiles.value
        .filter((item, index) => !selectedFiles.error[index])
        .map(async (file) => {
          const options: MediaFileRequestOptions = { source: file };

          const uploadPromise = api.post.mediaFile(options);
          let uploadResult: Partial<UploadEntry> = {};

          try {
            const uploaded = await uploadPromise;
            uploadResult = {
              status: STATUS.uploaded,
              uploaded,
            };
          } catch (err) {
            const msg =
              err instanceof Error
                ? err.message
                : 'Unknown Error: api.post.mediaFiles';
            uploadResult = {
              status: STATUS.error,
              error: msg,
            };
          } finally {
            onFileUploadEnd?.(file, uploadResult);
          }

          return uploadPromise;
        });

      const uploadingResult = await Promise.allSettled(allPromises);
      onUploadEnd?.(uploadingResult);

      resetUploader();
    };

    uploadMediaFiles();
  }, [
    selectedFiles.value,
    selectedFiles.error,
    clearSelectedFiles,
    resetUploader,
    onFileUploadEnd,
    onUploadStart,
    onUploadEnd,
  ]);

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files: File[] = event.target.files
      ? Array.from(event.target.files)
      : [];
    selectedFiles.handleChange(files);
    onFilesSelected?.();

    // сбрасываем input value, для того, чтобы не блокировать
    // повторный выбор (и загрузку) файлов с одинаковыми именами
    fileInputRef.current && (fileInputRef.current.value = '');
  };

  return (
    <UploaderContext.Provider
      value={{
        isUpLoading,
        fileInputRef,
        selectedFiles,
        handleFilesDrop,
        handleFilesChange,
      }}
    >
      <div className={Styles.uploaderChildrens}>{children}</div>
    </UploaderContext.Provider>
  );
};

FilesUploader.Input = function Input({ label = '+ Загрузить' }) {
  const { fileInputRef, handleFilesChange } = useFilesUploader();

  return (
    <div className={Styles.download} id={CONTROL_ID.INPUT}>
      <input
        ref={fileInputRef}
        className={Styles.downloadInput}
        type='file'
        multiple
        onChange={handleFilesChange}
        id='file-uploader-input-button'
      />
      <label
        className={Styles.downloadLabel}
        htmlFor='file-uploader-input-button'
      >
        {label}
      </label>
    </div>
  );
};

FilesUploader.DnD = function DnD({ title = 'Перетащите сюда медиафайлы' }) {
  const { isUpLoading, selectedFiles, handleFilesDrop } = useFilesUploader();
  const isScenarioActive = isUpLoading || selectedFiles.value.length > 0;

  return (
    <div className={Styles.dnd}>
      <DndContainer
        title={title}
        onDrop={handleFilesDrop}
        disabled={isScenarioActive}
      />
    </div>
  );
};
```

## Применение

Теперь мы можем просто обернуть приложение в контекст **FilesUploader** и использовать **FilesUploader.Input** и **FilesUploader.DnD** на любом уровне вложенности. Например:

```typescript
import FilesUploader from './files-uploader';
import type { UploadEntry, UploadResult } from './files-uploader';
import Header from './header';

const Page = () => {
  const handleFilesSelecting = () => {
    /* files selecting processing */
  };
  const handleUploadingStart = (uploadEntries: UploadEntry[]) => {
    /* uploading start processing */
  };
  const handleUploadingEnd = (uploadResult: UploadResult[]) => {
    /* uploading end processing */
  };
  const handleFilesClearing = () => {
    /* uploader clearing processing */
  };
  const handleFileUploadingEnd = (file: File, obj: Partial<UploadEntry>) => {
    /* single file uploading processing */
  };

  return (
    <div>
      <FilesUploader
        onFilesSelected={handleFilesSelecting}
        onUploadStart={handleUploadingStart}
        onUploadEnd={handleUploadingEnd}
        onFilesCleared={handleFilesClearing}
        onFileUploadEnd={handleFileUploadingEnd}
      >
        <Header />
        {/* render some uploading view */}
      </FilesUploader>
    </div>
  );
};
```

```typescript
import FilesUploader from './files-uploader';

const Header = () => {
  return (
    <div>
      <h1>Header</h1>
      <FilesUploader.Input />
    </div>
  );
};
```

Пропсы **onFilesSelected**, **onFilesCleared**, **onUploadStart**, **onFileUploadEnd** дают возможность в рутовом компоненте получать актуальную информацию о статусе/прогрессе как всего процесса загрузки, так и конкретного элемента.
Это даст возможность работать с визуальным отображением загружаемых файлов.

## Итого

Таким образом мы полностью закрыли требования к нашему загрузчику:

**Фунцкиональные требования**

- загрузчик умеет валидировать загружаемые файлы
- загрузчик предоставляет 2 элемента для инициации загрузки (кнопку "загрузить" и dnd область для загрузки)
- загрузчик умеет отслеживать и предоставлять как общие статусы загрузки, так и статусы загрузки каждого конкретного файла

**Нефункциональные требования**

- логика загрузчика сфокусирована только на загрузке файлов. Отображение оставлено на откуп компоненту контейнеру, который содержит в себе загрузчик.
- использование контекста даёт возможность располагать элементы управления загрузчиком на разных уровнях вложенности (в рамках контекста загрузчика)

Спасибо за чтение и удачи в реализации ваших собственных загрузчиков)

PS:
Ссылки из статьи

- Зависимости
  - [Крошечный рецепт приготовления react-dnd](https://habr.com/ru/articles/732742/)
  - [Валидация форм без зависимостей](https://habr.com/ru/articles/732690/)
- понятным языком про [Compound components](https://habr.com/ru/company/alfa/blog/647013/)
- про Javascript
  - про [Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
  - про [FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList
- про Typescript
  - про [as const](https://blog.logrocket.com/complete-guide-const-assertions-typescript/)
  - про [keyof typeof](https://stackoverflow.com/questions/55377365/what-does-keyof-typeof-mean-in-typescript/62764510#62764510)
  - про [union type](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html)
