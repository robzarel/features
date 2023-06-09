# token authorization

Localstorage для авторизации

как можно использовать localStorage для авторизации

Данный набор решений реализует логику разграничения прав доступ к определённым действиям и/или блокам интерфейса, в зависимости от конкретной роли (в качестве примера будет бинарное разделение, но ничего не мешает сделать разрганичение на множество ролей).

## Предисловие

Использование localstorage, наряду с использованием httpOnly cookie, является одним из наиболее популярных подходов к хранению токенов доступа.
Мы не будем заниматься сравнением подоходов, об этом сказано уже много. Например [в этой статье](https://dev.to/cotter/localstorage-vs-cookies-all-you-need-to-know-about-storing-jwt-tokens-securely-in-the-front-end-15id)).

Здесь мы всего лишь зафиксируем, что localstorage чуть более уязвим для XSS атак, но позволяет работать с большим набором сценариев.
В этой статье мы рассмотрим как можно организовать работу с localStorage и при этом постараться обезопасить себя от XSS атак.

Так же важно понимать разницу между **access token** и **refresh token**. Как следует из названия, первый токен нужен для разграничения прав доступа к ресурсам, в то время как второй только для обновления первого).

В данной фиче мы будем говорить только о первом, об **access token** и в рамках нашего скоупа обсуждения будем считать, что **refresh token** у нас стабильный и валидный.

Итак, поехали!

## План действий

Для реализации фичи, нам понадобится пройти несколько шагов, а именно:

1. понять, как и где безопасно хранить токен
2. научится получать доступ к приватному апи (согласно нашей роли)
3. выяснить, как мы можем ограничить доступ пользователя к части интерфейса и/или целым страницам

## Безопасно хранить токен

Итак, после того как мы получили от бэка авторизационный токен, мы должны где-то его сохранить.
Выбираем для этого localStorage. Это достаточно безопасно, если следить за временем жизни этого самого токена и вовремя его обновлять.

Подробнее можно почитать тут: [как использовать localStorage для хранения токена](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/).

Наш модуль должен уметь в стандартные **CRUD** операции:

- устаналивать/обновлять его значение (CREAT/UPDATE)
- возвращать наш токен, по первому требованию (READ)
- а так же удалять его (DELETE)

А ещё:

- иметь ограниченное время жизни (для безопасности)
- иметь признак умер он или ещё нет (isExpired)

```typescript
type StoredToken = {
  value: string;
  timeStamp: number;
};

const TOKEN_KEY = 'auth_token';
/**
 * Токен имеет фиксированное время жизни.
 * Важно, так как храним в localStorage и уменьшаем риск в случае xss.
 * Время жизни токена ставим в 23 часа 59 минут
 */
const TOKEN_TTL_MS = 86340000;

const isExpired = (timeStamp?: number): boolean => {
  if (!timeStamp) return false;

  const now = new Date().getTime();
  const diff = now - timeStamp;

  return diff > TOKEN_TTL_MS;
};

const setToken = (access_token: string): void => {
  localStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({
      value: access_token,
      timeStamp: new Date().getTime(),
    })
  );
};

const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

const getToken = (): StoredToken | null => {
  let result = null;

  const storedToken = localStorage.getItem(TOKEN_KEY);
  storedToken && (result = JSON.parse(storedToken));

  return result;
};

export { getToken, setToken, removeToken, isExpired };
```

Сейчас есть весь функционал, который нам может понадобится.

Сама же логика установки токена будет на уровне компонента, так как триггером обновления access token должен быть пользователь.

## Получить доступ к приватному апи

В рамках решения данной задачи нам всего лишь нужно взять наш **access token** и подмешать его в отправляемый запрос (поместить значение в признак, который понимает наш бэкенд). В подавляющем большинстве случаев этот признак будет в виде какого-либо **http** заголовка.
Предположим, что мы договорились с нашим бэком о следующей конвенции: **"Authorization: `Bearer ${access_token}`"**

А, и ещё мы лучше не будем в каждый **fetch** руками что-то подмешивать. А напишем простенький authFetch с блэкджеком. И сделаем его таким, чтобы сигнатура его использования была точно такая же, как и у обычного, всем привычного **fetch**. Т.е. наш небольшой модуль сделает всё за нас:

- сам посмотрит, есть ли токен в хранилище (через внешние методы tokenProvider)
- сам подмешает нужный заголовок
- сам заботливо вернёт ответ без каких-либо манипуляций над данными

А нам останется всего лишь использовать **authFetch** вместо **fetch** для всех защищённых эндпойнтов.

```typescript
const authFetch = async (
  input: RequestInfo,
  init: RequestInit | undefined = {},
  token?: string
): Promise<Response> => {
  const access_token = token || getToken()?.value || 'no_token';

  if (access_token === 'no_token') {
    // eslint-disable-next-line no-console
    console.warn('Making secure API call without an auth token');
  }

  const options = { ...init };

  options.headers = {
    ...init.headers,
    Authorization: `Bearer ${access_token}`,
  };

  return fetch(input, options);
};

export default authFetch;
```

Вроде бы пока что не сложно. Идём дальше

## Ограничить доступ пользователя к части интерфейса

А для решения этой задачки нам достаточно лишь написать стандартный react компонент, который будет либо рендерить предоставленных ему children, либо отправлять на страницу авторизации.

Правилом хорошего тона, при редиректе на страницу авторизации, будет передать в явном виде информацию о том, откуда мы пришли на страницу логина. Мы будем использовать простой query parametr под названием **from**

Но мы сделаем наш компонент немного уменее. Он сам сможет инициировать попытку обновления access token, сам его установить в случае успешного обновления или же перенаправить на страницу авторизации в случае фейла.

Алгоритм работы будет следующий:

- если токен ещё не проверяли, то проверяем в localStorage
  - если токен есть и он не протух, то пускаем пользователя к контенту
  - если токена нет или он протух, то идём отправляемся за ним
    - если токен пришёл, то сохраняем его в localStorage и пускаем пользователя к контенту
    - если токен не пришёл, то отправляем пользователя на страницу авторизации

```typescript
import React, { useState, useEffect } from 'react';

import Preloader from 'some-ui-kit-library/Preloader';

import { getToken, setToken, removeToken, isExpired } from './index';
import api from '../../api';

type Props = {
  children: React.ReactNode;
};

const WithAuth = (props: Props) => {
  const { children } = props;
  const [isTokenFetchingActive, setTokenFetchingStatus] =
    useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        removeToken();

        const access_token = await api.get.token();

        setToken(access_token);
        setIsAuthenticated(true);
        setTokenFetchingStatus(false);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Unknown Error: api.get.token';

        // реализуем утилитарное предупреждение для пользователя
        // eslint-disable-next-line no-alert
        alert(
          `Неудалось загрузить токен доступа. Сейчас вы будете перенаправлены на страницу авторизации. Details: ${msg}`
        );

        window.location.assign(
          `/your-login-page/?from=${window.location.pathname}`
        );
      }
    };

    if (isTokenFetchingActive) {
      const token = getToken();

      if (token && !isExpired(token.timeStamp)) {
        setIsAuthenticated(true);
        setTokenFetchingStatus(false);
      } else {
        fetchToken();
      }
    }
  }, [isTokenFetchingActive]);

  const renderContent = () => {
    return isAuthenticated ? children : null;
  };

  return <div>{isTokenFetchingActive ? <Preloader /> : renderContent()}</div>;
};

export default WithAuth;
```

#### Применение WithAuth:

```typescript
<WithAuth>
  <SomePage />
</WithAuth>
```

## Итого

Имея всего 2 модуля и 1 компонет мы можем полностью, абсолютно как захотим, разграничить на зоны доступа наше приложение.

- **tokenProvider** инкапсулирует в себе всю "низкоуровневую" работу с обслуживанием токена и торчит наружу свой незамысловатый интерфейс
- **WithAuth** позволит нам зарендерить только доступную страницу (а при небольших доработках и кусочек интерфейса в рамках одной страницы)
- **authFetch** позволит нам не парится и просто бомбить нужное нам апи запросами.

Спасибо за чтение и удачи в реализаици фичи авторизации)

PS: cсылки из статьи:

- про сравнение [localStorage vs cookie](https://dev.to/cotter/localstorage-vs-cookies-all-you-need-to-know-about-storing-jwt-tokens-securely-in-the-front-end-15id)
- про [localStorage для хранения токена](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)
