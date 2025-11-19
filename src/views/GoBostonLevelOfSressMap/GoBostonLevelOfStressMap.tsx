import { createContext, ReactElement, useState } from 'react'

import LevelOfStressMap from '../../components/LevelOfStressMap/LevelOfStressMap';
import goBoston from '../../assets/neighborhoods/annotated/go-boston-annotated-geojson.json';

const routes = [
  goBoston

] as GeoJSON.FeatureCollection[]

const routeNames = [
  "goBoston"
]

const goBostonTogglesDefault = {
  showProjects: true,
  setShowProjects: (v: boolean) => {},
  showLevelOfStress: true,
  setShowLevelOfStress: (v: boolean) => {},
  showExistingInfrastructure: false,
  setShowExistingInfrastructure: (v: boolean) => {}
}

export const GoBostonTogglesContext = createContext(goBostonTogglesDefault)

function GoBostonLevelOfSressMap(): ReactElement {
  const [showProjects, setShowProjects] = useState(true);
  const [showLevelOfStress, setShowLevelOfStress] = useState(false);
  const [showExistingInfrastructure, setShowExistingInfrastructure] = useState(false);
    return <GoBostonTogglesContext.Provider value={{showProjects, setShowProjects, showLevelOfStress, setShowLevelOfStress, showExistingInfrastructure, setShowExistingInfrastructure}}>
        <LevelOfStressMap routes={routes} routeNames={routeNames}  goBostonOverlay={true}/>
      </GoBostonTogglesContext.Provider>
  }

export default GoBostonLevelOfSressMap;