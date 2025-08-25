import {createMap, createVectorSource, createVectorLayer, createDraw, initializeModifyInteraction, initializeSelectInteraction, createGeoJSON} from './openlayersUtilities';

let featuresJSON;
let draw;

const handleElement = (id, eventToHandle, methodToCall) => {
  const element = document.getElementById(id);
  element.addEventListener(eventToHandle, function(){
    methodToCall();
  });
  return element;
}

const drawSelectorOnClick = () => {
  cleanInteractions([i_delete,i_modify], false);
  const {value = 'no-option'} = drawSelector;
  if(value !== 'no-option'){
    draw = createDraw({type: value, source: simpleVectorSource});
    map.addInteraction(draw)
  } 
}

const cleanButtonOnClick = () => {
  cleanInteractions([i_delete,i_modify]);
  simpleVectorSource.clear()
}

const downloadButtonOnClick = () => {
   cleanInteractions([i_delete,i_modify]);
   var tempLink = document.createElement("a");
   tempLink.href='data:application/json;charset=utf-8,' + encodeURIComponent(featuresJSON)
   tempLink.download='GeoLayer.json'
   tempLink.click();
}

const modifyButtonOnClick = () => {
  cleanInteractions([i_delete])
  i_modify.setActive(!i_modify.getActive());
}

const deleteButtonOnClick = () => {
  cleanInteractions([i_modify])
  i_delete.setActive(!i_delete.getActive());
}

const cleanInteractions = (interactions, resetDrawValue = true) => {
  if(interactions.length > 0){
    interactions.forEach(element => {
      element.setActive(false)
    });
  }
  map.removeInteraction(draw);
  drawSelector.value = resetDrawValue?'no-option':drawSelector.value;
}
const geoJSONFormat = createGeoJSON({featureProjection:'EPSG:3857'});

const map = createMap('map','https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', 'Google Inc.',[-1.6389912,42.8171412] )
const simpleVectorSource = createVectorSource();
const simpleVectorLayer = createVectorLayer(simpleVectorSource);
map.addLayer(simpleVectorLayer)
const i_modify = initializeModifyInteraction(simpleVectorSource, map);
const i_delete = initializeSelectInteraction(map);

simpleVectorSource.on('change', function onChange(){
  featuresJSON = geoJSONFormat.writeFeatures(simpleVectorSource.getFeatures());
})

i_delete.on('select', function(e){
  simpleVectorSource.removeFeatures(e.selected);
})

const drawSelector = handleElement('draw-option', 'change', drawSelectorOnClick)
handleElement('clean', 'click',cleanButtonOnClick)
handleElement('download', 'click', downloadButtonOnClick)
handleElement('modify', 'click', modifyButtonOnClick)
handleElement('delete', 'click', deleteButtonOnClick)



