import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import moment from 'moment';

import DateTimeModal from '../../../components/modal/DateTimeModal';
import * as Constant from '../../../constants/constant';

const ChartItem = (props) => {
  const [showCalModal, setShowCalModal] = useState(false);
  const options = {
    chart: {
      id: "area-datetime",
      type: "line",
      height: 350,
      zoom: {
        autoScaleYaxis: true,
      },
      animations: {
        initialAnimation: {
          enabled: false,
        },
      },
    },
    dataLabels: {
      enabled: false,
      style: {
        colors: ["#ddd"],
      },
    },
    title: {
      text: props?.title,
      align: "left",
    },
    xaxis: {
      type: "datetime",
      labels: {
        format: Constant.DATE_CHART_XAXIS_FORMAT,
      }
    },
    tooltip: {
      x: {
        format: Constant.DATE_CHART_TOOLTIP_FORMAT,
      },
    },
  };

  const series = [
    {
      data: props?.chartData,
    },
  ];

  const onChangeTripDates = (beginD, endD, startT, endT) => {
    props.setDate(moment(beginD).format("YYYY-MM-DD"), moment(endD).format("YYYY-MM-DD"));
  }

  return (
    <>
      <div className="d-flex justify-content-end gap-1">
        <button className="form-control" onClick={() => {props.setDate(moment().subtract(0, "days").format("YYYY-MM-DD"), moment().subtract(0, "days").format("YYYY-MM-DD"))}} style={{width: "unset"}}>Today</button>
        <button className="form-control" onClick={() => {props.setDate(moment().subtract(1, "days").format("YYYY-MM-DD"), moment().subtract(1, "days").format("YYYY-MM-DD"))}} style={{width: "unset"}}>Yesterday</button>
        <button className="form-control" onClick={() => {props.setDate(moment().subtract(7, "days").format("YYYY-MM-DD"), moment().subtract(0, "days").format("YYYY-MM-DD"))}} style={{width: "unset"}}>Last 7 Days</button>
        <button className="form-control" onClick={() => {props.setDate(moment().subtract(1, "months").format("YYYY-MM-DD"), moment().subtract(0, "days").format("YYYY-MM-DD"))}} style={{width: "unset"}}>Last Month</button>
        <button className="form-control" onClick={() => {setShowCalModal(true)}} style={{width: "unset"}}>Custom</button>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
      <DateTimeModal
        title="Select Dates"
        open={showCalModal}
        onClose={() => setShowCalModal(false)}
        fromMonth={false}
        onChange={onChangeTripDates}
      />
    </>
  );
};

export default ChartItem;
