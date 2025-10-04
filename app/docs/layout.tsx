import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { PageTree } from 'fumadocs-core/server';
import { source } from '@/lib/source';

const tree: PageTree.Root = {
  name: 'docs',
  children: [
    { name: 'Services', type: 'separator' },
    { name: 'Content', url: '/docs/services/content', type: 'page' },
  ]
}

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={tree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
