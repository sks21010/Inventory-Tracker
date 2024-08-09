// import React, { useRef, useState } from 'react';
// import {Camera} from 'react-camera-pro';

// const CameraComponent = () => {
//   const camera = useRef(null);
//   const [numberOfCameras, setNumberOfCameras] = useState(0);
//   const [image, setImage] = useState(null);

//   return (
//     <>
//       <Camera ref={camera} numberOfCamerasCallback={setNumberOfCameras} />
//       <img src={image} alt='Image preview' />
//       <button
//         onClick={() => {
//           const photo = camera.current.takePhoto();
//           setImage(photo);
//         }}
//       >
//         Take Photo
//       </button>
//       <button
//         hidden={numberOfCameras <= 1}
//         onClick={() => {
//           camera.current.switchCamera();
//         }}
//       >
//         Switch Camera
//       </button>
//     </>
//   );
// };

// export default CameraComponent;


import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Camera } from 'react-camera-pro';

const CameraComponent = forwardRef(({ onTakePhoto, numberOfCamerasCallback }, ref) => {
  const camera = useRef(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);

  // Expose takePhoto method to the parent component
  // useImperativeHandle(ref, () => ({
  //   takePhoto: () => {
  //     if (camera.current) {
  //       return camera.current.takePhoto();
  //       // if (onTakePhoto) {
  //       //   onTakePhoto(photo);  // Pass the photo to the parent component
  //       // }
  //     }
  //     else {
  //       return null;
  //     }
  //   },
  //   switchCamera: () => {
  //     if (camera.current) {
  //       camera.current.switchCamera();
  //     }
  //   },
  // }));

  return (
    <>
      <Camera ref={camera} numberOfCamerasCallback={setNumberOfCameras}/>
      {/* <button
        onClick={() => {
          const photo = camera.current.takePhoto();
          if (onTakePhoto) {
            onTakePhoto(photo);  // Pass the photo to the parent component
          }
        }}
      >
        Take Photo
      </button>
      <button
        hidden={numberOfCameras <= 1}
        onClick={() => camera.current.switchCamera()}
      >
        Switch Camera
      </button> */}
    </>
  );
});

export default CameraComponent;

