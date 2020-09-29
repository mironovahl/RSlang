import '../../../css/pages/error404.scss';

const Error404 = {

  render: async () => {
    const view = /* html */`
    <section class="page404">
    <h1 class="page404__title">404</h1>      
      <div class="page404__bg"></div>
      <div class="page404__content">
        <h3>Такая страница отсутствует.</h3>
        <p>Возможно, вы ошиблись при наборе адреса страницы или перешли по неверной ссылке.</p>
        <a href="/" class="link_404">Вернуться на главную</a>
      </div>
    </section>`;
    return view;
  },
  afterRender: async () => {
  },
};
export default Error404;
