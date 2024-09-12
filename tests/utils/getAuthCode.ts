import puppeteer from 'puppeteer';

async function getAuthorizationCode(): Promise<string> {
  const browser = await puppeteer.launch({ headless: false }); // headless: false, чтобы открыть реальный браузер
  const page = await browser.newPage();

  // Открываем страницу авторизации
  const authorizationURL = 'https://senler.ru/cabinet/OAuth2authorize?client_id=66d9cba9c6e3b379e659e9a2&redirect_uri=https://9569-188-233-57-106.ngrok-free.app/auth/senler/callback';

  // Выводим ссылку в консоль, чтобы разработчик мог видеть и, при необходимости, скопировать
  console.log('Открытие страницы авторизации: ', authorizationURL);

  // Переходим на страницу
  await page.goto(authorizationURL);

  // Ждем, пока разработчик завершит аутентификацию вручную
  console.log('Ожидается ручная аутентификация разработчиком...');

  // Ожидаем перенаправления на callback URL с кодом
  await page.waitForNavigation();

  // Извлекаем текущий URL с кодом авторизации
  const currentURL = page.url();
  const authorizationCode = new URL(currentURL).searchParams.get('code') || '';

  if (authorizationCode) {
    console.log('Authorization Code:', authorizationCode);
  } else {
    console.error('Authorization Code not found');
  }

  await browser.close();
  return authorizationCode;
}

// Вызываем функцию получения кода авторизации
getAuthorizationCode()
  .then((code) => {
    if (code) {
      console.log('Получен Authorization Code:', code);
      // Здесь можно продолжить выполнение дальнейших действий
    } else {
      console.log('Не удалось получить Authorization Code.');
    }
  })
  .catch((error) => {
    console.error('Ошибка во время процесса авторизации:', error);
  });
