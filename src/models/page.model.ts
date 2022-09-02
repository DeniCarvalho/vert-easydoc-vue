export class PageModel {
  page: number;
  base64: string;
  size: string;

  constructor(fields: IPage) {
    this.page = fields.page;
    this.base64 = fields.base64;
    this.size = fields.size;
  }

  static fromJson(response: any): IPage {
    return new PageModel({
      page: response.page || 0,
      base64: response.base64 || '',
      size: response.size || ''
    });
  }
}

export interface IPage {
  page: number;
  base64: string;
  size: string;
}
