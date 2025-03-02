const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";

export const uploadToPinata = async (fileBuffer, fileName) => {
    let data = new FormData();
    const blob = new Blob([fileBuffer]);
    const metadata = JSON.stringify({
        name: fileName
    });
    const options = JSON.stringify({
        cidVersion: 0,
    });

    data.append('file', blob, fileName);
    data.append('pinataMetadata', metadata);
    data.append('pinataOptions', options);

    try {
        const pinataApiKey = process.env.PINATA_KEY;
        const pinataSecretApiKey = process.env.PINATA_SECRET;
        const response = await fetch(pinataUrl, {
            method: 'POST',
            body: data,
            headers: {
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey
            }
        });
        if (!response.ok) {
            throw new Error(`Error al subir el archivo: ${response.statusText}`);
        }
        const responseData = await response.json();
        return responseData;
    } catch (err) {
        console.error("Error al subir el archivo a Pinata: ", err);
        throw err;
    }
};
