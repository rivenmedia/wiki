import { source } from "@/lib/source";

export const revalidate = false;

const baseUrl = "https://riven.tv";

const getFullUrl = (url: string) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }
    return baseUrl + url;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const treeToText = (tree: any, depth = 0): string => {
    if (tree.children && tree.children.length > 0) {
        let result = "#".repeat(depth + 1) + " " + tree.name + "\n\n";

        if (depth > 0) {
            result = "\n" + result;
        }

        for (const child of tree.children) {
            result += treeToText(child, depth + 1);
        }

        return result + "\n";
    }

    if (tree.type === "separator") {
        return "---\n";
    } else if (tree.type === "folder") {
        return (
            tree.name +
            ": " +
            getFullUrl(tree.index.url) +
            ": " +
            tree.index.description +
            "\n"
        );
    } else if (tree.type === "page") {
        return (
            tree.name +
            ": " +
            getFullUrl(tree.url) +
            ": " +
            tree.description +
            "\n"
        );
    } else {
        return "";
    }
};

export async function GET() {
    return new Response(treeToText(source.getPageTree()));
}
