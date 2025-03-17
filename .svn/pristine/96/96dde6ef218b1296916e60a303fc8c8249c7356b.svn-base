/*========================================================
    DATE: 2024. 01
    AUTHOR: MOYOUNG
    DESC: Map Module Configuration
========================================================*/
_GL.MAP_CONFIG = {
    URLS: {
        BASE_MAPS: {
            GOOGLE: {
                ROAD: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
                HYBRID: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
                SATELLITE: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}'
            },
            OSM: {
                STANDARD: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                STANDARD2: 'https://{a-c}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
                GIS2: 'https://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}',
                GEOLOGY: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
            }
        },
        LAYERS: {
            PROVINCE: 'klums:province',
            DISTRICT: 'klums:district',
            COMMUNITY: 'klums:community',
            AERIAL: 'klums:aerial_issyk_ata',
            SATELLITE: 'klums:satellite_issyk_ata',
            LANDUSE: 'klums:land_use',
        },
    	WMS: '/klums/api/geoserver/wms',
    	WFS: '/klums/api/geoserver/wfs',
    },
    DEFAULT: {
        CENTER: [74.98030640526078, 42.68594002290223],
        ZOOM: 10
    },
    COMMON_FIELDS: [
        'objectid', 'ink', 'ink_1', 'coate_raio', 'name_raion',
        'coate_aa', 'name_aa', 'nomer_kont', 'staryi_nom',
        'vid_ugodii', 'uslcode', 'ispolzovan', 'opisanie',
        'primechani', 'kategoria_', 'kolichestv', 'obshay_plo',
        'ploshad_or', 'lclsf_cd', 'sclsf_cd', 'cnt', 'kdar'
    ]
};