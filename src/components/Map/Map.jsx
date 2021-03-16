import React, { useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import PropTypes from "prop-types";
import styles from "./Map.module.scss";

const activeColor = am4core.color("#ff8726");
const recoveredColor = am4core.color("#45d21a");
const deathsColor = am4core.color("#1c5fe5");

const colors = {
  active: activeColor,
  recovered: recoveredColor,
  deaths: deathsColor,
};

am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);

function Map({ data, countryData }) {
  useEffect(() => {
    const map = am4core.create("map", am4maps.MapChart);
    map.geodata = am4geodata_worldLow;
    map.projection = new am4maps.projections.Miller();

    map.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.05;
    map.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color(
      "#ffffff"
    );
    map.backgroundSeries.hidden = true;

    const polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.exclude = ["AQ"];
    polygonSeries.useGeodata = true;
    polygonSeries.calculateVisualCenter = true;
    polygonSeries.nonScalingStroke = true;
    polygonSeries.strokeWidth = 0.5;

    const imageSeries = map.series.push(new am4maps.MapImageSeries());
    polygonSeries.events.on("validated", () => {
      imageSeries.invalidate();
    });

    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";

    if (Object.keys(countryData).length > 0) {
      imageSeries.data = countryData.countryData;
    }
    imageSeries.dataFields.value = "active";
    const imageSeriesTemplate = imageSeries.mapImages.template;
    imageSeriesTemplate.tooltipText = "{name}: {value}";

    imageSeriesTemplate.adapter.add("latitude", (latitude, target) => {
      const polygon = polygonSeries.getPolygonById(
        target.dataItem.dataContext.id
      );
      if (polygon) {
        return polygon.visualLatitude;
      }
      return latitude;
    });

    imageSeriesTemplate.adapter.add("longitude", (longitude, target) => {
      const polygon = polygonSeries.getPolygonById(
        target.dataItem.dataContext.id
      );
      if (polygon) {
        return polygon.visualLongitude;
      }
      return longitude;
    });

    const circle = imageSeriesTemplate.createChild(am4core.Circle);
    circle.fillOpacity = 0.7;
    circle.properties.fill = activeColor;

    imageSeries.heatRules.push({
      target: circle,
      property: "radius",
      min: 2,
      max: 15,
      dataField: "value",
    });

    const label = imageSeriesTemplate.createChild(am4core.Label);
    label.horizontalCenter = "middle";
    label.padding(0, 0, 0, 0);
    label.adapter.add("dy", (dy, target) => {
      const targetCircle = target.parent.children.getIndex(0);
      return targetCircle.pixelRadius;
    });

    const mapGlobeSwitch = map.createChild(am4core.SwitchButton);
    mapGlobeSwitch.align = "center";
    mapGlobeSwitch.leftLabel.text = "Map";
    mapGlobeSwitch.rightLabel.text = "Globe";
    mapGlobeSwitch.leftLabel.fill = am4core.color("#ffffff");
    mapGlobeSwitch.rightLabel.fill = am4core.color("#ffffff");

    mapGlobeSwitch.events.on("toggled", () => {
      if (mapGlobeSwitch.isActive) {
        map.projection = new am4maps.projections.Orthographic();
        map.backgroundSeries.show();
        map.panBehavior = "rotateLongLat";
        polygonSeries.exclude = [];
      } else {
        map.projection = new am4maps.projections.Miller();
        map.backgroundSeries.hide();
        map.panBehavior = "move";
        polygonSeries.data = [];
        polygonSeries.exclude = ["AQ"];
      }
    });

    const nameAndButtonsContainer = map.createChild(am4core.Container);
    nameAndButtonsContainer.width = am4core.percent(100);
    nameAndButtonsContainer.height = am4core.percent(100);
    nameAndButtonsContainer.padding(500, 10, 5, 20);
    nameAndButtonsContainer.layout = "horizontal";

    const buttonsContainer = nameAndButtonsContainer.createChild(
      am4core.Container
    );
    buttonsContainer.layout = "grid";
    buttonsContainer.width = am4core.percent(100);
    buttonsContainer.height = am4core.percent(100);
    buttonsContainer.x = 10;
    buttonsContainer.contentAlign = "center";

    function handleButtonClick(event) {
      changeDataType(event.target.dummyData);
    }

    function addButton(name, color) {
      const button = buttonsContainer.createChild(am4core.Button);
      button.label.valign = "middle";
      button.background.cornerRadius(30, 30, 30, 30);
      button.background.strokeOpacity = 0.3;
      button.background.fillOpacity = 0;
      button.background.stroke = "white";
      button.background.padding(2, 3, 2, 3);
      button.states.create("active");
      button.setStateOnChildren = true;

      if (Object.keys(data).length > 0) {
        const btnProps = name === "active" ? data.data.cases : data.data[name];
        button.label.text = `${name[0].toUpperCase()}${name.substr(
          1
        )} : ${btnProps}`;
      } else {
        button.label.text = `${name[0].toUpperCase()}${name.substr(1)} : ...`;
      }

      const activeHoverState = button.background.states.create("hoverActive");
      activeHoverState.properties.fillOpacity = 0;

      const btnCircle = new am4core.Circle();
      btnCircle.radius = 8;
      btnCircle.fillOpacity = 0.2;
      btnCircle.fill = colors[name];
      btnCircle.strokeOpacity = 0;
      btnCircle.valign = "middle";
      btnCircle.marginRight = 5;
      button.icon = btnCircle;

      button.dummyData = name;

      const circleActiveState = btnCircle.states.create("active");
      circleActiveState.properties.fill = color;
      circleActiveState.properties.fillOpacity = 0.5;

      button.events.on("hit", handleButtonClick);

      return button;
    }

    const activeButton = addButton("active", activeColor);
    const recoveredButton = addButton("recovered", recoveredColor);
    const deathsButton = addButton("deaths", deathsColor);

    const buttons = {
      active: activeButton,
      recovered: recoveredButton,
      deaths: deathsButton,
    };

    // change data type (active/recovered/deaths)
    function changeDataType(name) {
      const activeBtn = buttons[name];
      activeBtn.isActive = true;
      Object.keys(buttons).forEach((key) => {
        if (buttons[key] !== activeBtn) {
          buttons[key].isActive = false;
        }
      });

      imageSeries.dataFields.value = name;
      imageSeries.invalidateData();
      circle.properties.fill = colors[name];

      imageSeries.dataItems.each((dataItem) => {
        dataItem.setValue("value", dataItem.dataContext[name]);
      });
    }
  }, [data, countryData]);

  return <div id='map' className={styles.map} />;
}

Map.propTypes = {
  countryData: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
};

export default Map;
