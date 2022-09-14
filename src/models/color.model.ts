export class Colors {
  primary?: IRGB;
  secondary?: IRGB;

  constructor(fields: IColor) {
    this.primary = fields.primary;
    this.secondary = fields.secondary;
  }
}

export interface IColor {
  primary?: IRGB;
  secondary?: IRGB;
}

export interface IRGB {
  r: number;
  g: number;
  b: number;
}
