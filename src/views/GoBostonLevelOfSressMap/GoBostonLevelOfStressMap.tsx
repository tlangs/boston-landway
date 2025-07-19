import { ReactElement } from 'react'

import eastBoston from '../../assets/neighborhoods/annotated/east-boston-annotated-geojson.json'
import LevelOfStressMap from '../../components/LevelOfStressMap/LevelOfStressMap';

const routes = [
  eastBoston
] as GeoJSON.FeatureCollection[]

const routeNames = [
  "eastBoston"
]
function GoBostonLevelOfSressMap(): ReactElement {
    return <LevelOfStressMap routes={routes} routeNames={routeNames}  goBostonOverlay={true}/>
  }

export default GoBostonLevelOfSressMap;