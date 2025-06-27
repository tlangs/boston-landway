export type RouteElementList = (WayRouteElement)[]
export type RouteElement = {
  id: number;
  type: string;
  notes: string;
}

export type WayRouteElement = RouteElement & {
  type: 'way'
  nodesSubset?: number[]
}
