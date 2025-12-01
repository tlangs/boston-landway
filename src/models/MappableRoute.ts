
import type {FeatureCollection} from 'geojson'

export type MappableRoute = {
    featureCollection: FeatureCollection
    routeName?: string
}