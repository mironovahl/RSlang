// import App from '@modules/app';
// import appConfig from '@settings/appConfig';
// import apiConfig from '@settings/apiConfig';

import '../css/style.scss'; // общий файл стилей
import '../css/pages/module.scss';

// Все страницы - по одному импорту на одну страницу
import Home from './views/pages/Home';
import Login from './views/pages/Login';
import Statistics from './views/pages/Statistics';
import Dictionary from './views/pages/Dictionary';
import Games from './views/pages/Games';
import Promo from './views/pages/Promo';
import Team from './views/pages/Team';
import Cards from './views/pages/Cards';

import Error404 from './views/pages/Error404';

// Все компоненты - общие элементы, которые могут использоваться на нескольких страницах
import Header from './views/components/Header';
import Footer from './views/components/Footer';

// Файлы-хелперы
import Utils from './services/Utils';

// Импорт модели
import AppModel from './model/AppModel';

const model = new AppModel();

// список всех маршрутов (routes) в формате:
// 'маршрут' : 'файл страницы для этого маршрута'
const routes = {
  '/': Home, // Главная,
  '/cards': Cards, // Карточки изучения слов
  '/login': Login, // Авторизация/Регистрация
  '/stats': Statistics, // Статистика,
  '/dictionary': Dictionary, // Словарь,
  '/games/:id': Games, // Мини-игры,
  '/promo': Promo, // О приложении,
  '/team': Team, // О команде,
};

// список страниц, которые должны быть доступны НЕавторизованному пользователю
const allowedToGuestRoutes = ['/login', '/team', '/', '/promo'];

// роутер - разбирает ссылку из адресной строки, ищет совпадение
// в объекте routes, загружает соответствующий элемент
// header и footer - общие для всех страниц элементы
// content - уникальная разметка/код, которую должна генерировать каждая страница
const router = async () => {
  const header = null || document.querySelector('.header');
  const content = null || document.querySelector('.content');
  const footer = null || document.querySelector('.footer');

  // нормальная реализация редиректа есть в AuthHelper, но это не его ответственность, а роутера
  const redirectToLogin = () => {
    window.location.replace(`${window.location.origin}/#/login`);
  };
  const redirectToPage = (pageName) => {
    window.location.replace(`${window.location.origin}/#/${pageName}`);
  };
  // авторизован пользователь или нет
  const isUserLogged = await model.checkUser();

  // для каждого элемента вызывается метод render(), чтобы создать html-разметку,
  // а затем - afterRender(), чтобы повесить на разметку обработчики событий
  header.innerHTML = await Header.render();
  await Header.afterRender(model);
  footer.innerHTML = await Footer.render();
  await Footer.afterRender();

  // парсинг url
  const request = Utils.parseRequestURL();

  // Parse the URL and if it has an id part, change it with the string ":id"
  const resource = request.resource ? `/${request.resource}` : '/';
  const id = request.id ? '/:id' : '';
  const verb = request.verb ? `/${request.verb}` : '';

  const parsedURL = `${resource}${id}${verb}`;

  /* если пользователь запрашивает страницу, разрешенную только авторизованным,
  проверяем, авторизован ли он. Если нет - перенаправляем на /login */
  if (!allowedToGuestRoutes.includes(resource) && !isUserLogged) {
    redirectToLogin();
    return;
  }
  /** если пользователь авторизован, запретить ему страницу авторизации/регистрации */
  if (resource === '/login' && isUserLogged) {
    redirectToPage('');
    return;
  }

  // Найти совпадение в объекте routes, и загрузить нужную страницу (или 404, если совпадения нет)
  const page = routes[parsedURL] ? routes[parsedURL] : Error404;
  content.innerHTML = await page.render(model);
  await page.afterRender(model);
};

// слушатель на изменение текста за хэштегом в адресной строке
window.addEventListener('hashchange', router);

// слушатель на загрузку страницы
window.addEventListener('load', router);
