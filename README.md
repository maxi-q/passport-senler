# Passport-Senler Strategy Library
![Tests workflow](https://github.com/maxi-q/passport-senler/actions/workflows/test.yml/badge.svg)
![Build status](https://github.com/maxi-q/passport-senler/actions/workflows/publish.yml/badge.svg)
[![npm version](https://img.shields.io/npm/v/passport-senler.svg?style=flat-square)](https://www.npmjs.org/package/passport-senler)
[![npm downloads](https://img.shields.io/npm/dm/passport-senler.svg?style=flat-square)](https://npm-stat.com/charts.html?package=passport-senler)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=passport-senler&query=$.install.pretty&label=install%20size&style=flat-square)](https://packagephobia.now.sh/result?p=passport-senler)

Библиотека предоставляет стратегию аутентификации для интеграции **Senler** с вашим Express приложением через **Passport.js**.

Используется только для получения токена авторизации, продолжать работу рекомендуем с библиотекой **senler-sdk**

## Установка

Сначала установите необходимые пакеты:

```bash
npm install passport-senler
```

## Использование
В примере будет использоваться express (passport устанавливается как зависимость passport-senler)

Вот как можно интегрировать эту библиотеку в ваше **Express.js** приложение, используя **Passport** для аутентификации через Senler:

### Пример:

```javascript
import express from 'express';
import passport from 'passport';
import { SenlerStrategy } from 'passport-senler';

passport.use(
  new SenlerStrategy({
    clientID: 'ВАШ_SENLER_CLIENT_ID',
    clientSecret: 'ВАШ_SENLER_CLIENT_SECRET',
    callbackURL: 'https://yourapp.com/auth/senler/callback',
  })
);

const app = express();

// Инициализация маршрута аутентификации через Senler
app.get('/auth/senler', passport.authenticate('senler'));

// Обработчик обратного вызова для Senler
app.get(
  '/auth/senler/callback',
  passport.authenticate('senler', {
    failureRedirect: '/auth/senler/error',
    session: false, // Отключите сессии, так как библиотека passport-senler не работает с сессиями
  }),
  (req, res) => {
    // Если аутентификация успешна, токен доступен через req.accessToken
    res.json(req.accessToken);
  }
);

// Запуск сервера
app.listen(3000, () => {
  console.log('Приложение запущено на порту 3000');
});
```

### Объяснение:

1. **Конфигурация стратегии Senler**:
    - `clientID`: Ваш идентификатор клиента приложения **Senler**.
    - `clientSecret`: Ваш секретный ключ клиента приложения **Senler**.
    - `callbackURL`: URL, на который **Senler** перенаправит после авторизации пользователя. Домен должен быть опубликованным

2. **Маршруты**:
    - `/auth/senler`: Перенаправляет пользователей на **Senler** для аутентификации.
    - `/auth/senler/callback`: Обрабатывает обратный вызов от **Senler** после аутентификации. Если аутентификация успешна, объект пользователя будет доступен через `req.user`.

3. **Обработка ошибок**:
    - В случае неудачной аутентификации пользователи будут перенаправлены на `/auth/senler/error`.

4. **Отключение сессий**:
    - Опция `session: false` предотвращает сериализацию пользователя в сессии, её функционал бесполезен в данном контексте и включение будет приводить к ошибке

# Используйте senler-sdk
passport-senler не предоставляет API для работы с Senler. используйте в связке с **senler-sdk**

## Конфигурация

Необходимо заменить следующие значения на ваши:

- `clientID`: Получите его в панели разработчика **Senler**.
- `clientSecret`: Также доступен в настройках вашего приложения **Senler**.
- `callbackURL`: Это должен быть публичный URL, на который **Senler** перенаправит пользователей после аутентификации.
