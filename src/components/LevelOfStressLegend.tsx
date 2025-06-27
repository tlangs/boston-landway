import { Fragment, ReactElement } from 'react'
import { ReactComponent as LevelOfStressLegendSvg } from '../assets/stress_level_legend.svg';

function LevelOfStressLegend(): ReactElement {


  return (
    <Fragment>
      <div className='legend' style={{ 'display': 'block' }}>
        <LevelOfStressLegendSvg style={{ width: '150px', height: '25%' }} />
      </div>
    </Fragment>
  )
}

export default LevelOfStressLegend;