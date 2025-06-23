import './Mapbox.css'
import { useRef, useEffect, type RefObject } from 'react'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import GeoJson from './geojson.json';

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function routes() {
  const set = new Set();
  GeoJson.features.forEach((feature) => {
    set.add(feature.properties.routeId)
  })
  return Array.from(set)
}


function Mapbox() {

  const mapRef: RefObject<mapboxgl.Map> = useRef(null as unknown as mapboxgl.Map);
  const mapContainerRef: RefObject<HTMLDivElement> = useRef(null as unknown as HTMLDivElement);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGxhbmdzZm9yZCIsImEiOiJjbWM4MTkzMGYxaGJxMmxwdGdweTVqb3RhIn0.S0CyG6BWDXPKNyG-mjJQOQ'
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-71.057778, 42.360278],
      zoom: 10.12,
      style: 'mapbox://styles/mapbox/outdoors-v12',
    });

    mapRef.current.on('load', () => {
      mapRef.current.addSource('boston-landway', {
        type: 'geojson',
        data: GeoJson as GeoJSON.FeatureCollection
      });

      routes().forEach((routeId) => {
        mapRef.current.addLayer({
          id: 'route' + routeId,
          type: 'line',
          source: 'boston-landway',
          layout: {
            'line-join': 'round',
            "line-cap": 'round'
          },
          paint: {
            'line-color': getRandomColor(),
            'line-opacity': 1,
            'line-width': 5
          },
          filter: ['==', 'routeId', routeId]
        });
      })

    })



    return () => {
      mapRef.current.remove()
    }
  }, [])
  return (
    <div id="root">
      <div id='map-container' ref={mapContainerRef} />
    </div>
  )
}

export default Mapbox;