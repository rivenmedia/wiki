import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { PageTree } from 'fumadocs-core/server';

const tree: PageTree.Root = {
  name: 'docs',
  children: [
    { name: 'Architecture', url: '/docs/architecture', type: 'page' },
    { name: 'Deployment', url: '/docs/deployment', type: 'page' },
    { name: 'Troubleshooting', url: '/docs/troubleshooting', type: 'page' },
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
        {
          name: 'Filesystem (VFS)',
          type: 'folder',
          children: [
            { name: 'Overview', url: '/docs/services/filesystem', type: 'page' },
            { name: 'Performance Tuning', url: '/docs/services/filesystem/performance', type: 'page' },
          ],
        },
        { name: 'Content Services', url: '/docs/services/content', type: 'page' },
        { name: 'Scrapers', url: '/docs/services/scrapers', type: 'page' },
        { name: 'Downloaders', url: '/docs/services/downloaders', type: 'page' },
        { name: 'Updaters', url: '/docs/services/updaters', type: 'page' },
        { name: 'Post-Processing', url: '/docs/services/post-processing', type: 'page' },
        { name: 'Subtitles', url: '/docs/services/subtitles', type: 'page' },
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
