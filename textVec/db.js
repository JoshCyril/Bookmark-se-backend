
import { ChromaClient } from 'chromadb'
const client = new ChromaClient();
import fs from "fs";
import { refactorCode } from "../helper.js";



let coll_name = "1_2"

// --------------------------[ Vector DB ]--------------------------------------

export async function vdbStore(req){

    console.log("Creating Embeddings - Text")
    let data = JSON.parse(fs.readFileSync('./collections.json').toString());
    let docs = [];
    let meta = [];
    let idx = [];

    data.forEach((el) => {
        docs.push(el.title)
        let metaT = {
            "description": el.description,
            "url": el.url,
            "uri": el.uri,
            "favicon": el.favicon
        }
        meta.push(metaT)
        idx.push(el.ids.toString())
    });


    const collection = await client.getOrCreateCollection({
        name: req.coll,
    });

    await collection.add({
        documents: docs,
        metadatas: meta,
        ids: idx,
    });

    return "Text"
}

export async function vdbStoreCode(req){

    console.log("Creating Embeddings - Code")
    let data = JSON.parse(fs.readFileSync('./collections.json').toString());
    let iCtr = 0;
    let docs = [];
    let meta = [];
    let idx = [];

    data.forEach((el) => {
        // console.log(el.data.code)
        if (Array.isArray(el.data.code)){

            el.data.code.forEach((nd) => {
                idx.push(iCtr.toString())
                docs.push(refactorCode(nd))
                let metaT = {
                    "mid": el.ids.toString(),
                    "url": el.url,
                    "uri": el.uri,
                    "favicon": el.favicon
                }
                meta.push(metaT)
                iCtr++
            });
        }
    });


    const collection = await client.getOrCreateCollection({
        name: req.coll + "_code",
    });

    // console.log(docs, meta, idx)

    await collection.add({
        documents: docs,
        metadatas: meta,
        ids: idx,
    });

    return " Code"
}

export async function vdbSearch(req, isCode){

    const collection = await client.getOrCreateCollection({
        name: req.coll,
    });

    return await collection.query({
        queryTexts: [req.query], // Chroma will embed this for you
        nResults: req.count, // how many results to return
        include: ['documents', 'distances', 'metadatas']
    });

}

export async function vdbCode(req){

    const collection = await client.getOrCreateCollection({
        name: req.coll + "_code",
    });

    return await collection.query({
        queryTexts: [req.query], // Chroma will embed this for you
        nResults: req.count, // how many results to return
        include: ['documents', 'distances', 'metadatas']
    });

}

export async function vdbCheck(req){
    let data = (fs.readFileSync('./emb.txt').toString()).split(/\r?\n/);
    let res = false
    data.forEach((el) => {
        if(el === req.coll){
            res = true
        }
    });
    return res
}

export async function vdbId(req){


    const collection = await client.getOrCreateCollection({
        name: req.coll,
    });

    const results = await collection.get( {
            ids: [req.id],
            include: ['ids', 'distances']
        })

    return results
}

export async function vdbReset(req){
    // await client.reset();

    const collection = await client.deleteCollection({
        name: req.coll,
    });

    const collection_code = await client.deleteCollection({
        name: req.coll + "_code",
    });


    return("Reset complete")
}

export async function vdbList(){
    const collections = await client.listCollections();
    return (collections)
}

// export default { vdbSearch, vdbStore }

// vdbStore();
// vdbSearch("Web Development & Programming Training Courses | Udacity ");
