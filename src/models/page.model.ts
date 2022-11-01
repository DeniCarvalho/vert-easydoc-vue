export class PageModel {
  page: number;
  base64: string;
  size?: IPageSize;

  constructor(fields: IPage) {
    this.page = fields.page;
    this.base64 = fields.base64;
    this.size = fields.size;
  }

  static fromJson(response: any): IPage {
    return new PageModel({
      page: response.page || 0,
      base64: response.base64 || '',
      size:
        response && response.size
          ? PageSizeModel.fromJson(response.size)
          : undefined,
    });
  }
}

export interface IPage {
  page: number;
  base64: string;
  size?: IPageSize;
}

export class PageSizeModel {
  height: number;
  width: number;

  constructor(fields: IPageSize) {
    this.height = fields.height;
    this.width = fields.width;
  }

  static fromJson(response: any): IPageSize {
    return new PageSizeModel({
      height: response && response.height ? parseInt(response.height) : 0,
      width: response && response.width ? parseInt(response.width) : 0,
    });
  }
}

export interface IPageSize {
  height: number;
  width: number;
}
