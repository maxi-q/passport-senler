
# Passport-Senler Strategy Library

Эта библиотека предоставляет стратегию аутентификации для интеграции **Senler** с вашим Express приложением через **Passport.js**.

Используется только для получения токена авторизации, продолжать работу рекомендуем с библиотекой **senler-sdk**

## Установка

Сначала установите необходимые пакеты, в примере будет использоваться express:

```bash
npm install passport passport-senler express
```

## Использование

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
