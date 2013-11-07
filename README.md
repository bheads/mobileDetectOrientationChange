mobileDetectOrientationChange
=============================
Handles detecting of device orientation change events, goal is to handle popular mobile OS/devices.

Used to trigger events on landscape <-> portrait orientation changes.

Events:

|Event|Event params|Comment|
|-----|------------|-------|
|landscape|{landscape: true, portrait: false}|Device changed to landscape mode|
|portrait|{landscape: false, portrait: true}|Device changed to portrait mode|
|orientationchanged|{landscape: X, portrait: Y}|Device changed to orientation, fired after landscape/portrait event|

helper functions:

|function|Comment|
|--------|-------|
|$(window).isLandscape()|True if is landscape|
|$(window).detectOrientationChange()|Adds orientation detection to element|
|$(window).testOrientation()|Manually trigger orientation detection, fires events on orientation even if it hasn't changed|

All functions ( except isLandscape() ) support chaining.

Requires: jQuery

Example:

```javascript
function showChartWide(event) { .. };
function showChartSkinny(event) { .. };

// detect window orientation, show chart based on orientation.
$(function() {
    $(window).detectOrientationChange().landscape(showChartWide).portrait(showChartSkinny).testOrientation();
});

// no need to test if in landscape/portrait on load, testOrientation will trigger the handlers for us!
```
