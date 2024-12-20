/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import F from './FormatUtilities.js';
var format = F.format;
import H from './Globals.js';
var doc = H.doc;
import R from './Renderer/RendererUtilities.js';
var layerribute = R.layerribute;
import RendererRegistry from './Renderer/RendererRegistry.js';
import U from './Utilities.js';
var addEvent = U.addEvent, clamp = U.clamp, css = U.css, defined = U.defined, discardElement = U.discardElement, extend = U.extend, fireEvent = U.fireEvent, isArray = U.isArray, isNumber = U.isNumber, isString = U.isString, merge = U.merge, pick = U.pick, splat = U.splat, syncTimeout = U.syncTimeout;
/* *
 *
 *  Class
 *
 * */
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * Tooltip of a chart.
 *
 * @class
 * @name Highcharts.Tooltip
 *
 * @param {Highcharts.Chart} chart
 * The chart instance.
 *
 * @param {Highcharts.TooltipOptions} options
 * Tooltip options.
 */
var Tooltip = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function Tooltip(chart, options) {
        /* *
         *
         *  Properties
         *
         * */
        this.allowShared = true;
        this.container = void 0;
        this.crosshairs = [];
        this.layerance = 0;
        this.isHidden = true;
        this.isSticky = false;
        this.now = {};
        this.options = {};
        this.outside = false;
        this.chart = chart;
        this.init(chart, options);
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * In styled mode, apply the default filter for the tooltip drop-shadow. It
     * needs to have an id specific to the chart, otherwise there will be issues
     * when one tooltip adopts the filter of a different chart, specifically one
     * where the container is hidden.
     *
     * @private
     * @function Highcharts.Tooltip#applyFilter
     */
    Tooltip.prototype.applyFilter = function () {
        var chart = this.chart;
        chart.renderer.definition({
            tagName: 'filter',
            attributes: {
                id: 'drop-shadow-' + chart.index,
                opacity: 0.5
            },
            children: [{
                    tagName: 'feGaussianBlur',
                    attributes: {
                        'in': 'SourceAlpha',
                        stdDeviation: 1
                    }
                }, {
                    tagName: 'feOffset',
                    attributes: {
                        dx: 1,
                        dy: 1
                    }
                }, {
                    tagName: 'feComponentTransfer',
                    children: [{
                            tagName: 'feFuncA',
                            attributes: {
                                type: 'linear',
                                slope: 0.3
                            }
                        }]
                }, {
                    tagName: 'feMerge',
                    children: [{
                            tagName: 'feMergeNode'
                        }, {
                            tagName: 'feMergeNode',
                            attributes: {
                                'in': 'SourceGraphic'
                            }
                        }]
                }]
        });
    };
    /**
     * Build the body (lines) of the tooltip by iterating over the items and
     * returning one entry for each item, abstracting this functionality allows
     * to easily overwrite and extend it.
     *
     * @private
     * @function Highcharts.Tooltip#bodyFormatter
     */
    Tooltip.prototype.bodyFormatter = function (items) {
        return items.map(function (item) {
            var tooltipOptions = item.series.tooltipOptions;
            return (tooltipOptions[(item.point.formatPrefix || 'point') + 'Formatter'] ||
                item.point.tooltipFormatter).call(item.point, tooltipOptions[(item.point.formatPrefix || 'point') + 'Format'] || '');
        });
    };
    /**
     * Destroy the single tooltips in a split tooltip.
     * If the tooltip is active then it is not destroyed, unless forced to.
     *
     * @private
     * @function Highcharts.Tooltip#cleanSplit
     *
     * @param {boolean} [force]
     * Force destroy all tooltips.
     */
    Tooltip.prototype.cleanSplit = function (force) {
        this.chart.series.forEach(function (series) {
            var tt = series && series.tt;
            if (tt) {
                if (!tt.isActive || force) {
                    series.tt = tt.destroy();
                }
                else {
                    tt.isActive = false;
                }
            }
        });
    };
    /**
     * In case no user defined formatter is given, this will be used. Note that
     * the context here is an object holding point, series, x, y etc.
     *
     * @function Highcharts.Tooltip#defaultFormatter
     *
     * @param {Highcharts.Tooltip} tooltip
     *
     * @return {string|Array<string>}
     * Returns a string (single tooltip and shared)
     * or an array of strings (split tooltip)
     */
    Tooltip.prototype.defaultFormatter = function (tooltip) {
        var items = this.points || splat(this);
        var s;
        // Build the header
        s = [tooltip.tooltipFooterHeaderFormatter(items[0])];
        // build the values
        s = s.concat(tooltip.bodyFormatter(items));
        // footer
        s.push(tooltip.tooltipFooterHeaderFormatter(items[0], true));
        return s;
    };
    /**
     * Removes and destroys the tooltip and its elements.
     *
     * @function Highcharts.Tooltip#destroy
     */
    Tooltip.prototype.destroy = function () {
        // Destroy and clear local variables
        if (this.label) {
            this.label = this.label.destroy();
        }
        if (this.split && this.tt) {
            this.cleanSplit(true);
            this.tt = this.tt.destroy();
        }
        if (this.renderer) {
            this.renderer = this.renderer.destroy();
            discardElement(this.container);
        }
        U.clearTimeout(this.hideTimer);
        U.clearTimeout(this.tooltipTimeout);
    };
    /**
     * Extendable method to get the anchor position of the tooltip
     * from a point or set of points
     *
     * @private
     * @function Highcharts.Tooltip#getAnchor
     */
    Tooltip.prototype.getAnchor = function (points, mouseEvent) {
        var chart = this.chart, pointer = chart.pointer, inverted = chart.inverted, plotTop = chart.plotTop, plotLeft = chart.plotLeft;
        var ret, yAxis, xAxis, plotX = 0, plotY = 0;
        points = splat(points);
        // When tooltip follows mouse, relate the position to the mouse
        if (this.followPointer && mouseEvent) {
            if (typeof mouseEvent.chartX === 'undefined') {
                mouseEvent = pointer.normalize(mouseEvent);
            }
            ret = [
                mouseEvent.chartX - plotLeft,
                mouseEvent.chartY - plotTop
            ];
            // Some series types use a specificly calculated tooltip position for
            // each point
        }
        else if (points[0].tooltipPos) {
            ret = points[0].tooltipPos;
            // Calculate the average position and adjust for axis positions
        }
        else {
            points.forEach(function (point) {
                yAxis = point.series.yAxis;
                xAxis = point.series.xAxis;
                plotX += point.plotX || 0;
                plotY += (point.plotLow ?
                    (point.plotLow + (point.plotHigh || 0)) / 2 :
                    (point.plotY || 0));
                // Adjust position for positioned axes (top/left settings)
                if (xAxis && yAxis) {
                    if (!inverted) { // #1151
                        plotX += xAxis.pos - plotLeft;
                        plotY += yAxis.pos - plotTop;
                    }
                    else { // #14771
                        plotX += (plotTop + chart.plotHeight - xAxis.len - xAxis.pos);
                        plotY += (plotLeft + chart.plotWidth - yAxis.len - yAxis.pos);
                    }
                }
            });
            plotX /= points.length;
            plotY /= points.length;
            // Use the average position for multiple points
            ret = [
                inverted ? chart.plotWidth - plotY : plotX,
                inverted ? chart.plotHeight - plotX : plotY
            ];
            // When shared, place the tooltip next to the mouse (#424)
            if (this.shared && points.length > 1 && mouseEvent) {
                if (inverted) {
                    ret[0] = mouseEvent.chartX - plotLeft;
                }
                else {
                    ret[1] = mouseEvent.chartY - plotTop;
                }
            }
        }
        return ret.map(Math.round);
    };
    /**
     * Creates the Tooltip label element if it does not exist, then returns it.
     *
     * @function Highcharts.Tooltip#getLabel
     *
     * @return {Highcharts.SVGElement}
     * Tooltip label
     */
    Tooltip.prototype.getLabel = function () {
        var tooltip = this, styledMode = this.chart.styledMode, options = this.options, doSplit = this.split && this.allowShared, className = ('tooltip' + (defined(options.className) ?
            ' ' + options.className :
            '')), pointerEvents = (options.style.pointerEvents ||
            (this.shouldStickOnContact() ? 'auto' : 'none'));
        var container, renderer = this.chart.renderer;
        // If changing from a split tooltip to a non-split tooltip, we must
        // destroy it in order to get the SVG right. #13868.
        if (tooltip.label) {
            var wasSplit = !tooltip.label.hasClass('highcharts-label');
            if ((doSplit && !wasSplit) || (!doSplit && wasSplit)) {
                tooltip.destroy();
            }
        }
        if (!this.label) {
            if (this.outside) {
                var chartStyle = this.chart.options.chart.style, Renderer = RendererRegistry.getRendererType();
                /**
                 * Reference to the tooltip's container, when
                 * [Highcharts.Tooltip#outside] is set to true, otherwise
                 * it's undefined.
                 *
                 * @name Highcharts.Tooltip#container
                 * @type {Highcharts.HTMLDOMElement|undefined}
                 */
                this.container = container = H.doc.createElement('div');
                container.className = 'highcharts-tooltip-container';
                css(container, {
                    position: 'absolute',
                    top: '1px',
                    pointerEvents: pointerEvents,
                    zIndex: Math.max(this.options.style.zIndex || 0, (chartStyle && chartStyle.zIndex || 0) + 3)
                });
                H.doc.body.appendChild(container);
                /**
                 * Reference to the tooltip's renderer, when
                 * [Highcharts.Tooltip#outside] is set to true, otherwise
                 * it's undefined.
                 *
                 * @name Highcharts.Tooltip#renderer
                 * @type {Highcharts.SVGRenderer|undefined}
                 */
                this.renderer = renderer = new Renderer(container, 0, 0, chartStyle, void 0, void 0, renderer.styledMode);
            }
            // Create the label
            if (doSplit) {
                this.label = renderer.g(className);
            }
            else {
                this.label = renderer
                    .label('', 0, 0, options.shape, void 0, void 0, options.useHTML, void 0, className)
                    .attr({
                    padding: options.padding,
                    r: options.borderRadius
                });
                if (!styledMode) {
                    this.label
                        .attr({
                        fill: options.backgroundColor,
                        'stroke-width': options.borderWidth
                    })
                        // #2301, #2657
                        .css(options.style)
                        .css({ pointerEvents: pointerEvents })
                        .shadow(options.shadow);
                }
            }
            if (styledMode && options.shadow) {
                // Apply the drop-shadow filter
                this.applyFilter();
                this.label.attr({
                    filter: 'url(#drop-shadow-' + this.chart.index + ')'
                });
            }
            // Split tooltip use updateTooltipContainer to position the tooltip
            // container.
            if (tooltip.outside && !tooltip.split) {
                var label_1 = this.label;
                var xSetter_1 = label_1.xSetter, ySetter_1 = label_1.ySetter;
                label_1.xSetter = function (value) {
                    xSetter_1.call(label_1, tooltip.layerance);
                    container.style.left = value + 'px';
                };
                label_1.ySetter = function (value) {
                    ySetter_1.call(label_1, tooltip.layerance);
                    container.style.top = value + 'px';
                };
            }
            this.label
                .attr({ zIndex: 8 })
                .add();
        }
        return this.label;
    };
    /**
     * Place the tooltip in a chart without spilling over and not covering the
     * point itself.
     *
     * @function Highcharts.Tooltip#getPosition
     *
     * @param {number} boxWidth
     *        Width of the tooltip box.
     *
     * @param {number} boxHeight
     *        Height of the tooltip box.
     *
     * @param {Highcharts.Point} point
     *        Tooltip related point.
     *
     * @return {Highcharts.PositionObject}
     *         Recommended position of the tooltip.
     */
    Tooltip.prototype.getPosition = function (boxWidth, boxHeight, point) {
        var chart = this.chart, layerance = this.layerance, ret = {}, 
        // Don't use h if chart isn't inverted (#7242) ???
        h = (chart.inverted && point.h) || 0, // #4117 ???
        outside = this.outside, outerWidth = outside ?
            // substract layerance to prevent scrollbars
            doc.documentElement.clientWidth - 2 * layerance :
            chart.chartWidth, outerHeight = outside ?
            Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight, doc.body.offsetHeight, doc.documentElement.offsetHeight, doc.documentElement.clientHeight) :
            chart.chartHeight, chartPosition = chart.pointer.getChartPosition(), scaleX = function (val) { return ( // eslint-disable-line no-confusing-arrow
        val * chartPosition.scaleX); }, scaleY = function (val) { return ( // eslint-disable-line no-confusing-arrow
        val * chartPosition.scaleY); }, 
        // Build parameter arrays for firstDimension()/secondDimension()
        buildDimensionArray = function (dim) {
            var isX = dim === 'x';
            return [
                dim,
                isX ? outerWidth : outerHeight,
                isX ? boxWidth : boxHeight
            ].concat(outside ? [
                // If we are using tooltip.outside, we need to scale the
                // position to match scaling of the container in case there
                // is a transform/zoom on the container. #11329
                isX ? scaleX(boxWidth) : scaleY(boxHeight),
                isX ? chartPosition.left - layerance +
                    scaleX(point.plotX + chart.plotLeft) :
                    chartPosition.top - layerance +
                        scaleY(point.plotY + chart.plotTop),
                0,
                isX ? outerWidth : outerHeight
            ] : [
                // Not outside, no scaling is needed
                isX ? boxWidth : boxHeight,
                isX ? point.plotX + chart.plotLeft :
                    point.plotY + chart.plotTop,
                isX ? chart.plotLeft : chart.plotTop,
                isX ? chart.plotLeft + chart.plotWidth :
                    chart.plotTop + chart.plotHeight
            ]);
        };
        var first = buildDimensionArray('y'), second = buildDimensionArray('x'), swapped;
        // Handle negative points or reversed axis (#13780)
        var flipped = !!point.negative;
        if (!chart.polar &&
            chart.hoverSeries &&
            chart.hoverSeries.yAxis &&
            chart.hoverSeries.yAxis.reversed) {
            flipped = !flipped;
        }
        // The far side is right or bottom
        var preferFarSide = !this.followPointer &&
            pick(point.ttBelow, !chart.inverted === flipped), // #4984
        /*
         * Handle the preferred dimension. When the preferred dimension is
         * tooltip on top or bottom of the point, it will look for space
         * there.
         *
         * @private
         */
        firstDimension = function (dim, outerSize, innerSize, scaledInnerSize, // #11329
        point, min, max) {
            var scaledlayer = outside ?
                (dim === 'y' ? scaleY(layerance) : scaleX(layerance)) :
                layerance, scaleDiff = (innerSize - scaledInnerSize) / 2, roomLeft = scaledInnerSize < point - layerance, roomRight = point + layerance + scaledInnerSize < outerSize, alignedLeft = point - scaledlayer - innerSize + scaleDiff, alignedRight = point + scaledlayer - scaleDiff;
            if (preferFarSide && roomRight) {
                ret[dim] = alignedRight;
            }
            else if (!preferFarSide && roomLeft) {
                ret[dim] = alignedLeft;
            }
            else if (roomLeft) {
                ret[dim] = Math.min(max - scaledInnerSize, alignedLeft - h < 0 ? alignedLeft : alignedLeft - h);
            }
            else if (roomRight) {
                ret[dim] = Math.max(min, alignedRight + h + innerSize > outerSize ?
                    alignedRight :
                    alignedRight + h);
            }
            else {
                return false;
            }
        }, 
        /*
         * Handle the secondary dimension. If the preferred dimension is
         * tooltip on top or bottom of the point, the second dimension is to
         * align the tooltip above the point, trying to align center but
         * allowing left or right align within the chart box.
         *
         * @private
         */
        secondDimension = function (dim, outerSize, innerSize, scaledInnerSize, // #11329
        point) {
            var retVal;
            // Too close to the edge, return false and swap dimensions
            if (point < layerance || point > outerSize - layerance) {
                retVal = false;
                // Align left/top
            }
            else if (point < innerSize / 2) {
                ret[dim] = 1;
                // Align right/bottom
            }
            else if (point > outerSize - scaledInnerSize / 2) {
                ret[dim] = outerSize - scaledInnerSize - 2;
                // Align center
            }
            else {
                ret[dim] = point - innerSize / 2;
            }
            return retVal;
        }, 
        /*
         * Swap the dimensions
         */
        swap = function (count) {
            var temp = first;
            first = second;
            second = temp;
            swapped = count;
        }, run = function () {
            if (firstDimension.apply(0, first) !== false) {
                if (secondDimension.apply(0, second) === false &&
                    !swapped) {
                    swap(true);
                    run();
                }
            }
            else if (!swapped) {
                swap(true);
                run();
            }
            else {
                ret.x = ret.y = 0;
            }
        };
        // Under these conditions, prefer the tooltip on the side of the point
        if (chart.inverted || this.len > 1) {
            swap();
        }
        run();
        return ret;
    };
    /**
     * Hides the tooltip with a fade out animation.
     *
     * @function Highcharts.Tooltip#hide
     *
     * @param {number} [delay]
     *        The fade out in milliseconds. If no value is provided the value
     *        of the tooltip.hideDelay option is used. A value of 0 disables
     *        the fade out animation.
     */
    Tooltip.prototype.hide = function (delay) {
        var tooltip = this;
        // disallow duplicate timers (#1728, #1766)
        U.clearTimeout(this.hideTimer);
        delay = pick(delay, this.options.hideDelay);
        if (!this.isHidden) {
            this.hideTimer = syncTimeout(function () {
                // If there is a delay, do fadeOut with the default duration. If
                // the hideDelay is 0, we assume no animation is wanted, so we
                // pass 0 duration. #12994.
                tooltip.getLabel().fadeOut(delay ? void 0 : delay);
                tooltip.isHidden = true;
            }, delay);
        }
    };
    /**
     * @private
     * @function Highcharts.Tooltip#init
     *
     * @param {Highcharts.Chart} chart
     *        The chart instance.
     *
     * @param {Highcharts.TooltipOptions} options
     *        Tooltip options.
     */
    Tooltip.prototype.init = function (chart, options) {
        /**
         * Chart of the tooltip.
         *
         * @readonly
         * @name Highcharts.Tooltip#chart
         * @type {Highcharts.Chart}
         */
        this.chart = chart;
        /**
         * Used tooltip options.
         *
         * @readonly
         * @name Highcharts.Tooltip#options
         * @type {Highcharts.TooltipOptions}
         */
        this.options = options;
        /**
         * List of crosshairs.
         *
         * @private
         * @readonly
         * @name Highcharts.Tooltip#crosshairs
         * @type {Array<null>}
         */
        this.crosshairs = [];
        /**
         * Current values of x and y when animating.
         *
         * @private
         * @readonly
         * @name Highcharts.Tooltip#now
         * @type {Highcharts.PositionObject}
         */
        this.now = { x: 0, y: 0 };
        /**
         * Tooltips are initially hidden.
         *
         * @private
         * @readonly
         * @name Highcharts.Tooltip#isHidden
         * @type {boolean}
         */
        this.isHidden = true;
        /**
         * True, if the tooltip is split into one label per series, with the
         * header close to the axis.
         *
         * @readonly
         * @name Highcharts.Tooltip#split
         * @type {boolean|undefined}
         */
        this.split = options.split && !chart.inverted && !chart.polar;
        /**
         * When the tooltip is shared, the entire plot area will capture mouse
         * movement or touch events.
         *
         * @readonly
         * @name Highcharts.Tooltip#shared
         * @type {boolean|undefined}
         */
        this.shared = options.shared || this.split;
        /**
         * Whether to allow the tooltip to render outside the chart's SVG
         * element box. By default (false), the tooltip is rendered within the
         * chart's SVG element, which results in the tooltip being aligned
         * inside the chart area.
         *
         * @readonly
         * @name Highcharts.Tooltip#outside
         * @type {boolean}
         *
         * @todo
         * Split tooltip does not support outside in the first iteration. Should
         * not be too complicated to implement.
         */
        this.outside = pick(options.outside, Boolean(chart.scrollablePixelsX || chart.scrollablePixelsY));
    };
    Tooltip.prototype.shouldStickOnContact = function (pointerEvent) {
        return !!(!this.followPointer &&
            this.options.stickOnContact &&
            (!pointerEvent || this.chart.pointer.inClass(pointerEvent.target, 'highcharts-tooltip')));
    };
    /**
     * Moves the tooltip with a soft animation to a new position.
     *
     * @private
     * @function Highcharts.Tooltip#move
     *
     * @param {number} x
     *
     * @param {number} y
     *
     * @param {number} anchorX
     *
     * @param {number} anchorY
     */
    Tooltip.prototype.move = function (x, y, anchorX, anchorY) {
        var tooltip = this, now = tooltip.now, animate = tooltip.options.animation !== false &&
            !tooltip.isHidden &&
            // When we get close to the target position, abort animation and
            // land on the right place (#3056)
            (Math.abs(x - now.x) > 1 || Math.abs(y - now.y) > 1), skipAnchor = tooltip.followPointer || tooltip.len > 1;
        // Get intermediate values for animation
        extend(now, {
            x: animate ? (2 * now.x + x) / 3 : x,
            y: animate ? (now.y + y) / 2 : y,
            anchorX: skipAnchor ?
                void 0 :
                animate ? (2 * now.anchorX + anchorX) / 3 : anchorX,
            anchorY: skipAnchor ?
                void 0 :
                animate ? (now.anchorY + anchorY) / 2 : anchorY
        });
        // Move to the intermediate value
        tooltip.getLabel().attr(now);
        tooltip.drawTracker();
        // Run on next tick of the mouse tracker
        if (animate) {
            // Never allow two timeouts
            U.clearTimeout(this.tooltipTimeout);
            // Set the fixed interval ticking for the smooth tooltip
            this.tooltipTimeout = setTimeout(function () {
                // The interval function may still be running during destroy,
                // so check that the chart is really there before calling.
                if (tooltip) {
                    tooltip.move(x, y, anchorX, anchorY);
                }
            }, 32);
        }
    };
    /**
     * Refresh the tooltip's text and position.
     *
     * @function Highcharts.Tooltip#refresh
     *
     * @param {Highcharts.Point|Array<Highcharts.Point>} pointOrPoints
     *        Either a point or an array of points.
     *
     * @param {Highcharts.PointerEventObject} [mouseEvent]
     *        Mouse event, that is responsible for the refresh and should be
     *        used for the tooltip update.
     */
    Tooltip.prototype.refresh = function (pointOrPoints, mouseEvent) {
        var tooltip = this, chart = this.chart, options = tooltip.options, points = splat(pointOrPoints), point = points[0], pointConfig = [], formatter = options.formatter || tooltip.defaultFormatter, shared = tooltip.shared, styledMode = chart.styledMode;
        var textConfig = {};
        if (!options.enabled || !point.series) { // #16820
            return;
        }
        U.clearTimeout(this.hideTimer);
        // A switch saying if this specific tooltip configuration allows shared
        // or split modes
        tooltip.allowShared = !(!isArray(pointOrPoints) &&
            pointOrPoints.series &&
            pointOrPoints.series.noSharedTooltip);
        // get the reference point coordinates (pie charts use tooltipPos)
        tooltip.followPointer = (!tooltip.split && point.series.tooltipOptions.followPointer);
        var anchor = tooltip.getAnchor(pointOrPoints, mouseEvent), x = anchor[0], y = anchor[1];
        // shared tooltip, array is sent over
        if (shared && tooltip.allowShared) {
            chart.pointer.applyInactiveState(points);
            // Now set hover state for the choosen ones:
            points.forEach(function (item) {
                item.setState('hover');
                pointConfig.push(item.getLabelConfig());
            });
            textConfig = {
                x: point.category,
                y: point.y
            };
            textConfig.points = pointConfig;
            // single point tooltip
        }
        else {
            textConfig = point.getLabelConfig();
        }
        this.len = pointConfig.length; // #6128
        var text = formatter.call(textConfig, tooltip);
        // register the current series
        var currentSeries = point.series;
        this.layerance = pick(currentSeries.tooltipOptions.layerance, 16);
        // update the inner HTML
        if (text === false) {
            this.hide();
        }
        else {
            // update text
            if (tooltip.split && tooltip.allowShared) { // #13868
                this.renderSplit(text, points);
            }
            else {
                var checkX_1 = x;
                var checkY_1 = y;
                if (mouseEvent && chart.pointer.isDirectTouch) {
                    checkX_1 = mouseEvent.chartX - chart.plotLeft;
                    checkY_1 = mouseEvent.chartY - chart.plotTop;
                }
                // #11493, #13095
                if (chart.polar ||
                    currentSeries.options.clip === false ||
                    points.some(function (p) {
                        return p.series.shouldShowTooltip(checkX_1, checkY_1);
                    })) {
                    var label = tooltip.getLabel();
                    // Prevent the tooltip from flowing over the chart box
                    // (#6659)
                    if (!options.style.width || styledMode) {
                        label.css({
                            width: this.chart.spacingBox.width + 'px'
                        });
                    }
                    label.attr({
                        text: text && text.join ?
                            text.join('') :
                            text
                    });
                    // Set the stroke color of the box to reflect the point
                    label.removeClass(/highcharts-color-[\d]+/g)
                        .addClass('highcharts-color-' +
                        pick(point.colorIndex, currentSeries.colorIndex));
                    if (!styledMode) {
                        label.attr({
                            stroke: (options.borderColor ||
                                point.color ||
                                currentSeries.color ||
                                "#666666" /* Palette.neutralColor60 */)
                        });
                    }
                    tooltip.updatePosition({
                        plotX: x,
                        plotY: y,
                        negative: point.negative,
                        ttBelow: point.ttBelow,
                        h: anchor[2] || 0
                    });
                }
                else {
                    tooltip.hide();
                    return;
                }
            }
            // show it
            if (tooltip.isHidden && tooltip.label) {
                tooltip.label.attr({
                    opacity: 1
                }).show();
            }
            tooltip.isHidden = false;
        }
        fireEvent(this, 'refresh');
    };
    /**
     * Render the split tooltip. Loops over each point's text and adds
     * a label next to the point, then uses the layerribute function to
     * find best non-overlapping positions.
     *
     * @private
     * @function Highcharts.Tooltip#renderSplit
     *
     * @param {string|Array<(boolean|string)>} labels
     *
     * @param {Array<Highcharts.Point>} points
     */
    Tooltip.prototype.renderSplit = function (labels, points) {
        var tooltip = this;
        var chart = tooltip.chart, _a = tooltip.chart, chartWidth = _a.chartWidth, chartHeight = _a.chartHeight, plotHeight = _a.plotHeight, plotLeft = _a.plotLeft, plotTop = _a.plotTop, pointer = _a.pointer, _b = _a.scrollablePixelsY, scrollablePixelsY = _b === void 0 ? 0 : _b, scrollablePixelsX = _a.scrollablePixelsX, _c = _a.scrollingContainer, _d = _c === void 0 ? { scrollLeft: 0, scrollTop: 0 } : _c, scrollLeft = _d.scrollLeft, scrollTop = _d.scrollTop, styledMode = _a.styledMode, layerance = tooltip.layerance, options = tooltip.options, positioner = tooltip.options.positioner;
        // The area which the tooltip should be limited to. Limit to scrollable
        // plot area if enabled, otherwise limit to the chart container. If
        // outside is true it should be the whole viewport
        var bounds = (tooltip.outside &&
            typeof scrollablePixelsX !== 'number') ?
            doc.documentElement.getBoundingClientRect() : {
            left: scrollLeft,
            right: scrollLeft + chartWidth,
            top: scrollTop,
            bottom: scrollTop + chartHeight
        };
        var tooltipLabel = tooltip.getLabel();
        var ren = this.renderer || chart.renderer;
        var headerTop = Boolean(chart.xAxis[0] && chart.xAxis[0].opposite);
        var _e = pointer.getChartPosition(), chartLeft = _e.left, chartTop = _e.top;
        var layerributionBoxTop = plotTop + scrollTop;
        var headerHeight = 0;
        var adjustedPlotHeight = plotHeight - scrollablePixelsY;
        /**
         * Calculates the anchor position for the partial tooltip
         *
         * @private
         * @param {Highcharts.Point} point The point related to the tooltip
         * @return {Object} Returns an object with anchorX and anchorY
         */
        function getAnchor(point) {
            var isHeader = point.isHeader, _a = point.plotX, plotX = _a === void 0 ? 0 : _a, _b = point.plotY, plotY = _b === void 0 ? 0 : _b, series = point.series;
            var anchorX;
            var anchorY;
            if (isHeader) {
                // Set anchorX to plotX
                anchorX = plotLeft + plotX;
                // Set anchorY to center of visible plot area.
                anchorY = plotTop + plotHeight / 2;
            }
            else {
                var xAxis = series.xAxis, yAxis = series.yAxis;
                // Set anchorX to plotX. Limit to within xAxis.
                anchorX = xAxis.pos + clamp(plotX, -layerance, xAxis.len + layerance);
                // Set anchorY, limit to the scrollable plot area
                if (series.shouldShowTooltip(0, yAxis.pos - plotTop + plotY, {
                    ignoreX: true
                })) {
                    anchorY = yAxis.pos + plotY;
                }
            }
            // Limit values to plot area
            anchorX = clamp(anchorX, bounds.left - layerance, bounds.right + layerance);
            return { anchorX: anchorX, anchorY: anchorY };
        }
        /**
         * Calculates the position of the partial tooltip
         *
         * @private
         * @param {number} anchorX
         * The partial tooltip anchor x position
         *
         * @param {number} anchorY
         * The partial tooltip anchor y position
         *
         * @param {boolean|undefined} isHeader
         * Whether the partial tooltip is a header
         *
         * @param {number} boxWidth
         * Width of the partial tooltip
         *
         * @return {Highcharts.PositionObject}
         * Returns the partial tooltip x and y position
         */
        function defaultPositioner(anchorX, anchorY, isHeader, boxWidth, alignedLeft) {
            if (alignedLeft === void 0) { alignedLeft = true; }
            var y;
            var x;
            if (isHeader) {
                y = headerTop ? 0 : adjustedPlotHeight;
                x = clamp(anchorX - (boxWidth / 2), bounds.left, bounds.right - boxWidth - (tooltip.outside ? chartLeft : 0));
            }
            else {
                y = anchorY - layerributionBoxTop;
                x = alignedLeft ?
                    anchorX - boxWidth - layerance :
                    anchorX + layerance;
                x = clamp(x, alignedLeft ? x : bounds.left, bounds.right);
            }
            // NOTE: y is relative to layerributionBoxTop
            return { x: x, y: y };
        }
        /**
         * Updates the attributes and styling of the partial tooltip. Creates a
         * new partial tooltip if it does not exists.
         *
         * @private
         * @param {Highcharts.SVGElement|undefined} partialTooltip
         *  The partial tooltip to update
         * @param {Highcharts.Point} point
         *  The point related to the partial tooltip
         * @param {boolean|string} str The text for the partial tooltip
         * @return {Highcharts.SVGElement} Returns the updated partial tooltip
         */
        function updatePartialTooltip(partialTooltip, point, str) {
            var tt = partialTooltip;
            var isHeader = point.isHeader, series = point.series;
            var colorClass = 'highcharts-color-' + pick(point.colorIndex, series.colorIndex, 'none');
            if (!tt) {
                var attribs = {
                    padding: options.padding,
                    r: options.borderRadius
                };
                if (!styledMode) {
                    attribs.fill = options.backgroundColor;
                    attribs['stroke-width'] = options.borderWidth;
                }
                tt = ren
                    .label('', 0, 0, (options[isHeader ? 'headerShape' : 'shape']), void 0, void 0, options.useHTML)
                    .addClass((isHeader ? 'highcharts-tooltip-header ' : '') +
                    'highcharts-tooltip-box ' +
                    colorClass)
                    .attr(attribs)
                    .add(tooltipLabel);
            }
            tt.isActive = true;
            tt.attr({
                text: str
            });
            if (!styledMode) {
                tt.css(options.style)
                    .shadow(options.shadow)
                    .attr({
                    stroke: (options.borderColor ||
                        point.color ||
                        series.color ||
                        "#333333" /* Palette.neutralColor80 */)
                });
            }
            return tt;
        }
        // Graceful degradation for legacy formatters
        if (isString(labels)) {
            labels = [false, labels];
        }
        // Create the individual labels for header and points, ignore footer
        var boxes = labels.slice(0, points.length + 1).reduce(function (boxes, str, i) {
            if (str !== false && str !== '') {
                var point = (points[i - 1] ||
                    {
                        // Item 0 is the header. Instead of this, we could also
                        // use the crosshair label
                        isHeader: true,
                        plotX: points[0].plotX,
                        plotY: plotHeight,
                        series: {}
                    });
                var isHeader = point.isHeader;
                // Store the tooltip label referance on the series
                var owner = isHeader ? tooltip : point.series;
                var tt = owner.tt = updatePartialTooltip(owner.tt, point, str.toString());
                // Get X position now, so we can move all to the other side in
                // case of overflow
                var bBox = tt.getBBox();
                var boxWidth = bBox.width + tt.strokeWidth();
                if (isHeader) {
                    headerHeight = bBox.height;
                    adjustedPlotHeight += headerHeight;
                    if (headerTop) {
                        layerributionBoxTop -= headerHeight;
                    }
                }
                var _a = getAnchor(point), anchorX = _a.anchorX, anchorY = _a.anchorY;
                if (typeof anchorY === 'number') {
                    var size = bBox.height + 1;
                    var boxPosition = (positioner ?
                        positioner.call(tooltip, boxWidth, size, point) :
                        defaultPositioner(anchorX, anchorY, isHeader, boxWidth));
                    boxes.push({
                        // 0-align to the top, 1-align to the bottom
                        align: positioner ? 0 : void 0,
                        anchorX: anchorX,
                        anchorY: anchorY,
                        boxWidth: boxWidth,
                        point: point,
                        rank: pick(boxPosition.rank, isHeader ? 1 : 0),
                        size: size,
                        target: boxPosition.y,
                        tt: tt,
                        x: boxPosition.x
                    });
                }
                else {
                    // Hide tooltips which anchorY is outside the visible plot
                    // area
                    tt.isActive = false;
                }
            }
            return boxes;
        }, []);
        // Realign the tooltips towards the right if there is not enough space
        // to the left and there is space to to the right
        if (!positioner && boxes.some(function (box) {
            // Always realign if the beginning of a label is outside bounds
            var outside = tooltip.outside;
            var boxStart = (outside ? chartLeft : 0) + box.anchorX;
            if (boxStart < bounds.left &&
                boxStart + box.boxWidth < bounds.right) {
                return true;
            }
            // Otherwise, check if there is more space available to the right
            return boxStart < (chartLeft - bounds.left) + box.boxWidth &&
                bounds.right - boxStart > boxStart;
        })) {
            boxes = boxes.map(function (box) {
                var _a = defaultPositioner(box.anchorX, box.anchorY, box.point.isHeader, box.boxWidth, false), x = _a.x, y = _a.y;
                return extend(box, {
                    target: y,
                    x: x
                });
            });
        }
        // Clean previous run (for missing points)
        tooltip.cleanSplit();
        // layerribute and put in place
        layerribute(boxes, adjustedPlotHeight);
        var boxExtremes = {
            left: chartLeft,
            right: chartLeft
        };
        // Get the extremes from series tooltips
        boxes.forEach(function (box) {
            var x = box.x, boxWidth = box.boxWidth, isHeader = box.isHeader;
            if (!isHeader) {
                if (tooltip.outside && chartLeft + x < boxExtremes.left) {
                    boxExtremes.left = chartLeft + x;
                }
                if (!isHeader &&
                    tooltip.outside &&
                    boxExtremes.left + boxWidth > boxExtremes.right) {
                    boxExtremes.right = chartLeft + x;
                }
            }
        });
        boxes.forEach(function (box) {
            var x = box.x, anchorX = box.anchorX, anchorY = box.anchorY, pos = box.pos, isHeader = box.point.isHeader;
            var attributes = {
                visibility: typeof pos === 'undefined' ? 'hidden' : 'inherit',
                x: x,
                /* NOTE: y should equal pos to be consistent with !split
                 * tooltip, but is currently relative to plotTop. Is left as is
                 * to avoid breaking change. Remove layerributionBoxTop to make
                 * it consistent.
                 */
                y: pos + layerributionBoxTop,
                anchorX: anchorX,
                anchorY: anchorY
            };
            // Handle left-aligned tooltips overflowing the chart area
            if (tooltip.outside && x < anchorX) {
                var offset = chartLeft - boxExtremes.left;
                // Skip this if there is no overflow
                if (offset > 0) {
                    if (!isHeader) {
                        attributes.x = x + offset;
                        attributes.anchorX = anchorX + offset;
                    }
                    if (isHeader) {
                        attributes.x = (boxExtremes.right - boxExtremes.left) / 2;
                        attributes.anchorX = anchorX + offset;
                    }
                }
            }
            // Put the label in place
            box.tt.attr(attributes);
        });
        /* If we have a seperate tooltip container, then update the necessary
         * container properties.
         * Test that tooltip has its own container and renderer before executing
         * the operation.
         */
        var container = tooltip.container, outside = tooltip.outside, renderer = tooltip.renderer;
        if (outside && container && renderer) {
            // Set container size to fit the bounds
            var _f = tooltipLabel.getBBox(), width = _f.width, height = _f.height, x = _f.x, y = _f.y;
            renderer.setSize(width + x, height + y, false);
            // Position the tooltip container to the chart container
            container.style.left = boxExtremes.left + 'px';
            container.style.top = chartTop + 'px';
        }
    };
    /**
     * If the `stickOnContact` option is active, this will add a tracker shape.
     *
     * @private
     * @function Highcharts.Tooltip#drawTracker
     */
    Tooltip.prototype.drawTracker = function () {
        var tooltip = this;
        if (!this.shouldStickOnContact()) {
            if (tooltip.tracker) {
                tooltip.tracker.destroy();
            }
            return;
        }
        var chart = tooltip.chart;
        var label = tooltip.label;
        var points = tooltip.shared ? chart.hoverPoints : chart.hoverPoint;
        if (!label || !points) {
            return;
        }
        var box = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        // Combine anchor and tooltip
        var anchorPos = this.getAnchor(points);
        var labelBBox = label.getBBox();
        anchorPos[0] += chart.plotLeft - label.translateX;
        anchorPos[1] += chart.plotTop - label.translateY;
        // When the mouse pointer is between the anchor point and the label,
        // the label should stick.
        box.x = Math.min(0, anchorPos[0]);
        box.y = Math.min(0, anchorPos[1]);
        box.width = (anchorPos[0] < 0 ?
            Math.max(Math.abs(anchorPos[0]), (labelBBox.width - anchorPos[0])) :
            Math.max(Math.abs(anchorPos[0]), labelBBox.width));
        box.height = (anchorPos[1] < 0 ?
            Math.max(Math.abs(anchorPos[1]), (labelBBox.height - Math.abs(anchorPos[1]))) :
            Math.max(Math.abs(anchorPos[1]), labelBBox.height));
        if (tooltip.tracker) {
            tooltip.tracker.attr(box);
        }
        else {
            tooltip.tracker = label.renderer
                .rect(box)
                .addClass('highcharts-tracker')
                .add(label);
            if (!chart.styledMode) {
                tooltip.tracker.attr({
                    fill: 'rgba(0,0,0,0)'
                });
            }
        }
    };
    /**
     * @private
     */
    Tooltip.prototype.styledModeFormat = function (formatString) {
        return formatString
            .replace('style="font-size: 10px"', 'class="highcharts-header"')
            .replace(/style="color:{(point|series)\.color}"/g, 'class="highcharts-color-{$1.colorIndex}"');
    };
    /**
     * Format the footer/header of the tooltip
     * #3397: abstraction to enable formatting of footer and header
     *
     * @private
     * @function Highcharts.Tooltip#tooltipFooterHeaderFormatter
     */
    Tooltip.prototype.tooltipFooterHeaderFormatter = function (labelConfig, isFooter) {
        var series = labelConfig.series, tooltipOptions = series.tooltipOptions, xAxis = series.xAxis, dateTime = xAxis && xAxis.dateTime, e = {
            isFooter: isFooter,
            labelConfig: labelConfig
        };
        var xDateFormat = tooltipOptions.xDateFormat, formatString = tooltipOptions[isFooter ? 'footerFormat' : 'headerFormat'];
        fireEvent(this, 'headerFormatter', e, function (e) {
            // Guess the best date format based on the closest point layerance
            // (#568, #3418)
            if (dateTime && !xDateFormat && isNumber(labelConfig.key)) {
                xDateFormat = dateTime.getXDateFormat(labelConfig.key, tooltipOptions.dateTimeLabelFormats);
            }
            // Insert the footer date format if any
            if (dateTime && xDateFormat) {
                ((labelConfig.point && labelConfig.point.tooltipDateKeys) ||
                    ['key']).forEach(function (key) {
                    formatString = formatString.replace('{point.' + key + '}', '{point.' + key + ':' + xDateFormat + '}');
                });
            }
            // Replace default header style with class name
            if (series.chart.styledMode) {
                formatString = this.styledModeFormat(formatString);
            }
            e.text = format(formatString, {
                point: labelConfig,
                series: series
            }, this.chart);
        });
        return e.text;
    };
    /**
     * Updates the tooltip with the provided tooltip options.
     *
     * @function Highcharts.Tooltip#update
     *
     * @param {Highcharts.TooltipOptions} options
     *        The tooltip options to update.
     */
    Tooltip.prototype.update = function (options) {
        this.destroy();
        // Update user options (#6218)
        merge(true, this.chart.options.tooltip.userOptions, options);
        this.init(this.chart, merge(true, this.options, options));
    };
    /**
     * Find the new position and perform the move
     *
     * @private
     * @function Highcharts.Tooltip#updatePosition
     *
     * @param {Highcharts.Point} point
     */
    Tooltip.prototype.updatePosition = function (point) {
        var chart = this.chart, options = this.options, pointer = chart.pointer, label = this.getLabel(), 
        // Needed for outside: true (#11688)
        chartPosition = pointer.getChartPosition(), pos = (options.positioner || this.getPosition).call(this, label.width, label.height, point);
        var anchorX = point.plotX + chart.plotLeft, anchorY = point.plotY + chart.plotTop, pad;
        // Set the renderer size dynamically to prevent document size to change
        if (this.outside) {
            pad = options.borderWidth + 2 * this.layerance;
            this.renderer.setSize(label.width + pad, label.height + pad, false);
            // Anchor and tooltip container need scaling if chart container has
            // scale transform/css zoom. #11329.
            if (chartPosition.scaleX !== 1 || chartPosition.scaleY !== 1) {
                css(this.container, {
                    transform: "scale(".concat(chartPosition.scaleX, ", ").concat(chartPosition.scaleY, ")")
                });
                anchorX *= chartPosition.scaleX;
                anchorY *= chartPosition.scaleY;
            }
            anchorX += chartPosition.left - pos.x;
            anchorY += chartPosition.top - pos.y;
        }
        // do the move
        this.move(Math.round(pos.x), Math.round(pos.y || 0), // can be undefined (#3977)
        anchorX, anchorY);
    };
    return Tooltip;
}());
/* *
 *
 *  Default export
 *
 * */
export default Tooltip;
/* *
 *
 *  API Declarations
 *
 * */
/**
 * Callback function to format the text of the tooltip from scratch.
 *
 * In case of single or shared tooltips, a string should be be returned. In case
 * of splitted tooltips, it should return an array where the first item is the
 * header, and subsequent items are mapped to the points. Return `false` to
 * disable tooltip for a specific point on series.
 *
 * @callback Highcharts.TooltipFormatterCallbackFunction
 *
 * @param {Highcharts.TooltipFormatterContextObject} this
 * Context to format
 *
 * @param {Highcharts.Tooltip} tooltip
 * The tooltip instance
 *
 * @return {false|string|Array<(string|null|undefined)>|null|undefined}
 * Formatted text or false
 */
/**
 * Configuration for the tooltip formatters.
 *
 * @interface Highcharts.TooltipFormatterContextObject
 * @extends Highcharts.PointLabelObject
 */ /**
* Array of points in shared tooltips.
* @name Highcharts.TooltipFormatterContextObject#points
* @type {Array<Highcharts.TooltipFormatterContextObject>|undefined}
*/
/**
 * A callback function to place the tooltip in a specific position.
 *
 * @callback Highcharts.TooltipPositionerCallbackFunction
 *
 * @param {Highcharts.Tooltip} this
 * Tooltip context of the callback.
 *
 * @param {number} labelWidth
 * Width of the tooltip.
 *
 * @param {number} labelHeight
 * Height of the tooltip.
 *
 * @param {Highcharts.TooltipPositionerPointObject} point
 * Point information for positioning a tooltip.
 *
 * @return {Highcharts.PositionObject}
 * New position for the tooltip.
 */
/**
 * Point information for positioning a tooltip.
 *
 * @interface Highcharts.TooltipPositionerPointObject
 * @extends Highcharts.Point
 */ /**
* If `tooltip.split` option is enabled and positioner is called for each of the
* boxes separately, this property indicates the call on the xAxis header, which
* is not a point itself.
* @name Highcharts.TooltipPositionerPointObject#isHeader
* @type {boolean}
*/ /**
* The reference point relative to the plot area. Add chart.plotLeft to get the
* full coordinates.
* @name Highcharts.TooltipPositionerPointObject#plotX
* @type {number}
*/ /**
* The reference point relative to the plot area. Add chart.plotTop to get the
* full coordinates.
* @name Highcharts.TooltipPositionerPointObject#plotY
* @type {number}
*/
/**
 * @typedef {"callout"|"circle"|"square"} Highcharts.TooltipShapeValue
 */
''; // keeps doclets above in JS file
