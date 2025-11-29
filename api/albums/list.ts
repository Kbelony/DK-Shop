import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

/**
 * Endpoint pour lister tous les albums Google Photos de l'utilisateur
 * GET /api/albums/list
 * 
 * Utile pour obtenir les vrais albumId à mettre dans GOOGLE_PHOTOS_ALBUM_MAP
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
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

    // Lister tous les albums
    const response = await photos.albums.list({
      pageSize: 50,
    });

    const albums = response.data.albums || [];

    // Formater la réponse pour faciliter l'utilisation
    const formattedAlbums = albums.map((album) => ({
      id: album.id,
      title: album.title,
      productUrl: album.productUrl, // Lien de partage
      coverPhotoUrl: album.coverPhotoBaseUrl,
      mediaItemsCount: album.mediaItemsCount,
      isWriteable: album.isWriteable,
    }));

    res.status(200).json({
      albums: formattedAlbums,
      total: formattedAlbums.length,
    });
  } catch (error: any) {
    console.error("Error listing albums:", error);

    if (error.code === 401 || error.response?.status === 401) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Please re-authenticate by visiting /api/auth/login",
      });
    }

    res.status(500).json({
      error: "Failed to list albums",
      details: NODE_ENV === "development" ? String(error) : undefined,
    });
  }
}

