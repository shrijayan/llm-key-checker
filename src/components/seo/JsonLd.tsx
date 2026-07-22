interface JsonLdProps {
  data: object
}

/**
 * Renders a JSON-LD <script type="application/ld+json"> tag. `<` is
 * escaped in the serialized output so a value that happened to contain
 * "</script>" could never break out of the tag — the standard safe way to
 * inline arbitrary JSON inside HTML.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
