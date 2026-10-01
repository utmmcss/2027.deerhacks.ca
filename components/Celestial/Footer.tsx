import NextLink from 'next/link'

import { Github, Instagram, Linkedin } from 'lucide-react'

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/deerhacks', label: 'Instagram' },
  { icon: Github, href: 'https://github.com/utmmcss', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/company/deerhacks', label: 'LinkedIn' },
]

const footerLinks = [
  { label: 'Code of Conduct', href: '/code' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'MLH Guidelines', href: 'https://mlh.io' },
]

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <span className="text-xl font-display font-bold text-gradient">DeerHacks</span>
            <p className="text-sm text-muted-foreground mt-2">
              (c) 2027 DeerHacks. Made with ♥️ at UTM.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) =>
              link.href.startsWith('/') ? (
                <NextLink
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
                >
                  {link.label}
                </NextLink>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
                >
                  {link.label}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
