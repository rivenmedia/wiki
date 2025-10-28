import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSubtree(tree: any): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subTree: any = { name: tree.name, children: [] };

  if (tree.url) {
    subTree.url = tree.url;
  }

  if (!subTree.url && tree.index && tree.index.url) {
    if (tree.children?.length > 0) {
      subTree.children.push({ name: 'Overview', url: tree.index.url, type: 'page' });
    } else {
      subTree.url = tree.index.url;
    }
  }

  if (tree.children?.length > 0) {
    for (const child of tree.children) {
      const subTreeChildren = getSubtree(child);
      if (subTreeChildren) {
        subTree.children.push(subTreeChildren);
      }
    }
  }
  
  if (tree.type === 'page' || tree.type === "folder" && !(subTree.children?.length > 0)) {
    subTree.type = 'page';
  } else {
    subTree.type = 'folder';
  }

  // if (!subTree.url && !(subTree.children?.length > 0)) {
  //   return null;
  // }

  return subTree;
}

// const origTree: PageTree.Root = {
//   name: 'docs',
//   children: [
//     { name: 'Architecture', url: '/docs/architecture', type: 'page' },
//     { name: 'Deployment', url: '/docs/deployment', type: 'page' },
//     { name: 'Troubleshooting', url: '/docs/troubleshooting', type: 'page' },
//     { name: 'Contribute to Wiki', url: '/docs/contribute', type: 'page' },
//     {
//       name: 'Frontend',
//       type: 'folder',
//       children: [
//         { name: 'Item Page', url: '/docs/frontend/item-page', type: 'page' },
//       ],
//     },
//     {
//       name: 'Services',
//       type: 'folder',
//       children: [
//         { name: 'Overview', url: '/docs/services', type: 'page' },
//         {
//           name: 'Filesystem (VFS)',
//           type: 'folder',
//           children: [
//             { name: 'Overview', url: '/docs/services/filesystem', type: 'page' },
//             { name: 'Performance Tuning', url: '/docs/services/filesystem/performance', type: 'page' },
//           ],
//         },
//         { name: 'Content Services', url: '/docs/services/content', type: 'page' },
//         { name: 'Scrapers', url: '/docs/services/scrapers', type: 'page' },
//         { name: 'Downloaders', url: '/docs/services/downloaders', type: 'page' },
//         { name: 'Updaters', url: '/docs/services/updaters', type: 'page' },
//         { name: 'Post-Processing', url: '/docs/services/post-processing', type: 'page' },
//         { name: 'Subtitles', url: '/docs/services/subtitles', type: 'page' },
//         { name: 'Notifications', url: '/docs/services/notifications', type: 'page' },
//         { name: 'Management Commands', url: '/docs/services/extras', type: 'page' },
//       ],
//     },
//   ]
// }

export default function Layout({ children }: LayoutProps<'/docs'>) {

  const tree = source.getPageTree();
  const subTree = getSubtree(tree);
  // console.log('Orig tree:', origTree);
  // console.log('Gen tree:', subTree);
  // console.log("Is subtree same as original tree?", JSON.stringify(subTree) === JSON.stringify(origTree));

  return (
    <DocsLayout tree={subTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
