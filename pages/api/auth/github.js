export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!clientId) {
    console.error("GITHUB_CLIENT_ID is not defined");
    return res.status(500).json({
      error: "GitHub OAuth configuration is missing",
    });
  }

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_BASE_URL is not defined");
    return res.status(500).json({
      error: "Base URL configuration is missing",
    });
  }

  const redirectUri = `${baseUrl}/api/auth/callback/github`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;

  res.redirect(githubAuthUrl);
}
