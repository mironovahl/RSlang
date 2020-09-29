import '../../../css/pages/login.scss';

const Login = {
  render: async () => {
    const view = /* html */`
    <section class="section login--container">
      <div class="wrapper">
        <div class="login__card">
          <div class="login__card_control">
            <p class="login__control_button control-login selected">Авторизация</p>
            <p class="login__control_button control-signin">Регистрация</p>
          </div>
          <p class="login__card_label">Введите email</p>
          <input type="text" class="login--email__input" placeholder="Email">
          <p class="login__card_label">Введите пароль</p>
          <input type="password" class="login--password__input" placeholder="Пароль">
          <div class="login__card_error">
            <p class="login__card_errorMessage"></p>
          </div>
          <div class="login__card_buttons">
            <button class="login__card_button button-signin hidden">Зарегистрироваться</button>
            <button class="login__card_button button-login">Войти</button>
          </div>
        </div>
      </div>
    </section>
          `;

    return view;
  },
  afterRender: async (model) => {
    const emailInput = document.querySelector('.login--email__input');
    const passwordInput = document.querySelector('.login--password__input');

    const createUserButton = document.querySelector('.button-signin');
    const loginUserButton = document.querySelector('.button-login');
    const controlLogin = document.querySelector('.login__card_control');
    const errorMessage = document.querySelector('.login__card_errorMessage');

    const outputError = (text) => {
      errorMessage.innerHTML = text;
    };

    const clearError = () => {
      errorMessage.innerHTML = '';
    };

    const getUserData = () => ({
      email: emailInput.value,
      password: passwordInput.value,
    });

    const createUser = async () => {
      const userData = getUserData();
      // создаем нового пользователя, авторизуем, добавляем его данные в localStorage
      const newUser = await model.createAndSetUser(userData);
      if (newUser.error) {
        outputError(newUser.errorText);
        return;
      }
      model.redirectToMain();
    };

    const loginUser = async () => {
      const userData = getUserData();
      // авторизуем пользователя, добавляем его данные в localStorage
      const authUser = await model.loginAndSetUser(userData);
      if (authUser.error) {
        outputError(authUser.errorText);
        return;
      }
      model.redirectToMain();
    };

    controlLogin.addEventListener('click', ({ target }) => {
      clearError();
      if (!target.classList.contains('selected')) {
        target.classList.add('selected');
        if (target.classList.contains('control-login')) {
          document.querySelector('.control-signin').classList.remove('selected');
          document.querySelector('.button-login').classList.remove('hidden');
          document.querySelector('.button-signin').classList.add('hidden');
        } else if (target.classList.contains('control-signin')) {
          document.querySelector('.control-login').classList.remove('selected');
          document.querySelector('.button-signin').classList.remove('hidden');
          document.querySelector('.button-login').classList.add('hidden');
        }
      }
    });

    createUserButton.addEventListener('click', createUser);
    loginUserButton.addEventListener('click', loginUser);
  },
};

export default Login;
