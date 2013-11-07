/**
* @preserve Copyright 2011 Moxie Group
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ 

/**
 * mobileDetectOrientationChange
 *
 * Handles detecting of device orientation change events, goal is to handle popular mobile OS/devices.
 *
 * Used to trigger events on landscape <-> portrait orientation changes.
 *
 *  Event               Event params                            Comment
 *  landscape           {landscape: true, portrait: false}      Device changed to landscape mode
 *  portrait            {landscape: false, portrait: true}      Device changed to portrait mode
 *  orientationchanged  {landscape: X, portrait: Y}             Device changed to orientation, fired after landscape/portrait event
 *
 *  helper functions
 *  $(window).isLandscape()             True if is landscape
 *  $(window).detectOrientationChange() Adds orientation detection to element
 *  $(window).testOrientation()         Manually trigger orientation detection, fires events on orientation even if it hasn't changed
 *                                       useful to trigger orientation logic on page load.
 *
 *  All functions ( except isLandscape() ) support chaining.
 *
 * Requires: jQuery
 * Author: Byron Heads
 * Date: 2013-11-07
 *
 */

/**
 * Example:
 *
 *  function showChartWide(event) { .. };
 *  function showChartSkinny(event) { .. };
 *
 *  // detect window orientation, show chart based on orientation.
 *  $(function() {
 *      $(window).detectOrientationChange().landscape(showChartWide).portrait(showChartSkinny).testOrientation();
 *  }):
 *
 *  // no need to test if in landscape/portrait on load, testOrientation will trigger the handlers for us!
 */

(function($) {
    var ORIENTATION = {LANDSCAPE: 1, PORTRAIT: 2};

    /**
     * Simple test to see if the device is in landscape mode
     * use !$(window).isLandscape() to test for portrait mode, or use events
     *
     * @returns {boolean} true if the orientation is landscape
     */
    $.fn.isLandscape = function() {
        var element = this[0];
        // Try to use orientation
        if(typeof(element.orientation) !== 'undefined') {
            // portrait mode == 0
            if(element.orientation != 0) {
                return true;
            }
            return false;
        } else {
            // Fall back to test window dimensions
            return element.innerWidth > element.innerHeight;
        }
    }

    /**
     * Trigger landscape events on self
     * @param self
     */
    function landscape(self) {
        self.trigger({ type: 'landscape', landscape: true, portrait: false });
        self.trigger({ type: 'orientationchanged', landscape: true, portrait: false });
    }

    /**
     * Trigger portrait events on self
     * @param self
     */
    function portrait(self) {
        self.trigger({ type: 'portrait', landscape: false, portrait: true });
        self.trigger({ type: 'orientationchanged', landscape: false, portrait: true });
    }

    /**
     * Set up orientation detection events
     *
     * @param idx - unused
     * @param element - element to add event listeners to
     */
    function init(/* unused */ idx, element) {
        var self = $(element);
        // track current orientation, to reduce event spamming
        var orientation = (self.isLandscape() ? ORIENTATION.LANDSCAPE : ORIENTATION.PORTRAIT );

        // test if onorientationchange is supported on this element
        if('onorientationchange' in element) {
            self.on('orientationchange', function() {
                if(element.orientation == 0 && orientation == ORIENTATION.LANDSCAPE) {
                    portrait(self);
                    orientation = ORIENTATION.PORTRAIT;
                } else if(element.orientation != 0 && orientation == ORIENTATION.PORTRAIT) {
                    landscape(self);
                    orientation = ORIENTATION.LANDSCAPE;
                }
            });

            // fall back to resize events, desktop and windows mobile IE do not have onorientationchange events
        } else if('onresize' in element) {
            self.on('resize', function() {
                if(window.innerWidth < window.innerHeight && orientation == ORIENTATION.LANDSCAPE) {
                    portrait(self);
                    orientation = ORIENTATION.PORTRAIT;
                } else if(window.innerWidth >= window.innerHeight && orientation == ORIENTATION.PORTRAIT) {
                    landscape(self);
                    orientation = ORIENTATION.LANDSCAPE;
                }
            });
        }
    };

    /**
     * One time check for orientation, good way to trigger events on document ready, after adding event listeners
     * @returns {*} chaining
     */
    $.fn.testOrientation = function() {
        var self = this;

        // Not testing for change here, just triggering landscape or not
        if(self.isLandscape()) {
            landscape(self);
        } else {
            portrait(self);
        }

        return self;
    }

    /**
     * Added event listeners for orientation events to given elements
     * @returns {*}
     */
    $.fn.detectOrientationChange = function() {
        $.each(this, init);
        return this;
    };

    // @Todo: add remove logic

    /**
     * All events pass landscape{bool} and portrait{bool} in the event object
     */

    /**
     * Listen for landscape events
     * @param fn - handler function
     * @returns {*} self chaining
     */
    $.fn.landscape = function(fn) {
        var self = this;
        self.on('landscape', fn);
        return self;
    };

    /**
     * Listen for portrait events
     * @param fn - handler function
     * @returns {*} self chaining
     */
    $.fn.portrait = function(fn) {
        var self = this;
        self.on('portrait', fn);
        return self;
    };

    /**
     * Listen for orientation change events, this fires after landscape or portrait
     * @param fn - handler function
     * @returns {*} self chaining
     */
    $.fn.orientationchanged = function(fn) {
        var self = this;
        self.on('orientationchanged', fn);
        return self;
    };
} (jQuery));