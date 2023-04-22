import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';

import * as APIHandler from '../../apis/APIHandler';
import * as Constant from '../../constants/constant';
import AppSpinner from '../../components/loading/AppSpinner';
import ItemMemoSection from './ItemMemoSection';
import ItemPriceSection from './ItemPriceSection';
import ItemAgreementSection from './ItemAgreementSection';

const ItemCheckoutScreen = (props) => {
  const { id } = useParams();
  const { reservedTime, itemTripDates } = props;
  const [itemData, setItemData] = useState({});
  const [tripDates, setTripDates] = useState(undefined);
  const [beginDate, setBeginDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [tripDays, setTripDays] = useState(0);
  const [tripCost, setTripCost] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    APIHandler.getItemDetails(id).then(data => {
      if (data?.length !== 1) {
        return;
      }
      setItemData(data[0]);
    });
  }, [id]);

  useEffect(() => {
    if (itemTripDates.itemId === id) {
      setTripDates(itemTripDates);
    } else {
      setTripDates(reservedTime);
    }
  }, [itemTripDates, reservedTime, id]);

  useEffect(() => {
    if (!!tripDates) {
      const begin = moment(tripDates.beginDate).set('hour', tripDates.startTime).set('minute', 0);
      const end = moment(tripDates.endDate).set('hour', tripDates.endTime).set('minute', 0);
      setBeginDate(moment(tripDates.beginDate).set('hour', tripDates.startTime).format(Constant.DATE_TIME_SAVE_FORMAT));
      setEndDate(moment(tripDates.endDate).set('hour', tripDates.endTime).format(Constant.DATE_TIME_SAVE_FORMAT));
      setTripDate(
        moment(begin).format(Constant.DATE_TRIP_PERIOD_FORMAT) +
        ' - ' +
        moment(end).format(Constant.DATE_TRIP_PERIOD_FORMAT));
  
      const days = tripDates.endDate.diff(tripDates.beginDate, 'days') + 1;
      setTripDays(days);
  
      let amount = 0;
      if (days < 7) {
        for (var i = 0; i < days; i++) {
          var date = moment(tripDates.beginDate).add(i, 'days');
          if (
            (date.isoWeekday() === 6 || date.isoWeekday() === 7)
            && itemData.rent_per_weekend !== 0
          ) {
            amount += itemData.rent_per_weekend;
          } else {
            amount += itemData.rent_per_day;
          }
        }
      } else {
        amount = (itemData.rent_per_week / 7.0) * days;
      }
      setTripCost(amount);
  
      // Transaction fee = 3% of (Trip Price + Security Deposit)
      const transactionFee = (amount + itemData.security_deposit) * 0.03 + 0.02;
      setServiceFee(transactionFee);
      setTotalPrice(amount + transactionFee + itemData.security_deposit + (itemData.cleaning_fee || 0));
    }
  }, [tripDates, itemData]);

  const onChangeNote = (e) => {
    setNote(e.target.value);
  }

  return (
    <div className="app-container">
      {itemData ?
        <div className="position-relative">
          <ItemMemoSection
            itemData={itemData}
            tripDate={tripDate}
            tripDays={tripDays}
          />
          <ItemPriceSection
            itemData={itemData}
            tripDays={tripDays}
            tripCost={tripCost}
            serviceFee={serviceFee}
            totalPrice={totalPrice}
            disabled={loading}
            onChange={onChangeNote}
            className="mt-5"
          />
          <ItemAgreementSection
            itemData={itemData}
            hasHelmet={[42, 43, 45, 46].includes(itemData.category_id)}
            note={note}
            begin={beginDate}
            end={endDate}
            totalPrice={totalPrice}
            rentalAmount={tripCost}
            tripDays={tripDays}
            setLoading={setLoading}
            className="mt-5 mb-5"
          />
          { loading && <AppSpinner absolute /> }
        </div>
        :
        <div className="fw-600 fs-1p125 gray-36 text-center pt-4">
          No Vehicle Info
        </div>
      }
    </div>
  );
};

const mapStateToProps = state => {
  return {
    reservedTime: state.reservedTime,
    itemTripDates: state.itemTripDates,
  };
}

export default connect(mapStateToProps)(ItemCheckoutScreen);