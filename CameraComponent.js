import React, { useRef, useState } from 'react';
import {Camera} from 'react-camera-pro';

const CameraComponent = () => {
  const camera = useRef(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);

  return (
    <>
      <Camera ref={camera} numberOfCamerasCallback={setNumberOfCameras} />
      <img src={image} alt='Image preview' />
      <button
        onClick={() => {
          const photo = camera.current.takePhoto();
          setImage(photo);
        }}
      >
        Take Photo
      </button>
      <button
        hidden={numberOfCameras <= 1}
        onClick={() => {
          camera.current.switchCamera();
        }}
      >
        Switch Camera
      </button>
    </>
  );
};

export default CameraComponent;
