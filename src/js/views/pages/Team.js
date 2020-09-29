import '../../../css/pages/team.scss';

const Team = {
  render: async () => {
    const view = `
    <div class="aboutTeam">
    <div class="wrapper">
        <div class="aboutTeam_content">
          <div class="aboutTeam__card">
            <div class="aboutTeam__card_image imageDdenis"></div>
            <div class="aboutTeam__card_icon iconMentor"></div>
            <div class="aboutTeam__card_text">
              <p class="aboutTeam__card_name">Денис Архипов</p>
              <p class="aboutTeam__card_position">Ментор</p>
              <p class="aboutTeam__card_about">Менторил и trello это очень важно!</p>
              <div class="aboutTeam__card_contact">
                <div class="aboutTeam__card_contact-github">
                  <div class="aboutTeam__card_contact-githubImage"></div>
                  <a class="aboutTeam__card_contact-githubLink" href="https://github.com/vikingspb" target="_blank">vikingspb</a>
                </div>
              </div>
            </div>
          </div>

          <div class="aboutTeam__card">
            <div class="aboutTeam__card_image imageDmitry"></div>
            <div class="aboutTeam__card_icon iconTeamLead"></div>

            <div class="aboutTeam__card_text">
              <p class="aboutTeam__card_name">Дмитрий Семенов</p>
              <p class="aboutTeam__card_position">Тимлид</p>
              <p class="aboutTeam__card_about">Разработка архитектуры приложения, сервисного слоя, мини-игры "Пазл". Создание видео. Тестирование и отладка.</p>
              <div class="aboutTeam__card_contact">
                <div class="aboutTeam__card_contact-github">
                  <div class="aboutTeam__card_contact-githubImage"></div>
                  <a class="aboutTeam__card_contact-githubLink" href="https://github.com/dispector" target="_blank">dispector</a>
                </div>
              </div>
            </div>
          </div>
          <div class="aboutTeam__card">
            <div class="aboutTeam__card_image imageEvgenii"></div>
            <div class="aboutTeam__card_icon iconStudent"></div>

            <div class="aboutTeam__card_text">
              <p class="aboutTeam__card_name">Евгений Лагутин</p>
              <p class="aboutTeam__card_position">Студент</p>
              <p class="aboutTeam__card_about">Разработка мини-игры "Аудиовызов", страниц 404 и all games, верстка header и footer, реализация функционала карточек для изучения слов.</p>
              <div class="aboutTeam__card_contact">
                <div class="aboutTeam__card_contact-github">
                  <div class="aboutTeam__card_contact-githubImage"></div>
                  <a class="aboutTeam__card_contact-githubLink" href="https://github.com/jeka2100" target="_blank">jeka2100</a>
                </div>
              </div>
            </div>
          </div>
          <div class="aboutTeam__card">
            <div class="aboutTeam__card_image imageKate"></div>
            <div class="aboutTeam__card_icon iconStudentGirl"></div>

            <div class="aboutTeam__card_text">
              <p class="aboutTeam__card_name">Екатерина Белякова</p>
              <p class="aboutTeam__card_position">Студент</p>
              <p class="aboutTeam__card_about">Разработка стартового экрана для игр и мини-игры "Саванна", верстка карточек для изучения слов, верстка и функционал настроек для изучения слов</p>
              <div class="aboutTeam__card_contact">
                <div class="aboutTeam__card_contact-github">
                  <div class="aboutTeam__card_contact-githubImage"></div>
                  <a class="aboutTeam__card_contact-githubLink" href="https://github.com/katefaith" target="_blank">katefaith</a>
                </div>
              </div>
            </div>
          </div>
          <div class="aboutTeam__card">
            <div class="aboutTeam__card_image imageElena"></div>
            <div class="aboutTeam__card_icon iconStudentGirl"></div>

            <div class="aboutTeam__card_text">
              <p class="aboutTeam__card_name">Елена Миронова</p>
              <p class="aboutTeam__card_position">Студент</p>
              <p class="aboutTeam__card_about">Разработка мини-игры "Спринт", дизайна приложения, реализация страницы о команде и промо-страницы, адаптация, верстка страницы авторизации.</p>
              <div class="aboutTeam__card_contact">
                <div class="aboutTeam__card_contact-github">
                  <div class="aboutTeam__card_contact-githubImage"></div>
                  <a class="aboutTeam__card_contact-githubLink" href="https://github.com/mironovahl" target="_blank">mironovahl</a>
                </div>
              </div>
            </div>
          </div>
          <div class="aboutTeam__card">
            <div class="aboutTeam__card_image imageYaroslava"></div>
            <div class="aboutTeam__card_icon iconStudentGirl"></div>

            <div class="aboutTeam__card_text">
              <p class="aboutTeam__card_name">Ярослава Одинец</p>
              <p class="aboutTeam__card_position">Студент</p>
              <p class="aboutTeam__card_about">Разработка своей игры "Буквенный квадрат" и глобальной статистики.</p>
              <div class="aboutTeam__card_contact">
                <div class="aboutTeam__card_contact-github">
                  <div class="aboutTeam__card_contact-githubImage"></div>
                  <a class="aboutTeam__card_contact-githubLink" href="https://github.com/YaroslavaOdin" target="_blank">YaroslavaOdin</a>
                </div>
              </div>
            </div>
          </div>
          <div class="aboutTeam__card">
            <div class="aboutTeam__card_image imageVictor"></div>
            <div class="aboutTeam__card_icon iconStudent"></div>

            <div class="aboutTeam__card_text">
              <p class="aboutTeam__card_name">Виктор Макаров</p>
              <p class="aboutTeam__card_position">Студент</p>
              <p class="aboutTeam__card_about">Разработка словаря, реализация мини-игры "Скажи это" и мобильной версии header.</p>
              <div class="aboutTeam__card_contact">
                <div class="aboutTeam__card_contact-github">
                  <div class="aboutTeam__card_contact-githubImage"></div>
                  <a class="aboutTeam__card_contact-githubLink" href="https://github.com/Gollwyd" target="_blank">Gollwyd</a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
            `;
    return view;
  },
  afterRender: async () => { },

};

export default Team;
