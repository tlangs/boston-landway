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
  // console.log(lts1)

  // const borderStyle = ({colorScale, index}) => {
  //   return ({borderColor: colorScale[index]})
  // }

  const borderStyle = ({ }) => {
    return ({ borderColor: '#63B281' })
  }

  return (
    <div className="go-boston-legend go-boston-grid-container">
      <span>Go Boston 2030</span>

      <div className='go-boston-legend-row' style={existing}>
        <div className="go-boston-legend-text">
          <span>Existing Bicycle Network</span>
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
    </div>
  )
}