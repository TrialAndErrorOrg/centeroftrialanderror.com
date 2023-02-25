// @ts-expect-error no declaration file for this
import cronTasks from '@webbio/strapi-plugin-scheduler/cron-task'
import { Env } from './admin'

export default ({ env }: { env: Env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('STRAPI_APP_KEYS'),
  },
  cron: {
    enabled: true,
    tasks: cronTasks,
  },
})
