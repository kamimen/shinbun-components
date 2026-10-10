import { PlacedElement } from "../internal/base.js";
import { parseRatio } from "../internal/validate.js";
/**
 * Photo or figure with an optional caption. Spans all columns inside an article;
 * as a direct child of the page it can be placed with `span`, `y`, `x`, `w`.
 * In vertical writing the image height is the column length, so `ratio` sets the width relative to it.
 *
 * @element shinbun-photo
 *
 * @attr {string} ratio - Aspect ratio (width / height), e.g. `10 / 11`
 * @attr {number} span - Number of columns when placed in the page (1-15)
 * @attr {number} y - Start column when placed in the page (1-15)
 * @attr {number} x - Start position on the line axis when placed in the page (1-60)
 * @attr {number} w - Lines occupied when placed in the page (1-60)
 *
 * @slot - img and figcaption
 *
 * @cssprop --sb-photo-bg - Background color before the image loads
 * @cssprop --sb-photo-ratio - Aspect ratio (also set by `ratio`)
 */
export class ShinbunPhoto extends PlacedElement {
    attributeChangedCallback(name, old, value) {
        if (name === "ratio")
            this.setProp("--sb-photo-ratio", this.parse(name, value, parseRatio));
        else
            super.attributeChangedCallback(name, old, value);
    }
}
ShinbunPhoto.defaultTag = "shinbun-photo";
ShinbunPhoto.block = "sb-photo";
ShinbunPhoto.role = "figure";
ShinbunPhoto.parts = { img: "sb-photo__img", figcaption: "sb-photo__caption" };
ShinbunPhoto.extraAttributes = ["ratio"];
