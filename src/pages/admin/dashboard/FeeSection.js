import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import * as APIHandler from "../../../apis/APIHandler";

const FeeSection = () => {
  const [feeValue, setFeeValue] = useState(0);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    let isMounted = true;
    APIHandler.fetchFeeValue().then((data) => {
      if (isMounted) {
        setFeeValue(data.value);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [reload]);

  const updateFee = (value) => {
    APIHandler.updateFeeValue(value).then((data) => {
      if (data.result === "true") {
        toast.success("Fee has changed");
        setReload(!reload);
      } else {
        toast.error("Fee has not changed");
      }
    });
  };

  return (
    <div className="">
      <h3>UrentMe Fee</h3>
      <input
        className="form-control w-25"
        value={feeValue}
        onChange={(e) => {
          setFeeValue(e.target.value);
        }}
      />
      <button
        className="btn btn-primary mt-2"
        onClick={() => updateFee(feeValue)}
      >
        update
      </button>
    </div>
  );
};

export default FeeSection;
