import './Mapbox.css'
import { useRef, useEffect, type RefObject, ReactElement, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import GeoJson from './geojson.json';
import osmtogeojson from 'osmtogeojson';
import type { OverpassJson, OverpassNode, OverpassWay } from 'overpass-ts';
import { overpassJson } from 'overpass-ts';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson'

function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function routes(): number[] {
  const set = new Set<number>();
  GeoJson.features.forEach((feature) => {
    set.add(feature.properties.routeId)
  })
  return Array.from(set)
}

const routeIdToColor: Map<number, string> = new Map(routes().map(routeId => [routeId, getRandomColor()]))

const nodesOfRoutesQuery = (nodeIds: number[], wayIds: number[]) => {
  return `
  [out:json]
  [timeout:25];
  node(id:${nodeIds.join(",")});
  way(bn)->.b;
  way.b(id:${wayIds.join(",")})->.c;
  .c out;
  out;
  `
}

var fetched = false;
type RouteElementList = (WayRouteElement)[]
type RouteElement = {
  id: number;
  type: string;
  notes: string;
}

type WayRouteElement = RouteElement & {
  type: 'way'
  nodesSubset?: number[]
}

const southwestExpressBikewayRouteElements: RouteElementList = [
  { type: "way", id: 170646335, notes: "Southwest Corridor" },
  { type: "way", id: 959902023, notes: "Southwest Corridor" },
  { type: "way", id: 1083635638, notes: "Southwest Corridor" },
  { type: "way", id: 1113383241, notes: "Southwest Corridor" },
  { type: "way", id: 1092239230, notes: "Southwest Corridor" },
  { type: "way", id: 1092239227, notes: "Southwest Corridor" },
  { type: "way", id: 220595104, notes: "Southwest Corridor" },
  { type: "way", id: 1083635639, notes: "Southwest Corridor" },
  { type: "way", id: 1083635640, notes: "Southwest Corridor" },
  { type: "way", id: 968253495, notes: "Southwest Corridor" },
  { type: "way", id: 969386981, notes: "Southwest Corridor" },
  { type: "way", id: 969386980, notes: "Southwest Corridor" },
  { type: "way", id: 969440902, notes: "Southwest Corridor" },
  { type: "way", id: 969440903, notes: "Southwest Corridor" },
  { type: "way", id: 1050580856, notes: "Southwest Corridor" },
  { type: "way", id: 968253494, notes: "Southwest Corridor" },
  { type: "way", id: 727902008, notes: "Southwest Corridor" },
  { type: "way", id: 727902007, notes: "Southwest Corridor" },
  { type: "way", id: 1281288100, notes: "Southwest Corridor" },
  { type: "way", id: 727902006, notes: "Southwest Corridor" },
  { type: "way", id: 727902004, notes: "Southwest Corridor" },
  { type: "way", id: 727902005, notes: "Southwest Corridor" },
  { type: "way", id: 1281288097, notes: "Southwest Corridor" },
  { type: "way", id: 1281288098, notes: "Southwest Corridor" },
  { type: "way", id: 127381926, notes: "Southwest Corridor" },
  { type: "way", id: 1087041470, notes: "Southwest Corridor" },
  { type: "way", id: 1087041469, notes: "Southwest Corridor" },
  { type: "way", id: 1083635643, notes: "Southwest Corridor" },
  { type: "way", id: 1281288094, notes: "Southwest Corridor" },
  { type: "way", id: 89534810, notes: "Southwest Corridor" },
  { type: "way", id: 668284028, notes: "Southwest Corridor" },
  { type: "way", id: 570815191, notes: "Southwest Corridor" },
  { type: "way", id: 1201197712, notes: "Southwest Corridor" },
  { type: "way", id: 1201197713, notes: "Southwest Corridor" },
  { type: "way", id: 1271777005, notes: "Southwest Corridor" },
  { type: "way", id: 301737839, notes: "Southwest Corridor" },
  { type: "way", id: 1370936861, notes: "Southwest Corridor" },
  { type: "way", id: 1083635647, notes: "Southwest Corridor" },
  { type: "way", id: 186640200, notes: "Southwest Corridor" },
  { type: "way", id: 1083635648, notes: "Southwest Corridor" },
  { type: "way", id: 383938869, notes: "Southwest Corridor" },
  { type: "way", id: 485286879, notes: "Southwest Corridor" },
  { type: "way", id: 426462252, notes: "Massachussetts Avenue Southbound" },
  { type: "way", id: 485286878, notes: "Massachussetts Avenue Southbound" },
  { type: "way", id: 426462236, notes: "Massachussetts Avenue Southbound" },
  { type: "way", id: 426462212, notes: "Columbus Avenue" },
  { type: "way", id: 426462210, notes: "Columbus Avenue" },
  { type: "way", id: 420501710, notes: "Columbus Avenue" },
  { type: "way", id: 485292826, notes: "Columbus Avenue" },
  { type: "way", id: 383058042, notes: "Columbus Avenue" },
  { type: "way", id: 533474631, notes: "Columbus Avenue" },
  { type: "way", id: 533474632, notes: "Columbus Avenue" },
  { type: "way", id: 383058044, notes: "Columbus Avenue" },
  { type: "way", id: 383058045, notes: "Columbus Avenue" },
  { type: "way", id: 485292827, notes: "Columbus Avenue" },
  { type: "way", id: 92029619, notes: "Columbus Avenue" },
  { type: "way", id: 1329768972, notes: "Columbus Avenue" },
  { type: "way", id: 383058043, notes: "Columbus Avenue" },
  { type: "way", id: 1285819243, notes: "Columbus Avenue" },
  { type: "way", id: 822959766, notes: "Columbus Avenue" },
  { type: "way", id: 87109189, notes: "Columbus Avenue" },
  { type: "way", id: 1285819244, notes: "Columbus Avenue" },
  { type: "way", id: 8646035, notes: "Stuart Street" },
  { type: "way", id: 1096256457, notes: "Stuart Street" },
  { type: "way", id: 1280740663, notes: "Stuart Street" },
  { type: "way", id: 242633874, notes: "Stuart Street" },
  { type: "way", id: 970425331, notes: "Stuart Street" },
  { type: "way", id: 242652627, notes: "Stuart Street" },
  { type: "way", id: 242633873, notes: "Stuart Street" },
  { type: "way", id: 1285819768, notes: "Stuart Street" },
  { type: "way", id: 1285819769, notes: "Stuart Street" },
  { type: "way", id: 1121981969, notes: "Washington Street, Northbound" },
  { type: "way", id: 591136310, notes: "Washington Street, Northbound" },
  { type: "way", id: 1154673770, notes: "Washington Street, Northbound" },
  { type: "way", id: 1154673771, notes: "Washington Street, Northbound" },
  { type: "way", id: 333071936, notes: "Washington Street, Northbound" },
  { type: "way", id: 8638403, notes: "Avenue De Lafayette, Northbound" },
  { type: "way", id: 851480300, notes: "Avenue De Lafayette, Northbound" },
  { type: "way", id: 862549735, notes: "Chauncy Street, Northbound" },
  { type: "way", id: 591217296, notes: "Chauncy Street, Northbound" },
  { type: "way", id: 8648507, notes: "Southwest Corridor" },
  { type: "way", id: 747090065, notes: "Arch Street, Northbound" },
  { type: "way", id: 747090064, notes: "Arch Street, Northbound" },
  { type: "way", id: 844528872, notes: "Milk Street, Northbound" },
  { type: "way", id: 426489346, notes: "Milk Street, Northbound" },
  { type: "way", id: 426489347, notes: "Milk Street, Northbound" },
  { type: "way", id: 426489344, notes: "Milk Street, Northbound" },
  { type: "way", id: 426489345, notes: "Milk Street, Northbound" },
  { type: "way", id: 104210747, notes: "Milk Street, Northbound" },
  { type: "way", id: 485292837, notes: "Milk Street, Northbound" },
  { type: "way", id: 426488104, notes: "Milk Street, Northbound" },
  { type: "way", id: 1188182972, notes: "Atlantic Avenue, Northbound" },
  { type: "way", id: 1188182970, notes: "Atlantic Avenue, Northbound" },
  { type: "way", id: 1188182971, notes: "Atlantic Avenue, Northbound" },
  { type: "way", id: 970425325, notes: "Atlantic Avenue, Northbound" },
  { type: "way", id: 970425326, notes: "Atlantic Avenue, Northbound" },
  { type: "way", id: 426488102, notes: "Atlantic Avenue, Northbound" },
  { type: "way", id: 8641399, notes: "Atlantic Avenue, Northbound" },
  { type: "way", id: 972626709, notes: "Cross Street, Northbound" },
  { type: "way", id: 591310041, notes: "Cross Street, Northbound" },
  { type: "way", id: 8643638, notes: "North Washington Street, Northbound" },
  { type: "way", id: 426481845, notes: "North Washington Street, Northbound" },
  { type: "way", id: 48982020, notes: "North Washington Street, Northbound" },
  { type: "way", id: 426481851, notes: "North Washington Street, Northbound" },
  { type: "way", id: 1395423596, notes: "North Washington Street, Northbound" },
  { type: "way", id: 1395423597, notes: "North Washington Street Bridge, Northbound" },
  { type: "way", id: 1392256152, notes: "North Washington Street Bridge, Northbound" },
  { type: "way", id: 1262331183, notes: "North Washington Street Bridge, Northbound" },
  { type: "way", id: 1408478137, notes: "North Washington Street, Northbound" },
  { type: "way", id: 1314062049, notes: "Chelsea Street, Northbound" },
  { type: "way", id: 94670408, notes: "Chelsea Street, Northbound" },
  { type: "way", id: 426642737, notes: "Chelsea Street, Northbound" },
  { type: "way", id: 591493318, notes: "Warren Street, Northbound" },
  { type: "way", id: 845414078, notes: "Warren Street, Northbound" },
  { type: "way", id: 8646107, notes: "Warren Street, Northbound" },
  { type: "way", id: 690296523, notes: "Dexter Row, Northbound" },
  { type: "way", id: 1000386665, notes: "Main Street" },
  { type: "way", id: 95609072, notes: "Main Street" },
  { type: "way", id: 1000386664, notes: "Main Street" },
  { type: "way", id: 82576282, notes: "Main Street, Northbound" },
  { type: "way", id: 1119626508, notes: "Main Street, Northbound" },
  { type: "way", id: 980643130, notes: "Main Street" },
  { type: "way", id: 132174475, notes: "Main Street" },
  { type: "way", id: 1298911297, notes: "Main Street" },
  { type: "way", id: 1086801844, notes: "Main Street" },
  { type: "way", id: 1338748625, notes: "Main Street, Northbound Cycleway" },
  { type: "way", id: 132174849, notes: "Alford Street, Northbound" },
  { type: "way", id: 8640386, notes: "Alford Street, Northbound" },
  { type: "way", id: 778940114, notes: "Alford Street, Northbound" },
  { type: "way", id: 980431771, notes: "Alford Street, Northbound" },
  { type: "way", id: 8645648, notes: "Alford Street, Northbound" },
  { type: "way", id: 822623866, notes: "Alford Street, Northbound" },
  { type: "way", id: 822623867, notes: "Alford Street, Northbound" },
  { type: "way", id: 1086801846, notes: "Alford Street, Northbound" },
  { type: "way", id: 1298911298, notes: "Alford Street" },
  { type: "way", id: 923417551, notes: "Alford Street" },
  { type: "way", id: 1326404261, notes: "Alford Street" },
  { type: "way", id: 1108983906, notes: "Alford Street" },
  { type: "way", id: 1136392748, notes: "Broadway, Northbound" },
  { type: "way", id: 688290230, notes: "Broadway, Northbound" },
  { type: "way", id: 9080332, notes: "Broadway, Northbound" },
  { type: "way", id: 1136392747, notes: "Broadway, Northbound" },
  { type: "way", id: 778743955, notes: "Broadway, Northbound" },
  { type: "way", id: 923679978, notes: "Broadway, Northbound" },
  { type: "way", id: 1109063829, notes: "Broadway, Northbound" },
  { type: "way", id: 1136392749, notes: "Broadway" },
  { type: "way", id: 1108989204, notes: "Broadway" },
  { type: "way", id: 1000386662, notes: "Beecham Street" },
  { type: "way", id: 9080315, notes: "Beecham Street" },
  { type: "way", id: 1144592514, notes: "Beecham Street" },
  { type: "way", id: 1110610259, notes: "Beecham Street Path" },
  { type: "way", id: 1379890280, notes: "Williams Street" },
  { type: "way", id: 8617273, notes: "Williams Street" },
  { type: "way", id: 966288370, notes: "Williams Street" },
  { type: "way", id: 924058722, notes: "Williams Street" },
  { type: "way", id: 1263872113, notes: "Williams Street" },
  {
    type: "way", id: 93278103, notes: "Pearl Street", nodesSubset: [
      61361916,
      8614298830,
      12887504484,
      8614298829,
      8614298828,
      61357988
    ]
  },
  { type: "way", id: 821595656, notes: "Pearl Street" },
  { type: "way", id: 8617292, notes: "Pearl Street" },
  { type: "way", id: 93278101, notes: "Pearl Street" },
  { type: "way", id: 426640403, notes: "Pearl Street" },
  { type: "way", id: 426640404, notes: "Pearl Street" },
  { type: "way", id: 564068740, notes: "Pearl Street" },
  { type: "way", id: 923769412, notes: "Pearl Street" },
  { type: "way", id: 1217036169, notes: "Pearl Street" },
  



]

async function fetchWayOsm(list: RouteElementList): Promise<OverpassJson> {
  const wayIds = list
    .filter(o => o.type == "way" &&  !o.nodesSubset)
    .map(o => (o as WayRouteElement).id)
    .join(",");
  return overpassJson(`[out:json];way(id:${wayIds});out geom;`, {
    endpoint: 'https://overpass.private.coffee/api/interpreter'
  });
}

async function fetchNodeOsm(list: RouteElementList): Promise<OverpassJson | undefined> {
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
  }
  return {
    ...overpassResponse,
    elements: returnedWays
  }
}

function Mapbox(): ReactElement {

  const [geoJson, setGeoJson] = useState<FeatureCollection<Geometry, GeoJsonProperties>>();


  useEffect(() => {
    const fetchGeoJson = async () => {
      const osmWayJson = await fetchWayOsm(southwestExpressBikewayRouteElements);
      const osmWayMap = new Map(osmWayJson.elements.map(e => [e.id, e]));
      const osmWaySubsetJson = await fetchNodeOsm(southwestExpressBikewayRouteElements) || { elements: []};
      const osmWaySubsetMap = new Map(osmWaySubsetJson.elements.map(e => [e.id, e]));
      const elementsInOrder = southwestExpressBikewayRouteElements
        .map(e =>  osmWayMap.get(e.id) || osmWaySubsetMap.get(e.id))
      setGeoJson(osmtogeojson({ elements: elementsInOrder }));
    }

    if (!fetched) {
      fetched = true
      fetchGeoJson()
    }
  }, [])

  const mapRef: RefObject<mapboxgl.Map> = useRef(null as unknown as mapboxgl.Map);
  const mapContainerRef: RefObject<HTMLDivElement> = useRef(null as unknown as HTMLDivElement);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGxhbmdzZm9yZCIsImEiOiJjbWM4MTkzMGYxaGJxMmxwdGdweTVqb3RhIn0.S0CyG6BWDXPKNyG-mjJQOQ'
    console.log(geoJson);
    if (geoJson) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: [-71.09549, 42.30450],
        zoom: 10.12,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        maxBounds: [
          [-71.39417, 42.13907],
          [-70.90290, 42.45938]
        ]
      });

      mapRef.current.on('load', () => {
        mapRef.current.addSource("testSource", {
          type: 'geojson',
          data: geoJson as GeoJSON.FeatureCollection
        });
        mapRef.current.addLayer({
          id: 'testRoute',
          type: 'line',
          source: 'testSource',
          layout: {
            'line-join': 'round',
            "line-cap": 'round'
          },
          paint: {
            'line-color': getRandomColor(),
            'line-opacity': 1,
            'line-width': 3,
            'line-gap-width': .6
          }
        });
        // mapRef.current.addSource('boston-landway', {
        //   type: 'geojson',
        //   data: GeoJson as GeoJSON.FeatureCollection,
        // });

        // routes().forEach((routeId) => {
        //   mapRef.current.addLayer({
        //     id: 'lowlevel' + routeId,
        //     type: 'line',
        //     source: 'boston-landway',
        //     layout: {
        //       'line-join': 'round',
        //       "line-cap": 'round'
        //     },
        //     paint: {
        //       'line-color': routeIdToColor.get(routeId),
        //       'line-opacity': 1,
        //       'line-width': 3,
        //       'line-dasharray': [.5, 2]
        //     },
        //     filter: ['all', ['==', 'routeId', routeId], ['<', 'protectionLevel', 3]]
        //   });
        //   mapRef.current.addLayer({
        //     id: 'midlevel' + routeId,
        //     type: 'line',
        //     source: 'boston-landway',
        //     layout: {
        //       'line-join': 'round',
        //       "line-cap": 'round'
        //     },
        //     paint: {
        //       'line-color': routeIdToColor.get(routeId),
        //       'line-opacity': 1,
        //       'line-width': 3,
        //     },
        //     filter: ['all', ['==', 'routeId', routeId], ['>=', 'protectionLevel', 3], ['<', 'protectionLevel', 6]]
        //   });
        //   mapRef.current.addLayer({
        //     id: 'highlevel' + routeId,
        //     type: 'line',
        //     source: 'boston-landway',
        //     layout: {
        //       'line-join': 'round',
        //       "line-cap": 'round'
        //     },
        //     paint: {
        //       'line-color': routeIdToColor.get(routeId),
        //       'line-opacity': 1,
        //       'line-width': 3,
        //       'line-gap-width': .6
        //     },
        //     filter: ['all', ['==', 'routeId', routeId], ['>=', 'protectionLevel', 6]]
        //   });
        // })

      })
    }

    return () => {
      if (geoJson) {
        mapRef.current.remove()
      }
    }
  }, [geoJson])


  return (
    <div id="root">
      <div id='map-container' ref={mapContainerRef} />
    </div>
  )
}

export default Mapbox;