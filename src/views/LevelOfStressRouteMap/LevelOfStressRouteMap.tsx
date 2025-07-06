import './LevelOfStressRouteMap.css'
import { useRef, useEffect, type RefObject, ReactElement, Fragment } from 'react'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import LevelOfStressLegend from '../../components/LevelOfStressLegend';
import testRouteAnnotated from '../../assets/test-route-annotated-geojson.json'
import { fetchGeoJson } from '../../services/osm';
import testRoute from '../../assets/test-route.json'
import { RouteElementList } from '../../components/RouteElements';


const stressLevelFourHex = '#d31f11';
const stressLevelThreeHex = '#f47a00';
const stressLevelTwoHex = '#62c8d3';
const stressLevelOneHex = '#007191';

function LevelOfStressRouteMap(): ReactElement {

  const mapRef: RefObject<mapboxgl.Map> = useRef(null as unknown as mapboxgl.Map);
  const mapContainerRef: RefObject<HTMLDivElement> = useRef(null as unknown as HTMLDivElement);
  fetchGeoJson(testRoute as RouteElementList)

  const geolocation = navigator.geolocation;
  console.log(geolocation);


  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGxhbmdzZm9yZCIsImEiOiJjbWM4MTkzMGYxaGJxMmxwdGdweTVqb3RhIn0.S0CyG6BWDXPKNyG-mjJQOQ'
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-71.09549, 42.30450],
      zoom: 10.12,
      style: "mapbox://styles/tlangsford/cmc9o4u7902f401s278a2da92",
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
          'line-join': 'bevel',
          'line-cap': 'round'
        },
        paint: {
          'line-color': [
            "match",
            ["number", ["get", "lts"]],
            4,
            stressLevelFourHex,
            3,
            stressLevelThreeHex,
            2,
            stressLevelTwoHex,
            1,
            stressLevelOneHex,
            stressLevelFourHex
          ],
          'line-opacity': .8,
          'line-width': 4
        }
      });
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

        var html = LevelOfTrafficStressPopupHTML(props)

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
        <LevelOfStressLegend colorScale={[stressLevelOneHex, stressLevelTwoHex, stressLevelThreeHex, stressLevelFourHex]} />
        <div id='map-container' ref={mapContainerRef} />
      </div>
    </Fragment>
  )
}

function LevelOfTrafficStressPopupHTML(properties: { [name: string]: any }) {
  let html = '<table>'
  html += '<tr>'
  html += `<td><img src="https://raw.githubusercontent.com/BostonCyclistsUnion/Website/refs/heads/main/public/Icon_LTS${properties["lts"]}.svg" width="100px"/></td>`
  html += `<td><img src="https://raw.githubusercontent.com/BostonCyclistsUnion/Website/refs/heads/main/public/Text_LTS${properties["lts"]}.svg"/></td>`
  html += '</tr>'
  html += `<tr><td>Name:</td><td>${properties["name"]}</td></tr>`
  html += `<tr><td>Type of road:</td><td>${properties["highway"]}</td></tr>`
  html += `<tr><td>Speed:</td><td>${properties["speed"]}mph</td></tr>`
  html += `<tr><td>Lanes:</td><td>${properties["lanes"]}</td></tr>`
  html += `<tr><td>Condition:</td><td>${properties["condition"]}</td></tr>`
  html += `<tr><td>Cycling facilities:</td><td>${properties["cycleway"] ? "<pre>" + JSON.stringify(JSON.parse(properties["cycleway"]), null, 2) + "</pre>" : "None"}</td></tr>`
  html += '</table>'
  return html
}

export default LevelOfStressRouteMap;