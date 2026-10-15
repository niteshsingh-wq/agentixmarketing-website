/**
 * On-demand revalidation triggered by Payload content changes.
 *
 * Architecture:
 *   editor saves in Payload  ->  afterChange / afterDelete hook
 *                            ->  revalidatePath for the affected URLs
 *                            ->  next request regenerates and re-caches
 *
 * `next/cache` is imported dynamically because payload.config.ts is also
 * loaded by the `payload migrate` CLI (tsx, outside the Next runtime), where
 * importing next/cache at module scope would fail. The import and the call
 * are both guarded so a revalidation failure can never block a CMS save.
 */

export type ContentKind = 'services' | 'case-studies'

/** Public URLs affected by a change to a given document. */
export function affectedPaths(kind: ContentKind, slug?: string): string[] {
  const paths = ['/sitemap.xml']

  if (kind === 'services') {
    if (slug) paths.push(`/services/${slug}`)
  } else {
    // The homepage's ClientShowcase lists case studies from Payload.
    paths.push('/', '/case-studies')
    if (slug) paths.push(`/case-studies/${slug}`)
  }

  return paths
}

export async function revalidateContent(kind: ContentKind, slug?: string): Promise<void> {
  let revalidatePath: (path: string, type?: 'page' | 'layout') => void
  try {
    ;({ revalidatePath } = await import('next/cache'))
  } catch {
    // Not running inside Next (e.g. the migrate CLI) — nothing to revalidate.
    return
  }

  for (const path of affectedPaths(kind, slug)) {
    try {
      revalidatePath(path)
    } catch (e) {
      // Outside a request context revalidatePath throws; log and continue so
      // the Payload write still succeeds.
      console.error(`[revalidate] failed for ${path}:`, e)
    }
  }
}
