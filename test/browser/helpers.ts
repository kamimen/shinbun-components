import "../../src/define.ts";

let loaded: Promise<void> | null = null;
export function loadStyles(): Promise<void> {
  loaded ??= Promise.all(
    ["/src/css/shinbun.css", "/src/css/components.css"].map(
      (href) =>
        new Promise<void>((resolve, reject) => {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = href;
          link.onload = () => resolve();
          link.onerror = () => reject(new Error(`failed to load ${href}`));
          document.head.append(link);
        }),
    ),
  ).then(() => undefined);
  return loaded;
}

export async function mount<T extends Element = Element>(html: string): Promise<T> {
  await loadStyles();
  const host = document.createElement("div");
  host.innerHTML = html.trim();
  document.body.append(host);
  return host.firstElementChild as T;
}

export function cleanup(): void {
  for (const el of [...document.body.children]) if (el.tagName === "DIV" && !el.id) el.remove();
}

export const TEXT =
  "政府は十日、来年度の予算案について関係閣僚会議を開き、歳出の総額を見直す方針を確認した。" +
  "会議では、各省庁からの要望を踏まえ、優先順位を付けて調整を進めることで一致した。";
