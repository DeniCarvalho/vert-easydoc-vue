export function useColor() {
  let HEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
  let SHORT_HEX = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
  let VALUE = /(?:\d+|\d*\.\d+)%?/;
  let SEP = /(?:\s*,\s*|\s+)/;
  let ALPHA_SEP = /\s*[,/]\s*/;
  let CUSTOM_PROPERTY = /var\(--(?:[^ )]*?)\)/;
  let RGB = new RegExp(
    `^(rgb)a?\\(\\s*(${VALUE.source}|${CUSTOM_PROPERTY.source})(?:${SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source}))?(?:${SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source}))?(?:${ALPHA_SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source}))?\\s*\\)$`
  );

  function formatColor({ mode, color, alpha, css }: any) {
    let hasAlpha = alpha !== undefined;
    return !css
      ? `${mode}(${color.join(' ')}${hasAlpha ? ` / ${alpha}` : ''})`
      : `${mode}(${color.join(',')}${hasAlpha ? `,${alpha}` : ''})`;
  }

  function parseColor(
    value: any,
    { loose = false, css = false } = {},
    alpha?: number
  ) {
    if (!value) return null;

    let HSL = new RegExp(
      `^(hsl)a?\\(\\s*((?:${VALUE.source})(?:deg|rad|grad|turn)?|${CUSTOM_PROPERTY.source})(?:${SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source}))?(?:${SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source}))?(?:${ALPHA_SEP.source}(${VALUE.source}|${CUSTOM_PROPERTY.source}))?\\s*\\)$`
    );

    var ref, ref1;
    if (typeof value !== 'string') {
      return null;
    }
    value = value.trim();
    if (value === 'transparent') {
      return formatColor({
        mode: 'rgb',
        color: ['0', '0', '0'],
        alpha: alpha || '0',
        css,
      });
    }

    let hex = value
      .replace(SHORT_HEX, (_: any, r: any, g: any, b: any, a: any) =>
        ['#', r, r, g, g, b, b, a ? a + a : ''].join('')
      )
      .match(HEX);
    if (hex !== null) {
      return formatColor({
        mode: 'rgba',
        color: [
          parseInt(hex[1], 16),
          parseInt(hex[2], 16),
          parseInt(hex[3], 16),
        ].map((v) => v.toString()),
        alpha: alpha || (hex[4] ? (parseInt(hex[4], 16) / 255).toString() : 1),
        css,
      });
    }
    var ref2;
    let match =
      (ref2 = value.match(RGB)) !== null && ref2 !== void 0
        ? ref2
        : value.match(HSL);
    if (match === null) {
      return null;
    }
    let color = [match[2], match[3], match[4]]
      .filter(Boolean)
      .map((v) => v.toString());
    if (!loose && color.length !== 3) {
      return null;
    }
    if (color.length < 3 && !color.some((part) => /^var\(.*?\)$/.test(part))) {
      return null;
    }
    return formatColor({
      mode: match[1],
      color,
      alpha:
        alpha ||
        ((ref = match[5]) === null || ref === void 0
          ? void 0
          : (ref1 = ref.toString) === null || ref1 === void 0
          ? void 0
          : ref1.call(ref)),
      css,
    });
  }

  return { parseColor, formatColor };
}
