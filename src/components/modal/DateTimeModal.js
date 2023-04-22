import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Modal } from 'react-responsive-modal';
import Helmet from 'react-helmet';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import * as Color from '../../constants/color';
import * as Constant from '../../constants/constant';

const DateTimeModal = (props) => {
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [beginDate, setBeginDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [modifiers, setModifiers] = useState({});
  const [dayOffset, setDayOffset] = useState(0);

  useEffect(() => {
    setOpen(props.open);
    if (props.open) {
      if (!!props.beginDate) {
        setBeginDate(props.beginDate.toDate());
      }
      if (!!props.endDate) {
        setEndDate(props.endDate.toDate());
      }
      setStartTime(props.startTime);
      setEndTime(props.endTime);
    }
  }, [props.open, props.beginDate, props.endDate, props.startTime, props.endTime]);

  useEffect(() => {
    setModifiers({
      start: beginDate,
      end: endDate,
      sunday: { daysOfWeek: [0] },
    });
    const offset = (!!beginDate && !!endDate) ? moment(endDate).diff(moment(beginDate), 'days') + 1 : 0;
    setDayOffset(offset);
  }, [beginDate, endDate]);

  const onCloseModal = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  const onSave = () => {
    if (props.onChange) {
      props.onChange(beginDate, endDate, startTime, endTime);
    }
    onCloseModal();
  }

  const timeString = (time) => {
    const AmOrPm = Math.floor(time) >= 12 ? 'PM' : 'AM';
    const hours = Math.floor(time) % 12 || 12;
    return hours + ':00 ' + AmOrPm;
  }

  const handleDayClick = (day) => {
    const range = DateUtils.addDayToRange(day, { from: beginDate, to: endDate });
    setBeginDate(range.from);
    setEndDate(range.to);
  }

  const renderPeriod = () => {
    const begin = beginDate ? moment(beginDate).format(Constant.DATE_FORMAT) : 'Not selected';
    const end = endDate ? moment(endDate).format(Constant.DATE_FORMAT) : 'Not selected';
    
    return (
      <div className="d-flex align-items-center justify-content-evenly">
        <div>
          <div className="fw-500 fs-1p0 cod-gray">Departure</div>
          <div className="fw-600 fs-1p125 gray-36">{begin}</div>
          <div className="fw-400 fs-1p0 gary-36">{timeString(startTime)}</div>
        </div>
        <div>
          <span className="fw-600 fs-1p125 cod-gray px-4 py-2"
            style={{ backgroundColor: "#ffc29e", borderRadius: "4px" }}
          >{dayOffset} days</span>
        </div>
        <div>
          <div className="fw-500 fs-1p0 cod-gray">Return</div>
          <div className="fw-600 fs-1p125 gray-36">{end}</div>
          <div className="fw-400 fs-1p0 gary-36">{timeString(endTime)}</div>
        </div>
      </div>
    );
  }

  const renderTimeSlider = () => {
    return (
      <div className="mb-4 px-3">
        <div className="d-flex align-items-center justify-content-center">
          <span className="fw-400 fs-1p0 cod-gray">Start:</span>
          <span className="fw-400 fs-1p0 color-primary ms-2">{timeString(startTime)}</span>
        </div>
        <Slider
          max={24}
          value={startTime}
          trackStyle={{ backgroundColor: Color.SLIDER_RAIL_COLOR }}
          railStyle={{ backgroundColor: Color.PRIMARY_COLOR }}
          handleStyle={{ borderColor: Color.PRIMARY_COLOR, backgroundColor: Color.PRIMARY_COLOR }}
          onChange={setStartTime}
        />
        <div className="d-flex align-items-center justify-content-center mt-3">
          <span className="fw-400 fs-1p0 cod-gray">End:</span>
          <span className="fw-400 fs-1p0 color-primary ms-2">{timeString(endTime)}</span>
        </div>
        <Slider
          max={24}
          value={endTime}
          trackStyle={{ backgroundColor: Color.PRIMARY_COLOR }}
          railStyle={{ backgroundColor: Color.SLIDER_RAIL_COLOR }}
          handleStyle={{ borderColor: Color.PRIMARY_COLOR, backgroundColor: Color.PRIMARY_COLOR }}
          onChange={setEndTime}
        />
      </div>
    );
  }

  const dayPickerHelmet = (
    <Helmet>
      <style>{`
  .Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end) {
    background-color: #fe7a3c !important;
    color: #ffffff;
  }
  .Selectable .DayPicker-Day {
    border-radius: 0 !important;
    padding: 0.6rem 1rem;
  }
  .Selectable .DayPicker-Day--start {
    background-color: #fe7a3c !important;
    border-top-left-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
  }
  .Selectable .DayPicker-Day--end {
    background-color: #fe7a3c !important;
    border-top-right-radius: 50% !important;
    border-bottom-right-radius: 50% !important;
  }
  .Selectable .DayPicker-Day--sunday:not(.DayPicker-Day--outside) {
    color: #d0021b !important;
  }
`}</style>
    </Helmet>
  );

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      showCloseIcon={false}
      closeOnOverlayClick={props.closeOnOverlayClick ?? true}
      center
      classNames={{ root: 'z-1050', modal: 'w-480px border-12' }}
    >
      {props.title &&
        <div className="modal-header">
          <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">{props.title}</span>
          <span type="button" className="btn-close" onClick={onCloseModal} />
        </div>
      }
      <div className="modal-body d-flex flex-column align-items-center px-0">
        <button
          type="button"
          className="btn btn-app-primary fw-500 fs-1p0 midnight order-1 w-75 py-2"
          disabled={dayOffset === 0}
          onClick={onSave}
        >Save</button>
        <div className="order-0">
          {renderPeriod()}
          <DayPicker
            className="Selectable"
            numberOfMonths={1}
            fromMonth={props.fromMonth ? new Date() : ""}
            fixedWeeks
            selectedDays={[beginDate, { from: beginDate, to: endDate }]}
            modifiers={modifiers}
            onDayClick={handleDayClick}
          />
          {dayPickerHelmet}
          {renderTimeSlider()}
        </div>
      </div>
    </Modal>
  );
};

export default DateTimeModal;
