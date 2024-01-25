export default class WAMLError extends Error{
  public readonly node:any;

  constructor(message:string, node?:any){
    super(message);
    this.node = node;
  }
}
export const NOT_YET_IMPLEMENTED = new WAMLError("Not yet implemented");