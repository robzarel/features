# Пагинация

Пишем пагинацию за 7 минут.
Как сделать пагинатор в React приложении

В общем и целом всё пилится быстро и легко

3 этапа

1. Пишем логику хождения за данными

На этом этапе задача понять где хранить и как забирать данные
объявляем состояние и пишем useEffect

2. пишем пагинатор
   Простой стейтлесс компонент визуальный, который будет состоять из двух кнопок

3. соединяем: пагинатор и состояние контейнера
   немного логики, которая будет оперировать изменением состояния, отвечающего за перелистывание

итак, поехали!

1. объявляем состояние и пишем useEffect

```typescript
const [page, setPage] = useState(1);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getData({ page });

      setData(response);
    } catch (err) {
      // https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
      setError(
        err instanceof Error
          ? err.message
          : 'Unknown Error: api.mercury.private.get.configs'
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [page]);
```

2. пишем пагинатор

```typescript
type PaginationProps = {
  nav?: {
    current: number;
    total: number;
  };
  disable: {
    left: boolean;
    right: boolean;
  };
  onNextPageClick: () => void;
  onPrevPageClick: () => void;
};

const Pagination = (props: PaginationProps) => {
  const { nav = null, disable, onNextPageClick, onPrevPageClick } = props;

  const handleNextPageClick = () => {
    onNextPageClick();
  };
  const handlePrevPageClick = () => {
    onPrevPageClick();
  };

  const shouldRenderControls = !(nav && nav.current === nav.total);

  return (
    <div className={Styles.paginator}>
      {shouldRenderControls && (
        <button
          className={Styles.arrow}
          type='button'
          onClick={handlePrevPageClick}
          disabled={disable.left}
        >
          <Icon symbol='arrow-left' size='m' />
        </button>
      )}
      {nav && (
        <span className={Styles.navigation} data-testid='pagination-navigation'>
          {nav.current} / {nav.total}
        </span>
      )}
      {shouldRenderControls && (
        <button
          className={Styles.arrow}
          type='button'
          onClick={handleNextPageClick}
          disabled={disable.right}
        >
          <Icon symbol='arrow-right' size='m' />
        </button>
      )}
    </div>
  );
};
```

3. соединяем: пагинатор и состояние контейнера
   пишем обработчики и цепляемся на состояние

```typescript
const handleNextClick = useCallback(() => {
  const current = page;
  const next = current + 1;
  const total = configsData ? getTotalPageCount(configsData.count) : current;

  setPage(next <= total ? next : current);
}, [page, configsData]);

const handlePrevClick = useCallback(() => {
  const current = page;
  const prev = current - 1;

  setPage(prev > 0 ? prev : current);
}, [page]);
```

4.  очень часто пагинация используется с параметрами поиска и инпутом.

```typescript
const handleSearch = useCallback((value: string) => {
  if (value.length === 0 || value.length > 3) {
    setPage(1);
    setSearchValue(value || null);
  }
}, []);
```

Выводы

Ссылки из статьи

ну и легко и непринуждённо можно использовать reaqt-query для запросов.
