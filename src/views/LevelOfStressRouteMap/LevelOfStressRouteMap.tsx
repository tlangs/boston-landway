import './LevelOfStressRouteMap.css'
import { useRef, useEffect, type RefObject, ReactElement, Fragment } from 'react'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import LevelOfStressLegend from '../../components/LevelOfStressLegend';
import testRouteAnnotated from '../../assets/test-route-annotated-geojson.json'


function LevelOfStressRouteMap(): ReactElement {

  const mapRef: RefObject<mapboxgl.Map> = useRef(null as unknown as mapboxgl.Map);
  const mapContainerRef: RefObject<HTMLDivElement> = useRef(null as unknown as HTMLDivElement);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGxhbmdzZm9yZCIsImEiOiJjbWM4MTkzMGYxaGJxMmxwdGdweTVqb3RhIn0.S0CyG6BWDXPKNyG-mjJQOQ'
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
        data: testRouteAnnotated as GeoJSON.FeatureCollection
      });
      mapRef.current.addLayer({
        id: 'testRoute',
        type: 'line',
        source: 'testSource',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': 'teal',
          'line-opacity': [
            "match",
            ["string", ["get", "lts"]],
            "4",
            .4,
            1
          ],
          'line-width': [
            'match',
            ['string', ['get', 'lts']],
            '1',
            6,
            '2',
            2,
            3
          ],
          'line-gap-width': [
            'match',
            ['string', ['get', 'lts']],
            '2',
            2,
            0
          ]
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

    mapRef.current.on('mouseenter', 'testRoute', () => {
      mapRef.current.getCanvas().style.cursor = 'pointer'
    })
    mapRef.current.on('mouseleave', 'testRoute', () => {
      mapRef.current.getCanvas().style.cursor = ''
    })

    mapRef.current.on('click', 'testRoute', (e) => {
      if (e.features && e.features[0] && e.features[0].properties) {
        const props = e.features[0].properties;
        var html = `<h3>Level of Traffic Stress: ${props.lts}</h3><hr/>`
        const ltsMessage = JSON.parse(props.ltsMessage ?? []) as string[]
        if (ltsMessage.length > 0) {
          html += ltsMessage.map(message => `<p>${message}</p>`).join("");
        } else {
          html += `<p>No LTS Message was given</p>`
        }

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(html)
          .addTo(mapRef.current);
      }

    });

    return () => {
      mapRef.current.remove()
    }
  }, [])


  return (
    <Fragment>
      <div id="root">
        <LevelOfStressLegend />
        <div id='map-container' ref={mapContainerRef} />
      </div>
    </Fragment>
  )
}

export default LevelOfStressRouteMap;