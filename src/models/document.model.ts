import { IPage, PageModel } from './page.model';

export class DocumentModel {
  name: string;
  file: string;
  extension: string;
  pages: IPage[];

  constructor(fields: IDocument) {
    this.name = fields.name;
    this.file = fields.file;
    this.extension = fields.extension;
    this.pages = fields.pages;
  }

  static fromJson(response: any): IDocument {
    const pages: IPage[] =
      response?.cultivations?.map((page: any) => PageModel.fromJson(page)) ||
      [];

    return new DocumentModel({
      name: response.name || 'Nome do documento',
      file: response.file,
      extension: response.extension || '',
      pages: pages,
    });
  }
}

export interface IDocument {
  name: string;
  file: string;
  extension: string;
  pages: IPage[];
}

export interface IModalSign {
  target: any;
  div: HTMLElement | null;
  id: number;
  xPosition: number;
  yPosition: number;
}

export interface IDataSign {
  id: number;
  name: string;
  email: string;
  page: number;
  xPosition: number;
  yPosition: number;
}

export interface IDataFinish {
  signers: ISigners[];
  name: string;
  file: string;
}

export interface ISigners {
  name: string;
  email: string;
  signHereTabs: ISignHereTab[];
}

export interface ISignHereTab {
  page: number;
  xPosition: number;
  yPosition: number;
}

export interface IPartyDefault {
  name: string;
  email: string;
}
