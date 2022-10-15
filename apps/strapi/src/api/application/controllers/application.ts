/**
 *  application controller
 */

import { factories } from '@strapi/strapi'
import { writeFileSync } from 'fs'
import { join } from 'path'

export default factories.createCoreController('api::application.application', ({ strapi }) => ({
  async create(ctx) {
    const standardRes = await super.create(ctx)
    const {
      body,
      // @ts-expect-error this should be defined according to the docs https://docs.strapi.io/developer-docs/latest/development/backend-customization/requests-responses.html#accessing-the-request-context-anywhere
      files: { 'files.documents': documents },
    } = ctx.request
    console.log({ body, documents })
    const { name, email, additional, url, motivation, cv, open_position } = JSON.parse(body.data)

    const files = Array.isArray(documents) ? documents : [documents]
    // strapi.service('api::application.application').

    const position = await strapi.entityService.findOne(
      'api::open-position.open-position',
      open_position,
      {
        populate: {
          image: true,
        },
      },
    )
    console.log({ position })

    // send email
    try {
      const res = await strapi.plugins['email-designer'].service('email').sendTemplatedEmail(
        {
          to: email,
          from: 'noreply@trialanderror.org',
          bcc: ['positions@trialanderror.org', 'jorna@trialanderror.org'],
          attachments: files.length
            ? files?.map((file: File) => ({
                filename: file?.name,
                // @ts-expect-error hmmm yes, but it does work?
                path: file?.path,
              }))
            : [],
        },
        {
          templateReferenceId: 1,
        },
        {
          application: {
            name,
            email,
            motivation,
            cv,
            position,
            additional,
            url,
          },
        },
      )
      console.log({ res })
    } catch (error) {
      console.error(error)
      return ctx.badRequest(standardRes, error)
    }
    return standardRes
  },
}))
