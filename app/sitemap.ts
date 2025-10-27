import { source } from '@/lib/source';
import type { MetadataRoute } from 'next'

export const revalidate = false;

const baseUrl = "https://riven.tv";

const getFullUrl = (url: string) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return baseUrl + url;
}

function getAllPagesUrls(tree: any): string[] {
  let urls: string[] = [];

  if (tree.children && tree.children.length > 0) {
    for (const child of tree.children) {
      urls = urls.concat(getAllPagesUrls(child));
    }
  }

  if (tree.type === 'folder') {
    console.log(tree)
    if (tree.index && tree.index.url) {
      urls.push(getFullUrl(tree.index.url));
    } else if (tree.children?.length > 0) {
      for (const child of tree.children) {
        urls = urls.concat(getAllPagesUrls(child));
      }
    }
  } else if (tree.type === 'page') {
    urls.push(getFullUrl(tree.url));
  }

  return urls;
}
 
export default function sitemap(): MetadataRoute.Sitemap {

  const tree = source.getPageTree();
  const pageUrls = getAllPagesUrls(tree);
    const sitemapEntries = pageUrls.map(url => ({
    url,
    lastModified: new Date(),
  }));

  return [
    {
      url: 'https://riven.tv/',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://riven.tv/docs',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...sitemapEntries,
  ]
}