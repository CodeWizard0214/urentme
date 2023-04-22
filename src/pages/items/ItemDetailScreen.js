import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { AiOutlineCar } from 'react-icons/ai';

import AppSpinner from '../../components/loading/AppSpinner';
import CircleMark from '../../components/marks/CircleMark';
import ItemImageCarousel from '../../components/elements/ItemImageCarousel';
import ItemOverviewSection from './ItemOverviewSection';
import { ItemFeatureSection } from './ItemFeatureSection';
import { ItemCostSection } from './ItemCostSection';
import ItemTripReviewSection from './ItemTripReviewSection';
import { ItemInsuranceSection } from './ItemInsuranceSection';
import { getItemImageUris } from '../../utils/imageUrl';
import * as APIHandler from '../../apis/APIHandler';
import * as Color from '../../constants/color';

const ItemDetailScreen = (props) => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { allItemImages, allItemFeatures, allItemCourtesies, wishItems } = props;
  const [itemData, setItemData] = useState(null);
  const [itemImages, setItemImages] = useState([]);
  const [itemFeatures, setItemFeatures] = useState([]);
  const [itemCourtesies, setItemCourtesies] = useState([]);
  const [featured, setFeatured] = useState(false);
  const [tripDetail, setTripDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTripDetail(pathname.includes('trips'));
  }, [pathname]);

  useEffect(() => {
    setLoading(true);
    APIHandler.getItemDetails(id).then(data => {
      setLoading(false);
      if (data.length === 1) {
        setItemData(data[0]);
      }
    });
  }, [id]);

  useEffect(() => {
    setItemImages(getItemImageUris(allItemImages, +id));
  }, [id, allItemImages])

  useEffect(() => {
    setItemFeatures(allItemFeatures?.filter((feature) => feature.item_id === +id));
  }, [id, allItemFeatures]);

  useEffect(() => {
    setItemCourtesies(allItemCourtesies?.filter((courtesy) => courtesy.item_id === +id));
  }, [id, allItemCourtesies]);

  useEffect(() => {
    setFeatured(wishItems && wishItems.find((e) => (+e.item_id) === id));
  }, [id, wishItems]);

  const emptyView = (
    <div className="d-flex flex-column align-items-center justify-content-center app-content-height">
      <CircleMark
        width={110}
        height={110}
        borderColor={Color.PRIMARY_COLOR}
        borderWidth="2px"
        borderStyle="solid"
      >
        <AiOutlineCar className="fs-3p0 color-primary mt-2" />
      </CircleMark>
      <span className="fw-600 fs-1p125 gray-36 text-center pt-4">
        No Item Info
      </span>
    </div>
  );
 
  return (
    <div className="app-container">
      {loading ? (
        <AppSpinner absolute />
      ) : itemData ? (
      <div className="row mx-4 my-4 my-xl-5">
        <div className="col-md-6 col-xxl-5">
          <ItemImageCarousel
            id={id}
            images={itemImages}
            featured={featured}
          />
        </div>
        <div className="mt-4 col-md-6 mt-md-0 offset-xxl-1">
          <ItemOverviewSection
            itemId={id}
            itemData={itemData}
            hideButtons={tripDetail}
          />
        </div>
        <div className="col-md-6">
          <ItemFeatureSection
            item={itemData}
            features={itemFeatures}
            courtesies={itemCourtesies}
            className="mt-4"
          />
          <ItemTripReviewSection
            reviews={itemData.reviews}
            className="mt-4"
          />
        </div>
        <div className="col-md-6">
          <ItemCostSection
            costDaily={itemData.rent_per_day}
            costWeekly={itemData.rent_per_week}
            costWeekend={itemData.rent_per_weekend}
            cleaningFee={itemData.cleaning_fee}
            className="mt-4"
          />
          <ItemInsuranceSection
            className="mt-5"
          />
        </div>
      </div>
      ) : (
        emptyView
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    allItemImages: state.allItemImages,
    allItemFeatures : state.allItemFeatures,
    allItemCourtesies : state.allItemCourtesies,
    wishItems: state.wishItems,
  };
}

export default connect(mapStateToProps)(ItemDetailScreen);