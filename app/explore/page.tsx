'use client';
import {Button} from "@/components/ui/button";
import React, { ReactElement } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from 'next/navigation';

export default function Page() {
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [message, setMessage] = React.useState('');
    const [inputList, setInputList] = React.useState<string[]>([]);
    const [shouldCopyContent, setShouldCopyContent] = React.useState(false);
    const [shouldUploadFile, setShouldUploadFile] = React.useState(false);

    function copyContent() {
        setShouldCopyContent(true);
        setShouldUploadFile(false);
    }

    function uploadFileAction() {
        setShouldUploadFile(true);
        setShouldCopyContent(false);
    }

    const onAddBtnClick = (message: string) => {
        console.log("add button " + message)
        setInputList(inputList => [...inputList, message]);
        console.log("input " + JSON.stringify(inputList));
      };

      const ChatMessage = (props: any) =>{
        return (
            <div className="flex flex-row justify-center items-center space-x-4 my-8">
                {props.chatMessage}
            </div>
          );
    }

    function messageChange(e: any) {
        const currentText = e.target.value;
        setMessage(currentText);
        console.log("message change " + currentText);
    }

    function messageEnter(evt: any) {
        const keyCode = evt.keyCode;
        console.log(keyCode);
        if (keyCode === 13) {
            evt.preventDefault();
            sendRequest();
            setMessage('');
        }
    }

    function displayMessage(message: string, type: string) {
        console.log('message display ' + message );
    }

    let baseURL = "http://192.168.254.21:3000";

    async function uploadFile(file: any) {
        const formData = new FormData();
        formData.append('file', file);
      
        try {
          const response = await fetch(`${baseURL}/upload-file`, {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          return data.fileId; // Update according to the actual response structure
        } catch (error) {
          console.error('Error uploading file:', error);
          // Handle error appropriately
        }
      }

    let file: any;
    let fileUrl: string;
    async function sendMessageToServer(message: string) {    
        let imageFilename = null; 
        if (file) {
          // If it's not an image, treat it as a different type of file
         fileUrl = await uploadFile(file); // Assume uploadFile is a function similar to uploadImageAndGetUrl for handling other files
          // Extract filename from the fileUrl if necessary
          const filename = fileUrl.split('/').pop();
          // Proceed with any additional logic needed after the file upload
        }
        // Prepare the payload with the current model ID
        let payload, endpoint;
        // const instructions = await fetchInstructions();
        // if (isAssistants === true) {
        //   if (messageCounter === 0) {
        //     isFirstMessage = true
        //     messageCounter +=1
        //   } else {
        //     isFirstMessage = false;
        //   }
        //   payload = {
        //     message: message,
        //     modelID: currentModelID,
        //     instructions: instructions,
        //     file: fileUrl, // Existing image handling for OpenAI
        //     initialize: isFirstMessage
        //   };
        //   endpoint = `${baseURL}/assistant`; // OpenAI endpoint
        // } else {
        // if (currentModelID.includes('gemini')) {
          // Prepare the payload for Google Gemini API
          payload = {
            prompt: message,
            model: 'gemini-pro',
            imageParts: imageFilename ? [{ filename: imageFilename, mimeType: 'image/jpeg' }] : []
          };
          endpoint = `http://192.168.254.21:3000/gemini`; // Gemini endpoint
      try {
        // COMMET == for testing
        // const response = await fetch(endpoint, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     // Add other headers as needed
        //   },
        //   body: JSON.stringify(payload)
        // });
    
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
    
        // COMMET == for testing
        //const data = await response.json();

        await timeout(1000);
        const data = {text: "TestMessage"};

        // Determine the source of the response and format the message accordingly
        let messageContent;
        if (endpoint.includes('gemini')) {
          // Direct text response from Gemini API
          messageContent = data.text || 'No response received.';
        // } else if (endpoint.includes('assistant')) {
        //   messageContent = data.text.text || 'No response received.';
        } else {
          // Response from GPT API, expected to have a 'text' property
          messageContent = data.text || 'No response received.';
        }

        onAddBtnClick(messageContent)
        displayMessage(messageContent, 'response'); // Display the response in the chat box
      } catch (error) {
        console.error('Error sending message to server:', error);
        displayMessage('Error sending message. Please try again.', 'error');
      }
    }

    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }

    async function sendRequest() {
        console.log("send request");
        onAddBtnClick(message);
        if (message) {
            displayMessage(message, 'user');
            // Check if it's an image generation request
            // if (isImageGenerationRequest(message)) {
            //     await handleImageGenerationRequest(message);
            // } else {
                // Existing code to handle regular messages
                try {
                    await sendMessageToServer(message); // Pass the message, image file, and model to the server
                    // if (voiceMode) {
                    //     // Call to TTS API to read the response
                    //     // This will be implemented in the displayMessage function
                    // }
                    if (message === "Bye!") {
                        // exportChatOnShutdown();
                    }
                } catch (error) {
                    // Handle error
                    console.error('Error sending message:', error);
                    displayMessage('Error sending message. Please try again.', 'error');
                }
           // }
        }
    }

    if (!isLoaded || !userId) {
        redirect('/sign-in');
      }

    
    return (
    <>
        <div>
            <div className="flex flex-row justify-center items-center space-x-4 my-8">
                Hello, your current active session.
             </div>
            <div id="chat-container">
                <div className="flex flex-row justify-center items-center space-x-4 my-8">
                    <Button onClick={uploadFileAction}>
                        Interact With Doc
                    </Button>
                    <Button onClick={copyContent}>
                        Copy Content
                    </Button>
               </div>
                { (shouldCopyContent || shouldUploadFile) && 
                <div>
                    <div>
                    {inputList.map((product) => (
                        <div className="flex flex-row justify-center items-center space-x-4 my-8">
                            {/* {product} */}
                            <ChatMessage chatMessage={product} />
                        </div>
                    ))}
                    </div>
                    <div className="flex flex-row justify-center items-center space-x-4 my-8">
                        <textarea id="message-input" value={message} onChange={messageChange} onKeyDown={messageEnter} placeholder="Type your message here..." rows={4} cols={40}></textarea>
                        <Button onClick={() => console.log("testing")}>
                            📋
                        </Button>
                    </div>
                    <div className="flex flex-row justify-center items-center space-x-4 my-8">
                        {shouldUploadFile && 
                            <div>
                                <input type="file" id="file-input" accept="*/*"/>
                                <Button>
                                    📤
                                </Button>
                            </div>
                            }
                    </div>
                    <div className="flex flex-row justify-center items-center space-x-4 my-8">
                        <Button onClick={sendRequest}>
                            Send
                        </Button>
                    </div>
            
                    <div id="upload-status"></div>
                </div>
                }
            </div>
        </div>
    </>
    );
}