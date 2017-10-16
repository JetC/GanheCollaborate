/**
 * OTPM Cesium Navigation Mixin by jschweppe@burnsmcd.com based on - https://github.com/alberto-acevedo/cesium-navigation
 *
 * The plugin is 100% based on open source libraries. The same license that applies to Cesiumjs and terriajs applies also to this plugin. Feel free to use it,  modify it, and improve it.
 */
(function (root, factory) {
    'use strict';
    /*jshint sub:true*/
    
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    }
    
    Cesium['viewerCesiumNavigationMixin'] = factory();
}(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {

// <-- actual code


/**
 * @license almond 0.3.1 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                //Lop off the last part of baseParts, so that . matches the
                //"directory" and not name of the baseName's module. For instance,
                //baseName of "one/two/three", maps to "one/two/three.js", but we
                //want the directory, "one/two" for this normalization.
                name = baseParts.slice(0, baseParts.length - 1).concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});


/*global define*/
define('Core/createFragmentFromTemplate',[
], function () {
    'use strict';

    var createFragmentFromTemplate = function (htmlString) {
        var holder = document.createElement('div');
        holder.innerHTML = htmlString;

        var fragment = document.createDocumentFragment();
        while (holder.firstChild) {
            fragment.appendChild(holder.firstChild);
        }

        return fragment;
    };

    return createFragmentFromTemplate;
});


/*global require*/
define('Core/loadView',[
    'Cesium/Widgets/getElement',
    'KnockoutES5',
    'Core/createFragmentFromTemplate'
], function (
    getElement,
    Knockout,
    createFragmentFromTemplate) {
    'use strict';

    var loadView = function (htmlString, container, viewModel) {
        container = getElement(container);

        var fragment = createFragmentFromTemplate(htmlString);

        // Sadly, fragment.childNodes doesn't have a slice function.
        // This code could be replaced with Array.prototype.slice.call(fragment.childNodes)
        // but that seems slightly error prone.
        var nodes = [];

        var i;
        for (i = 0; i < fragment.childNodes.length; ++i) {
            nodes.push(fragment.childNodes[i]);
        }

        container.appendChild(fragment);

        for (i = 0; i < nodes.length; ++i) {
            var node = nodes[i];
            if (node.nodeType === 1 || node.nodeType === 8) {
                Knockout.applyBindings(viewModel, node);
            }
        }

        return nodes;
    };

    return loadView;
});



/*global require*/
define('ViewModels/UserInterfaceControl',[
    'Cesium/Core/defined',
    'Cesium/Core/defineProperties',
    'Cesium/Core/DeveloperError',
    'KnockoutES5'
], function (
    defined,
    defineProperties,
    DeveloperError,
    Knockout) {
    'use strict';

    /**
     * The view-model for a control in the user interface
     *
     * @alias UserInterfaceControl
     * @constructor
     * @abstract
     *
     * @param {Terria} terria The Terria instance.
     */
    var UserInterfaceControl = function (terria) {

        if (!defined(terria)) {
            throw new DeveloperError('terria is required');
        }

        this._terria = terria;

        /**
         * Gets or sets the name of the control which is set as the controls title.
         * This property is observable.
         * @type {String}
         */
        this.name = 'Unnamed Control';

        /**
         * Gets or sets the text to be displayed in the UI control.
         * This property is observable.
         * @type {String}
         */
        this.text = undefined;

        /**
         * Gets or sets the svg icon of the control.  This property is observable.
         * @type {Object}
         */
        this.svgIcon = undefined;

        /**
         * Gets or sets the height of the svg icon.  This property is observable.
         * @type {Integer}
         */
        this.svgHeight = undefined;

        /**
         * Gets or sets the width of the svg icon.  This property is observable.
         * @type {Integer}
         */
        this.svgWidth = undefined;

        /**
         * Gets or sets the CSS class of the control. This property is observable.
         * @type {String}
         */
        this.cssClass = undefined;

        /**
         * Gets or sets the property describing whether or not the control is in the active state.
         * This property is observable.
         * @type {Boolean}
         */
        this.isActive = false;

        Knockout.track(this, ['name', 'svgIcon', 'svgHeight', 'svgWidth', 'cssClass', 'isActive']);
    };

    defineProperties(UserInterfaceControl.prototype, {
        /**
         * Gets the Terria instance.
         * @memberOf UserInterfaceControl.prototype
         * @type {Terria}
         */
        terria: {
            get: function () {
                return this._terria;
            }
        },
        /**
         * Gets a value indicating whether this button has text associated with it.
         * @type {Object}
         */
        hasText: {
            get: function () {
                return defined(this.text) && typeof this.text === 'string';
            }
        }

    });

    /**
     * When implemented in a derived class, performs an action when the user clicks
     * on this control.
     * @abstract
     * @protected
     */
    UserInterfaceControl.prototype.activate = function () {
        throw new DeveloperError('activate must be implemented in the derived class.');
    };

    return UserInterfaceControl;
});

/*global require*/
define('ViewModels/NavigationControl',[
    'Cesium/Core/defined',
    'Cesium/Core/Ray',
    'Cesium/Core/IntersectionTests',
    'Cesium/Core/Ellipsoid',
    'ViewModels/UserInterfaceControl'
], function (
    defined,
    Ray,
    IntersectionTests,
    Ellipsoid,
    UserInterfaceControl) {
    'use strict';

    /**
     * The view-model for a control in the navigation control tool bar
     *
     * @alias NavigationControl
     * @constructor
     * @abstract
     *
     * @param {Terria} terria The Terria instance.
     */
    var NavigationControl = function (terria) {
        UserInterfaceControl.apply(this, arguments);
    };

    NavigationControl.prototype = Object.create(UserInterfaceControl.prototype);

    NavigationControl.prototype.getCameraFocus = function (scene) {
        var ray = new Ray(scene.camera.positionWC, scene.camera.directionWC);
        var intersections = IntersectionTests.rayEllipsoid(ray, scene.globe.ellipsoid);
        if (defined(intersections)) {
            return Ray.getPoint(ray, intersections.start);
        } else {
            // Camera direction is not pointing at the globe, so use the ellipsoid horizon point as
            // the focal point.
            return IntersectionTests.grazingAltitudeLocation(ray, scene.globe.ellipsoid);
        }
    };
    return NavigationControl;
});

/*global define*/
define('SvgPaths/svgReset',[
], function () {
    'use strict';

    return 'M14.521617889404297,6.258603058755398 C14.521617889404297,8.802555046975613 12.730293273925781,10.864828072488308 10.520584106445312,10.864828072488308 L10.520584106445312,14.549798928201199 L10.520584106445312,14.549798928201199 C12.730293273925781,14.549798928201199 14.521617889404297,12.487524949014187 14.521617889404297,9.943577729165554 L14.521617889404297,6.258603058755398 C14.521617889404297,4.158184014260769 13.287376403808594,2.32375618070364 11.520841598510742,1.7986578568816185 L11.520841598510742,-0.04382973909378052 L10.520584106445312,3.4948787316679955 L11.520841598510742,7.326125107705593 L11.520841598510742,5.483634911477566 L11.520841598510742,5.483634911477566 C12.712026596069336,5.837712727487087 13.695491790771484,6.803000889718533 14.18759536743164,8.10108657926321 M0.8089869022369385,6.503499947488308 C0.8089869022369385,9.04745288938284 2.454080820083618,11.109725914895535 4.483405530452728,11.109725914895535 L4.483405530452728,14.794694863259792 L4.483405530452728,14.794694863259792 C2.454080820083618,14.794694863259792 0.8089869022369385,12.73242374509573 0.8089869022369385,10.188474617898464 L0.8089869022369385,6.503499947488308 C0.8089869022369385,4.4030818566679955 1.9424738883972168,2.568654976785183 3.564801722764969,2.0435561761260033 L3.564801722764969,0.20106884092092514 L4.483405530452728,3.739776574075222 L3.564801722764969,7.571023903787136 L3.564801722764969,5.728532753884792 L3.564801722764969,5.728532753884792 C2.470854640007019,6.082611046731472 1.567674160003662,7.047899208962917 1.1157422065734863,8.34598346799612 M9.769882607124767,9.761581233501389 C9.769882607124767,9.747364082048655 9.733001792519396,9.735838830779755 9.687507066044038,9.735838830779755 L9.687507066044038,9.715244971871805 L9.687507066044038,9.715244971871805 C9.733001792519396,9.715244971871805 9.769882607124767,9.726770223140704 9.769882607124767,9.740987321868975 L9.769882607124767,9.761581233501389 C9.769882607124767,9.773319702498732 9.744471261306423,9.783571499812364 9.708100924951989,9.786506143423932 L9.708100924951989,9.796803072877907 L9.687507066044038,9.77702660132012 L9.708100924951989,9.755615302337542 L9.708100924951989,9.765912231791518 L9.708100924951989,9.765912231791518 C9.73262570892469,9.763933429969999 9.752873853528634,9.75853876836295 9.763005491791048,9.75128425132295 M4,8.091836780309677 C4,6.158135265111923 5.566298484802246,4.591836780309677 7.5,4.591836780309677 C9.433701515197754,4.591836780309677 11,6.158135265111923 11,8.091836780309677 C11,10.025538295507431 9.433701515197754,11.591836780309677 7.5,11.591836780309677 C5.566298484802246,11.591836780309677 4,10.025538295507431 4,8.091836780309677 M7,9 C7,9 7.223756906077348,9 7.5,9 C7.776243093922652,9 8,9 8,9 C8,9 7.776243093922652,9 7.5,9 C7.223756906077348,9 7,9 7,9 M7,6.5 C7,6.223756906077348 7,6 7,6 C7,6 7,6.223756906077348 7,6.5 C7,6.776243093922652 7,7 7,7 C7,7 7,6.776243093922652 7,6.5 ';
});
/*global require*/
define('ViewModels/ResetViewNavigationControl',[
    'Cesium/Core/defined',
    'Cesium/Scene/Camera',
    'ViewModels/NavigationControl',
    'SvgPaths/svgReset'
], function (
    defined,
    Camera,
    NavigationControl,
    svgReset) {
    'use strict';

    /**
     * The model for a zoom in control in the navigation control tool bar
     *
     * @alias ResetViewNavigationControl
     * @constructor
     * @abstract
     *
     * @param {Terria} terria The Terria instance.
     */
    var ResetViewNavigationControl = function (terria) {
        NavigationControl.apply(this, arguments);

        /**
         * Gets or sets the name of the control which is set as the control's title.
         * This property is observable.
         * @type {String}
         */
        this.name = 'Tilt View';

        /**
         * Gets or sets the svg icon of the control.  This property is observable.
         * @type {Object}
         */
        this.svgIcon = svgReset;

        /**
         * Gets or sets the height of the svg icon.  This property is observable.
         * @type {Integer}
         */
        this.svgHeight = 15;

        /**
         * Gets or sets the width of the svg icon.  This property is observable.
         * @type {Integer}
         */
        this.svgWidth = 15;

        this.availableAngles = [90, 60, 30];

        this.activeAngle = 90;

        /**
         * Gets or sets the CSS class of the control. This property is observable.
         * @type {String}
         */
        this.cssClass = "navigation-control-icon-reset";

    };

    ResetViewNavigationControl.prototype = Object.create(NavigationControl.prototype);

    ResetViewNavigationControl.prototype.nextView = function () {
        var range;        
        var resetViewNavigationControll = this;
        var view = resetViewNavigationControll.activeAngle;
        var viewSelection = resetViewNavigationControll.availableAngles;

        if (viewSelection.indexOf(view) === viewSelection.length - 1) {
            resetViewNavigationControll.activeAngle = viewSelection[0];
        } else {
            resetViewNavigationControll.activeAngle = viewSelection[viewSelection.indexOf(view) + 1];
        }
        var centerScratch = new Cesium.Cartesian3();
        var windowPositionScratch = new Cesium.Cartesian2();
        var pickRayScratch = new Cesium.Ray();
        var windowPosition = windowPositionScratch;
        windowPosition.x = viewer.scene.canvas.clientWidth / 2;
        windowPosition.y = viewer.scene.canvas.clientHeight / 2;
        var ray = viewer.scene.camera.getPickRay(windowPosition, pickRayScratch);
        var center = viewer.scene.globe.pick(ray, viewer.scene, centerScratch);
        var centerCartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(center);      
        var longitude = centerCartographic.longitude * (180/Math.PI);
        var latitude = centerCartographic.latitude * (180/Math.PI);
        if (!Cesium.defined(center)) {
            // Globe is barely visible, so reset to home view.
            viewer.scene.camera.flyTo({
                destination: that.defaultView
            });
            return;
        }                    
        var center = Cesium.Cartesian3.fromDegrees(longitude, latitude );
        var scratchLookAtMatrix4 = new Cesium.Matrix4();
        var transform = Cesium.Transforms.eastNorthUpToFixedFrame(center, Cesium.Ellipsoid.WGS84, scratchLookAtMatrix4);
        viewer.camera.lookAtTransform(transform);
        if (viewSelection.indexOf(view) == 0){
              range = viewer.scene.camera.positionCartographic.height;
        }
        else{
              range = viewer.scene.camera.getMagnitude();
            }         
        var heading = viewer.camera.heading;
        var pitch = Cesium.Math.toRadians(-1 * resetViewNavigationControll.activeAngle);
        viewer.camera.lookAtTransform(transform, new Cesium.HeadingPitchRange(heading, pitch, range));
        viewer.scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }

    /**
     * When implemented in a derived class, performs an action when the user clicks
     * on this control
     * @abstract
     * @protected
     */
    ResetViewNavigationControl.prototype.activate = function () {
        this.nextView();
    };
    return ResetViewNavigationControl;
});

/*global require*/
define('ViewModels/ZoomInNavigationControl',[
    'Cesium/Core/defined',
    'Cesium/Core/Cartesian3',
    'ViewModels/NavigationControl'
], function (
    defined,
    Cartesian3,
    NavigationControl) {
    'use strict';

    /**
     * The model for a zoom in control in the navigation control tool bar
     *
     * @alias ZoomInNavigationControl
     * @constructor
     * @abstract
     *
     * @param {Terria} terria The Terria instance.
     */
    var ZoomInNavigationControl = function (terria) {
        NavigationControl.apply(this, arguments);

        /**
         * Gets or sets the name of the control which is set as the control's title.
         * This property is observable.
         * @type {String}
         */
        this.name = 'Zoom In';

        /**
         * Gets or sets the text to be displayed in the nav control. Controls that
         * have text do not display the svgIcon.
         * This property is observable.
         * @type {String}
         */
        this.text = '+';

        /**
         * Gets or sets the CSS class of the control. This property is observable.
         * @type {String}
         */
        this.cssClass = "navigation-control-icon-zoom-in";

    };

    ZoomInNavigationControl.prototype = Object.create(NavigationControl.prototype);

    var cartesian3Scratch = new Cartesian3();

    ZoomInNavigationControl.prototype.zoomIn = function () {
        // this.terria.analytics.logEvent('navigation', 'click', 'zoomIn');

        this.isActive = true;


//    if (defined(this.terria.cesium)) {
//        var scene =  this.terria.cesium.scene;
//        var camera = scene.camera;
//        var focus = this.getCameraFocus(scene);
//        var direction = Cartesian3.subtract(focus, camera.position, cartesian3Scratch);
//        var movementVector = Cartesian3.multiplyByScalar(direction, 2.0 / 3.0, cartesian3Scratch);
//        var endPosition = Cartesian3.add(camera.position, movementVector, cartesian3Scratch);
//
//        this.flyToPosition(scene, endPosition);
//    }
        if (defined(this.terria)) {
            var scene = this.terria.scene;
            var camera = scene.camera;
            var focus = this.getCameraFocus(scene);
            var direction = Cartesian3.subtract(focus, camera.position, cartesian3Scratch);
            var movementVector = Cartesian3.multiplyByScalar(direction, 2.0 / 3.0, cartesian3Scratch);
            var endPosition = Cartesian3.add(camera.position, movementVector, cartesian3Scratch);

            this.terria.camera.flyTo({'destination': endPosition, 'duration': 1});
        }

        /// this.terria.notifyRepaintRequired();
        this.isActive = false;
    };

    /**
     * When implemented in a derived class, performs an action when the user clicks
     * on this control
     * @abstract
     * @protected
     */
    ZoomInNavigationControl.prototype.activate = function () {
        this.zoomIn();
    };
    return ZoomInNavigationControl;
});

/*global require*/
define('ViewModels/ZoomOutNavigationControl',[
    'Cesium/Core/defined',
    'Cesium/Core/Cartesian3',
    'ViewModels/NavigationControl'
], function (
    defined,
    Cartesian3,
    NavigationControl) {
    'use strict';

    /**
     * The model for a zoom in control in the navigation control tool bar
     *
     * @alias ZoomOutNavigationControl
     * @constructor
     * @abstract
     *
     * @param {Terria} terria The Terria instance.
     */
    var ZoomOutNavigationControl = function (terria) {
        NavigationControl.apply(this, arguments);

        /**
         * Gets or sets the name of the control which is set as the control's title.
         * This property is observable.
         * @type {String}
         */
        this.name = 'Zoom Out';

        /**
         * Gets or sets the text to be displayed in the nav control. Controls that
         * have text do not display the svgIcon.
         * This property is observable.
         * @type {String}
         */
        this.text = '-';

        /**
         * Gets or sets the CSS class of the control. This property is observable.
         * @type {String}
         */
        this.cssClass = "navigation-control-icon-zoom-out";

    };

    ZoomOutNavigationControl.prototype = Object.create(NavigationControl.prototype);

    var cartesian3Scratch = new Cartesian3();

    ZoomOutNavigationControl.prototype.zoomOut = function () {
        //this.terria.analytics.logEvent('navigation', 'click', 'zoomOut');

        this.isActive = true;


//    if (defined( this.terria.cesium)) {
//        var scene =  this.terria.cesium.scene;
//        var camera = scene.camera;
//        var focus = this.getCameraFocus(scene);
//        var direction = Cartesian3.subtract(focus, camera.position, cartesian3Scratch);
//        var movementVector = Cartesian3.multiplyByScalar(direction, -2.0, cartesian3Scratch);
//        var endPosition = Cartesian3.add(camera.position, movementVector, cartesian3Scratch);
//
//        this.flyToPosition(scene, endPosition);
//    }

        if (defined(this.terria)) {
            var scene = this.terria.scene;
            var camera = scene.camera;
            var focus = this.getCameraFocus(scene);
            var direction = Cartesian3.subtract(focus, camera.position, cartesian3Scratch);
            var movementVector = Cartesian3.multiplyByScalar(direction, -2.0, cartesian3Scratch);
            var endPosition = Cartesian3.add(camera.position, movementVector, cartesian3Scratch);

            this.terria.camera.flyTo({'destination': endPosition, 'duration': 1});
        }

        // this.terria.notifyRepaintRequired();
        this.isActive = false;
    };

    /**
     * When implemented in a derived class, performs an action when the user clicks
     * on this control
     * @abstract
     * @protected
     */
    ZoomOutNavigationControl.prototype.activate = function () {
        this.zoomOut();
    };

    return ZoomOutNavigationControl;
});

/*global define*/
define('SvgPaths/svgCompassOuterRing',[
], function () {
    'use strict';

    return 'M 66.5625,0 C 71.407429,0.19096337 75.338119,-0.09891457 80.15625,0 75.336927,0.11416127 71.301899,0 66.5625,0 Z M 72.5,20.21875 c -28.867432,0 -52.28125,23.407738 -52.28125,52.28125 0,28.87351 23.413818,52.3125 52.28125,52.3125 28.86743,0 52.28125,-23.43899 52.28125,-52.3125 0,-28.873512 -23.41382,-52.28125 -52.28125,-52.28125 z m 0,1.75 c 13.842515,0 26.368948,5.558092 35.5,14.5625 l -11.03125,11 0.625,0.625 11.03125,-11 c 8.9199,9.108762 14.4375,21.579143 14.4375,35.34375 0,13.764606 -5.5176,26.22729 -14.4375,35.34375 l -11.03125,-11 -0.625,0.625 11.03125,11 c -9.130866,9.01087 -21.658601,14.59375 -35.5,14.59375 -13.801622,0 -26.321058,-5.53481 -35.4375,-14.5 l 11.125,-11.09375 c 6.277989,6.12179 14.857796,9.90625 24.3125,9.90625 19.241896,0 34.875,-15.629154 34.875,-34.875 0,-19.245847 -15.633104,-34.84375 -34.875,-34.84375 -9.454704,0 -18.034511,3.760884 -24.3125,9.875 L 37.0625,36.4375 C 46.179178,27.478444 58.696991,21.96875 72.5,21.96875 Z m -0.875,0.84375 0,13.9375 1.75,0 0,-13.9375 -1.75,0 z M 36.46875,37.0625 47.5625,48.15625 C 41.429794,54.436565 37.65625,63.027539 37.65625,72.5 c 0,9.472461 3.773544,18.055746 9.90625,24.34375 L 36.46875,107.9375 c -8.96721,-9.1247 -14.5,-21.624886 -14.5,-35.4375 0,-13.812615 5.53279,-26.320526 14.5,-35.4375 z M 72.5,39.40625 c 18.297686,0 33.125,14.791695 33.125,33.09375 0,18.302054 -14.827314,33.125 -33.125,33.125 -18.297687,0 -33.09375,-14.822946 -33.09375,-33.125 0,-18.302056 14.796063,-33.09375 33.09375,-33.09375 z M 22.84375,71.625 l 0,1.75 13.96875,0 0,-1.75 -13.96875,0 z m 85.5625,0 0,1.75 14,0 0,-1.75 -14,0 z M 71.75,108.25 l 0,13.9375 1.71875,0 0,-13.9375 -1.71875,0 z';
});

define('SvgPaths/svgCompassOuterRingN',[
], function () {
    'use strict';

    return 'm 81.85315,15.236122 c -1.480511,0 -4.453531,-0.01802 -5.934042,-0.01802 0,-3.641033 -2.510407,-6.1897564 -4.956443,-10.1341685 l 0,10.1289565 c -1.416133,0 -3.663392,-0.02774 -5.143896,-0.02774 0,-5.5829177 -0.0057,-9.4943817 -0.0057,-15.13794253 l 5.793263,0 c 1.931084,3.21622163 3.990901,6.43244333 5.986372,9.64865683 l 0,-9.64865683 4.248424,0 c 0,5.64356083 0.012,9.60599203 0.012,15.18890953 z M 18.536151,2.1735744 ';
});
/*global define*/
define('SvgPaths/svgCompassGyro',[
], function () {
    'use strict';

    return 'm 72.71875,54.375 c -0.476702,0 -0.908208,0.245402 -1.21875,0.5625 -0.310542,0.317098 -0.551189,0.701933 -0.78125,1.1875 -0.172018,0.363062 -0.319101,0.791709 -0.46875,1.25 -6.91615,1.075544 -12.313231,6.656514 -13,13.625 -0.327516,0.117495 -0.661877,0.244642 -0.9375,0.375 -0.485434,0.22959 -0.901634,0.471239 -1.21875,0.78125 -0.317116,0.310011 -0.5625,0.742111 -0.5625,1.21875 l 0.03125,0 c 0,0.476639 0.245384,0.877489 0.5625,1.1875 0.317116,0.310011 0.702066,0.58291 1.1875,0.8125 0.35554,0.168155 0.771616,0.32165 1.21875,0.46875 1.370803,6.10004 6.420817,10.834127 12.71875,11.8125 0.146999,0.447079 0.30025,0.863113 0.46875,1.21875 0.230061,0.485567 0.470708,0.870402 0.78125,1.1875 0.310542,0.317098 0.742048,0.5625 1.21875,0.5625 0.476702,0 0.876958,-0.245402 1.1875,-0.5625 0.310542,-0.317098 0.582439,-0.701933 0.8125,-1.1875 0.172018,-0.363062 0.319101,-0.791709 0.46875,-1.25 6.249045,-1.017063 11.256351,-5.7184 12.625,-11.78125 0.447134,-0.1471 0.86321,-0.300595 1.21875,-0.46875 0.485434,-0.22959 0.901633,-0.502489 1.21875,-0.8125 0.317117,-0.310011 0.5625,-0.710861 0.5625,-1.1875 l -0.03125,0 c 0,-0.476639 -0.245383,-0.908739 -0.5625,-1.21875 C 89.901633,71.846239 89.516684,71.60459 89.03125,71.375 88.755626,71.244642 88.456123,71.117495 88.125,71 87.439949,64.078341 82.072807,58.503735 75.21875,57.375 c -0.15044,-0.461669 -0.326927,-0.884711 -0.5,-1.25 -0.230061,-0.485567 -0.501958,-0.870402 -0.8125,-1.1875 -0.310542,-0.317098 -0.710798,-0.5625 -1.1875,-0.5625 z m -0.0625,1.40625 c 0.03595,-0.01283 0.05968,0 0.0625,0 0.0056,0 0.04321,-0.02233 0.1875,0.125 0.144288,0.147334 0.34336,0.447188 0.53125,0.84375 0.06385,0.134761 0.123901,0.309578 0.1875,0.46875 -0.320353,-0.01957 -0.643524,-0.0625 -0.96875,-0.0625 -0.289073,0 -0.558569,0.04702 -0.84375,0.0625 C 71.8761,57.059578 71.936151,56.884761 72,56.75 c 0.18789,-0.396562 0.355712,-0.696416 0.5,-0.84375 0.07214,-0.07367 0.120304,-0.112167 0.15625,-0.125 z m 0,2.40625 c 0.448007,0 0.906196,0.05436 1.34375,0.09375 0.177011,0.592256 0.347655,1.271044 0.5,2.03125 0.475097,2.370753 0.807525,5.463852 0.9375,8.9375 -0.906869,-0.02852 -1.834463,-0.0625 -2.78125,-0.0625 -0.92298,0 -1.802327,0.03537 -2.6875,0.0625 0.138529,-3.473648 0.493653,-6.566747 0.96875,-8.9375 0.154684,-0.771878 0.320019,-1.463985 0.5,-2.0625 0.405568,-0.03377 0.804291,-0.0625 1.21875,-0.0625 z m -2.71875,0.28125 c -0.129732,0.498888 -0.259782,0.987558 -0.375,1.5625 -0.498513,2.487595 -0.838088,5.693299 -0.96875,9.25 -3.21363,0.15162 -6.119596,0.480068 -8.40625,0.9375 -0.682394,0.136509 -1.275579,0.279657 -1.84375,0.4375 0.799068,-6.135482 5.504716,-11.036454 11.59375,-12.1875 z M 75.5,58.5 c 6.043169,1.18408 10.705093,6.052712 11.5,12.15625 -0.569435,-0.155806 -1.200273,-0.302525 -1.875,-0.4375 -2.262525,-0.452605 -5.108535,-0.783809 -8.28125,-0.9375 -0.130662,-3.556701 -0.470237,-6.762405 -0.96875,-9.25 C 75.761959,59.467174 75.626981,58.990925 75.5,58.5 z m -2.84375,12.09375 c 0.959338,0 1.895843,0.03282 2.8125,0.0625 C 75.48165,71.267751 75.5,71.871028 75.5,72.5 c 0,1.228616 -0.01449,2.438313 -0.0625,3.59375 -0.897358,0.0284 -1.811972,0.0625 -2.75,0.0625 -0.927373,0 -1.831062,-0.03473 -2.71875,-0.0625 -0.05109,-1.155437 -0.0625,-2.365134 -0.0625,-3.59375 0,-0.628972 0.01741,-1.232249 0.03125,-1.84375 0.895269,-0.02827 1.783025,-0.0625 2.71875,-0.0625 z M 68.5625,70.6875 c -0.01243,0.60601 -0.03125,1.189946 -0.03125,1.8125 0,1.22431 0.01541,2.407837 0.0625,3.5625 -3.125243,-0.150329 -5.92077,-0.471558 -8.09375,-0.90625 -0.784983,-0.157031 -1.511491,-0.316471 -2.125,-0.5 -0.107878,-0.704096 -0.1875,-1.422089 -0.1875,-2.15625 0,-0.115714 0.02849,-0.228688 0.03125,-0.34375 0.643106,-0.20284 1.389577,-0.390377 2.25,-0.5625 2.166953,-0.433487 4.97905,-0.75541 8.09375,-0.90625 z m 8.3125,0.03125 c 3.075121,0.15271 5.824455,0.446046 7.96875,0.875 0.857478,0.171534 1.630962,0.360416 2.28125,0.5625 0.0027,0.114659 0,0.228443 0,0.34375 0,0.735827 -0.07914,1.450633 -0.1875,2.15625 -0.598568,0.180148 -1.29077,0.34562 -2.0625,0.5 -2.158064,0.431708 -4.932088,0.754666 -8.03125,0.90625 0.04709,-1.154663 0.0625,-2.33819 0.0625,-3.5625 0,-0.611824 -0.01924,-1.185379 -0.03125,-1.78125 z M 57.15625,72.5625 c 0.0023,0.572772 0.06082,1.131112 0.125,1.6875 -0.125327,-0.05123 -0.266577,-0.10497 -0.375,-0.15625 -0.396499,-0.187528 -0.665288,-0.387337 -0.8125,-0.53125 -0.147212,-0.143913 -0.15625,-0.182756 -0.15625,-0.1875 0,-0.0047 -0.02221,-0.07484 0.125,-0.21875 0.147212,-0.143913 0.447251,-0.312472 0.84375,-0.5 0.07123,-0.03369 0.171867,-0.06006 0.25,-0.09375 z m 31.03125,0 c 0.08201,0.03503 0.175941,0.05872 0.25,0.09375 0.396499,0.187528 0.665288,0.356087 0.8125,0.5 0.14725,0.14391 0.15625,0.21405 0.15625,0.21875 0,0.0047 -0.009,0.04359 -0.15625,0.1875 -0.147212,0.143913 -0.416001,0.343722 -0.8125,0.53125 -0.09755,0.04613 -0.233314,0.07889 -0.34375,0.125 0.06214,-0.546289 0.09144,-1.094215 0.09375,-1.65625 z m -29.5,3.625 c 0.479308,0.123125 0.983064,0.234089 1.53125,0.34375 2.301781,0.460458 5.229421,0.787224 8.46875,0.9375 0.167006,2.84339 0.46081,5.433176 0.875,7.5 0.115218,0.574942 0.245268,1.063612 0.375,1.5625 -5.463677,-1.028179 -9.833074,-5.091831 -11.25,-10.34375 z m 27.96875,0 C 85.247546,81.408945 80.919274,85.442932 75.5,86.5 c 0.126981,-0.490925 0.261959,-0.967174 0.375,-1.53125 0.41419,-2.066824 0.707994,-4.65661 0.875,-7.5 3.204493,-0.15162 6.088346,-0.480068 8.375,-0.9375 0.548186,-0.109661 1.051942,-0.220625 1.53125,-0.34375 z M 70.0625,77.53125 c 0.865391,0.02589 1.723666,0.03125 2.625,0.03125 0.912062,0 1.782843,-0.0048 2.65625,-0.03125 -0.165173,2.736408 -0.453252,5.207651 -0.84375,7.15625 -0.152345,0.760206 -0.322989,1.438994 -0.5,2.03125 -0.437447,0.03919 -0.895856,0.0625 -1.34375,0.0625 -0.414943,0 -0.812719,-0.02881 -1.21875,-0.0625 -0.177011,-0.592256 -0.347655,-1.271044 -0.5,-2.03125 -0.390498,-1.948599 -0.700644,-4.419842 -0.875,-7.15625 z m 1.75,10.28125 c 0.284911,0.01545 0.554954,0.03125 0.84375,0.03125 0.325029,0 0.648588,-0.01171 0.96875,-0.03125 -0.05999,0.148763 -0.127309,0.31046 -0.1875,0.4375 -0.18789,0.396562 -0.386962,0.696416 -0.53125,0.84375 -0.144288,0.147334 -0.181857,0.125 -0.1875,0.125 -0.0056,0 -0.07446,0.02233 -0.21875,-0.125 C 72.355712,88.946416 72.18789,88.646562 72,88.25 71.939809,88.12296 71.872486,87.961263 71.8125,87.8125 z';
});
/*global define*/
define('SvgPaths/svgCompassRotationMarker',[
], function () {
    'use strict';

    return 'M 72.46875,22.03125 C 59.505873,22.050338 46.521615,27.004287 36.6875,36.875 L 47.84375,47.96875 C 61.521556,34.240041 83.442603,34.227389 97.125,47.90625 l 11.125,-11.125 C 98.401629,26.935424 85.431627,22.012162 72.46875,22.03125 z';
});
/*global define*/
define('ViewModels/NavigationViewModel',[
    'Cesium/Core/defined',
    'Cesium/Core/Math',
    'Cesium/Core/getTimestamp',
    'Cesium/Core/EventHelper',
    'Cesium/Core/Transforms',
    'Cesium/Scene/SceneMode',
    'Cesium/Core/Cartesian2',
    'Cesium/Core/Cartesian3',
    'Cesium/Core/Matrix4',
    'KnockoutES5',
    'Core/loadView',
    'ViewModels/ResetViewNavigationControl',
    'ViewModels/ZoomInNavigationControl',
    'ViewModels/ZoomOutNavigationControl',
    'SvgPaths/svgCompassOuterRing',
    'SvgPaths/svgCompassOuterRingN',
    'SvgPaths/svgCompassGyro',
    'SvgPaths/svgCompassRotationMarker'
], function (
    defined,
    CesiumMath,
    getTimestamp,
    EventHelper,
    Transforms,
    SceneMode,
    Cartesian2,
    Cartesian3,
    Matrix4,
    Knockout,
    loadView,
    ResetViewNavigationControl,
    ZoomInNavigationControl,
    ZoomOutNavigationControl,
    svgCompassOuterRing,
    svgCompassOuterRingN,
    svgCompassGyro,
    svgCompassRotationMarker) {
    'use strict';

    var NavigationViewModel = function (options) {

        this.terria = options.terria;
        this.eventHelper = new EventHelper();

        this.controls = options.controls;
        if (!defined(this.controls)) {
            this.controls = [
                new ZoomInNavigationControl(this.terria),
                new ResetViewNavigationControl(this.terria),
                new ZoomOutNavigationControl(this.terria)
            ];
        }

        this.svgCompassOuterRing = svgCompassOuterRing;
        this.svgCompassOuterRingN = svgCompassOuterRingN;
        this.svgCompassGyro = svgCompassGyro;
        this.svgCompassRotationMarker = svgCompassRotationMarker;

        this.showCompass = defined(this.terria);
        this.heading = this.showCompass ? this.terria.scene.camera.heading : 0.0;

        this.isOrbiting = false;
        this.orbitCursorAngle = 0;
        this.orbitCursorOpacity = 0.0;
        this.orbitLastTimestamp = 0;
        this.orbitFrame = undefined;
        this.orbitIsLook = false;
        this.orbitMouseMoveFunction = undefined;
        this.orbitMouseUpFunction = undefined;

        this.isRotating = false;
        this.rotateInitialCursorAngle = undefined;
        this.rotateFrame = undefined;
        this.rotateIsLook = false;
        this.rotateMouseMoveFunction = undefined;
        this.rotateMouseUpFunction = undefined;

        this._unsubcribeFromPostRender = undefined;

        Knockout.track(this, ['controls', 'showCompass', 'heading', 'isOrbiting', 'orbitCursorAngle', 'isRotating']);

        var that = this;

        function widgetChange() {
            if (defined(that.terria)) {
                if (that._unsubcribeFromPostRender) {
                    that._unsubcribeFromPostRender();
                    that._unsubcribeFromPostRender = undefined;
                }

                that.showCompass = true;

                that._unsubcribeFromPostRender = that.terria.scene.postRender.addEventListener(function () {
                    that.heading = that.terria.scene.camera.heading;
                });
            } else {
                if (that._unsubcribeFromPostRender) {
                    that._unsubcribeFromPostRender();
                    that._unsubcribeFromPostRender = undefined;
                }
                that.showCompass = false;
            }
        }

        this.eventHelper.add(this.terria.afterWidgetChanged, widgetChange, this);
        //this.terria.afterWidgetChanged.addEventListener(widgetChange);

        widgetChange();
    };


    NavigationViewModel.prototype.destroy = function () {

        this.eventHelper.removeAll();

        //loadView(require('fs').readFileSync(baseURLEmpCesium + 'js-lib/terrajs/lib/Views/Navigation.html', 'utf8'), container, this);

    };

    NavigationViewModel.prototype.show = function (container) {
        var testing = '<div class="compass" title="拖动外环: XY方向旋转视角. ' +
            '拖动内环: 任意方向旋转.' +
            '双击: 重置视角.' +
            'TIP: CTRL+拖动地图实现任意旋转." data-bind="visible: showCompass, event: { mousedown: handleMouseDown, dblclick: handleDoubleClick }">' +
            '<div class="compass-outer-ring-background"></div>' +
            ' <div class="compass-rotation-marker" data-bind="visible: isOrbiting, style: { transform: \'rotate(-\' + orbitCursorAngle + \'rad)\', \'-webkit-transform\': \'rotate(-\' + orbitCursorAngle + \'rad)\', opacity: orbitCursorOpacity }, cesiumSvgPath: { path: svgCompassRotationMarker, width: 145, height: 145 }"></div>' +
            ' <div class="compass-outer-ring-n" title="Click and drag to rotate the camera" data-bind="style: { transform: \'rotate(-\' + heading + \'rad)\', \'-webkit-transform\': \'rotate(-\' + heading + \'rad)\' }, cesiumSvgPath: { path: svgCompassOuterRingN, width: 145, height: 145 }"></div>' +
            ' <div class="compass-outer-ring" title="Click and drag to rotate the camera" data-bind="style: { transform: \'rotate(-\' + heading + \'rad)\', \'-webkit-transform\': \'rotate(-\' + heading + \'rad)\' }, cesiumSvgPath: { path: svgCompassOuterRing, width: 145, height: 145 }"></div>' +
            ' <div class="compass-gyro-background"></div>' +
            ' <div class="compass-gyro" data-bind="cesiumSvgPath: { path: svgCompassGyro, width: 145, height: 145 }, css: { \'compass-gyro-active\': isOrbiting }"></div>' +
            '</div>' +
            '<div class="navigation-controls">' +
            '<!-- ko foreach: controls -->' +
            '<div data-bind="click: activate, attr: { title: $data.name }, css: $root.isLastControl($data) ? \'navigation-control-last\' : \'navigation-control\' ">' +
            '   <!-- ko if: $data.hasText -->' +
            '   <div data-bind="text: $data.text, css: $data.isActive ?  \'navigation-control-icon-active \' + $data.cssClass : $data.cssClass"></div>' +
            '   <!-- /ko -->' +
            '  <!-- ko ifnot: $data.hasText -->' +
            '  <div data-bind="cesiumSvgPath: { path: $data.svgIcon, width: $data.svgWidth, height: $data.svgHeight }, css: $data.isActive ?  \'navigation-control-icon-active \' + $data.cssClass : $data.cssClass"></div>' +
            '  <!-- /ko -->' +
            ' </div>' +
            ' <!-- /ko -->' +
            '</div>';
        loadView(testing, container, this);
        // loadView(navigatorTemplate, container, this);
        //loadView(require('fs').readFileSync(baseURLEmpCesium + 'js-lib/terrajs/lib/Views/Navigation.html', 'utf8'), container, this);

    };

    /**
     * Adds a control to this toolbar.
     * @param {NavControl} control The control to add.
     */
    NavigationViewModel.prototype.add = function (control) {
        this.controls.push(control);
    };

    /**
     * Removes a control from this toolbar.
     * @param {NavControl} control The control to remove.
     */
    NavigationViewModel.prototype.remove = function (control) {
        this.controls.remove(control);
    };

    /**
     * Checks if the control given is the last control in the control array.
     * @param {NavControl} control The control to remove.
     */
    NavigationViewModel.prototype.isLastControl = function (control) {
        return (control === this.controls[this.controls.length - 1]);
    };

    var vectorScratch = new Cartesian2();

    NavigationViewModel.prototype.handleMouseDown = function (viewModel, e) {
        var compassElement = e.currentTarget;
        var compassRectangle = e.currentTarget.getBoundingClientRect();
        var maxDistance = compassRectangle.width / 2.0;
        var center = new Cartesian2((compassRectangle.right - compassRectangle.left) / 2.0, (compassRectangle.bottom - compassRectangle.top) / 2.0);
        var clickLocation = new Cartesian2(e.clientX - compassRectangle.left, e.clientY - compassRectangle.top);
        var vector = Cartesian2.subtract(clickLocation, center, vectorScratch);
        var distanceFromCenter = Cartesian2.magnitude(vector);

        var distanceFraction = distanceFromCenter / maxDistance;

        var nominalTotalRadius = 145;
        var norminalGyroRadius = 50;

        if (distanceFraction < norminalGyroRadius / nominalTotalRadius) {
            orbit(this, compassElement, vector);
        } else if (distanceFraction < 1.0) {
            rotate(this, compassElement, vector);
        } else {
            return true;
        }
    };

    var oldTransformScratch = new Matrix4();
    var newTransformScratch = new Matrix4();
    var centerScratch = new Cartesian3();
    var windowPositionScratch = new Cartesian2();

    NavigationViewModel.prototype.handleDoubleClick = function (viewModel, e) {
        var scene = this.terria.scene;
        var camera = scene.camera;

        var windowPosition = windowPositionScratch;
        windowPosition.x = scene.canvas.clientWidth / 2;
        windowPosition.y = scene.canvas.clientHeight / 2;

        var center = camera.pickEllipsoid(windowPosition, scene.globe.ellipsoid, centerScratch);

        if (!defined(center)) {
            // Globe is barely visible, so reset to home view.

            this.controls[1].resetView();
            return;
        }

        var rotateFrame = Transforms.eastNorthUpToFixedFrame(center, scene.globe.ellipsoid);

        var cameraPosition = scene.globe.ellipsoid.cartographicToCartesian(camera.positionCartographic, new Cartesian3());
        var lookVector = Cartesian3.subtract(center, cameraPosition, new Cartesian3());

        var destination = Matrix4.multiplyByPoint(rotateFrame, new Cartesian3(0, 0, Cartesian3.magnitude(lookVector)), new Cartesian3());

        camera.flyTo({
            destination: destination,
            duration: 1.5
        });
    };

    NavigationViewModel.create = function (options) {
        var result = new NavigationViewModel(options);
        result.show(options.container);
        return result;
    };

    function orbit(viewModel, compassElement, cursorVector) {
        // Remove existing event handlers, if any.
        document.removeEventListener('mousemove', viewModel.orbitMouseMoveFunction, false);
        document.removeEventListener('mouseup', viewModel.orbitMouseUpFunction, false);

        if (defined(viewModel.orbitTickFunction)) {
            viewModel.terria.clock.onTick.removeEventListener(viewModel.orbitTickFunction);
        }

        viewModel.orbitMouseMoveFunction = undefined;
        viewModel.orbitMouseUpFunction = undefined;
        viewModel.orbitTickFunction = undefined;

        viewModel.isOrbiting = true;
        viewModel.orbitLastTimestamp = getTimestamp();

        var scene = viewModel.terria.scene;
        var camera = scene.camera;

        var windowPosition = windowPositionScratch;
        windowPosition.x = scene.canvas.clientWidth / 2;
        windowPosition.y = scene.canvas.clientHeight / 2;

        var center = camera.pickEllipsoid(windowPosition, scene.globe.ellipsoid, centerScratch);

        if (!defined(center)) {
            viewModel.orbitFrame = Transforms.eastNorthUpToFixedFrame(camera.positionWC, scene.globe.ellipsoid, newTransformScratch);
            viewModel.orbitIsLook = true;
        } else {
            viewModel.orbitFrame = Transforms.eastNorthUpToFixedFrame(center, scene.globe.ellipsoid, newTransformScratch);
            viewModel.orbitIsLook = false;
        }

        viewModel.orbitTickFunction = function (e) {
            var timestamp = getTimestamp();
            var deltaT = timestamp - viewModel.orbitLastTimestamp;
            var rate = (viewModel.orbitCursorOpacity - 0.5) * 2.5 / 1000;
            var distance = deltaT * rate;

            var angle = viewModel.orbitCursorAngle + CesiumMath.PI_OVER_TWO;
            var x = Math.cos(angle) * distance;
            var y = Math.sin(angle) * distance;

            var scene = viewModel.terria.scene;
            var camera = scene.camera;

            var oldTransform = Matrix4.clone(camera.transform, oldTransformScratch);

            camera.lookAtTransform(viewModel.orbitFrame);

            if (viewModel.orbitIsLook) {
                camera.look(Cartesian3.UNIT_Z, -x);

                // do not look up/down in 2D mode
                if (scene.mode !== SceneMode.SCENE2D) {
                    camera.look(camera.right, -y);
                }
            } else {
                camera.rotateLeft(x);

                // do not look up/down in 2D mode
                if (scene.mode !== SceneMode.SCENE2D) {
                    camera.rotateUp(y);
                }
            }

            camera.lookAtTransform(oldTransform);

            // viewModel.terria.cesium.notifyRepaintRequired();

            viewModel.orbitLastTimestamp = timestamp;
        };

        function updateAngleAndOpacity(vector, compassWidth) {
            var angle = Math.atan2(-vector.y, vector.x);
            viewModel.orbitCursorAngle = CesiumMath.zeroToTwoPi(angle - CesiumMath.PI_OVER_TWO);

            var distance = Cartesian2.magnitude(vector);
            var maxDistance = compassWidth / 2.0;
            var distanceFraction = Math.min(distance / maxDistance, 1.0);
            var easedOpacity = 0.5 * distanceFraction * distanceFraction + 0.5;
            viewModel.orbitCursorOpacity = easedOpacity;

            //viewModel.terria.cesium.notifyRepaintRequired();
        }

        viewModel.orbitMouseMoveFunction = function (e) {
            var compassRectangle = compassElement.getBoundingClientRect();
            var center = new Cartesian2((compassRectangle.right - compassRectangle.left) / 2.0, (compassRectangle.bottom - compassRectangle.top) / 2.0);
            var clickLocation = new Cartesian2(e.clientX - compassRectangle.left, e.clientY - compassRectangle.top);
            var vector = Cartesian2.subtract(clickLocation, center, vectorScratch);
            updateAngleAndOpacity(vector, compassRectangle.width);
        };

        viewModel.orbitMouseUpFunction = function (e) {
            // TODO: if mouse didn't move, reset view to looking down, north is up?

            viewModel.isOrbiting = false;
            document.removeEventListener('mousemove', viewModel.orbitMouseMoveFunction, false);
            document.removeEventListener('mouseup', viewModel.orbitMouseUpFunction, false);

            if (defined(viewModel.orbitTickFunction)) {
                viewModel.terria.clock.onTick.removeEventListener(viewModel.orbitTickFunction);
            }

            viewModel.orbitMouseMoveFunction = undefined;
            viewModel.orbitMouseUpFunction = undefined;
            viewModel.orbitTickFunction = undefined;
        };

        document.addEventListener('mousemove', viewModel.orbitMouseMoveFunction, false);
        document.addEventListener('mouseup', viewModel.orbitMouseUpFunction, false);
        viewModel.terria.clock.onTick.addEventListener(viewModel.orbitTickFunction);

        updateAngleAndOpacity(cursorVector, compassElement.getBoundingClientRect().width);
    }

    function rotate(viewModel, compassElement, cursorVector) {
        // Remove existing event handlers, if any.
        document.removeEventListener('mousemove', viewModel.rotateMouseMoveFunction, false);
        document.removeEventListener('mouseup', viewModel.rotateMouseUpFunction, false);

        viewModel.rotateMouseMoveFunction = undefined;
        viewModel.rotateMouseUpFunction = undefined;

        viewModel.isRotating = true;
        viewModel.rotateInitialCursorAngle = Math.atan2(-cursorVector.y, cursorVector.x);

        var scene = viewModel.terria.scene;
        var camera = scene.camera;

        var windowPosition = windowPositionScratch;
        windowPosition.x = scene.canvas.clientWidth / 2;
        windowPosition.y = scene.canvas.clientHeight / 2;

        var viewCenter = camera.pickEllipsoid(windowPosition, scene.globe.ellipsoid, centerScratch);

        if (!defined(viewCenter)) {
            viewModel.rotateFrame = Transforms.eastNorthUpToFixedFrame(camera.positionWC, scene.globe.ellipsoid, newTransformScratch);
            viewModel.rotateIsLook = true;
        } else {
            viewModel.rotateFrame = Transforms.eastNorthUpToFixedFrame(viewCenter, scene.globe.ellipsoid, newTransformScratch);
            viewModel.rotateIsLook = false;
        }

        var oldTransform = Matrix4.clone(camera.transform, oldTransformScratch);
        camera.lookAtTransform(viewModel.rotateFrame);
        viewModel.rotateInitialCameraAngle = -camera.heading;
        viewModel.rotateInitialCameraDistance = Cartesian3.magnitude(new Cartesian3(camera.position.x, camera.position.y, 0.0));
        camera.lookAtTransform(oldTransform);

        viewModel.rotateMouseMoveFunction = function (e) {
            var compassRectangle = compassElement.getBoundingClientRect();
            var center = new Cartesian2((compassRectangle.right - compassRectangle.left) / 2.0, (compassRectangle.bottom - compassRectangle.top) / 2.0);
            var clickLocation = new Cartesian2(e.clientX - compassRectangle.left, e.clientY - compassRectangle.top);
            var vector = Cartesian2.subtract(clickLocation, center, vectorScratch);
            var angle = Math.atan2(-vector.y, vector.x);

            var angleDifference = angle - viewModel.rotateInitialCursorAngle;
            var newCameraAngle = CesiumMath.zeroToTwoPi(viewModel.rotateInitialCameraAngle - angleDifference);

            var camera = viewModel.terria.scene.camera;

            var oldTransform = Matrix4.clone(camera.transform, oldTransformScratch);
            camera.lookAtTransform(viewModel.rotateFrame);
            var currentCameraAngle = -camera.heading;
            camera.rotateRight(newCameraAngle - currentCameraAngle);
            camera.lookAtTransform(oldTransform);

            // viewModel.terria.cesium.notifyRepaintRequired();
        };

        viewModel.rotateMouseUpFunction = function (e) {
            viewModel.isRotating = false;
            document.removeEventListener('mousemove', viewModel.rotateMouseMoveFunction, false);
            document.removeEventListener('mouseup', viewModel.rotateMouseUpFunction, false);

            viewModel.rotateMouseMoveFunction = undefined;
            viewModel.rotateMouseUpFunction = undefined;
        };

        document.addEventListener('mousemove', viewModel.rotateMouseMoveFunction, false);
        document.addEventListener('mouseup', viewModel.rotateMouseUpFunction, false);
    }

    return NavigationViewModel;
});

/*global define*/
define('CesiumNavigation',[
    'Cesium/Core/defined',
    'Cesium/Core/defineProperties',
    'Cesium/Core/Event',
    'KnockoutES5',
    'ViewModels/NavigationViewModel'
], function (
    defined,
    defineProperties,
    CesiumEvent,
    Knockout,
    NavigationViewModel) {
    'use strict';

    /**
     * @alias CesiumNavigation
     * @constructor
     *
     * @param {CesiumWidget} cesiumWidget The CesiumWidget instance
     */
    var CesiumNavigation = function (cesiumWidget) {
        initialize.apply(this, arguments);

        this._onDestroyListeners = [];
    };


    CesiumNavigation.prototype.navigationViewModel = undefined;
    CesiumNavigation.prototype.navigationDiv = undefined;
    CesiumNavigation.prototype.distanceLegendDiv = undefined;
    CesiumNavigation.prototype.terria = undefined;
    CesiumNavigation.prototype.container = undefined;
    CesiumNavigation.prototype._onDestroyListeners = undefined;

    CesiumNavigation.prototype.destroy = function () {
        if (defined(this.navigationViewModel)) {
            this.navigationViewModel.destroy();
        }
        

        if (defined(this.navigationDiv)) {
            this.navigationDiv.parentNode.removeChild(this.navigationDiv);
        }
        delete this.navigationDiv;

        
        if (defined(this.container)) {
            this.container.parentNode.removeChild(this.container);
        }
        delete this.container;

        for (var i = 0; i < this._onDestroyListeners.length; i++) {
            this._onDestroyListeners[i]();
        }
    };

    CesiumNavigation.prototype.addOnDestroyListener = function (callback) {
        if (typeof callback === "function") {
            this._onDestroyListeners.push(callback);
        }
    };

    function initialize(cesiumWidget, options) {
        if (!defined(cesiumWidget)) {
            throw new DeveloperError('cesiumWidget is required.');
        }

        var container = document.createElement('div');
        container.className = 'cesium-widget-cesiumNavigationContainer';
        cesiumWidget.container.appendChild(container);

        this.terria = cesiumWidget;
        this.terria.afterWidgetChanged = new CesiumEvent();
        this.terria.beforeWidgetChanged = new CesiumEvent();
        this.container = container;
        this.navigationDiv = document.createElement('div');
        this.navigationDiv.setAttribute("id", "navigationDiv");



     

        container.appendChild(this.navigationDiv);
       



       

        // Create the navigation controls.
        this.navigationViewModel = NavigationViewModel.create({
            container: this.navigationDiv,
            terria: this.terria
        });
    }

    return CesiumNavigation;
});


define('dummy/require-less/less/dummy',[],function(){});
/**
 * Created by Larcius on 18.02.16.
 */
/*global define*/
define('viewerCesiumNavigationMixin',[
    'Cesium/Core/defined',
    'Cesium/Core/defineProperties',
    'Cesium/Core/DeveloperError',
    'CesiumNavigation',
    'dummy/require-less/less/dummy'
], function(
    defined,
    defineProperties,
    DeveloperError,
    CesiumNavigation) {
    'use strict';

    /**
     * A mixin which adds the Compass/Navigation widget to the Viewer widget.
     * Rather than being called directly, this function is normally passed as
     * a parameter to {@link Viewer#extend}, as shown in the example below.
     * @exports viewerCesiumNavigationMixin
     *
     * @param {Viewer} viewer The viewer instance.
     * @param {{}} options The options.
     *
     * @exception {DeveloperError} viewer is required.
     *
     * @demo {@link http://localhost:8080/index.html|run local server with examples}
     *
     * @example
     * var viewer = new Cesium.Viewer('cesiumContainer');
     * viewer.extend(viewerCesiumNavigationMixin);
     */
    function viewerCesiumNavigationMixin(viewer, options) {
        if (!defined(viewer)) {
            throw new DeveloperError('viewer is required.');
        }

        var cesiumNavigation = init(viewer.cesiumWidget, options);

        cesiumNavigation.addOnDestroyListener((function (viewer) {
            return function () {
                delete viewer.cesiumNavigation;
            };
        })(viewer));

        defineProperties(viewer, {
            cesiumNavigation: {
                configurable: true,
                get: function () {
                    return viewer.cesiumWidget.cesiumNavigation;
                }
            }
        });
    }

    /**
     *
     * @param {CesiumWidget} cesiumWidget The cesium widget instance.
     * @param {{}} options The options.
     */
    viewerCesiumNavigationMixin.mixinWidget = function (cesiumWidget, options) {
        return init.apply(undefined, arguments);
    };

    var init = function (cesiumWidget, options) {
        var cesiumNavigation = new CesiumNavigation(cesiumWidget, options);

        defineProperties(cesiumWidget, {
            cesiumNavigation: {
                configurable: true,
                get: function () {
                    return cesiumNavigation;
                }
            }
        });

        cesiumNavigation.addOnDestroyListener((function (cesiumWidget) {
            return function () {
                delete cesiumWidget.cesiumNavigation;
            };
        })(cesiumWidget));

        return cesiumNavigation;
    };

    return viewerCesiumNavigationMixin;
});

// actual code -->

    /*global define,require,self,Cesium*/
    define('KnockoutES5', function() { return Cesium["knockout"]; });
    define('Cesium/Core/defined', function() { return Cesium["defined"]; });
    define('Cesium/Core/defineProperties', function() { return Cesium["defineProperties"]; });
    define('Cesium/Core/defaultValue', function() { return Cesium["defaultValue"]; });
    define('Cesium/Core/Event', function() { return Cesium["Event"]; });
    define('Cesium/Widgets/getElement', function() { return Cesium["getElement"]; });
    define('Cesium/Widgets/SvgPathBindingHandler', function() { return Cesium["SvgPathBindingHandler"]; });
    define('Cesium/Core/DeveloperError', function() { return Cesium["DeveloperError"]; });
    define('Cesium/Core/EllipsoidGeodesic', function() { return Cesium["EllipsoidGeodesic"]; });
    define('Cesium/Core/Cartesian2', function() { return Cesium["Cartesian2"]; });
    define('Cesium/Core/getTimestamp', function() { return Cesium["getTimestamp"]; });
    define('Cesium/Core/EventHelper', function() { return Cesium["EventHelper"]; });
    define('Cesium/Core/Ray', function() { return Cesium["Ray"]; });
    define('Cesium/Core/IntersectionTests', function() { return Cesium["IntersectionTests"]; });
    define('Cesium/Core/Ellipsoid', function() { return Cesium["Ellipsoid"]; });
    define('Cesium/Core/Math', function() { return Cesium["Math"]; });
    define('Cesium/Core/Transforms', function() { return Cesium["Transforms"]; });
    define('Cesium/Scene/SceneMode', function() { return Cesium["SceneMode"]; });
    define('Cesium/Core/Cartesian3', function() { return Cesium["Cartesian3"]; });
    define('Cesium/Core/Matrix4', function() { return Cesium["Matrix4"]; });
    define('Cesium/Scene/Camera', function() { return Cesium["Camera"]; });
    
    return require('viewerCesiumNavigationMixin');
}));