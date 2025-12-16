// import './LevelOfStressMap.css'
import { useRef, useEffect, type RefObject, ReactElement, Fragment, useContext } from 'react'
import mapboxgl, { ExpressionSpecification } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { MappableRoute } from '../../models/MappableRoute';
import cambridgeRoute from '../../assets/cambridgeMap/annotated/cambridge-map-annotated-geojson.json';

const lastMapCenterKey = "lastMapCenter"
const lastZoomLevelKey = "lastZoomLevel"

const stressLevelFourHex = '#d31f11';
const stressLevelThreeHex = '#f47a00';
const stressLevelTwoHex = '#62c8d3';
const stressLevelOneHex = '#007191';
const footpathHex = '#62c8d3'

const lts4Expr = ['==', ["get", "lts"], 4];
const lts3Expr = ['==', ["get", "lts"], 3];
const lts2Expr = ['==', ["get", "lts"], 2];
const lts1Expr = ['==', ["get", "lts"], 1];
const footpathExpr = ['==', ["get", "highway"], "footway"];
const bothSidesCycleTrackExpr = [
  'any',
  ['all',
    ['has', 'cycleway', ['properties']],

    [
      'all',
      ['has', 'cycleway', ['properties']],
      ['has', 'leftType', ['get', 'cycleway', ['properties']]],
      ['==', [
        'get', 'leftType', [
          'get', 'cycleway', ['properties']
        ]
      ],
        'track'],
      ['has', 'cycleway', ['properties']],
      ['has', 'rightType', ['get', 'cycleway', ['properties']]],
      ['==', [
        'get', 'rightType', [
          'get', 'cycleway', ['properties']
        ]
      ], 'track'
      ]
    ]]]

type BostonCyclistsUnionMapProps = {
  routes: MappableRoute[]
}

function CambridgeMap(): ReactElement {

  const showLevelOfStress = true;
  const routes = [cambridgeRoute] as unknown as MappableRoute[]

  const ltsPaint = {
    'line-color': [
      'case',
      lts4Expr,
      stressLevelFourHex,
      lts3Expr,
      stressLevelThreeHex,
      lts2Expr,
      stressLevelTwoHex,
      lts1Expr,
      stressLevelOneHex,
      footpathExpr,
      footpathHex,
      stressLevelFourHex
    ] as ExpressionSpecification,
    'line-opacity': 1,
    'line-width': 5,
    // 'line-dasharray': [
    //   'case',
    //   ['==', ["get", "routeName"], 'Future']
    // ]

  };

  const clickableAreaPaint = {
    'line-width': 10,
    'line-opacity': 0
  }

  const mapRef: RefObject<mapboxgl.Map> = useRef(null as unknown as mapboxgl.Map);
  const mapContainerRef: RefObject<HTMLDivElement> = useRef(null as unknown as HTMLDivElement);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGxhbmdzZm9yZCIsImEiOiJjbWM4MTkzMGYxaGJxMmxwdGdweTVqb3RhIn0.S0CyG6BWDXPKNyG-mjJQOQ'
    const localStorageLastCenter = window.localStorage.getItem(lastMapCenterKey)
    const initialCenter = localStorageLastCenter ? JSON.parse(localStorageLastCenter) : { "lng": -71.09679412683583, "lat": 42.33081574894257 }
    const localStorageLastZoom = window.localStorage.getItem(lastZoomLevelKey)
    const initialZoom = localStorageLastZoom ? parseFloat(localStorageLastZoom) : 12.0
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: initialCenter,
      zoom: initialZoom,
      style: "mapbox://styles/tlangsford/cmc9o4u7902f401s278a2da92",
      maxBounds: [
        [-71.39417, 42.13907],
        [-70.90290, 42.45938]
      ]
    });

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      const routeName = route.routeName
      mapRef.current.on('load', () => {
        mapRef.current.addSource(`${routeName || ""}Source`, {
          type: 'geojson',
          data: route.featureCollection as GeoJSON.FeatureCollection
        });
      })
    }

    if (showLevelOfStress) {
      for (const route of routes) {
        mapRef.current.on('load', () => {
          mapRef.current.addLayer({
            id: route.routeName || "",
            type: 'line',
            source: `${route.routeName || ""}Source`,
            slot: 'middle',
            layout: {
              'line-join': 'bevel',
              'line-cap': 'round'
            },
            paint: ltsPaint
          });
        })
      }
    }

    for (const route of routes) {
      const routeName = route.routeName || ""
      mapRef.current.on('load', () => {
        mapRef.current.addLayer({
          id: routeName + ":clickable",
          type: 'line',
          source: `${routeName}Source`,
          layout: {
            'line-join': 'bevel',
            'line-cap': 'round'
          },
          paint: clickableAreaPaint
        });
      })
    }

    const clickableRouteNames = routes.map(r => (r.routeName || "") + ":clickable" );
    mapRef.current.on('mouseenter', clickableRouteNames, () => {
      mapRef.current.getCanvas().style.cursor = 'pointer'
    })
    mapRef.current.on('mouseleave', clickableRouteNames, () => {
      mapRef.current.getCanvas().style.cursor = ''
    })

    mapRef.current.on('click', clickableRouteNames, (e) => {
      if (e.features && e.features[0] && e.features[0].properties) {
        const props = e.features[0].properties;

        var html = LevelOfTrafficStressPopupHTML(props)

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(html)
          .addTo(mapRef.current);
      }
    });

    mapRef.current.on('moveend', (e) => {
      window.localStorage.setItem(lastMapCenterKey, JSON.stringify(e.target.getCenter()))
    })

    mapRef.current.on('zoomend', (e) => {
      window.localStorage.setItem(lastZoomLevelKey, String(e.target.getZoom()))
    })


    return () => {
      mapRef.current.remove()
    }
  })


  return (
    <Fragment>
      <div id="root">
        {/* { showLevelOfStress && <RoutePieChart routes={routes} colorMap={{1: stressLevelOneHex, 2: stressLevelTwoHex, 3: stressLevelThreeHex, 4: stressLevelFourHex}}/> } */}
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
  html += `<tr><td>Cycling facilities:</td><td>
  ${properties["cycleway"] ? 
    Object.entries(JSON.parse(properties["cycleway"])).filter(([key, _]) => key != "wayOsmId").map(([key, value]) => `${key}: ${value}`).join("<br/>") 
    : "None"
  }</td></tr>`
  html += `<tr><td>OSM ID:</td><td><a target="_blank" href="https://www.openstreetmap.org/way/${properties["osmId"]}">${properties["osmId"]}</a></td></tr>`
  html += '</table>'
  return html
}

export default CambridgeMap;