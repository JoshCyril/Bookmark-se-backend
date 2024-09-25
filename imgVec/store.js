import weaviate from 'weaviate-ts-client'
import fs  from 'fs'
import { v1 as uuidv1 } from 'uuid';
import { urlToBase64, downloadImage } from "../helper.js";


const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});




export async function idbStore(req){
    // await Promise.all(promises);
    console.log("Creating Embeddings - Image")
    const dir = './img';

    // fs.rmdir(dir, err => {
    // if (err) {
    //     throw err;
    // }
        // fs.mkdirSync(dir)
    // });

    fs.readdirSync(dir).forEach(f => fs.rmSync(`${dir}/${f}`));

    let data = JSON.parse(fs.readFileSync('./collections.json').toString());
    let idx = 0
    let txt = [];

    for (const el of data) {
        if (Array.isArray(el.data.img)){
            for (const nd of el.data.img) {

                let imgval =  nd.split("?")[0]

                if(imgval.slice(-4) === ".png" || imgval.slice(-4) === ".jpg" || imgval.slice(-4) === ".gif"|| imgval.slice(-4) === ".svg"){

                    downloadImage(imgval, idx.toString() + imgval.slice(-4))
                    idx++
                    txt.push(el.ids + "|" + el.url + "|" + el.favicon + "|" + nd)
                }
                else if(imgval.slice(-5) === ".jpeg" || imgval.slice(-5) === ".webp" ){
                    downloadImage(imgval, idx.toString()  + imgval.slice(-5))
                    idx++
                    txt.push(el.ids + "|" + el.url + "|" + el.favicon + "|" + nd)
                }


            }
        }

    }


    // idx = 0

    // const imgFiles = fs.readdirSync('./img');
    // const Tcount = imgFiles.length

    // const promises = imgFiles.map(async (imgFile) => {

    //     const b64 = Buffer.from(fs.readFileSync(`img/${imgFile}`)).toString('base64');
    //     await client.data.creator()
    //         .withClassName(req.coll)
    //         .withProperties({
    //             image: b64,
    //             text: txt[idx],
    //     }).do();
    //     idx++
    // })



    // await Promise.all(promises);

    return 'Created embedding';

}
