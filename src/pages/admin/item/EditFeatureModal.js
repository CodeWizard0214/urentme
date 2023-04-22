import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { Modal } from 'react-responsive-modal';
import { toast } from 'react-toastify';

import AppSpinner from '../../../components/loading/AppSpinner';
import FeatureInput from '../../../components/elements/FeatureInput';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';

const EditFeatureModal = (props) => {
  const { id } = props;
  const [open, setOpen] = useState(false);
  const [features, setFeatures] = useState([]);
  const [current, setCurrent] = useState('');
  const [removed, setRemoved] = useState([]);
  const [added, setAdded] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      setLoading(true);
      APIHandler.adminAllFeatures(id).then(data => {
        if (isMounted && data.length > 0) {
          setFeatures(data);
          setLoading(false);
        }
      });
    }
    return () => { isMounted = false; };
  }, [id]);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const onCloseModal = () => {
    setOpen(false);
    setCurrent('');
    if (props.onClose) {
      props.onClose();
    }
  }

  const handleChange = (text) => {
    setCurrent(text);
  }

  const addFeature = (text) => {
    if (features.length > 0 && features.filter(e => e.name === text).length > 0) {
      toast.error('Item already exists');
      return;
    }

    setFeatures([...features, { name: text }]);
    setAdded([...added, text]);
    setCurrent('');
  }

  const removeFeature = (feature) => {
    const data = features.filter((e) => e.name === feature);
    if (data.length > 0) {
      if (data[0].id) {
        setRemoved([...removed, data[0].id]);
      } else {
        setAdded(added.filter(e => e !== feature));
      }
    }
    setFeatures(features.filter((e) => e.name !== feature));
  }

  const submitFeatures = async () => {
    setLoading(true);
    if (added.length > 0) {
      for (const name of added) {
        const data = await APIHandler.adminAddFeature({ item_id: id, name });
        if (data.result === 'false') {
          toast.error('Could not update features of item');
          setLoading(false);
          return;
        }
      }
    }

    if (removed.length > 0) {
      const data = await APIHandler.adminDeleteFeature(`(${removed})`);
      if (data.result === 'false') {
        toast.error('Could not update features of item');
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    toast.success('Item features have been updated successfully');
    onCloseModal();
  }

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      showCloseIcon={false}
      center
      classNames={{root: 'z-1050', modal: 'w-480px border-12 position-relative'}}
    >
      <div className="modal-header">
        <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">Item Features</span>
        <span type="button" className="btn-close" onClick={onCloseModal} />
      </div>
      <div className="modal-body">
        <div className="row">
          <FeatureInput
            addable={true}
            className="col-12 mb-2"
            text={current}
            onChange={handleChange}
            onClick={addFeature}
            disabled={loading}
          />
          {features.length > 0 && features.map((feature, idx) => (
            <FeatureInput
              key={`feature-${idx}`}
              addable={false}
              className="col-12 mt-3"
              text={feature.name}
              created={feature.created ? moment(feature.created).format(Constant.DATE_FORMAT) : ""}
              onClick={removeFeature}
              disabled={loading}
            />
          ))}
        </div>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <button
            type="submit"
            className="btn btn-app-primary w-100 fw-500 fs-1p0 white py-2"
            disabled={loading}
            onClick={submitFeatures}
          >Submit</button>
          <button
            type="button"
            className="btn btn-outline-app-primary w-100 fw-500 fs-1p0 midnight py-2"
            disabled={loading}
            onClick={onCloseModal}
          >Cancel</button>
        </div>
      </div>
      {loading && <AppSpinner absolute />}
    </Modal>
  );
};

export default EditFeatureModal;
