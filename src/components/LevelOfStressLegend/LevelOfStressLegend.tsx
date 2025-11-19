import './LevelOfStressLegend.css'
import { ReactComponent as IconLTS1 } from '../../assets/Icon_LTS1.svg'
import { ReactComponent as IconLTS2 } from '../../assets/Icon_LTS2.svg'
import { ReactComponent as IconLTS3 } from '../../assets/Icon_LTS3.svg'
import { ReactComponent as IconLTS4 } from '../../assets/Icon_LTS4.svg'
import { ReactComponent as TextLTS1 } from '../../assets/Text_LTS1.svg'
import { ReactComponent as TextLTS2 } from '../../assets/Text_LTS2.svg'
import { ReactComponent as TextLTS3 } from '../../assets/Text_LTS3.svg'
import { ReactComponent as TextLTS4 } from '../../assets/Text_LTS4.svg'
import { ReactComponent as LogoStressmap } from '../../assets/BikeStressMap.svg'


type LevelOfStressLegendProps = {
  colorScale: string[]
}

export default function LevelOfStressLegend(props: LevelOfStressLegendProps) {
  // console.log('Legend')

  // console.log(colorScale)
  const { colorScale } = props;
  const lts1 = { borderColor: colorScale[0] }
  const lts2 = { borderColor: colorScale[1] }
  const lts3 = { borderColor: colorScale[2] }
  const lts4 = { borderColor: colorScale[3] }
  // console.log(lts1)

  // const borderStyle = ({colorScale, index}) => {
  //   return ({borderColor: colorScale[index]})
  // }

  const borderStyle = ({ }) => {
    return ({ borderColor: '#63B281' })
  }

  return (
    <div className="legend grid-container">
      <div className="legend-header-hover">
        <LogoStressmap title='Legend' className='hover-image' />
      </div> 

      <div className='legend-row' style={lts1}>
        <div className="legend-icon">
          <IconLTS1 title='LTS 1' className='default-image' />
          <IconLTS1 title='LTS 1' className='hover-image' />
        </div>
        <div className="legend-text">
          <TextLTS1 title='Carefree riding' className='hover-image' />
        </div>
      </div>

      <div className='legend-row' style={lts2}>
        <div className="legend-icon">
          <IconLTS2 title='LTS 2' className='default-image' />
          <IconLTS2 title='LTS 2' className='hover-image' />
        </div>
        <div className="legend-text">
          <TextLTS2 title='Easy going riding' className='hover-image' />
        </div>
      </div>

      <div className='legend-row' style={lts3}>
        <div className="legend-icon">
          <IconLTS3 title='LTS 3' className='default-image' />
          <IconLTS3 title='LTS 3' className='hover-image' />
        </div>
        <div className="legend-text">
          <TextLTS3 title='Stressful riding' className='hover-image' />
        </div>
      </div>

      <div className='legend-row' style={lts4}>
        <div className="legend-icon">
          <IconLTS4 title='LTS 4' className='default-image' />
          <IconLTS4 title='LTS 4' className='hover-image' />
        </div>
        <div className="legend-text">
          <TextLTS4 title='White knuckle riding' className='hover-image' />
        </div>
      </div>
    </div>
  )
}