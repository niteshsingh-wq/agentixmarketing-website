import { REST_DELETE, REST_GET, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'
import config from '@payload-config'
import type { NextRequest } from 'next/server'

const handler = (method: typeof REST_GET) =>
  (req: NextRequest, ctx: { params: Promise<{ payload: string[] }> }) => {
    const adapted = { params: ctx.params.then(p => ({ slug: p.payload })) }
    return method(config)(req, adapted)
  }

export const GET = handler(REST_GET)
export const POST = handler(REST_POST)
export const DELETE = handler(REST_DELETE)
export const PATCH = handler(REST_PATCH)
export const PUT = handler(REST_PUT)
