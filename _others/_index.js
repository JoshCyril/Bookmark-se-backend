import weaviate from 'weaviate-ts-client';
// import readFileSync from fs;

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

const schemaRes = await client.schema.getter().do();

console.log(schemaRes)

const schemaConfig = {
    'class': 'Memy',
    'vectorizer': 'img2vec-neural',
    'vectorIndexType': 'hnsw',
    'moduleConfig': {
        'img2vec-neural': {
            'imageFields': [
                'image'
            ]
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

await client.schema
    .classCreator()
    .withClass(schemaConfig)
    .do();

// Store an Image
// const img = readFileSync('./img/night.png');

// const b64 = Buffer.from(img).toString('base64');

// await client.data.creator()
//   .withClassName('Memy')
//   .withProperties({
//     image: b64,
//     text: 'matrix meme'
//   })
//   .do();


// Query an Image
// const test = Buffer.from( readFileSync('./test.png') ).toString('base64');

// const resImage = await client.graphql.get()
//   .withClassName('Memy')
//   .withFields(['image'])
//   .withNearImage({ image: test })
//   .withLimit(1)
//   .do();

// // Write result to filesystem
// const result = resImage.data.Get.Meme[0].image;
// writeFileSync('./result.png', result, 'base64');
