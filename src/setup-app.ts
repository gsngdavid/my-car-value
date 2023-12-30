import { ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

export function SetupApp(app: any) {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(
    cookieSession({
      keys: ['secret', 'Golf', 'Basketball'],
    }),
  );
}
