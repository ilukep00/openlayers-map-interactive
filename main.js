import {Map,View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import {XYZ} from 'ol/source'
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Draw from 'ol/interaction/Draw.js';
import Modify from 'ol/interaction/Modify.js';
import Select from 'ol/interaction/Select.js';
import { click } from 'ol/events/condition';


let featuresJSON;
const geoJSONFormat = new GeoJSON({featureProjection:'EPSG:3857'});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new XYZ({
        url:'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
        attributions: 'Google Inc.',
        attributionsCollapsible: false,
      })
    })
  ],
  view: new View({
    center: fromLonLat([-1.6389912,42.8171412]),
    zoom: 15
  })
})
const simpleVectorSource = new VectorSource();
const simpleVectorLayer = new VectorLayer({
  source: simpleVectorSource
});

const i_modify = new Modify({source: simpleVectorSource});
i_modify.setActive(false);
map.addInteraction(i_modify);

const i_delete = new Select({condition:click})
i_delete.setActive(false);
map.addInteraction(i_delete);


simpleVectorSource.on('change', function onChange(){
  featuresJSON = geoJSONFormat.writeFeatures(simpleVectorSource.getFeatures());
})

map.addLayer(simpleVectorLayer)

const cleanButton = document.getElementById("clean");
cleanButton.addEventListener("click", function onClick(){
  cleanAllInteractions();
  drawSelector.value = 'no-option'
  simpleVectorSource.clear()
})

const downloadButton = document.getElementById("download");

downloadButton.addEventListener('click', function downloadOnClick(){
   cleanAllInteractions();
   drawSelector.value = 'no-option'
   var tempLink = document.createElement("a");
   tempLink.href='data:application/json;charset=utf-8,' + encodeURIComponent(featuresJSON)
   tempLink.download='GeoLayer.json'
   tempLink.click();
})

let draw;
const drawSelector = document.getElementById("draw-option");
drawSelector.addEventListener('change', function(){
  cleanAllInteractions();
  const {value = 'no-option'} = drawSelector;
  if(value !== 'no-option'){
    draw = new Draw({type: value, source: simpleVectorSource});
    map.addInteraction(draw)
  } 
})


const modifyButton = document.getElementById("modify");
modifyButton.addEventListener('click', function(){
  map.removeInteraction(draw);
  drawSelector.value = 'no-option'
  i_delete.setActive(false);
  i_modify.setActive(!i_modify.getActive());
});


const deleteButton = document.getElementById("delete");
deleteButton.addEventListener('click', function(){
  map.removeInteraction(draw);
  i_modify.setActive(false);
  drawSelector.value = 'no-option';
  i_delete.setActive(!i_delete.getActive());
})

i_delete.on('select', function(e){
  simpleVectorSource.removeFeatures(e.selected);
})


const cleanAllInteractions = () => {
  i_modify.setActive(false);
  i_delete.setActive(false);
  map.removeInteraction(draw);
}

