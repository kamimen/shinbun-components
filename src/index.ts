// Registration is a side effect, so it lives in ./define.ts
export { ShinbunElement, PlacedElement, type Choice } from "./internal/base.ts";
export { ShinbunPaper, type Theme, type Writing } from "./elements/paper.ts";
export { ShinbunPage } from "./elements/page.ts";
export { ShinbunArticle } from "./elements/article.ts";
export { ShinbunHeadline, type HeadlineSize } from "./elements/headline.ts";
export { ShinbunPhoto } from "./elements/photo.ts";
export { ShinbunMasthead, ShinbunNameplate, ShinbunFolio } from "./elements/bands.ts";
export { ShinbunKicker, ShinbunSleeve, ShinbunSub, ShinbunYoko } from "./elements/headings.ts";
export { ShinbunLead, ShinbunDateline, ShinbunByline, ShinbunParagraph } from "./elements/text.ts";
export { ShinbunBox, ShinbunAd, ShinbunRule } from "./elements/blocks.ts";
export { ShinbunTable } from "./elements/table.ts";
export { ShinbunEmphasis, ShinbunTcy, ShinbunSideways, ShinbunHorizontal } from "./elements/inline.ts";
export { splitTcy, autoTcy, type TcyPart } from "./internal/tcy.ts";
export { findOverflow } from "./internal/overflow.ts";
