import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

/**
 * Endpoint pour récupérer les images d'un album Google Photos
 * GET /api/gallery/[albumId]
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { albumId } = req.query;

  if (!albumId || typeof albumId !== "string") {
    return res.status(400).json({ error: "Missing albumId parameter" });
  }

  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    NODE_ENV,
  } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    console.error("Missing Google OAuth credentials");
    return res.status(500).json({
      error: "Server configuration error: Missing OAuth credentials",
    });
  }

  try {
    // Récupérer le token depuis les cookies
    const accessToken = req.cookies?.google_access_token;
    const refreshToken = req.cookies?.google_refresh_token;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({
        error: "Not authenticated",
        message: "Please authenticate first by visiting /api/auth/login",
      });
    }

    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );

    // Si on a un refresh token mais pas d'access token, on refresh
    if (!accessToken && refreshToken) {
      oauth2Client.setCredentials({ refresh_token: refreshToken });
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(credentials);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        return res.status(401).json({
          error: "Token refresh failed",
          message: "Please re-authenticate by visiting /api/auth/login",
        });
      }
    } else if (accessToken) {
      oauth2Client.setCredentials({ access_token: accessToken });
    }

    // Créer le client Google Photos
    const photos = google.photoslibrary({ version: "v1", auth: oauth2Client });

    // Récupérer les médias de l'album
    const response = await photos.mediaItems.search({
      requestBody: {
        albumId: albumId,
        pageSize: 100, // Maximum par requête
      },
    });

    const mediaItems = response.data.mediaItems || [];

    // Transformer les médias en format attendu par le frontend
    const images = mediaItems.map((item) => {
      if (!item.baseUrl || !item.filename) {
        return null;
      }

      // Construire l'URL de l'image avec les paramètres de taille
      // w1920-h1080 = largeur 1920px, hauteur 1080px (maintenant le ratio)
      const imageUrl = `${item.baseUrl}=w1920-h1080`;

      return {
        src: imageUrl,
        alt: item.filename || item.description || "Image",
        width: item.mediaMetadata?.width,
        height: item.mediaMetadata?.height,
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);

    // Gérer la pagination si nécessaire
    let nextPageToken = response.data.nextPageToken;
    while (nextPageToken && images.length < 100) {
      const nextResponse = await photos.mediaItems.search({
        requestBody: {
          albumId: albumId,
          pageSize: 100,
          pageToken: nextPageToken,
        },
      });

      const nextMediaItems = nextResponse.data.mediaItems || [];
      const nextImages = nextMediaItems.map((item) => {
        if (!item.baseUrl || !item.filename) {
          return null;
        }
        return {
          src: `${item.baseUrl}=w1920-h1080`,
          alt: item.filename || item.description || "Image",
          width: item.mediaMetadata?.width,
          height: item.mediaMetadata?.height,
        };
      }).filter((item): item is NonNullable<typeof item> => item !== null);

      images.push(...nextImages);
      nextPageToken = nextResponse.data.nextPageToken;
    }

    res.status(200).json({ images });
  } catch (error: any) {
    console.error("Error fetching album:", error);

    // Gérer les erreurs spécifiques
    if (error.code === 401 || error.response?.status === 401) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Please re-authenticate by visiting /api/auth/login",
      });
    }

    if (error.code === 404 || error.response?.status === 404) {
      return res.status(404).json({
        error: "Album not found",
        message: `Album with ID ${albumId} not found or not accessible`,
      });
    }

    res.status(500).json({
      error: "Failed to fetch album",
      details: NODE_ENV === "development" ? String(error) : undefined,
    });
  }
}

