import { ReactElement } from 'react'
import southwestCorridorRoute from '../../assets/routes/annotated/southwest-corridor-route-annotated-geojson.json'
import esplanadeRoute from '../../assets/routes/annotated/esplanade-route-annotated-geojson.json'
import emeraldNecklaceRoute from '../../assets/routes/annotated/emerald-necklace-route-annotated-geojson.json'
import neponsetRoute from '../../assets/routes/annotated/neponset-route-annotated-geojson.json'
import harborwalkRoute from '../../assets/routes/annotated/harborwalk-route-annotated-geojson.json'
import westRoxburyRoute from '../../assets/routes/annotated/west-roxbury-route-annotated-geojson.json'
import dotAveRoute from '../../assets/routes/annotated/dot-ave-route-annotated-geojson.json'
import melneaCassRoute from '../../assets/routes/annotated/melnea-cass-route-annotated-geojson.json'
import blueHillsRoute from '../../assets/routes/annotated/blue-hills-route-annotated-geojson.json'
import LevelOfStressMap from '../../components/LevelOfStressMap/LevelOfStressMap';

const routes = [
  southwestCorridorRoute,
  esplanadeRoute,
  emeraldNecklaceRoute,
  neponsetRoute,
  harborwalkRoute,
  westRoxburyRoute,
  dotAveRoute,
  melneaCassRoute,
  blueHillsRoute
] as GeoJSON.FeatureCollection[]
const routeNames = [
  "southwestCorridorRoute",
  "esplanadeRoute",
  "emeraldNecklaceRoute",
  "neponsetRoute",
  "harborwalkRoute",
  "westRoxburyRoute",
  "dotAveRoute",
  "melneaCassRoute",
  "blueHillsRoute"
]

function LevelOfStressRouteMap(): ReactElement {
  return <LevelOfStressMap routes={routes} routeNames={routeNames}/>
}

export default LevelOfStressRouteMap;