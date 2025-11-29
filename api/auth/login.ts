import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

/**
 * Endpoint pour initier l'authentification OAuth avec Google Photos
 * GET /api/auth/login
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
    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );

    // Scopes nécessaires pour Google Photos
    const scopes = [
      "https://www.googleapis.com/auth/photoslibrary.readonly",
    ];

    // Générer l'URL d'autorisation
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline", // Pour obtenir un refresh token
      scope: scopes,
      prompt: "consent", // Force la demande de consentement pour obtenir le refresh token
    });

    // Rediriger vers l'URL d'autorisation Google
    res.redirect(302, authUrl);
  } catch (error) {
    console.error("Error initiating OAuth:", error);
    res.status(500).json({
      error: "Failed to initiate authentication",
      details: NODE_ENV === "development" ? String(error) : undefined,
    });
  }
}

