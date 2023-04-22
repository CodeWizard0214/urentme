import React, { useState } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';

import { getDefaultImageUri, getUserAvatar } from '../../utils/imageUrl';
import MapItem from './MapItem';
import MAP_PIN from '../../assets/images/map_pin.png';

const MapSection = (props) => {
  const { items, itemImages } = props;
  const [showing, setShowing] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [activeItem, setActiveItem] = useState({});

  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "100%",
  };

  const onMarkerClick = (props, marker, e) => {
    setActiveItem(props.item?.item);
    setActiveMarker(marker);
    setShowing(true);
  }

  const onMapClicked = (props) => {
    setShowing(false);
    setActiveMarker(null);
  }

  const onCloseInfo = () => {
    if (showing) {
      setShowing(false);
      setActiveMarker(null);
    }
  }

  const renderMarkers = () => {
    return items.map((item, idx) => 
      <Marker
        key={`marker-${idx}`}
        onClick={onMarkerClick}
        icon={{ url: MAP_PIN }}
        position={{ lat: item.latitude, lng: item.longitude }}
        item={{ item }}
      />
    );
  }

  return (
    <Map
      google={props.google}
      style={{ width: "100%", height: "100%" }}
      initialCenter={props.initialCenter}
      zoom={props.zoom ?? 5}
      containerStyle={containerStyle}
      onClick={onMapClicked}
    >
      {items?.length > 0 &&
        renderMarkers()
      }
      <InfoWindow
        marker={activeMarker}
        onClose={onCloseInfo}
        visible={showing}
      >
        {props.logoMarker ? (
          <div className="text-center p-2" style={{ width: "300px", height: "85px" }}>
            <div className="fs-2p0 fw-800 color-primary">URentME, Corp</div>
            <div className="fs-1p125 mt-2">Las Vegas Nevada</div>
          </div>
        ) : (
          <MapItem
            itemId={activeItem?.id}
            itemImg={getDefaultImageUri(itemImages, activeItem?.id, 160)}
            itemName={activeItem?.name}
            ownerImg={getUserAvatar(activeItem?.user_img)}
            ownerName={activeItem?.user_name}
            verified={activeItem?.user_verify === '1'}
            rate={+activeItem?.item_review_rating_avg}
            review={activeItem?.item_review_count}
            cost={activeItem?.rent_per_day}
          />
        )}
      </InfoWindow>
    </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyCAB5OJvg5OVW2J6CSZliYG-WQ63gcgpbI",
})(MapSection);
