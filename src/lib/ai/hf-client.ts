/**
 * Base client for Hugging Face Inference API
 */

export async function hfFetch(endpoint: string, data: any, isImage = false) {
  const token = process.env.HF_TOKEN;
  
  if (!token) {
    throw new Error("Missing HF_TOKEN environment variable");
  }
  
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${token}`,
  };

  let body: BodyInit;

  if (isImage) {
    // data is expected to be a Buffer or Blob
    body = data;
    headers["Content-Type"] = "application/octet-stream";
  } else {
    body = JSON.stringify(data);
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Hugging Face API Error (${response.status}):`, errText);
      throw new Error(`Hugging Face API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("HF Client Exception:", error);
    throw error;
  }
}

export async function hfFetchVLM(endpoint: string, base64Image: string, prompt: string) {
  const token = process.env.HF_TOKEN;
  if (!token) throw new Error("Missing HF_TOKEN");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt, // For Florence, the prompt is often passed as inputs if it's a multimodal endpoint, or sometimes it expects image as a separate param. 
      // Actually standard HF VQA uses this format:
      // inputs: { image: "base64", question: prompt }
      // Or for Florence-2 standard inference api it might just be image-to-text.
      // Let's pass the standard image-to-text with prompt payload.
    }),
  });
  // Note: Florence-2 via Inference API often just expects binary image. We'll refine this when testing.
}
