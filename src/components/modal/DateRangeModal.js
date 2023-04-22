import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Modal } from 'react-responsive-modal';
import Helmet from 'react-helmet';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { toast } from 'react-toastify';

import AppSpinner from '../loading/AppSpinner';
import * as APIHandler from '../../apis/APIHandler';
import * as Constant from '../../constants/constant';

const DAY_NONE = 0;
const DAY_SELECTED = 1;
const DAY_START = 2;
const DAY_END = 3;
const DAY_ALONE = 4;

const DateRangeModal = (props) => {
  const [open, setOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOpen(props.open);
    if (props.open && props.initDays) {
      let list = [];
      for (let day of props.initDays) {
        list = [...list, new Date(day)];
      }
      setSelectedDays(list);
    }
  }, [props.open, props.initDays]);

  const isDayContains = (list, day) => {
    if (list && list.length > 0) {
      return selectedDays.some(e => moment(e).isSame(day, 'day'));
    }
    return false;
  }

  const getDaySelectionStatus = (day) => {
    if (!isDayContains(selectedDays, day)) {
      return DAY_NONE;
    }

    const nextDay = new Date(day).setDate(day.getDate() + 1);
    const haveNext = isDayContains(selectedDays, nextDay);
    const beforeDay = new Date(day).setDate(day.getDate() - 1);
    const haveBefore = isDayContains(selectedDays, beforeDay);

    if (haveBefore && haveNext) {
      return DAY_SELECTED;
    } else if (haveBefore) {
      return DAY_END;
    } else if (haveNext) {
      return DAY_START;
    } else {
      return DAY_ALONE;
    }
  }

  const start = (day) => {
    return getDaySelectionStatus(day) === DAY_START;
  }

  const end = (day) => {
    return getDaySelectionStatus(day) === DAY_END;
  }

  const alone = (day) => {
    return getDaySelectionStatus(day) === DAY_ALONE;
  }

  const disabled = (day) => {
    return moment(day) <= moment();
  }

  const onCloseModal = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  const handleDayClick = (day, { selected }) => {
    if (loading || moment(day) < moment()) {
      return;
    }
    if (selected) {
      setSelectedDays(selectedDays.filter(e => !moment(e).isSame(day, 'day')));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  }

  const onSave = () => {
    setLoading(true);
    const blockDates = [];
    for (const day of selectedDays) {
      blockDates.push(moment(day).format(Constant.DATE_SAVE_FORMAT));
    }
    
    APIHandler.addBlockDate(props.itemId, blockDates).then(data => {
      if (data !== '') {
        if (props.onSuccess) {
          props.onSuccess(blockDates);
        }
      } else {
        toast.error('Fail to add block dates');
      }
      setLoading(false);
    });
  }

  const dayPickerHelmet = (
    <Helmet>
      <style>{`
  .Selectable .DayPicker-Day--selected {
    background-color: #fe7a3c !important;
    color: #ffffff;
  }
  .Selectable .DayPicker-Day {
    border-radius: 0 !important;
    padding: 0.6rem 1rem;
  }
  .Selectable .DayPicker-Day--start {
    border-top-left-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
  }
  .Selectable .DayPicker-Day--end {
    border-top-right-radius: 50% !important;
    border-bottom-right-radius: 50% !important;
  }
  .Selectable .DayPicker-Day--alone {
    border-radius: 50% !important;
  }
  .Selectable .DayPicker-Day--sunday:not(.DayPicker-Day--outside):not(.DayPicker-Day--disabled) {
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
      classNames={{ root: 'z-1050', modal: 'w-480px border-12 position-relative' }}
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
          disabled={loading}
          onClick={onSave}
        >Save</button>
        <div className="order-0">
          <div className="d-flex align-items-center justify-content-center">
            <span className="fw-600 fs-1p125 cod-gray px-4 py-2"
              style={{ backgroundColor: "#ffc29e", borderRadius: "4px" }}
            >{selectedDays.length} days</span>
          </div>
          <DayPicker
            className="Selectable"
            numberOfMonths={1}
            fromMonth={new Date()}
            fixedWeeks
            modifiers={{ start, end, alone, disabled, sunday: { daysOfWeek: [0] } }}
            selectedDays={selectedDays}
            onDayClick={handleDayClick}
          />
          {dayPickerHelmet}
        </div>
      </div>
      {loading && <AppSpinner absolute />}
    </Modal>
  );
};

export default DateRangeModal;
