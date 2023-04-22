import React, { useState, useEffect } from "react";
import moment from 'moment';

import ChartItem from "./ChartItem";
import * as APIHandler from "../../../apis/APIHandler";

const ChartSection = () => {
  const [allTableData, setAllTableData] = useState(0);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [bookings_value, setBookings_value] = useState([]);
  const [bookings_fee, setBookings_fee] = useState([]);
  const [reviews, setReview] = useState([]);
  const [completed_rentals, setCompleted_rentals] = useState([]);
  const [rental_disputes, setRental_disputes] = useState([]);
  const [user_favorites, setUser_favorites] = useState([]);
  const [item_listings, setItem_listings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let isMounted = true;
    APIHandler.fetchTableData().then((data) => {
      if (isMounted) {
        setAllTableData(data);
        setUsers(data.users.filter((e) => e[0] >= moment().subtract(1, "months").format("YYYY-MM-DD") && e[0] <= moment().subtract(0, "days").format("YYYY-MM-DD")));
        setItems(data.items.filter((e) => e[0] >= moment().subtract(1, "months").format("YYYY-MM-DD") && e[0] <= moment().subtract(0, "days").format("YYYY-MM-DD")));
        setBookings_value(data.bookings_value.filter((e) => e[0] >= moment().subtract(1, "months").format("YYYY-MM-DD") && e[0] <= moment().subtract(0, "days").format("YYYY-MM-DD")));
        setBookings_fee(data.bookings_fee.filter((e) => e[0] >= moment().subtract(1, "months").format("YYYY-MM-DD") && e[0] <= moment().subtract(0, "days").format("YYYY-MM-DD")));
        setReview(data.reviews.filter((e) => e[0] >= moment().subtract(1, "months").format("YYYY-MM-DD") && e[0] <= moment().subtract(0, "days").format("YYYY-MM-DD")));
        setCompleted_rentals(data.completed_rentals.filter((e) => e[0] >= moment().subtract(1, "months").format("YYYY-MM-DD") && e[0] <= moment().subtract(0, "days").format("YYYY-MM-DD")));
        setRental_disputes(data.rental_disputes.filter((e) => e[0] >= moment().subtract(1, "months").format("YYYY-MM-DD") && e[0] <= moment().subtract(0, "days").format("YYYY-MM-DD")));
        setUser_favorites(data.user_favorites.filter((e) => e[0] >= moment().subtract(1, "months").format("YYYY-MM-DD") && e[0] <= moment().subtract(0, "days").format("YYYY-MM-DD")));
        setItem_listings(data.items.filter((e) => e[0] >= moment().subtract(1, "months").format("YYYY-MM-DD") && e[0] <= moment().subtract(0, "days").format("YYYY-MM-DD")));
        setTransactions(data.item_listings.filter((e) => e[0] >= moment().subtract(1, "months").format("YYYY-MM-DD") && e[0] <= moment().subtract(0, "days").format("YYYY-MM-DD")));
        setMessages(data.transactions.filter((e) => e[0] >= moment().subtract(1, "months").format("YYYY-MM-DD") && e[0] <= moment().subtract(0, "days").format("YYYY-MM-DD")));       
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const setUserChartData = (sdate, edate) => {
    setUsers(allTableData.users.filter((e) => e[0] >= sdate && e[0] <= edate));
  }
  const setItemChartData = (sdate, edate) => {
    setItems(allTableData.users.filter((e) => e[0] >= sdate && e[0] <= edate));
  }
  const setBvalueChartData = (sdate, edate) => {
    setBookings_value(allTableData.users.filter((e) => e[0] >= sdate && e[0] <= edate));
  }
  const setBfeeChartData = (sdate, edate) => {
    setBookings_fee(allTableData.users.filter((e) => e[0] >= sdate && e[0] <= edate));
  }
  const setReviewChartData = (sdate, edate) => {
    setReview(allTableData.users.filter((e) => e[0] >= sdate && e[0] <= edate));
  }
  const setCrentalChartData = (sdate, edate) => {
    setCompleted_rentals(allTableData.users.filter((e) => e[0] >= sdate && e[0] <= edate));
  }
  const setDrentalChartData = (sdate, edate) => {
    setRental_disputes(allTableData.users.filter((e) => e[0] >= sdate && e[0] <= edate));
  }
  const setFovoriteChartData = (sdate, edate) => {
    setUser_favorites(allTableData.users.filter((e) => e[0] >= sdate && e[0] <= edate));
  }
  const setMessageChartData = (sdate, edate) => {
    setMessages(allTableData.users.filter((e) => e[0] >= sdate && e[0] <= edate));
  }
  const setListChartData = (sdate, edate) => {
    setItem_listings(allTableData.users.filter((e) => e[0] >= sdate && e[0] <= edate));
  }
  const setTransactionChartData = (sdate, edate) => {
    setTransactions(allTableData.users.filter((e) => e[0] >= sdate && e[0] <= edate));
  }
  return (
    <>
      <ChartItem title={"User Registration"} chartData={users} setDate={(sdate,edate) => setUserChartData(sdate, edate)} />
      <ChartItem title={"Item Bookings"} chartData={items} setDate={(sdate,edate) => setItemChartData(sdate, edate)}/>
      <ChartItem title={"Bookings Value"} chartData={bookings_value} setDate={(sdate,edate) => setBvalueChartData(sdate, edate)}/>
      <ChartItem title={"Bookings Fees"} chartData={bookings_fee} setDate={(sdate,edate) => setBfeeChartData(sdate, edate)}/>
      <ChartItem title={"Owner/Renter Reviews"} chartData={reviews} setDate={(sdate,edate) => setReviewChartData(sdate, edate)}/>
      <ChartItem title={"Completed Rentals"} chartData={completed_rentals} setDate={(sdate,edate) => setCrentalChartData(sdate, edate)}/>
      <ChartItem title={"Rental Disputes"} chartData={rental_disputes} setDate={(sdate,edate) => setDrentalChartData(sdate, edate)}/>
      <ChartItem title={"Uer Favorites"} chartData={user_favorites} setDate={(sdate,edate) => setFovoriteChartData(sdate, edate)}/>
      <ChartItem title={"Inbox Messages"} chartData={messages} setDate={(sdate,edate) => setMessageChartData(sdate, edate)}/>
      <ChartItem title={"Item Listings"} chartData={item_listings} setDate={(sdate,edate) => setListChartData(sdate, edate)}/>
      <ChartItem title={"Transactional Value"} chartData={transactions} setDate={(sdate,edate) => setTransactionChartData(sdate, edate)}/>
    </>
  );
};

export default ChartSection;
