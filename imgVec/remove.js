import weaviate from 'weaviate-ts-client'

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});


export async function idbReset(req){
    await client.schema
        .classDeleter()
        .withClassName(req.coll)
        .do();
    return console.log("Deleted")
    }
