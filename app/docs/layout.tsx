import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { PageTree } from 'fumadocs-core/server';
import { source } from '@/lib/source';

const tree: PageTree.Root = {
  name: 'docs',
  children: [
    { name: 'Contribute to Wiki', url: '/docs/contribute', type: 'page' },
    {
      name: 'Frontend',
      type: 'folder',
      children: [
        { name: 'Item Page', url: '/docs/frontend/item-page', type: 'page' },
      ],
    },
    {
      name: 'Services',
      type: 'folder',
      children: [
        { name: 'Overview', url: '/docs/services', type: 'page' },
        { name: 'Content Services', url: '/docs/services/content', type: 'page' },
        { name: 'Downloaders', url: '/docs/services/downloaders', type: 'page' },
        { name: 'Scrapers', url: '/docs/services/scrapers', type: 'page' },
        { name: 'Subtitles', url: '/docs/services/subtitles', type: 'page' },
        { name: 'Symlink', url: '/docs/services/symlink', type: 'page' },
        { name: 'Updaters', url: '/docs/services/updaters', type: 'page' },
        { name: 'Notifications', url: '/docs/services/notifications', type: 'page' },
        { name: 'Management Commands', url: '/docs/services/extras', type: 'page' },
      ],
    },
  ]
}

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={tree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
