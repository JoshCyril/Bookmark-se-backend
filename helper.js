import { appendFile } from 'fs';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';
import { Buffer } from 'buffer';
import download from 'image-downloader';

// Polyfill for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// export async function urlToBase64(url) {
//     try {
//         // Fetch the image using axios with responseType set to 'arraybuffer'
//         const response = await axios.get(url, { responseType: 'arraybuffer' });
//         // console.log(response.data)
//         // Create a Buffer from the response data
//         const base64String = Buffer.from(response.data).toString('base64');

//         // Return the Base64 string with the correct MIME type (e.g., image/jpeg)
//         const mimeType = response.headers['content-type']; // E.g., 'image/jpeg'
//         // return `data:${mimeType};base64,${base64String}`;
//         return `${base64String}`;
//       } catch (error) {
//         console.error('Error fetching or converting image to Base64:', error);
//         throw error;
//       }
// }

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

    export function logEmb(message) {
        const logFilePath = `${__dirname}/emb.txt`; // Use the __dirname to create the log file path
        const logEntry = `\n${message}`;
        let isEmb = false

        let data = (fs.readFileSync('./emb.txt').toString()).split(/\r?\n/);
        data.forEach((el) => {
            if(message === el){
                isEmb = true
            }
        });

        // Append the message to the log.txt file
        if (!isEmb){
            appendFile(logFilePath, logEntry, (err) => {
                if (err) {
                    console.error('Failed to write: embedding:', err);
                } else {
                    console.log('updated embedding successfully!');
                }
            });
        }

    }

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



    // const url = 'https://i.sstatic.net/RRuCp.png'

    // async function fetchImage(url){
    //     const response = await fetch(url, {mode: 'no-cors',})
    //     const blob = await response.blob()

    //     return blob
    // }

    // export async function urlToBase64(url){

    //     const imageBlob = await fetchImage(url)
    //     const reader = new FileReader()

    //     reader.onload = () => {
    //         const base64data = fs.result
    //         console.log({base64data})
    //     }
    //     reader.onerror = () => {
    //         console.log('error')
    //     }
    //     reader.readAsDataURL(imageBlob)

    //     return imageBlob
    // }

    export async function urlToBase64(url) {
        let response = await fetch(url);
        let blob = await response.blob();
        let buffer = Buffer.from(await blob.arrayBuffer()).toString('base64');

        let res ={
            "image": {
              "mime": blob.type,
              "data": buffer
            }
        }
        return buffer;
        //  "data:" + blob.type + ';base64,' + buffer;
        // return buffer.toString('base64');
    }

    // // Declare function
    // const base64ToBlob = async (base64, type = 'application/octet-stream') =>
    //     fetch(`data:${type};base64,${base64}`)
    //     .then(res => res.blob())

    // // Call function
    // const blob = await base64ToBlob('iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==', 'image/png')
