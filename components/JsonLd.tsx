// Renders a JSON-LD <script> block. Pass any schema.org object(s).
// Escapes "<" so a stray "</script>" inside admin-entered text (a review,
// description, etc.) can't prematurely close the script tag.
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
