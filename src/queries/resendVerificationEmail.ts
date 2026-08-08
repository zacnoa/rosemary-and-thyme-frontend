import { API_URL } from "~/utils/apiUrl";

export const resendVerificationEmail = async (email: string) => {
  const result = await fetch(`${API_URL}/auth/verify-email/resend`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });

  return { ok: result.ok };
};
