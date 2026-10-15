import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { json, type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import { ACCESS_COOKIE, REFRESH_COOKIE } from './shared/config/cookies';
import { resolveCorsOrigins } from './shared/config/cors';
import { RequestLoggerMiddleware } from './shared/middleware/request-logger.middleware';

export const API_PREFIX = 'api';
export const TELEMETRY_BODY_LIMIT = '16kb';
export const DEFAULT_BODY_LIMIT = '100kb';

/**
 * Shared HTTP configuration for `main.ts` and the e2e tests.
 * The app must be created with `{ bodyParser: false }` so the per-route body limits below apply.
 */
export function configureApp(
  app: INestApplication,
  options: { requestLogging?: boolean } = {},
) {
  const config = app.get(ConfigService);

  app.setGlobalPrefix(API_PREFIX);

  if (options.requestLogging !== false) {
    const logger = new RequestLoggerMiddleware();
    app.use(logger.use.bind(logger));
  }

  app.use(helmet());
  app.use(cookieParser());
  app.use(`/${API_PREFIX}/telemetry`, json({ limit: TELEMETRY_BODY_LIMIT }));
  app.use(json({ limit: DEFAULT_BODY_LIMIT }));
  // Body-parser errors happen before Nest's exception filters; answer them in Nest's error shape.
  app.use(
    (
      err: { type?: string; status?: number },
      _req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      if (err?.type === 'entity.too.large') {
        return res.status(413).json({
          statusCode: 413,
          message: 'Payload too large',
          error: 'Payload Too Large',
        });
      }
      if (err?.type === 'entity.parse.failed') {
        return res.status(400).json({
          statusCode: 400,
          message: 'Malformed JSON body',
          error: 'Bad Request',
        });
      }
      return next(err);
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: resolveCorsOrigins({
      nodeEnv: config.get<string>('NODE_ENV'),
      corsUrls: config.get<string[]>('CORS_URLS'),
      appUrl: config.get<string>('APP_URL'),
      landingUrl: config.get<string>('LANDING_URL'),
    }),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('White Knight API')
    .setDescription(
      'Accounts, progress, scoring and leaderboards for White Knight. Non-GET requests require the header `X-Requested-With: XMLHttpRequest`.',
    )
    .setVersion('1.0')
    .addCookieAuth(ACCESS_COOKIE)
    .addCookieAuth(REFRESH_COOKIE)
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    `${API_PREFIX}/docs`,
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  return app;
}
