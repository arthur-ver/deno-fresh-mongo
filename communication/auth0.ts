export class Auth0Api {
  async getAccessToken(code: string, uri: string) {
    const response = await fetch(
      `${Deno.env.get("AUTH_DOMAIN")}/oauth/token`,
      {
        method: "POST",
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: Deno.env.get("AUTH_CLIENT_ID"),
          client_secret: Deno.env.get("AUTH_CLIENT_SECRET"),
          redirect_uri: uri,
          code,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();

    const accessToken = data["access_token"];
    if (typeof accessToken !== "string") {
      throw new Error("Access token was not a string.");
    }

    return accessToken;
  }

  async getUserEmail(access_token: string) {
    const response = await fetch(`${Deno.env.get("AUTH_DOMAIN")}/userinfo`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const userData = await response.json();
    const { email } = userData;

    return email as string;
  }
}

export const auth0Api = new Auth0Api();
