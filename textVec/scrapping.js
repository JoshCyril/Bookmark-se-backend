
import axios from "axios";
import * as cheerio from 'cheerio';
import fs from "fs";

let collections = [];
let collection = "";
let progress = 0;
let lenUrl = 1;

// --------------------------[ Web Scrapping ]--------------------------------------

export async function scrapeData(urls) {
    lenUrl = urls.length
    const incr = 0.01
    for (let idx = 0; idx < lenUrl; idx++) {
        try {
        // Fetch HTML of the page we want to scrape
        const { data } = await axios.get(urls[idx]);

        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);

        // check if description exist in meta head or extract from <p>
        let val_desc = $.extract({
            desc: [
                {
                selector: 'meta',
                value: (el, key) => {
                const val = $(el).attr('name');
                return (val == "description"? $(el).attr('content'):null);
                }
            }
            ],
        });

        if(val_desc.desc[0] == null){
            val_desc = $("p").text().substring(0, 300).replace( /\s\s+/g, ' ' );

        }else{
            val_desc = val_desc.desc[0]
        }

        const coll = {ids:"", url: "", uri:"", favicon:"", title: "", description: "", data:"" };
        let uril = urls[idx].split("/")
        coll.ids  = idx
        coll.url = urls[idx];
        coll.uri = uril[2];
        coll.favicon = uril[0] + "//" + uril[2] + "/favicon.ico";
        coll.title = $("title").text();
        coll.description = val_desc

        coll.data = $.extract({
            img:[{
                selector: 'img',
                value: (el, key) => {
                    const val = $(el).attr('src');
                    return (val[0] == "h"? val:null);
                    },
            }],
            code:[{
                selector: 'pre',
                value: 'innerHTML',
            }],
        });

        collection = coll

        } catch (err) {
            const coll = {ids:"", url: "", uri:"", favicon:"", title: "", description: "", data:"" };
            coll.ids  = idx
            coll.url = urls[idx];
            coll.uri = "Invalid URL";
            coll.favicon = "No Icon";
            coll.title = "-";
            coll.description = "-";

            collection = coll
        }

        collections.push(collection);
        progress +=  incr //0.01
        // progressBar(progress)
        console.log(`url ${idx + 1} of ${urls.length}`);

    }
    await storeData();
    return `Scrapped ${urls.length} URLs`
  }

  async function storeData(){
    // Write countries array in countries.json file
    fs.writeFile("collections.json", JSON.stringify(collections, null, 2), (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("\n Successfully written data to file: collections.json");
    });
  }

  // Invoke the above function
//   scrapeData();


  function progressBar(percent) {
    // const barLength = lenUrl;
    // const filledLength = Math.round(percent * barLength);
    // const emptyLength = barLength - filledLength;

    // // console.log(percent, filledLength, emptyLength)

    // const filledBar = '█'.repeat(filledLength);
    // const emptyBar = '░'.repeat(emptyLength);
    // const percentage = (percent * 100).toFixed(2);


    // process.stdout.clearLine();
    // process.stdout.cursorTo(0);
    // process.stdout.write(`Extracting: [${filledBar}${emptyBar}] ${percentage}%`);
}

// vdbStore();
