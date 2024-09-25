'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var awsAmplify = require('aws-amplify');
var auth = require('aws-amplify/auth');
var maplibregl = require('maplibre-gl');
var maplibreGlJsAmplify = require('maplibre-gl-js-amplify');
var ReactMapGL = require('react-map-gl');
var uiReactCore = require('@aws-amplify/ui-react-core');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var maplibregl__default = /*#__PURE__*/_interopDefault(maplibregl);
var ReactMapGL__default = /*#__PURE__*/_interopDefault(ReactMapGL);

/**
 * The `MapView` component uses [react-map-gl](https://visgl.github.io/react-map-gl/) and
 * [maplibre-gl-js](https://visgl.github.io/react-map-gl/) to provide an interactive map using
 * [Amplify Geo APIs](https://docs.amplify.aws/lib/geo/getting-started/q/platform/js/) powered by
 * [Amazon Location Service](https://aws.amazon.com/location/). Since `MapView` is a wrapper of the
 * [react-map-gl default Map](https://visgl.github.io/react-map-gl/docs/api-reference/map/), it accepts the same
 * properties except `transformRequest` which is set by Amplify.
 *
 * [📖 Docs](https://ui.docs.amplify.aws/react/connected-components/geo#mapview)
 *
 * @example
 * // Basic usage of MapView:
 * function App() {
 *   return <MapView />
 * }
 */
const MapView = React.forwardRef(({ mapLib, mapStyle, style, ...props }, ref) => {
    const geoConfig = React.useMemo(() => {
        return (awsAmplify.Amplify.getConfig().Geo?.LocationService ??
            {});
    }, []);
    const [transformRequest, setTransformRequest] = React.useState();
    const styleProps = React.useMemo(() => ({
        height: '100vh',
        position: 'relative',
        width: '100vw',
        ...style,
    }), [style]);
    /**
     * The transformRequest is a callback used by react-map-gl before it makes a request for an external URL. It signs
     * the request with AWS Sigv4 Auth, provided valid credentials, and is how we integrate react-map-gl with Amplify Geo
     * and Amazon Location Service. Once the transformRequest is created, we render the map.
     */
    React.useEffect(() => {
        (async () => {
            const { credentials } = await auth.fetchAuthSession();
            if (credentials && geoConfig) {
                const { region } = geoConfig;
                const { transformRequest: amplifyTransformRequest } = new maplibreGlJsAmplify.AmplifyMapLibreRequest(credentials, region);
                setTransformRequest(() => amplifyTransformRequest);
            }
        })();
    }, [geoConfig]);
    /**
     * The mapLib property is used by react-map-gl@v7 to override the underlying map library. The default library is
     * mapbox-gl-js, which uses its own copyrighted license. We override the map library with the BSD-licensed
     * maplibre-gl-js.
     *
     * The default mapStyle we use is just the map ID provided by aws-exports.
     */
    return transformRequest ? (React__default["default"].createElement(ReactMapGL__default["default"], { ...props, mapLib: mapLib ?? maplibregl__default["default"], mapStyle: mapStyle ?? geoConfig?.maps?.default, ref: ref, style: styleProps, transformRequest: transformRequest, fog: props.fog, terrain: props.terrain })) : null;
});
MapView.displayName = 'MapView';

const VERSION = '2.0.25';

const LOCATION_SEARCH_OPTIONS = {
    maplibregl: maplibregl__default["default"],
    marker: { color: '#3FB1CE' },
    popup: true,
    showResultMarkers: { color: '#3FB1CE' },
    showResultsWhileTyping: true,
};
const LOCATION_SEARCH_CONTAINER = 'geocoder-container';
const LocationSearchControl = ({ position = 'top-right', ...props }) => {
    ReactMapGL.useControl(() => maplibreGlJsAmplify.createAmplifyGeocoder(props), {
        position,
    });
    return null;
};
const LocationSearchStandalone = (props) => {
    const hasMounted = React.useRef(false);
    React.useEffect(() => {
        if (!hasMounted.current) {
            maplibreGlJsAmplify.createAmplifyGeocoder(props).addTo(`#${LOCATION_SEARCH_CONTAINER}`);
            hasMounted.current = true;
        }
    }, [props]);
    return React__default["default"].createElement("div", { id: LOCATION_SEARCH_CONTAINER });
};
/**
 * The `<LocationSearch>` component provides location search.
 *
 * [📖 Docs](https://ui.docs.amplify.aws/react/connected-components/geo#location-search)
 *
 * @example
 * // Used as a map control:
 * function App() {
 *   return (
 *     <MapView>
 *       <LocationSearch />
 *     </MapView>
 *   );
 * }
 *
 * @example
 * // Used as a standalone component:
 * function App() {
 *   return <LocationSearch />;
 * }
 */
const LocationSearch = (props) => {
    const { current: map } = ReactMapGL.useMap();
    uiReactCore.useSetUserAgent({
        componentName: 'LocationSearch',
        packageName: 'react-geo',
        version: VERSION,
    });
    /**
     * This logic determines whether the LocationSearch exists as part of a Map component or if it is a standalone component.
     * The `useControl` hook inside `LocationSearchControl` from `react-map-gl` makes it easy to add a control to a map,
     * but throws an error if that map doesn't exist. If the map doesn't exist, the LocationSearch is mounted to a container
     * upon rendering inside the `LocationSearchStandalone`.
     */
    if (map) {
        return React__default["default"].createElement(LocationSearchControl, { ...LOCATION_SEARCH_OPTIONS, ...props });
    }
    return React__default["default"].createElement(LocationSearchStandalone, { ...LOCATION_SEARCH_OPTIONS, ...props });
};

exports.LocationSearch = LocationSearch;
exports.MapView = MapView;
