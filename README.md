# Yandex Praktikum Messenger

Проект мессенджера Яндекс.Практикум

Netlify: https://dynamic-kashata-8fad5b.netlify.app

Figma: https://www.figma.com/file/81pEOmE0IPf2m6d1jedEfc/Yandex-Practicum-Messanger?node-id=0%3A1

## Запуск проекта ##
- `npm run dev` - для разработки

- `npm run start` - запуск проекта

## Структура проекта ##
**components/\*** - папка компонентов

> **component_name.js** - Описание компонента

> **component_name.module.css** - Стили компонента (postcss-modules)


**images/\*** - изображения используемые в проекте

**layout/\*** - layout (макеты) страниц

> **layout_name.js** - Описание компонента макета

> **layout_name.module.css** - Стили компонента макета (postcss-modules)

**modules/\*** - модули

> **app.js** - Модуль приложения

> **component.js** - Модуль компонента

> **vdom.js** - Модуль для работы с VDOM

**pages/\*** - страницы

> **page_name.js** - Описание приложения страницы

> **page_name.module.css** - Стили страницы (postcss-modules)

> **index.html** - Точка входа страницы

**utils/\*** - утилиы



## Шаблонизатор ##

**Глоссарий**


> props - свойства компонента

> state - состояние компонента

> slot - место, в котрое вставляются дочерние элементы

> интерполяция - замена переменных в шаблоне компонента

> Virtual DOM / VDOM - виртуальное дерево DOM елементов

**Возможности**

- Определеие layout (макета) страницы
- Создание компонентов
- Передача в компоненты props и определение их значений по умолчанию
- Интерполяция state компонента
- Передача дочерник элементов (элементы Virtual DOM) в элемент slot
- Цикл for 

**Использование**
- Инициализация и монтирование приложения (должен быть хотя бы один корневой элемент в шаблоне)
```
const app = new App(
  new Component((props) => {
    return `<div>My App</div>`;
  }, state)
);

app.mount(document.getElementById('app'));
```

- Создание компонента (должен быть хотя бы один корневой элемент в шаблоне)
```
new Component((props) => {
    return `<div>My component</div>`;
  }, 
  // Состояние компонента
  state, 
  // Props по умолчанию
  defaultProps)
```
- Регистрация компонента (для использования одного компонента в другом)
```
const defaultLayoutComponent = new Component(() => `
<div class="${styles.page}">
  <Header>header</Header>
  <div class="${styles.page_inner}">
  <slot></slot>
  </div>
  <Footer>footer</Footer>
</div>
`);

defaultLayoutComponent.register('Header', headerComponent)
defaultLayoutComponent.register('Footer', footerComponent)

```

- Передача props в компонент (как обычные HTML аттрибуты)
```
const app = new App(
  new Component((props) => {
    return `
    ...
    <Button type="primary" class="${styles.edit_button}">СОХРАНИТЬ</Button>
    <Button type="secondary" class="${styles.edit_button}">ОТМЕНА</Button>
   ...
 `;
  })
);

app.register('Button', buttonComponent);
```
- Цикл :for
```
const state = {
  settings: [
  ...
    {
      name: 'Имя в чате',
      value: 'Антон Безушко',
    },
    {
      name: 'Имя',
      value: 'Антон',
    },
    ...
  ]
};

const app = new App(
  new Component((props) => {
    return `
    ...
    <div :for="setting in settings">
      <div class="${styles.settings_form_field}">
        <div class="${styles.settings_form_field_name}">{{setting.name}}</div>
        <div class="${styles.settings_form_field_value}">{{setting.value}}</div>
      </div>
    </div>
    ...
 `;
  }, state)
);
```


**Алгоритм работы рендера страницы**
- Создается экземпляр приложения с корневым компонентом (шаблон компонента может включать другие компоненты)
- Вызывается рендер функция корневого компонента в которой возвращается его шаблон 
- Шаблон преобразается в Virtual DOM, если элемент Virtual DOM является компонентом, то для него тоже вызывается функция рендера и т.д. 
На выходе получается полное Virtual DOM дерево страницы
- Приложение создание из Virtual DOM реальный DOm
