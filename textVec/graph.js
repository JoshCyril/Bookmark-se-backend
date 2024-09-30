import { ChromaClient } from 'chromadb'
const client = new ChromaClient();
import fs from "fs";
import { refactorCode } from "../helper.js";
import PCA from 'pca-js';

export async function graph(req){
    // let data = JSON.parse(fs.readFileSync('./collections.json').toString());

    const collection = await client.getOrCreateCollection({
        name: req.coll,
    });


    const results = await collection.get( {
        include: ['embeddings']
    })

    const embb = results.embeddings

    try {
        const reducedData = reduceTo2D(embb);
        // console.log("2D Points:", reducedData);
        return reducedData;
      } catch (error) {
        console.error("Error reducing data:", error.message);
      }

}

function reduceTo2D(data) {
    // Check if data is valid
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid data: Data should be a non-empty array of points.");
    }

    // Get eigenvectors for PCA
    const eigenVectors = PCA.getEigenVectors(data);

    // Check if we have enough dimensions to reduce
    if (eigenVectors.length < 2) {
      throw new Error("Data does not have enough dimensions for reduction to 2D.");
    }

    // Project the data to the new 2D space using the top 2 eigenvectors
    const twoDimensionalPoints = PCA.computeAdjustedData(data, eigenVectors[0], eigenVectors[1]).adjustedData;

    return twoDimensionalPoints;
  }
