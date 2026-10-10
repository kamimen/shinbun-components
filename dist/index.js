/*! shinbun-components v0.1.0 | MIT License | shinbun-css as Web Components */
// Registration is a side effect, so it lives in ./define.ts
export { ShinbunElement, PlacedElement } from "./internal/base.js";
export { ShinbunPaper } from "./elements/paper.js";
export { ShinbunPage } from "./elements/page.js";
export { ShinbunArticle } from "./elements/article.js";
export { ShinbunHeadline } from "./elements/headline.js";
export { ShinbunPhoto } from "./elements/photo.js";
export { ShinbunMasthead, ShinbunNameplate, ShinbunFolio } from "./elements/bands.js";
export { ShinbunKicker, ShinbunSleeve, ShinbunSub, ShinbunYoko } from "./elements/headings.js";
export { ShinbunLead, ShinbunDateline, ShinbunByline, ShinbunParagraph } from "./elements/text.js";
export { ShinbunBox, ShinbunAd, ShinbunRule } from "./elements/blocks.js";
export { ShinbunTable } from "./elements/table.js";
export { ShinbunEmphasis, ShinbunTcy, ShinbunSideways, ShinbunHorizontal } from "./elements/inline.js";
export { splitTcy, autoTcy } from "./internal/tcy.js";
export { findOverflow } from "./internal/overflow.js";
