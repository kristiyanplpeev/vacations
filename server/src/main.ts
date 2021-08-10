import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { getConnection } from 'typeorm';
import { Session } from './model/session.entity';
import { TypeormStore } from 'typeorm-store';
import * as helmet from 'helmet';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const repository = getConnection().getRepository(Session);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(helmet());
  app.use(
    session({
      cookie: {
        maxAge: 3600 * 1000 * 24,
      },
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({ repository }),
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT, () =>
    console.log(`App is listening on PORT ${process.env.PORT}...`),
  );
}
bootstrap();

//https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f
