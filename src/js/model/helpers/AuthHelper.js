const AuthHelper = {

  origin: window.location.origin,
  pages: {
    login: '/login',
    main: '/',
    notFound: '/404',
  },
  urls: {
    backendUrl: 'https://afternoon-falls-25894.herokuapp.com/',
    users: 'users/',
  },

  redirectTo: (pageName) => {
    const page = AuthHelper.pages[pageName]
      ? AuthHelper.pages[pageName]
      : AuthHelper.pages.notFound;
    window.location.replace(`${AuthHelper.origin}/#${page}`);
  },

  redirectToLogin: () => {
    AuthHelper.redirectTo('login');
  },

  redirectToMain: () => {
    AuthHelper.redirectTo('main');
  },

  /** проверить, что пользователь авторизован
   * проверка не пройдет, если:
   * - нет ключа 'rslang66' в localStorage,
   * - ключ есть, но в нем пустой userId, token или refreshToken
   * - после отправки запроса на авторизацию пользователя вернется ошибка
   */
  checkUser: async () => {
    const userSettings = JSON.parse(localStorage.getItem('rslang66'));
    if (!userSettings) {
      return false;
    }

    const { userId, token, refreshToken } = userSettings;

    if (!userId || !token || !refreshToken) {
      return false;
    }

    const isUserLogged = await AuthHelper.getUserById(userSettings);
    if (!isUserLogged) {
      return false;
    }

    return true;
  },


  /** отправить запрос на получение пользователя
   * если вернулся код ответа 200 - пользователь есть, токен действует
   * {
   *  userId: '5ef8dcfbbe75ea0017942665',
   *  token: ''
   * }
   */
  getUserById: async ({ userId, token }) => {
    const { backendUrl, users } = AuthHelper.urls;
    const url = `${backendUrl}${users}${userId}`;

    try {
      const rawResponse = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return (rawResponse.status === 200);
    } catch (e) {
      return { error: true, errorText: e.message };
    }
  },

};

export default AuthHelper;
