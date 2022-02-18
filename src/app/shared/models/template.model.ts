export class Template {
  constructor(
    public id: string,
    public name: string,
    public contacts: string[],
    public numbers: string[],
    public includeLocation: boolean,
    public message: string,
  ) {}
}
