import React, { useEffect, useState } from "react";

import AmountItem from "./AmountItem";
import { ImUsers } from "react-icons/im";
import { FaCubes } from "react-icons/fa";
import { AiFillFileText } from "react-icons/ai";
import { BsDribbble, BsCheckLg } from "react-icons/bs";
import * as APIHandler from "../../../apis/APIHandler";

const AmountSection = () => {
  const [allTableCount, setAllTableCount] = useState({});
  
  useEffect(() => {
    let isMounted = true;
    APIHandler.fetchTableCount().then((data) => {
      if (isMounted) {
        setAllTableCount(data);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="row align-content-stretch">
      <div className="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12 mb-4">
        <AmountItem icon={<ImUsers size={60} color={"#bab8b8"} />} title={"Users"} amount={allTableCount['users']} url={"/admin/users"} />
      </div>
      <div className="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12 mb-4">
        <AmountItem icon={<FaCubes size={60} color={"#bab8b8"} />} title={"Items"} amount={allTableCount['items']} url={"/admin/items"} />
      </div>
      <div className="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12 mb-4">
        <AmountItem icon={<AiFillFileText size={60} color={"#bab8b8"} />} title={"Pending Ids"} amount={allTableCount['userIdCount']} url={"/admin/userids"}/>
      </div>
      <div className="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12 mb-4">
        <AmountItem icon={<BsDribbble size={60} color={"#bab8b8"} />} title={"Posts"} amount={allTableCount['postCount']} url={"/admin/posts"} />
      </div>
      <div className="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12 mb-4">
        <AmountItem icon={<BsCheckLg size={60} color={"#bab8b8"} />} title={"Listing Pending Approval"} amount={allTableCount['pendingItemsCount']} url={"/admin/items"} />
      </div>
    </div>
  );
};

export default AmountSection;
