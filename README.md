# Yandex Praktikum Messenger

Проект мессенджера Яндекс.Практикум

Netlify: https://starlit-ganache-25683f.netlify.app/

Render(Docker): https://yandex-practikum.onrender.com

Figma: https://www.figma.com/file/81pEOmE0IPf2m6d1jedEfc/Yandex-Practicum-Messanger?node-id=0%3A1

## Запуск проекта

- `npm run dev` - для разработки

- `npm run hot` - разработка с HMR

- `npm run start` - запуск проекта

- `npm run build` - билд проекта

- `npm run lint` - линтеры (eslinter,stylelint)

- `npm run test` - тесты

## Структура проекта

**components/\*** - папка компонентов

> **component_name.tsx** - Описание компонента

> **component_name.module.css** - Стили компонента (postcss-modules)

**images/\*** - изображения используемые в проекте

**css/\*** - глобальные стили

**layout/\*** - layout (макеты) страниц

> **layout_name.tsx** - Описание компонента макета

> **layout_name.module.css** - Стили компонента макета (postcss-modules)

**modules/\*** - модули

> **vdom.ts** - Модуль для работы с VDOM

> **fetch.ts** - Модуль для работы с XHR

> **components.ts** - Модуль для работы с компонентом (пока не реализовн)

> **observer.ts** - Модуль для работы с паттерном Observer

> **reactivity.ts** - Система реактивности

> **validatorRules.ts** - Правила валидации

**pages/\*** - страницы

> **page_name.js** - Описание приложения страницы

> **page_name.module.css** - Стили страницы (postcss-modules)

> **index.html** - Точка входа страницы

**utils/\*** - утилиы

## Шаблонизатор

**Тесты**

- Все тесты находятся рядом с тестируемым файлами

**Особенности**

- Для рендера шаблонов используется синтаксис JSX. С помощью плагина `@babel/plugin-transform-react-jsx` меняем вызов `React.createElement` на свою функцию `h`

- Система реактивности (аналог Vue)

**Доработки**

- VDOM неправильно перерисовывает DOM дерево, функция `patchNode` перебираем своих потомков, а `patchChildren` меняет DOM, из-за чего цикл прекращает работу. Итог условный рендеринг использовать получится, если не менять структуру DOM. Универсально можно пользоваться `display: none;`
- JSX ссылается на типы React из-за чего могут быть ошибки IDE в возвращаемых типах. Как их переопределить не знаю
- Продумать жизненный цикл компонентов (сделано onMounted, update)
- Продумать возможность использовать в компонентах локальное состояние (сейчас функци ререндере рабаотает только при измененни в корневом шаблоне)

**Алгоритм работы рендера страницы**

- createApp обораживает корневой компонент в `watch (reactive)` функцию и следит за изменениями состояния
- При изменении перерисовывает VDOM
- VDOM делает изменения в DOM
