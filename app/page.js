// 'use client'
// import Image from "next/image"
// import {useState, useEffect, useRef} from 'react'
// import {firestore} from '@/firebase'
// import {Box, Modal, Typography, Stack, Button, TextField} from '@mui/material'
// import {collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from 'firebase/firestore'
// import CameraComponent from '@/CameraComponent'
// import {OpenAI} from 'openai'
// import dotenv from 'dotenv'
// dotenv.config()
// console.log(process.env)


// const openai = new OpenAI({
//   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true
// });


// export default function Home() {
//   const [inventory, setInventory] = useState([])
//   const [open, setOpen] = useState(false)
//   const [itemName, setItemName] = useState('')
//   const [numberOfCameras, setNumberOfCameras] = useState(0);
//   const [image, setImage] = useState(null);
//   const camera = useRef(null);


//   const updateInventory = async () => {
//     const snapshot = query(collection(firestore, 'inventory'))
//     const docs = await getDocs(snapshot)
//     const inventoryList = []
//     docs.forEach((doc) => {
//       inventoryList.push({
//         name: doc.id,
//         ...doc.data(),
//       })
//     })
//     setInventory(inventoryList)
    
//   }

//   const addItem = async (item) => {
//     const docRef = doc(collection(firestore, 'inventory'), item)
//     const docSnap = await getDoc(docRef)

//     if (docSnap.exists()) {
//       const {quantity} = docSnap.data()
//       await setDoc(docRef, {quantity: quantity + 1})
//     }
//     else {
//       await setDoc(docRef, {quantity: 1})
//     }

//     await updateInventory()
//   }


//   const removeItem = async (item) => {
//     const docRef = doc(collection(firestore, 'inventory'), item)
//     const docSnap = await getDoc(docRef)

//     if (docSnap.exists()) {
//       const {quantity} = docSnap.data()
//       if (quantity == 1) {
//         await deleteDoc(docRef)
//       }
//       else {
//         await setDoc(docRef, {quantity: quantity - 1})
//       }
//     }

//     await updateInventory()
//   }

//   const removeAllItems = async (item) => {
    
//     const docRef = doc(collection(firestore, 'inventory'), item);
//     const docSnap = await getDoc(docRef);

//     await deleteDoc(docRef);

//     await updateInventory()
    
//   }

//   const fetchOpenAIResponse = async () => {
//     try {
//       const response = await openai.chat.completions.create({
//         model: "gpt-4o-mini",
//         messages: [
//           {
//             role: "user",
//             content: [
//               {
//                 type: "text",
//                 text: "Give a concise, generic name for what this image depicts."
//               },
//               {
//                 type: "image_url",
//                 image_url: {
//                   url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Kleenex-small-box.jpg/800px-Kleenex-small-box.jpg",
//                   detail: "low"
//                 }

//               }
//             ]
//           }
//         ],
//         // max_tokens: 1000
//       });
//       const completionText = response.choices[0].text;
    
//     } catch (error) {
//       console.error('Error fetching OpenAI response:', error);
//     }
//   };

//   useEffect(() => {
//     updateInventory()
//   }, [])

//   const handleOpen = () => setOpen(true)
//   const handleClose = () => setOpen(false)

//   return (
    
//     <>
//       <CameraComponent ref={camera} numberOfCamerasCallback={setNumberOfCameras} /><img src={image} alt='Image preview' /><button
//         onClick={() => {
//           const photo = camera.current.takePhoto()
//           setImage(photo)
//         } } /><button
//           hidden={numberOfCameras <= 1}
//           onClick={() => {
//             camera.current.switchCamera()
//           } } /><Box
//             width="100vw"
//             height="100vh"
//             display="flex"
//             flexDirection="column"
//             justifyContent="center"
//             alignItems="center"
//             gap={2}
//           >
//           <Modal open={open} onClose={handleClose}>
//             <Box
//               position="absolute"
//               top="50%"
//               left="50%"
//               width={400}
//               bgcolor="white"
//               border="2px solid #000"
//               boxShadow={24}
//               p={4}
//               display="flex"
//               flexDirection="column"
//               gap={3}
//               sx={{
//                 transform: "translate(-50%,-50%)"
//               }}
//             >
//               <Typography variant="h6">Add Item</Typography>
//               <Stack width="100%" direction="row" spacing={2}>
//                 <TextField
//                   variant="outlined"
//                   fullWidth
//                   value={itemName}
//                   onChange={(e) => {
//                     setItemName(e.target.value)
//                   } }
//                 >
//                 </TextField>

//                 <Button
//                   variant="outlined"
//                   onClick={() => {
//                     addItem(itemName)
//                     setItemName("")
//                     handleClose()
//                   } }

//                 >
//                   Add

//                 </Button>



//               </Stack>

//             </Box>
//           </Modal>
//           <Button
//             variant="outlined"
//             onClick={() => {
//               handleOpen()
//             } }

//           >
//             Add New Item
//           </Button>
//           <Box border="1px solid #333">
//             <Box
//               width="800px"
//               height="100px"
//               bgcolor="#ADD8E6"
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//             >
//               <Typography variant="h2" color="#333">
//                 Inventory Items
//               </Typography>

//             </Box>



//             <Stack width="800px" height="300px" spacing={2} overflow="auto">
//               {inventory.map(({ name, quantity }) => (
//                 <Box
//                   key={name}
//                   width="100%"
//                   minHeight="150px"
//                   display="flex"
//                   alignItems="center"
//                   justifyContent="space-between"
//                   bgcolor="#f0f0f0"
//                   padding={5}
//                 >
//                   <Typography variant="h3" color="#333" textAlign="center">
//                     {name.charAt(0).toUpperCase() + name.slice(1)}
//                   </Typography>
//                   <Typography variant="h3" color="#333" textAlign="center">
//                     {quantity}
//                   </Typography>

//                   <Stack direction="row" spacing={2}>
//                     <Button variant="contained" onClick={() => {
//                       addItem(name)
//                     } }

//                     >
//                       Add
//                     </Button>

//                     <Button variant="contained" onClick={() => {
//                       removeItem(name)
//                     } }

//                     >
//                       Remove
//                     </Button>

//                     <Button variant="contained" onClick={() => {
//                       removeAllItems(name)
//                     } }

//                     >
//                       Remove All
//                     </Button>

//                   </Stack>
//                 </Box>
//               ))}

//             </Stack>
//           </Box>

//         </Box>
//     </>
//   ) 
// }

'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, Button, TextField } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore';
import CameraComponent from '@/CameraComponent';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();



const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const cameraRef = useRef(null);

  // Fetch inventory data from Firestore
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = docs.docs.map(doc => ({ name: doc.id, ...doc.data() }));
    setInventory(inventoryList);
  };

  // Add item to inventory
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  // Remove one item from inventory
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  // Remove all items from inventory
  const removeAllItems = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  // Fetch OpenAI response
  const fetchOpenAIResponse = async () => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Give a concise, generic name of 1-2 words for what this image depicts. Hyphenated words count as 1 word.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${image}`,
                  detail: "low",
                },
              },
            ],
          },
        ],
      });
      const completionText = response.choices[0].text;
      return completionText
      
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      return null;
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleTakePhoto = (photo) => {
    setImage(photo);
    console.log(photo);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setCameraOpen(true)}
        style={{ marginBottom: '20px' }}
      >
        Open Camera
      </Button>
      
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        style={{ marginBottom: '20px' }}
      >
        Add New Item
      </Button>

      <Box border="1px solid #333">
        <Box width="800px" height="100px" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h2" color="#333">Inventory Items</Typography>
        </Box>

        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => addItem(name)}>Add</Button>
                <Button variant="contained" onClick={() => removeItem(name)}>Remove</Button>
                <Button variant="contained" onClick={() => removeAllItems(name)}>Remove All</Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                setOpen(false);
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal open={cameraOpen} onClose={() => setCameraOpen(false)}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          height={500}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          {/* <CameraComponent ref={cameraRef} onTakePhoto={handleTakePhoto} />
          <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                setOpen(false);
              }}
            >
              Take Photo
            </Button> */}
            <CameraComponent ref={cameraRef}/>
            <Button 
              variant="contained" 
              onClick={() => {
                const photo = cameraRef.current.takePhoto();
                handleTakePhoto(photo);
              }}
              
              
            >Take Photo</Button>
            <Button
              variant="contained"
              hidden={numberOfCameras <= 1}
              onClick={() => cameraRef.current.switchCamera()}
            >
              Switch Camera
            </Button>
            
        </Box>
      </Modal>
      {image && <img src={image} alt='Image preview' />}
    </>
  );
}


