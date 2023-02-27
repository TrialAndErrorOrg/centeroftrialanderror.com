import { Env } from '../../admin'

export default ({ env }: { env: Env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      client: 'postgres',
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', ''),
      // schema: env('DATABASE_SCHEMA', 'public'), // Not required
      ssl: {
        ca:
          env('NODE_ENV') === 'production'
            ? Buffer.from(env('CERT', ''), 'base64').toString('utf-8')
            : undefined,
        rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false), // For self-signed certificates
      },
    },
    debug: false,
  },
})
