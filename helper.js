import { appendFile } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';
import { Buffer } from 'buffer';
import download from 'image-downloader';

// Polyfill for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export async function urlToBase64(url) {
    try {
        // Fetch the image using axios with responseType set to 'arraybuffer'
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        // console.log(response.data)
        // Create a Buffer from the response data
        const base64String = Buffer.from(response.data).toString('base64');

        // Return the Base64 string with the correct MIME type (e.g., image/jpeg)
        const mimeType = response.headers['content-type']; // E.g., 'image/jpeg'
        // return `data:${mimeType};base64,${base64String}`;
        return `${base64String}`;
      } catch (error) {
        console.error('Error fetching or converting image to Base64:', error);
        throw error;
      }
}

// export function urlToBase64(url) {
//     return fetch(url)
//       .then(response => response.blob())
//       .then(blob => new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onloadend = () => resolve(reader.result.split(',')[1]); // Extract base64 part
//         reader.onerror = reject;
//         reader.readAsDataURL(blob);
//       }));
//   }


// export function base64ToUrl(base64, contentType = 'image/png') {
//     const byteCharacters = atob(base64);
//     const byteArrays = [];

//     for (let offset = 0; offset < byteCharacters.length; offset += 512) {
//       const slice = byteCharacters.slice(offset, offset + 512);
//       const byteNumbers = new Array(slice.length);
//       for (let i = 0; i < slice.length; i++) {
//         byteNumbers[i] = slice.charCodeAt(i);
//       }
//       const byteArray = new Uint8Array(byteNumbers);
//       byteArrays.push(byteArray);
//     }

//     const blob = new Blob(byteArrays, { type: contentType });
//     return URL.createObjectURL(blob); // Generate a URL for the Blob
//   }

    export function logMessage(message) {
        const logFilePath = `${__dirname}/log.txt`; // Use the __dirname to create the log file path
        const timestamp = new Date().toISOString(); // Get the current timestamp
        const logEntry = `${message} - ${timestamp}\n`; // Log message with timestamp

        // Append the message to the log.txt file
        appendFile(logFilePath, logEntry, (err) => {
            if (err) {
                console.error('Failed to write to log file:', err);
            } else {
                console.log('Log updated successfully!');
            }
        });
    }

    export function refactorCode(inputString) {
        // Remove the <code> tags and extra escaping
        const cleanedString = inputString
            .replace(/<code>/g, '')   // Remove opening <code> tag
            .replace(/<\/code>/g, '') // Remove closing </code> tag
            .replace(/\\n/g, '\n')
            .replace(/\n/g, '')     // Replace \n with actual new lines
            .replace(/\\"/g, '')     // Replace escaped quotes with normal quotes
            .replace(/"/g, "'");      // Replace double quotes with single quotes

        return cleanedString;
    }



    export function downloadImage(Imgurl, count) {
        // const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        return download.image({
        url: Imgurl,
        dest: `${__dirname}/img/${count}`
        });
    }
