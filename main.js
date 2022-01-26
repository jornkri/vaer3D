require([
  'esri/Map',
  'esri/WebScene',
  'esri/views/SceneView',
  'esri/Basemap',
  'esri/layers/Layer',
  'esri/layers/SceneLayer',
  'esri/layers/FeatureLayer',
  'esri/layers/ElevationLayer',
  'esri/layers/GraphicsLayer',
  'esri/widgets/Sketch/SketchViewModel',
  'esri/symbols/WebStyleSymbol',
  'esri/views/layers/support/FeatureFilter',
  'esri/geometry/geometryEngine',
  'esri/Graphic',
  'esri/renderers/ClassBreaksRenderer',
  'esri/widgets/Slider',
  'esri/core/promiseUtils',
  'esri/widgets/LayerList',
  'esri/widgets/Expand',
  'esri/widgets/Daylight',
  'esri/Ground',
  'esri/layers/MapImageLayer',
  'esri/layers/VectorTileLayer',
  'esri/layers/WebTileLayer',
], function (
  Map,
  WebScene,
  SceneView,
  Basemap,
  Layer,
  SceneLayer,
  FeatureLayer,
  ElevationLayer,
  GraphicsLayer,
  SketchViewModel,
  WebStyleSymbol,
  Graphic,
  geometryEngine,
  FeatureFilter,
  ClassBreaksRenderer,
  Slider,
  promiseUtils,
  LayerList,
  Expand,
  Daylight,
  Ground,
  MapImageLayer,
  VectorTileLayer,
  WebTileLayer
) {
  const Bygninger_Norge = new SceneLayer({
    portalItem: {
      id: 'e0ebfcdb1ceb4a16b1675f1d8ae7833f',
    },
    //title: "Bygninger",
    //listMode: "hide",
    //outFields: ["*"],
    //purgeOptions: {
    //    displayCount: 1000
    //},
    //renderer: ,
    //opacity: 0.3,

    //popupTemplate: template,
    refreshInterval: 0.01,
    elevationInfo: {
      // elevation mode that will place points on top of the buildings or other SceneLayer 3D objects
      mode: 'on-the-ground',
      //offset: 2.8
    },
  });

  let basemap = new Basemap({
    baseLayers: [
      new VectorTileLayer({
        // URL to the style of vector tiles
        url: 'https://services.geodataonline.no/arcgis/rest/services/GeocacheVector/GeocacheGraatone_WM/VectorTileServer',
      }),
    ],
    title: 'basemap',
    id: 'basemap',
    spatialReference: 3857,
  });

  let basemapBilder = new Basemap({
    baseLayers: [
      new WebTileLayer({
        urlTemplate:
          'https://services.geodataonline.no/arcgis/rest/services/Geocache_WMAS_WGS84/GeocacheBilder/MapServer',
      }),
    ],
    title: 'basemap',
    id: 'basemap',
    //spatialReference: 3857,
  });

  // let basemap = new Basemap({
  //   portalItem: {
  //     id: 'd6e2025edfd841c4b21d5cfa1a6db3d4',
  //   },
  // });
  // const basemapBilder3857 = new Basemap({
  //   portalItem: {
  //     id: 'd6e2025edfd841c4b21d5cfa1a6db3d4',
  //   },
  // });
  // const basemapGraatoneTerrengVectorTile3857 = new Basemap({
  //   portalItem: {
  //     id: 'becb5061c72942879adc0654acf7ba61',
  //   },
  // });
  const elevLyr25833 = new ElevationLayer({
    portalItem: {
      id: '4526a4d94b844467a3ce130da8ca172d',
    },
  });
  const elevLyr3857 = new ElevationLayer({
    portalItem: {
      id: 'b51e1c2598e44dc695a724b441e5c426',
    },
  });
  // let map = new Map({
  //   basemap: basemap,
  //   layers: [Bygninger_Norge],
  //   ground: new Ground({
  //     layers: [elevLyr3857],
  //   }),
  // });

  const scene = new WebScene({
    portalItem: {
      id: '042e5f04f3d645a684e76e377490a36d',
    },
  });

  // map.ground.layers.add(elevLyr3857);

  let view = new SceneView({
    container: 'viewDiv',
    map: scene,
    qualityProfile: 'high',

    environment: {
      quality: 'high',
      atmosphere: {
        quality: 'high',
      },
      weather: {
        type: 'sunny',
        cloudCover: 0.8, // autocasts as new CloudyWeather({ cloudCover: 0.4 })
      },
    },
    //
    // center: {
    //   x: 263164.68078,
    //   y: 6639010.9098,
    //   z: 10000,
    //   tilt: 65,
    //   //spatialReference: 25833,
    // },

    // qualityProfile: 'high',
  });

  const weatherDropdown = document.getElementById('weatherDropdown');
  view.ui.add(weatherDropdown, 'top-right');

  // Listen to changes in the dropdown
  weatherDropdown.addEventListener('calciteDropdownSelect', () => {
    // Read the id of the current selected item
    let selectedWeather = weatherDropdown.selectedItems[0].id;
    // Get the new weather instance and set it to the weather property of the view
    view.environment.weather = setWeather(selectedWeather);
  });

  // Returns instances of the different weather types
  function setWeather(selectedWeather) {
    switch (selectedWeather) {
      case 'Sunny':
        return { type: 'sunny', cloudCover: 0.8 }; // autocasts as new SunnyWeather({ cloudCover: 0.8 })
      case 'Cloudy':
        return { type: 'cloudy', cloudCover: 0.4 }; // autocasts as new CloudyWeather({ cloudCover: 0.4})
      case 'Rainy':
        return { type: 'rainy', cloudCover: 0.4 }; // autocasts as new RainyWeather({ cloudCover: 0.4 })
      case 'Foggy':
        return { type: 'foggy', fogStrength: 0.6 }; // autocasts as new FoggyWeather({ fogStrength: 0.6 })
    }
  }
  scene.when(() => {
    // set this property to display trees, buildings and other
    // 3D objects reflected in the water.
    view.environment.lighting.waterReflectionEnabled = true;
  });
});
