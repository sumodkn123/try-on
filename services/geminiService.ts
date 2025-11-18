import { GoogleGenAI, Modality } from "@google/genai";
import { stripBase64Prefix, getMimeTypeFromBase64 } from "../utils/imageUtils";

// Initialize Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTryOnImage = async (
  userImageBase64: string,
  productImageBase64: string,
  productDescription: string
): Promise<string> => {
  try {
    const userImageMime = getMimeTypeFromBase64(userImageBase64);
    const userImageData = stripBase64Prefix(userImageBase64);

    const productImageMime = getMimeTypeFromBase64(productImageBase64);
    const productImageData = stripBase64Prefix(productImageBase64);

    // STRICT prompt to prevent hallucinations (extra people) and ensure simple clothing swap.
    const prompt = `ROLE: Expert Photo Editor & Virtual Stylist.

TASK: Perform a realistic clothing replacement.

INPUTS:
1. The first image provided is the "TARGET USER".
2. The second image provided is the "CLOTHING REFERENCE".

INSTRUCTIONS:
- Generate a single image of the "TARGET USER" wearing the "CLOTHING REFERENCE".
- The output must be a pixel-perfect reproduction of the "TARGET USER" image (same face, same hair, same pose, same background, same lighting), EXCEPT for the clothes.
- The clothing from the "CLOTHING REFERENCE" must be warped and lighted to fit the "TARGET USER" naturally.
- Use this description for the clothing details: "${productDescription}".

CRITICAL RULES:
1. PRESERVE IDENTITY: Do NOT change the user's face, hair, or body shape.
2. PRESERVE SCENE: Do NOT change the background or lighting.
3. SINGLE PERSON: Do NOT add any other people to the image. The output must contain exactly ONE person (the user).
4. OCCLUSION HANDLING: If the user is holding a phone (mirror selfie) or has hands in front of their body, you MUST render the new clothing *underneath* the hands/phone. The hands and phone must remain visible and unchanged.
5. NO SPLIT SCREEN: Do not show the inputs. Show only the final result.

EXECUTE.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: userImageMime,
              data: userImageData
            }
          },
          {
            inlineData: {
              mimeType: productImageMime,
              data: productImageData
            }
          }
        ]
      },
      config: {
        responseModalities: [Modality.IMAGE],
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && parts.length > 0) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("Model finished processing but did not return an image.");

  } catch (error) {
    console.error("Gemini Try-On API Error:", error);
    throw error;
  }
};