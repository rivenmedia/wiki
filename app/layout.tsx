import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter } from 'next/font/google';
import SearchDialog from '@/components/search';
import { FAQPage, WithContext } from 'schema-dts';

const inter = Inter({
  subsets: ['latin'],
});

const jsonLd: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Riven?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Riven is a powerful media management solution that works together with debrid services to help you find, organize, stream, and enjoy your media effortlessly."
      }
    },
    {
      "@type": "Question",
      "name": "How do I get started with Riven?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To get started with Riven, visit our documentation at https://riven.tv/docs to learn about installation and setup."
      }
    },
    {
      "@type": "Question",
      "name": "Where can I find support for Riven?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For support, please refer to our documentation, send us a message in our discord server at https://discord.riven.tv, or reach out via contact@riven.tv"
      }
    }
  ]
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      </head>

      <body className="flex flex-col min-h-screen">
        <RootProvider 
          search={{
            SearchDialog,
            }}
          >{children}</RootProvider>
      </body>
    </html>
  );
}
