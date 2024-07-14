# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Changelogs

### [0.1.6] - 2024-07-15

* Add demo link to README.mc

### [0.1.5] - 2024-07-15

* Add version to dashboard

### [0.1.4] - 2024-07-15

* Add the error message to missing data
* Add the type to InterfaceGeoJson
* Add the table overview of the generation of energy.
* Refactoring WorldMapSvg
  * move to src/lib/WorldMapSvg
  * Distribute many methods to BoundingBox, CoordinateConverter, DataConverter and GeometryChecker
  * Add GeoJson type @types/geojson to project
* Add copyrights to map
* Add the country map to the end of the chart list
* Add titles to all countries and cities
* Refactoring worldMapHelper
  * Add the first version of class WorldMapSvg
* Add world and country map as svg image
  * Available sizes: Tiny, Low and Medium
* Add the price range to 0, 5, 10, 15, 20

### [0.1.3] - 2024-07-07

* Change title of the app, favicons, manifest and license
* Optimize widths and position of input fields
* Possibility to summarize small producers by percentage share instead of absolute numbers
* Limit date selection to today and the past 
* Fix naming within countries

### [0.1.2] - 2024-07-07

* Add power production country selector
* Add day ahead price country selector
* Adding the geographical centers to the countries

### [0.1.1] - 2024-07-07

* Adding data sources and repository links
* Reducing the price font size for the price information in the BarCharts
* Fixed endless loop for the price request

### [0.1.0] - 2024-07-06

* First version
* Connection to the API https://energy-api.ixno.de/
* Date picker to allow selection of the day
* Add 4 charts
  * Day Ahead prices as BarChart incl. daily average, minimum, maximum and average price
  * Daily view of power generation as AreaChart incl. sunrise and sunset
    * threshold to summarize small producers
  * Daily average view of electricity generation
  * Current view of electricity generation

## Add new version

```bash
# → Either change patch version
$ vendor/bin/version-manager --patch

# → Or change minor version
$ vendor/bin/version-manager --minor

# → Or change major version
$ vendor/bin/version-manager --major

# → Usually version changes are set in the main or master branch
$ git checkout master && git pull

# → Edit your CHANGELOG.md file
$ vi CHANGELOG.md

# → Commit your changes to your repo
$ git add CHANGELOG.md VERSION .env && git commit -m "Add version $(cat VERSION)" && git push

# → Tag your version
$ git tag -a "$(cat VERSION)" -m "Version $(cat VERSION)" && git push origin "$(cat VERSION)"
```
