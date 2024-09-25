import weaviate from 'weaviate-ts-client'
import fs from 'fs'
import { urlToBase64 } from "../helper.js"

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});




// Write result to filesystem
// const result = resImage.data.Get.Images[0].image;


export async function idbSearch(req){
    results = []

    let search = urlToBase64(req.url)

    let resImage = await client.graphql.get()
        .withClassName(req.coll)
        .withFields(['image, text'])
        .withNearImage({ image: search })
        .withLimit(2)
        .do();

    for (let i=0; i<req.count; i++){
        let textSpl = resImage.data.Get.Images[i].text.split('|')
        let result = {
            "count": i+1,
            "id": textSpl[0],
            "url": textSpl[1],
            "favicon": textSpl[2],
            "image": textSpl[3]
        }
        results.push(result)

        // let test = Buffer.from( fs.readFileSync('./test.png') ).toString('base64');
        // fs.writeFileSync(`./result${i}.jpg`, resImage.data.Get.Images[i].image, 'base64');
        // base64ToUrl(base64String, 'image/jpeg')
        // results[i] = resImage.data.Get.Images[i].text
    }

    return results
}





// console.log("See the result.jpg")
