import {Map,View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import {Vector, XYZ} from 'ol/source'
import { fromLonLat } from 'ol/proj';
import Modify from 'ol/interaction/Modify.js';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector.js';
import Select from 'ol/interaction/Select.js';
import { click } from 'ol/events/condition';
import Draw from 'ol/interaction/Draw.js';
import GeoJSON from 'ol/format/GeoJSON.js';

const createMap = (target,sourceUrl, sourceAttributions, initialCoordinates) => {
  return new Map({
    target,
    layers: [
      new TileLayer({
        source: new XYZ({
          url: sourceUrl,
          attributions: 'Google Inc.',
          attributionsCollapsible: false,
        })
      })
    ],
    view: new View({
      center: fromLonLat(initialCoordinates),
      zoom: 15
    })
  })
}

const createVectorSource = (options=undefined) => {
  if(options===undefined){
    return new VectorSource();
  }
  return new VectorSource({...options});
}

const createVectorLayer = (source) => {
  return new VectorLayer({source});
 
}

const createDraw = (options) => {
  return new Draw({...options});
}

const createGeoJSON = (options) => {
  return new GeoJSON({...options});
}

const initializeModifyInteraction = (source, map) => {
  const i_modify = new Modify({source});
  i_modify.setActive(false);
  map.addInteraction(i_modify);
  return i_modify;
}

const initializeSelectInteraction = (map) => {
  const i_delete = new Select({condition:click})
  i_delete.setActive(false);
  map.addInteraction(i_delete);
  return i_delete;
}

export {createMap,createVectorSource, createVectorLayer, createDraw, createGeoJSON,initializeModifyInteraction, initializeSelectInteraction} ;