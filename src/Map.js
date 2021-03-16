import React from 'react'
import "./Map.css"
import {TileLayer, MapContainer, useMap} from "react-leaflet"
import { showDataOnMap } from './util';

const Map = ({center,zoom,countries,casesType}) => {

    function ChangeView({ center, zoom }) {
        const map = useMap();
        
        map.setView(center, zoom);
        return null;
      }
    return (
        
        <div className="map">
        <MapContainer center={center} zoom={zoom} >

        <ChangeView 
        center={center}
        zoom={zoom}
        />
        <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright"/>OpenStreet'
        />

        {showDataOnMap(countries,casesType)}
        </MapContainer>
        
</div>        
            
        
    )
}

export default Map
