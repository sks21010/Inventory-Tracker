'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, Button, TextField } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore';
import CameraComponent from '@/CameraComponent';
import { OpenAI } from 'openai';
import {Helmet} from 'react-helmet'; // maybe don't need
import Head from 'next/head';
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
  const [photo, setPhoto] = useState(null);
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
  const fetchOpenAIResponse = async (image_input) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Give a concise, generic name of 1-2 words for what this image depicts. Hyphenated words count as 1 word. No need for a period at the end",
              },
              {
                type: "image_url",
                image_url: {
                  url: image_input,
                  detail: "low"
                  
                },
              },
            ],
          },
        ],
      });
      console.log(response)
      const completionText = response.choices[0].message.content;
      console.log(completionText)
      return completionText
      
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      return null;
    }
  };

  useEffect(() => {
    updateInventory();
    const timer = setTimeout(() => {
      setOpen(false);
    }, 3000)
  }, []);
  
  const handleTakenPhoto = async (takenPhoto) => {
    setPhoto(takenPhoto); // makes the photo accessible throughout the Home() function scope
    console.log(takenPhoto);
    const itemName = await fetchOpenAIResponse(takenPhoto);
    console.log(itemName);
    if (itemName) {
      addItem(itemName.trim());
    }
    
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom, rgb(10, 10, 135), rgb(47, 140, 172), white)'
      }}
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      
    >
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" />
      </Head>
      <Typography variant="h2" sx={{ fontFamily: 'Georgia, serif', color: "white", height: "10vh"}}>Welcome to the AI Inventory Management Web App!</Typography>
      <Typography variant="h4" sx={{ fontFamily: 'Times New Roman, serif', color: "white", height: "7.5vh"}}>You can take a photo of an item and OpenAI GPT-4 will log its name in your inventory!</Typography>

      <Box display="flex" alignItems="center" gap={2}>
        <Button
          variant="contained"
          onClick={() => setCameraOpen(true)}
          sx={{ margin: '10px', height: '3.75vh'}}
        >
          Open Camera
        </Button>
        
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ margin: '10px', height: '3.75vh'}}
        >
          Add New Item
        </Button>
      </Box>




      <Box
        border="5px solid rgb(47, 140, 172)"
        borderRadius="16px"
        margin={2} 
        
      >
        <Box
          width="100%"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={2}
          borderRadius="10px 10px 0 0" // Rounded corners on top only
          zIndex={1} // Ensures the title box is above other content
        >
          <Typography variant="h2" color="#333" fontFamily="Georgia, serif">
            Inventory Items
          </Typography>
        </Box>

        <Stack
          width="800px"
          height="300px"
          spacing={2}
          overflow="auto"
          marginTop={2} // Margin between the title box and the inventory logs
        >
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={2}
              borderRadius="10px"
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
          border="5px solid rgb(47, 140, 172)"
          borderRadius="20px"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6" fontFamily="Georgia, serif" marginBottom="20px">Add Item Manually</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
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
            <CameraComponent ref={cameraRef}/>
            <Button 
              variant="contained" 
              sx={{ marginBottom: '7.5px' }}
              onClick={() => {
                const newPhoto = cameraRef.current.takePhoto();
                handleTakenPhoto(newPhoto);
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
      
      {/* {photo && <img src={photo} alt='Image preview' width="200px" height="200px"/> } */}
      
    </Box>
  );
}


