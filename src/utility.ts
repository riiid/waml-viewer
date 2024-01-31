export function getIntersection<T extends string|number>(a:T[], b:T[]):T[]{
  const table = a.reduce((pv, v) => {
    pv[v] = true;
    return pv;
  }, {} as Record<T, true>);

  return b.filter(v => v in table);
}