import React, { useState, useEffect } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from '@reach/combobox';
import '@reach/combobox/styles.css';
import { GoogleApiWrapper } from 'google-maps-react';

const PlaceAutocomplete = (props) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
      componentRestrictions: {country: "us"}
    },
    debounce: 200,
  });
  
  const [error, setError] = useState('');

  useEffect(() => {
    setValue(props.text, false);
  }, [props.text, setValue]);

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect = (description) => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);
    clearSuggestions();

    // Get latitude and longitude via utility functions
    getGeocode({ address: description }).then((results) => {
      if (props.getAddress) {
        props.getAddress(results[0].address_components);
      }
      getLatLng(results[0])
        .then(({ lat, lng}) => {
          setError('');
          if (props.getCoordinates) {
            props.getCoordinates({ lat, lng });
          }
        })
        .catch((error) => {
          setError(error);
        });
    }).catch((error) => {
      setError(error);
    })
  };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        description,
      } = suggestion;

      return (
        <ComboboxOption
          key={place_id}
          value={description}
          className="fw-400 fs-0p75 gray-36"
        />
      );
    });

  return (
    <div className="form-group">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready || props.disabled}
          required
          className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${error.length !== 0 && "app-form-error"}`}
        />
        <ComboboxPopover>
          <ComboboxList>{status === "OK" && renderSuggestions()}</ComboboxList>
        </ComboboxPopover>
        {error.length !== 0 &&
          <span className="fw-300 fs-0p75 red-orange">{error}</span>
        }
      </Combobox>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyCAB5OJvg5OVW2J6CSZliYG-WQ63gcgpbI",
})(PlaceAutocomplete);
