// Generate AI cover image

const fs = require("fs");

async function generateCoverImage(title) {
    const prompt = `Create a simple blog cover image for an article titled "${title}". Clean, modern, editorial style. No text in the image.`;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-image-1",
            prompt,
            size: "1024x1024"
        })
    });

    // Check for errors
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Image API error: ${errorText}`);
    }

    const data = await response.json();

    const image = data.data[0];
    
    // Convert base64 to file
    const fileName = `generated-${Date.now()}.png`;
    const filePath = `./public/images/${fileName}`;
    const publicPath = `/images/${fileName}`;
    const imageBuffer = Buffer.from(image.b64_json, "base64");
    fs.writeFileSync(filePath, imageBuffer);

    console.log("Saved image:", filePath);

    return publicPath;


}

// Export function
module.exports = {
    generateCoverImage
};