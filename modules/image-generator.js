// Generate AI cover image

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
    const imageUrl = `data:image/png;base64,${image.b64_json}`;

    console.log("Generated image URL:", imageUrl);
    return imageUrl;

}

// Export function
module.exports = {
    generateCoverImage
};