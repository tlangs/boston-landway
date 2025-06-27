import { RouteElementList, WayRouteElement } from "../components/RouteElements";
import type { OverpassJson, OverpassNode, OverpassWay } from 'overpass-ts';
import { overpassJson } from 'overpass-ts';
import { evaluateLTS } from "./stressmodel";
import osmtogeojson from "osmtogeojson";
import { notEmpty } from "../utils/utils";

const nodesOfRoutesQuery = (nodeIds: number[], wayIds: number[]) => {
    return `
    [out:json]
    [timeout:25];
    node(id:${nodeIds.join(",")});
    way(bn)->.b;
    way.b(id:${wayIds.join(",")})->.c;
    .c out geom;
    out;
    `
  }
  

export async function fetchWayOsm(list: RouteElementList): Promise<OverpassJson> {
    const wayIds = list
      .filter(o => o.type == "way" && !o.nodesSubset)
      .map(o => (o as WayRouteElement).id)
      .join(",");
    return overpassJson(`[out:json];way(id:${wayIds});out geom;`, {
      endpoint: 'https://overpass.private.coffee/api/interpreter'
    });
  }
  
  export async function fetchWaySubsetOsm(list: RouteElementList): Promise<OverpassJson | undefined> {
    const nodeIds: number[] = []
    const wayIds: number[] = []
    const waysWithNodeSubsets = list.filter(o => o.type == "way" && o.nodesSubset) as WayRouteElement[]
    waysWithNodeSubsets
      .forEach(o => {
        nodeIds.push(...o.nodesSubset || []);
        wayIds.push(o.id);
      });
    if (waysWithNodeSubsets.length === 0) {
      return Promise.resolve(undefined)
    }
    const overpassResponse = await overpassJson(nodesOfRoutesQuery(nodeIds, wayIds), {
      endpoint: 'https://overpass.private.coffee/api/interpreter'
    });
    const returnedWays = overpassResponse.elements.filter(e => e.type == "way") as OverpassWay[];
    for (const returnedWay of returnedWays) {
      const nodesForReturnedWay = new Set(waysWithNodeSubsets.find(n => n.id === returnedWay.id)?.nodesSubset || []);
      const returnedNodesForReturnedWay = new Map(
        overpassResponse.elements
          .filter(e => nodesForReturnedWay.has(e.id))
          .map(n => [(n as OverpassNode).id, n])
      );
      const latLons = returnedWay.nodes
        .filter(n => returnedNodesForReturnedWay.has(n))
        .map(n => (({ lat, lon }) => ({ lat, lon }))(returnedNodesForReturnedWay.get(n) as OverpassNode));
      returnedWay.geometry = latLons;
      returnedWay.nodes = returnedWay.nodes.filter(n => nodesForReturnedWay.has(n))
    }
    return {
      ...overpassResponse,
      elements: returnedWays
    }
  }

  export const fetchGeoJson = async (routeElements: RouteElementList) => {
    const osmWayJson = await fetchWayOsm(routeElements);
    const osmWayMap = new Map(osmWayJson.elements.map(e => [e.id, e]));
    const osmWaySubsetJson = await fetchWaySubsetOsm(routeElements) || { elements: [] };
    const osmWaySubsetMap = new Map(osmWaySubsetJson.elements.map(e => [e.id, e]));
    const elementsInOrder = routeElements
      .map(e => osmWayMap.get(e.id) || osmWaySubsetMap.get(e.id))
      .filter(notEmpty)

    elementsInOrder.forEach(w => {
      var evaluated = evaluateLTS(w);
      w.tags = { ...w.tags, lts: evaluated?.lts.toString() || '4', ltsMessage: evaluated?.message }
    })

    return osmtogeojson({ elements: elementsInOrder });
  }