import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { getConnection } from 'typeorm';
import { Session } from './model/session.entity';
import { TypeormStore } from 'typeorm-store';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const repository = getConnection().getRepository(Session);

  app.enableCors();
  app.use(
    session({
      cookie: {
        maxAge: 3600 * 1000 * 24,
      },
      secret: 'secret_key',
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({ repository }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(5000);
}
bootstrap();

//https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f
