import express from "express";
import { vdbSearch, vdbStore, vdbReset, vdbList, vdbStoreCode, vdbId, vdbCode, vdbCheck } from "./textVec/db.js";
import { idbStart } from "./imgVec/schema.js";
import { idbStore } from "./imgVec/store.js";
import { idbSearch } from "./imgVec/search.js";
import { idbReset } from "./imgVec/remove.js";
import { scrapeData } from "./textVec/scrapping.js";
import { logMessage, urlToBase64, downloadImage, logEmb } from "./helper.js";
import { graph } from "./textVec/graph.js";

const app = express ();
app.use(express.json());


const PORT = process.env.PORT || 3000;


   app.listen(PORT,() => {
    console.log("Server Listening on PORT:", PORT);
   });

   app.get("/", async (req, res, next) => {
    res.json("stable");
   });

   app.post("/check", async (req, res, next) => {
    const result_st = await vdbCheck(req.body);
    res.json(result_st)
   });

   app.post("/reset", async (req, res, next) => {
    // const result = await vdbReset(req.body)
    // const result_i = await idbReset(req.body)
    res.json(result);
    logMessage('Reset embedding');
   });

   app.get("/list", async (req, res, next) => {
    const result = await vdbList()
    res.json(result);
   });

//    ================ Search =================

   app.post("/search/text", async (req, res, next) => {
    const result = await vdbSearch(req.body)
    res.json(result);
   });

   app.post("/search/image", async (req, res, next) => {
    const result = await idbSearch(req.body)
    res.json(result);
   });

   app.post("/search/code", async (req, res, next) => {
    const result = await vdbCode(req.body)
    res.json(result);
   });

//    =========== Create scrapping & Embeddings ============

   app.post("/c/scrapping", async (req, res, next) => {
    const result = await scrapeData(req.body)
    res.json(result);
    logMessage('Data scrapped');
   });

   app.post("/c/embedding", async (req, res, next) => {

    const result_text = await vdbStore(req.body);
    const result_code = await vdbStoreCode(req.body);

    const result_st = await idbStart(req.body);
    const result_img = await idbStore(req.body);
    logEmb(req.body.coll);
    logMessage(req.body.coll + ' Created embedding');

    const result = [result_text, result_code, result_st, result_img].toString();
    res.json(result);
    });

    app.post("/c/graph", async (req, res, next) => {
        const result = await graph(req.body)
        res.json(result);
        logMessage('Graph Created');
    });
