import React, { useEffect, useState } from "react";
import ReactCrop from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';

const ImageCrop = (props) => {
  const [photo, setPhoto] = useState(props.photo);
  const [crop, setCrop] = useState({ unit: '%', width: 100, height: 100, x: 0, y: 0, aspect: (props.aspect ? props.aspect : undefined)});
  const [imageRef, setImageRef] = useState("");

  useEffect(() => {
    setPhoto(props.photo);
  }, [props.photo]);

  const onImageLoaded = (image) => {
    setImageRef(image);
    const cropAll = { unit: 'px', width: image.width, height: image.height, x: 0, y: 0 };
    makeClientCrop(image, cropAll);
  };

  const onCropComplete = (crop) => {
    makeClientCrop(imageRef, crop);
  };

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            return;
          }
          blob.name = fileName;
          props.croppedImageBlob(blob);
          const fileUrl = window.URL.createObjectURL(blob);
          resolve(fileUrl);
        },
        "image/jpeg",
        1
      );
    });
  };

  const makeClientCrop = async (image, crop) => {
    if (image && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        image,
        crop,
        "newFile.jpeg"
      );
      props.croppedImageUrl(croppedImageUrl);
    }
  };

  return (
    <ReactCrop
      src={photo}
      crop={crop}
      ruleOfThirds={true}
      onImageLoaded={onImageLoaded}
      onComplete={onCropComplete}
      onChange={onCropChange}
      crossorigin="anonymous"
      circularCrop={props.circularCrop}
    />
  );
};

export default ImageCrop;
