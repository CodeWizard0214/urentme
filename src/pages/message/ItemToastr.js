import React, { useState } from "react";
import { connect } from "react-redux";
import ItemHorzCard from "../../components/elements/ItemHorzCard";
import CollapseButton from "../../components/elements/CollapseButton";

import { getDefaultImageUri } from "../../utils/imageUrl";
import styles from "./ItemToastr.module.css";

const Toast = (props) => {
  const { itemData, wishItems, itemImages } = props;
  const [collapsed, setCollapsed] = useState(false);

  const isFeatured = (id) => {
    return wishItems.length > 0 && wishItems.find((e) => +e.item_id === id);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <div className="Toastify">
        <div
          className="Toastify__toast-container Toastify__toast-container--top-right"
          style={{ width: "unset", top: "7em" }}
        >
          <CollapseButton
            className={styles.collapse}
            collapsed={!collapsed}
            onClick={toggleCollapse}
          />
          <div
            id="gaftl3acg"
            class={`Toastify__toast Toastify__toast-theme--light Toastify__toast--default ${collapsed ? "d-none" : ""}`}
          >
            <div role="alert" class="Toastify__toast-body">
              <ItemHorzCard
                src={getDefaultImageUri(itemImages, itemData.id, 200)}
                id={itemData.id}
                name={itemData.name}
                rate={+itemData.item_review_rating_avg}
                review={itemData.item_review_count}
                cost={itemData.rent_per_day}
                featured={isFeatured(itemData.id)}
                showHeart={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    wishItems: state.wishItems,
    itemImages: state.allItemImages,
  };
};

export default connect(mapStateToProps)(Toast);
