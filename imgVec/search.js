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
    let results = []
    let search = ''

    if(req.isBase64){
        search = req.query
    }else{
        search = await urlToBase64(req.query)
    }

    let clName = req.coll
    let iCtr = 0

    let resImage = await client.graphql.get()
        .withClassName(clName)
        .withFields(['text'])
        .withNearImage({ image: search })
        .withLimit(req.count)
        .do();
    let res = resImage.data.Get
        for (const v in res) {
            res[v].forEach(el => {
                let textSpl = el.text.split('|')
                let result = {
                    "count": iCtr+1,
                    "id": textSpl[0],
                    "url": textSpl[1],
                    "uri": textSpl[2],
                    "favicon": textSpl[3],
                    "image": textSpl[4]
                }
                results.push(result)
                iCtr++;
            });
          }


    // for (let i=0; i<req.count; i++){
    //     let ctrVal = `resImage.data.Get.${clName}[${i}].text`
    //     console.log(ctrVal)
    //     let textSpl = ctrVal.text.split('|')
    //     console.log(textSpl)
    //     let result = {
    //         "count": i+1,
    //         "id": textSpl[0],
    //         "url": textSpl[1],
    //         "favicon": textSpl[2],
    //         "image": textSpl[3]
    //     }
    //     results.push(result)

    //     // let test = Buffer.from( fs.readFileSync('./test.png') ).toString('base64');
    //     // fs.writeFileSync(`./result${i}.jpg`, resImage.data.Get.Images[i].image, 'base64');
    //     // base64ToUrl(base64String, 'image/jpeg')
    //     // results[i] = resImage.data.Get.Images[i].text
    // }

    return results
}





// console.log("See the result.jpg")
