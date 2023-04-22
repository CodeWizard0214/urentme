import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import FeatureInput from '../../components/elements/FeatureInput';

const FeatureSection = (props) => {
  const { disabled, handleFeatures, init } = props;
  const [features, setFeatures] = useState([]);
  const [current, setCurrent] = useState('');

  useEffect(() => {
    if (init.length !== 0) {
      setFeatures(init);
    }
  }, [init]);

  useEffect(() => {
    if (handleFeatures) {
      handleFeatures(features);
    }
  }, [features, handleFeatures]);

  const handleChange = (text) => {
    setCurrent(text);
  }

  const addFeature = (feature) => {
    if (features.length > 0 && features.includes(feature)) {
      toast.error('Item already exists');
      return;
    }

    setFeatures([...features, feature]);
    setCurrent('');
  }

  const removeFeature = (feature) => {
    setFeatures(features.filter((e) => e !== feature));
  }

  return (
    <div className="row">
      <FeatureInput
        addable={true}
        className="col-12 col-md-4 mt-3"
        text={current}
        onChange={handleChange}
        onClick={addFeature}
        disabled={disabled}
      />
      {features.length > 0 && features.map((feature, idx) => (
        <FeatureInput
          key={`feature-${idx}`}
          addable={false}
          className="col-12 col-md-4 mt-3"
          text={feature}
          onClick={removeFeature}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default FeatureSection;