import weaviate from 'weaviate-ts-client'

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

export async function idbStart(req){

    const schemaConfig = {
        'class': req.coll,
        'vectorizer': 'img2vec-neural',
        'vectorIndexType': 'hnsw',
        'moduleConfig': {
            'img2vec-neural': {
                'imageFields': ['image']
            }
        },
        'properties': [
            {
                'name': 'image',
                'dataType': ['blob']
            },
            {
                'name': 'text',
                'dataType': ['string']
            }
        ]
    }

    return await client.schema
        .classCreator()
        .withClass(schemaConfig)
        .do();
}
