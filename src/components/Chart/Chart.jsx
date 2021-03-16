import React, { useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import PropTypes from "prop-types";
import { colors } from "../../constants/constants";
import styles from "./Chart.module.scss";

am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);

export const activeColor = am4core.color(colors.orange);
export const recoveredColor = am4core.color(colors.green);
export const deathsColor = am4core.color(colors.blue);

const colorsChart = {
  active: activeColor,
  recovered: recoveredColor,
  deaths: deathsColor,
};

function Chart({ dailyData }) {
  useEffect(() => {
    const chart = am4core.create("chart", am4charts.XYChart);

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    chart.yAxes.push(new am4charts.ValueAxis());

    function createSeries(s, name) {
      const series = chart.series.push(new am4charts.LineSeries());
      if (Object.keys(dailyData).length > 0) {
        series.data = dailyData.dailyData;
      }

      series.dataFields.valueY = name;
      series.dataFields.dateX = "date";
      series.name = name;
      series.stroke = colorsChart[name];
      series.strokeWidth = 2;

      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.background.cornerRadius = 20;
      series.tooltip.background.fillOpacity = 0.5;
      series.tooltip.label.padding(12, 12, 12, 12);

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "panXY";
      chart.cursor.xAxis = dateAxis;
      chart.cursor.snapToSeries = series;

      chart.scrollbarY = new am4core.Scrollbar();
      chart.scrollbarY.parent = chart.leftAxesContainer;
      chart.scrollbarY.toBack();

      chart.scrollbarX = new am4charts.XYChartScrollbar();
      chart.scrollbarX.series.push(series);
      chart.scrollbarX.parent = chart.bottomAxesContainer;

      const segment = series.segments.template;
      segment.interactionsEnabled = true;

      const hoverState = segment.states.create("hover");
      hoverState.properties.strokeWidth = 3;

      const dimmed = segment.states.create("dimmed");
      dimmed.properties.stroke = am4core.color("#dadada");

      segment.events.on("over", (event) => {
        processOver(event.target.parent.parent.parent);
      });

      segment.events.on("out", (event) => {
        processOut(event.target.parent.parent.parent);
      });

      return series;
    }

    createSeries(0, "active");
    createSeries(1, "recovered");
    createSeries(2, "deaths");

    dateAxis.start = 0.79;
    dateAxis.keepSelection = true;

    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.legend.scrollable = true;
    chart.legend.itemContainers.template.events.on("over", (event) => {
      processOver(event.target.dataItem.dataContext);
    });

    chart.legend.itemContainers.template.events.on("out", (event) => {
      processOut(event.target.dataItem.dataContext);
    });

    function processOver(hoveredSeries) {
      hoveredSeries.toFront();

      hoveredSeries.segments.each((segment) => {
        segment.setState("hover");
      });

      chart.series.each((series) => {
        if (series !== hoveredSeries) {
          series.segments.each((segment) => {
            segment.setState("dimmed");
          });
          series.bulletsContainer.setState("dimmed");
        }
      });
    }

    function processOut() {
      chart.series.each((series) => {
        series.segments.each((segment) => {
          segment.setState("default");
        });
        series.bulletsContainer.setState("default");
      });
    }

    chart.scrollbarX = new am4core.Scrollbar();
  }, [dailyData]);

  return <div id='chart' className={styles.chart} />;
}

Chart.propTypes = {
  dailyData: PropTypes.string.isRequired,
};

export default Chart;
