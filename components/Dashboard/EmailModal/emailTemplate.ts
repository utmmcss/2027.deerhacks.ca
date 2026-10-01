const EMAIL_TEMPLATE_WRAPPER = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DeerHacks</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse;">
          <tr>
            <td style="padding: 0; border-radius: 12px 12px 0 0; overflow: hidden;">
              <a href="https://deerhacks-v-2027.devpost.com" target="_blank" style="text-decoration:none;">
                <img src="https://i.imgur.com/o6UrNsQ.png"
                     alt="DeerHacks V Banner"
                     width="600"
                     style="display:block; width:100%; max-width:600px; height:auto; border:0;">
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; background-color: #1a1a1a; border-left: 1px solid #333; border-right: 1px solid #333;">
              {{CONTENT}}
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 30px; background-color: #111; border-radius: 0 0 12px 12px; border: 1px solid #333; border-top: none;">
              <p style="margin: 0; font-size: 12px; color: #888; text-align: center;">
                This email was sent by the DeerHacks team.<br>
                University of Toronto Mississauga
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

export const AVAILABLE_VARIABLES = [
  { key: '{{first_name}}', description: "User's first name" },
  { key: '{{last_name}}', description: "User's last name" },
  { key: '{{email}}', description: "User's email address" },
  { key: '{{status}}', description: 'Registration status' },
] as const

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const allowedTags = new Set([
  'a',
  'b',
  'blockquote',
  'br',
  'code',
  'div',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'i',
  'li',
  'ol',
  'p',
  'pre',
  'span',
  'strong',
  'u',
  'ul',
  'table',
  'thead',
  'tbody',
  'tr',
  'td',
  'th',
])

const isSafeHref = (value: string) => {
  try {
    const url = new URL(value)
    return ['http:', 'https:', 'mailto:'].includes(url.protocol)
  } catch {
    return false
  }
}

export const sanitizeHtml = (input: string) => {
  if (typeof window === 'undefined') return input
  const doc = new DOMParser().parseFromString(input, 'text/html')
  const elements = Array.from(doc.body.querySelectorAll('*'))
  for (const el of elements) {
    const tag = el.tagName.toLowerCase()
    if (!allowedTags.has(tag)) {
      el.replaceWith(...Array.from(el.childNodes))
      continue
    }
    const attrs = Array.from(el.attributes)
    for (const attr of attrs) {
      const name = attr.name.toLowerCase()
      if (tag === 'a' && (name === 'href' || name === 'title')) {
        if (name === 'href' && !isSafeHref(attr.value)) {
          el.removeAttribute(attr.name)
        }
        continue
      }
      el.removeAttribute(attr.name)
    }
  }
  return doc.body.innerHTML
}

const substituteVariables = (
  template: string,
  user: { first_name: string; last_name: string; email: string; status: string },
  escape: boolean,
): string => {
  const first = escape ? escapeHtml(user.first_name) : user.first_name
  const last = escape ? escapeHtml(user.last_name) : user.last_name
  const email = escape ? escapeHtml(user.email) : user.email
  const status = escape ? escapeHtml(user.status) : user.status

  return template
    .replace(/\{\{first_name\}\}/g, first)
    .replace(/\{\{last_name\}\}/g, last)
    .replace(/\{\{email\}\}/g, email)
    .replace(/\{\{status\}\}/g, status)
}

export const substituteVariablesPlain = (
  template: string,
  user: { first_name: string; last_name: string; email: string; status: string },
): string => substituteVariables(template, user, false)

export const substituteVariablesForHtml = (
  template: string,
  user: { first_name: string; last_name: string; email: string; status: string },
): string => substituteVariables(template, user, true)

export const wrapContent = (content: string): string => {
  return EMAIL_TEMPLATE_WRAPPER.replace('{{CONTENT}}', content)
}
