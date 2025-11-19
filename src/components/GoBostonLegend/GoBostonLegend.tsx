import './GoBostonLegend.css'
import { ReactComponent as IconLTS1 } from '../../assets/Icon_LTS1.svg'
import { ReactComponent as IconLTS2 } from '../../assets/Icon_LTS2.svg'
import { ReactComponent as IconLTS3 } from '../../assets/Icon_LTS3.svg'
import { ReactComponent as IconLTS4 } from '../../assets/Icon_LTS4.svg'
import { ReactComponent as TextLTS1 } from '../../assets/Text_LTS1.svg'
import { ReactComponent as TextLTS2 } from '../../assets/Text_LTS2.svg'
import { ReactComponent as TextLTS3 } from '../../assets/Text_LTS3.svg'
import { ReactComponent as TextLTS4 } from '../../assets/Text_LTS4.svg'
import { ReactComponent as LogoStressmap } from '../../assets/BikeStressMap.svg'
import { useContext } from 'react'
import { GoBostonTogglesContext } from '../../views/GoBostonLevelOfSressMap/GoBostonLevelOfStressMap'


type GoBostonLegendProps = {
  colorScale: string[]
}

export default function GoBostonLegend(props: GoBostonLegendProps) {
  // console.log('Legend')

  // console.log(colorScale)
  const { colorScale } = props;
  const existing = { borderColor: colorScale[0] }
  const future = { borderColor: colorScale[1] }
  const priority = { borderColor: colorScale[2] }

  const {showProjects, setShowProjects, showLevelOfStress, setShowLevelOfStress, showExistingInfrastructure, setShowExistingInfrastructure} = useContext(GoBostonTogglesContext)
  // console.log(lts1)

  // const borderStyle = ({colorScale, index}) => {
  //   return ({borderColor: colorScale[index]})
  // }

  const borderStyle = ({ }) => {
    return ({ borderColor: '#63B281' })
  }

  return (
    <div className="go-boston-legend go-boston-grid-container">

      <div className='go-boston-legend-header'>
        <h2>Go Boston 2030</h2>
      </div>

      <div className='go-boston-legend-row' style={existing}>
        <div className="go-boston-legend-text">
            <span>Existing Network</span>
        </div>
      </div>

      <div className='go-boston-legend-row' style={future}>
        <div className="go-boston-legend-text">
            <span>Future Improvements</span>
        </div>
      </div>

      <div className='go-boston-legend-row' style={priority}>
        <div className="go-boston-legend-text">
          <span>Priority Projects</span>
        </div>
      </div>
      <br/>

      <div className='go-boston-legend-checkbox'>
        <input
          type="checkbox"
          id="toggleLevelOfStress"
          name="toggleLevelOfStress"
          onChange={(e) => setShowLevelOfStress(e.target.checked)}
          checked={showLevelOfStress}
        />
        <label className='go-boston-legend-label' htmlFor="toggleLevelOfStress">Level of Stress</label>
      </div>
  
      <div className='go-boston-legend-checkbox'>
        <input
          type="checkbox"
          id="toggleExistingInfrastructure"
          name="toggleExistingInfrastructure"
          onChange={(e) => setShowExistingInfrastructure(e.target.checked)}
          checked={showExistingInfrastructure}
        />
        <label className='go-boston-legend-label' htmlFor="toggleExistingInfrastructure">Existing Infrastructure</label>
      </div>

    </div>
  )
}