## npm scripts

- `npm start` Старт дев сервера фронтового приложения
- `npm run serve` Старт json-server для локальной разработки
- `npm run deploy` Деплой на github-pages (при условии, что вы настроили автодеплой из ветки gh-pages в разделе `settings`->`settings/pages`->`Build and deployment` вашего github репозитория). Данная команда выполнит
  - билд приложения,
  - скопирует все файлы, которые будут выполнять функцию апи, в каталог build
  - отправит получившееся в ветку gh-pages в ваш репозиторий.

## Добавление контента в сохранялку

1. Выбираем тип контента, который хотим добавить и идём редактировать соотвествующий файл:

- `src/server/db/ru/core/features.json`
- `src/server/db/ru/core/projects.json`
- `src/server/db/ru/core/snippets.json`
  Модель данных берём или по примеру или по описанным типам в соответствующем файле:
- `src/types/core/feature.ts`
- `src/types/core/projects.ts`
- `src/types/core/snippets.ts`

2. не забываем указывать связи на сниппеты и фичи в поле `related`. Это потом пригодится)
3. создаём соответствующие `readme` в формате markdown для каждого нового юнита, который добавили. Например - докинули фичу с номером 12, значит описание для неё положили в файл `src/server/db/ru/readme/feature/12.md`. Для проектов и сниппетов аналогично. Эти файлы подтянутся при заходе на ваш развёрнутый github pages (url указан в секции `homepage` в package.json) а путь по следующему паттерну сформируется: `<your-github-pages-homepage>/<type>/<id>`

- `<your-github-pages-homepage>/feature/0`
- `<your-github-pages-homepage>/projects/0`
- `<your-github-pages-homepage>/snippets/0`

## Добавление даннных в резюме

По сути просто редактированием json файлов

- `src/server/db/ru/common/education.json`
- `src/server/db/ru/common/skills.json`
- `src/server/db/ru/common/experience.json`

Модели данных можно брать по примеру или посмотреть тут: `src/types/common/index.ts`
