// eslint-disable-next-line @jjoriping/variable-name
export function C(...args:any[]):string{
  return args.filter(v => v).join(' ');
}