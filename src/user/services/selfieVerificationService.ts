import api from "../../services/apiClient";

export async function submitSelfieVerification(selfieUrl: string) {
  const res = await api.post("/api/user/selfie-verification", {
    selfieUrl,
  });

  return res.data;
}