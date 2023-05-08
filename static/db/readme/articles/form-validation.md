# Валидация форм без зависимостей

Пишем систему валидации форм для React приложений (и не только).

## Мотивация

Cтатья основана на практике 2х проектов, которые имели следующие условия, повлиявшие на решение по реализации фичи валидации:

- полей ввода и форм было **много**
- полей ввода и форм могло стать **ещё больше**
- есть сложные **кастомные валидации** (например файлы)
- есть взаимосвязанные поля с асинхронной проверкой
- есть разные окружения (бразуер, node.js, потенциально могла прибавится мобилка)

И конечно же все некоторые аспекты проектов могли в любой момент измениться (привет agile).

Всё это привело к формированию следующих требований:

- **гибкость** и **расширяемость**
  - т.к полей ввода и форм много и может стать ещё больше, нужна легко переиспользуемая система, которую можно легко и адаптивно настраивать под потребоности интерфейсов и пользователей.
  - нам должно быть легко дополнять систему по требованию. Мы должны быть способны в любой момент напилить обработку новых полей с различной логикой (асинхронной, взаимосвязанной и т.д)
- **кроссплатформенность**
  - мы должны уметь запускаться в разных окружениях. Например на бэкенде (если вдруг мне понадобится написать proxy gataway сервер с простеньким ssr).
  - нам не надо зависеть от платформо-специфических api (в том числе от браузерных)
- **zero-dependency**
  - не хотелось добавлять ещё одну зависимость в проект/проекты

## Какой вектор решения выбрать

Как и всегда, для того, чтобы решить какой путь решения задачи выбрать, мне пришлось:

- обратился к своему опыту
- обратится к опыту коллег

Свой опыт подсказывал, что изменений может быть много, внешние зависимости могут терять саппорт, может понадобится такая кастомщина, покрыть которую может быть сложно засчёт внешних библиотек.

Опыт коллег показал, что в основном, для построения стабильной системы люди выбирали самписные решения, которые строились по формату: одна штука валидирует, вторая штука привязывает это к ui. Благо в тех компаниях, на проектах которых я работал были тысячи IT спациалистов с большим опытом и было куда подглядеть и кого поспрашивать).

Как итог было принято решение сделать самописную систему из двух частей - валидация и привязка к ui, которая полностью покрывает мои нужды.

Оставался только один вопрос - надо пилить вообще всё кастомное или же использовать [HTML5 Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation). Если ещё не читали этот туториал, то очень рекомендую это сделать.

Размышления были долгими, споры были жаркими и не все ребята на проекте со мной согласились, но проведя сравнительный анализ, всё же было принято решение в пользу разработки полностью кастомной и не завязанной ни на какое API системы.
И вот почему:

| Категория                  | Критерий                                                                                                        | Custom validation                                                                      | Constraint Validation API                                                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Консистентность            | Единый подход при работе с разными типами проверяемых значений                                                  | все валидаторы имеют одинаковую структуру                                              | Для файлов и всё равно выносить нужно в отдельные валидаторы. Часть валидаторов "вшита" в разметку                                                       |
| Разделение ответственности | Разделение логики валидации и логики представления данных                                                       | логика валидации мапится на вью в компоненте могут существовать отдельно друг от друга | логика валидации "прибита гвоздями" к html одно без другого не существует                                                                                |
| Масштабируемость           | перенос на веб                                                                                                  | легко                                                                                  | легко                                                                                                                                                    |
| Масштабируемость           | перенос на бэк                                                                                                  | легко                                                                                  | невозможно                                                                                                                                               |
| Масштабируемость           | перенос на мобилки                                                                                              | легко                                                                                  | частично                                                                                                                                                 |
| Масштабируемость           | возможность использовать применять валидацию к нестандартным элементам (канвас например или кастомные элементы) | да                                                                                     | нет, только поддерживаемые спекой форматы https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#the_constraint_validation_api             |
| Платформо-зависимость      | Зависимость от браузера                                                                                         | запускаемся где хотим                                                                  | запускаемся только в браузере и при этом имеем ограничения: 1) ie частично 2) opera mini не поддерживается 3) minlength вообще в ie имеет проблемы и т.п |
| Гибкость                   | возможность показывать кастомные ошибки                                                                         | да                                                                                     | да                                                                                                                                                       |
| Гибкость                   | возможность управлять очерёдностью проверок                                                                     | да                                                                                     | нет                                                                                                                                                      |
| Гибкость                   | возможность делать связанные/динамические поля и валидации                                                      | да                                                                                     | да                                                                                                                                                       |
| Прочее                     | наличие валидаторов                                                                                             | нет, надо писать с нуля                                                                | многие есть, но что-то чуть посложнее надо писать самому                                                                                                 |
| Прочее                     | функция запуска проверок                                                                                        | нет, надо писать с нуля                                                                | всё готово к употреблению                                                                                                                                |
| Прочее                     | порог входа                                                                                                     | низкий, надо написать пару функций уровня Junior+                                      | надо вызубрить всё api                                                                                                                                   |

Плюс в спеке так же говорится про кастомные контролы https://developer.mozilla.org/en-US/docs/Learn/Forms/How_to_build_custom_form_controls, что снова кладёт на нашу чашу весов ещё одну монетку.

PS:
Для сравнения доступности апи как всегда использовался убер ресурс [caniuse.com](https://caniuse.com/?search=constraint%20api)

Ну и разумеется у этого всего нет претензии на единственно верное решение (да и не бывает таких в практике).

Итак, поехали!

## Структура

Глобально статья состоит из 2х частей: **база** и **react**

**База**
Эта часть про систему валидации, которая занимается **только валидацией** и больше ничем.
Максимум независимости от всего, чего только можно. Нам нужен только JS движок для исполнения нашего кода.

**React**
Ну а здесь мы обсудим уже про интеграцию базовой валидации с React приложением. Построим переиспользуемое решение, которое позволит нам штамповать формы в пару десятков строк кода и быть счастливыми )

## База: Валидация значений

Валидаторы это простые функции, задача которых провести соответствующие проверки над переданным в неё значением.

Валидация вынесена в отделяемую абстракцию, для того, чтобы быть независимой от платформы, разметки/визуальных элементов и иметь возможность легко переиспользоваться на node.js (и в любом окружении, где работает js).

### Валидаторы

Каждая функция валидатор состоит из 3х частей:

```typescript
// Обёртка, которая позволяет кастомизировать сообщения об ошибках
type GetValidator<Options, Params> = (options: Options) => Validator<Params>;

// Валидатор, который непосредственно проводит валидацию
type Validator<T> = (params?: T) => Promise<ValidationResult>;

// Результат валидации:
type ValidationResult = string | null;
```

Все валидаторы по умолчанию являются асинхронными и должны возвращать `промис` с результатом валидации `Promise<ValidationResult>`. Даже в кейсах, когда внутри валидатора не требуется асинхронная логика. Такая реализация позволяет одновременно использовать в одной подборке
валидаторов для поля как синхронные, так и асинхронные валидаторы, при этом не усложняя кодовую базу.

### Запуск валидации

Функция `validate` поочерёдно запускает массив валидаторов с переданным значением.

```typescript
const validate: (
  value: any,
  validators: Validator[]
) => Promise<ValidationResult>;
```

Данная функция не выполняет "лишней" работы, а останавливается на **первом** невалидном результате. Т.е. Если в наборе из 4х валидаторов у нас валидатор №1 вернул ошибку, то валидаторы 2, 3, 4 уже не будут запущены в этой итерации валидации (так как в этом нет смысла - пользователю нужно исправить сначала ошибку, которую мы словили на валидаторе №1 и уже после этого переходить в последующим проверкам).

Полный код функции **validate**:

```typescript
type ValidationResult = string | null;
type Validator<T> = (params: T) => Promise<ValidationResult>;
type GetValidator<Options, Params> = (options?: Options) => Validator<Params>;

const validateValue = async <T>(
  value: T,
  validators: Validator<T>[]
): Promise<ValidationResult> => {
  let validationResult: ValidationResult = null;
  let i = 0;

  while (validationResult === null && i < validators.length) {
    const res = await validators[i](value);

    res && (validationResult = res);
    i++;
  }

  return validationResult;
};
```

### Пример использования системы валидации

Рассмотрим валидацию на примере загрузки файлов с пользовательской машины. Предположим у нас есть `<input type="file" />` и пара бизнес требований:

1. ограничить максимальный вес загружаемого файла в 10мб
2. ограничить максимальное разрешение загружаемого изображения в 25мп (перемножение ширины на высоту должно быть не более 25 000 000 пикселей)

Первое требование реализуется через синхронный валидатор. Второе - через асинхронный (например если реализовывать через img.decode() метод - https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode).

И вот как раз для того, чтобы не усложнять кодовую базу валидаторов, ровно как и код, который использует эти валидаторы, мы "приводим" все валидаторы к одному типу - делаем их все асинхронными.
В противном случае нам пришлось бы "ветвить" код использования синхронных и асинхронных валидаторов, плюс реализовывать пару вариантов validateValue с соответствующими типами.

Поэтому система построена так, что валидаторы все по умолчанию асинхронные и при создании валидатора необходимо из него возвращать асинхронную функцию `async`, которая в свою очередь возвращает промис с результатом валидации.

В случае, если вам не нужна асинхронная логика внутри валидатора - сразу же резолвим промис с нужным значением.

Например:

```typescript
import type { GetValidator } from './index';

const required: GetValidator<string, string> = (
  message = 'Обязательное поле'
) => {
  return async (value) => (value ? null : message);
};

export default required;
```

### Пример использования системы валидации

```typescript
import type { Validator } from './utils/validators';
import validate, {
  required,
  maxLength,
  minLength,
} from './utils/validators';

const validators = [required(), minLength(5), maxLength(150)]
const value: string = '123456'

const validationResult = validate(value, validators)

/* do with your **validationResult** whatever you want */
...
```

В этом примере значение `validationResult` равно `null`, что означает успешно пройденную валидацию по переданному массиву валидаторов. Проверяемое значение `value`:

- не пустое (валидатор `required()`)
- имеет длинну более 5 символов (валидатор `minLength(5)`)
- имеет длинну не более 150 символов (валидатор `maxLength(150)`)

### Итого

На этом первая часть закончена. В целом без всяких проблем мы можем писать любые валидаторы, синхронные/асинхронные и юзать их в контексте вообще любого фреймфорка/платформы, где есть js.
И запускать валидаторы мы можем по любому триггеру. Одним словом это свобода, о которой мы мечтаем.

Несколько примеров валидаторов с тестами можно найти по ссылке в тестовом репозитории [src/validators](https://github.com/robzarel/react-form-hooks/tree/main/src/validators). Ну а дальше по аналогии пишутся свои валидаторы под ваши нужды (телефоны, мейлы, маскированные инпуты и т.д и т.п.). Главное не забывать про тесты и логика будет легко переносима и управляема в процессе применения в разных проектах)

## Валидация форм в React

Теперь, когда у нас есть простая как js (тут можно посмеятся), атомарная, масштабируемся и отделяемая система валидации мы можем подумать над тем, как это дело запустить в контексте нашей любимой библиотеки интерфейсов **React**.

### Требования

Для начала так же как на предыдущих шагах, определим требования к системе. Будущая система валидации форм в React, должна нам позволять:

- иметь возможность быстро компоновать нужные нам формы
- не привязываться к конкретному представлению (view)
- иметь возможность валидировать как отдельное поле, так и всю форму
- реализовывать best practice по работе с формами

Так же неплохо бы иметь возможность в любой момент проверить наличие ошибок в поле/форме. Это может пригодится в различных более сложных кейсах со связанными и/или динамическими полями.

### Триггеры запуска валидации

Лучшие практики работы с формами говорят о том, что лучше всего помогать пользователю узнать ожидаемый формат ввода данных "на лету", т.е. по мере ввода данных в форму. Это помогает избежать лишних затрат времени пользователю, при взаимодействии с нашей формой.

В идеале, если позволяет место и дизайн приложения, реализовать подсказки под полем ввода. Однако
правил валидации может быть множество и все их сразу можно просто не уместить в "подсказке", которую ползователь видит до начала взаимодействия с полем ввода.

Поэтому обозначим несколько ключевых моментов, когда хотим запускать валидацию:

- Для поля
  - при "касании" (blur)
  - по мере ввода данных (change)
  - по кастомному триггеру
- Для формы
  - при отправке формы (submit)
  - по кастомному триггеру

По каждому из этих триггеров мы будем запускать валидацию.

### Хук **useTextFormField**

Теперь представим, что мы пилим форму, в которой есть одно текстовое поле. Например это форма обратной связи (где нам почему-то без разницы от кого был отзыв и мы просто хотим посмотреть, что нам напишут товарищи пользователи). Т.е. это форма на одно поле - textarea.

Начнём с того, что запилим хук, который позволяет использовать нам любые текстовые поля (input type text и texarea).

В принципе каждый хук, который в будущем будет отвечать за свой тип поля ввода (например за checkbox или radio button), может расширять анатомию **DefaultField** по своим потребностям.

Все поля, модели работы с которыми мы будем описывать будут основываться на дефолтном поле:

```typescript
type DefaultField = {
  id: string;
  value: string;
  error: null | string;
  hasError: () => Promise<boolean>;
};
```

Для текстовых полей **useTextFormField** мы расширяем **DefaultField** следующим образом:

```typescript
type TextField = DefaultField & {
  handleChange: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  handleBlur: () => void;
};
```

А сам код хука представлен ниже.
Он простой как тапок и позволяет легко инкапсулировать в себе модель данных конкретного поля формы:

```typescript
import { useCallback, useState } from 'react';
import type { ChangeEvent } from 'react';

import type { Validator, ValidationResult } from '../../validators';
import validateValue from '../../validators';
import type { DefaultField } from './types';

type TextField = DefaultField & {
  handleChange: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  handleBlur: () => void;
};

function useTextFormField(
  id: string,
  validators: Validator<string>[],
  init = ''
): TextField {
  const [value, setValue] = useState(init);
  const [error, setError] = useState<ValidationResult>(null);

  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const val = event.target.value;

      setValue(val);
      setError(await validateValue(val, validators));
    },
    [validators]
  );

  const handleBlur = useCallback(async () => {
    setError(await validateValue(value, validators));
  }, [value, validators]);

  const hasError = useCallback(async () => {
    const err = await validateValue(value, validators);
    setError(err);

    return !!err;
  }, [value, validators]);

  return {
    id,
    value,
    error,
    hasError,
    handleChange,
    handleBlur,
  };
}

export { TextField };
export default useTextFormField;
```

### Хук формы **useForm**

Хук для текстового поля у нас уже есть, теперь опишем логику отправки формы.

**useForm** это рутовый хук, который будет принимать набор полей формы, валидировать значения, выполнять запрос к апи (сабмит формы) и предоставлять информацию об успешности/не успешности сабмита.
Ну и разумеется будем в место вызова хука возвращать краткое описание его текущего состояния через флаг **isSending**

```typescript
import { useState } from 'react';
import type { FormEventHandler } from 'react';
import type { DefaultField } from './types';

function useForm<Field extends DefaultField, Response>(props: {
  fields: Field[];
  apiCall: () => Promise<Response>;
  onSuccess?: (response: Response) => void;
  onFailure?: (error: string) => void;
}): {
  isSending: boolean;
  sendingError: string;
  hasFieldErrors: boolean;
  handleFormSubmit: FormEventHandler<HTMLFormElement>;
} {
  const { fields, apiCall, onSuccess, onFailure } = props;

  const [isSending, setIsSending] = useState(false);
  const [sendingError, setSendingError] = useState('');

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const errors = await Promise.all(fields.map((field) => field.hasError()));
    const isFormValid = errors.every((error) => !error);

    if (isFormValid) {
      setIsSending(true);
      setSendingError('');

      try {
        const response = await apiCall();
        onSuccess?.(response);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Что-то пошло не так, попробуйте ещё раз';

        setSendingError(msg);
        onFailure?.(msg);
      } finally {
        setIsSending(false);
      }
    }
  };

  const hasFieldErrors = fields.some((field) => !!field.error);

  return {
    isSending,
    sendingError,
    hasFieldErrors,
    handleFormSubmit,
  };
}

export default useForm;
```

Примерчики хуков можно посмотреть здесь [src/form-validation-hooks](https://github.com/robzarel/react-form-hooks/tree/main/src/form-validation-hooks). По ссылке примеры хуков для работы с кастомным селектом, радио группой, инпутом для файлов и для текстовых полей.

PS:
Подробнее, про причину столь забавной типизации ошибки в catch блоке можно почитать здесь: [get-a-catch-block-error-message-with-typescript](https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript)

## Собираем всё вместе

Нам осталось соеденить эти 2 фичи вместе:

- Валидаторы (**validate** и наш кастомный **required** валидатор)
- Кастомные хуки: **useForm** (для формы) и **useTextFormField** (для текстового поля)

В качестве примера используем страницу для отправки обратной связи от пользователя.
Логика, которую реализуем укладывается в 3 простых шага:

1. собираем массив валидаторов (в нашем случае это один required валидатор)
2. инициализируем хуки
3. прикручиваем модели формы и поля к разметке так, как нам нужно

```typescript
import React from 'react';

import Preloader from 'your-ui-kit-library/Preloader';

import { required } from 'some-path/validators';
import { useForm, useTextFormField } from 'some-path/hooks';
import type { TextField } from 'some-path/hooks/types';

import api from 'some-path/api';
import type { Response as ApiResponse } from 'some-path/api/handlers/post-feedback';

import Styles from './index.css';

const validators = [required('our custom error message')];

function FormPage() {
  const feedback = useTextFormField('feedback', validators);

  const form = useForm<TextField, ApiResponse>({
    fields: [feedback],
    apiCall: () =>  /* your api call  */
    onSuccess: () => {
      /* api success call handler */
    },
    onFailure: () => {
      /* api failure call handler */
    },
  });

  return (
    <div className={Styles.layout}>
      <header className={Styles.header}>
        <h1 className={Styles.title}>Обратная связь</h1>
      </header>
      <main className={Styles.main}>
        <form className={Styles.form} onSubmit={form.handleFormSubmit}>
          <fieldset className={Styles.fieldset}>
            <p className={Styles.label}>Помогите нам стать лучше</p>
            <div className={Styles.textarea}>
              <textarea
                id={feedback.id}
                value={feedback.value}
                onChange={feedback.handleChange}
                onBlur={feedback.handleBlur}
                name="feedback"
                data-error={!!feedback.error}
              />
            </div>
          </fieldset>
          <div className={Styles.submitWrapper}>
            <button
              type='submit'
              className={Styles.submitButton}
              disabled={form.isSending || form.hasFieldErrors}
            >
              Получить
            </button>
            {form.isSending && (
              <div className={Styles.loader}>
                <Preloader />
              </div>
            )}
            {form.sendingError && (
              <p className={Styles.error}>{form.sendingError}</p>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
```

Немного пояснений:

- Используем textarea и делаем её [управляемым компонентом](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components)
- стилизацию **textarea** в случае ошибки делаем через **[data-error]** аттрибут уже в css
- **отключаем кнопку** на время отправки или в случае найденных ошибок
- **крутим крутилку** (любой Preloader, который больше нравится) пока запрос активный
- показываем сообщение об **ошибке**, если оно есть, через **form.sendingError**

PS:
CSS оставим за скобками наших обсуждений. Предположим что мы все профи в этом деле (что на самом деле не так - очень немногие фронты на самом деле действительно хорошо шарят в css)

## Итого

Мы имеем лёгку, гибкую систему состоящую из двух частей:

- Первая вообще не привязана ни к чему и мы можем её использовать где хотим.
- Вторая даёт нам возможность использовать апи хуков для реализации прекрасной реюзабельности хуков между формами.

Надеюсь вам было любопытно прочитать про этот подход)

Спасибо за чтение и удачи в реализации вашей валидации (кажется каждый frontend должен запилить за свою карьеру хотя бы раз свою собственную кастомную валидацию)))

PS:
В опытной эксплуатации данный подход был обкатан на двух проектах средней длительности (до 1.5 лет) и в процессе работы не встречалось ни недостатка гибкости в системе, ни критических проблем). Валидаторы пилились, некоторые мигрировали между фронтом/бэком разных проектов одной экосистемы, хуки писались, формы валидировались, тимлиды радовались ))
Но это история только про мой боевой опыт. Если же у вас есть время и желание поделится в кратце своей историей - велкам в комментарии)

PPS: ссылки из статьи

- про примерчики
  - валидаторы [src/validators](https://github.com/robzarel/react-form-hooks/tree/main/src/validators)
  - кастомные хуки [src/form-validation-hooks](https://github.com/robzarel/react-form-hooks/tree/main/src/form-validation-hooks)
- про [HTML5 Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation)
- про актуальность поддержки: [caniuse.com](https://caniuse.com/?search=constraint%20api)
- про [управляемые компоненты](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components)
- про [image.decode](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode)
