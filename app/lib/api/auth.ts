import { $api } from "~/utils/plain-fetch";

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export const authApi = {
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return await $api<ForgotPasswordResponse>("/auth/forgot-password", {
      method: "POST",
      body: { email },
    });
  },

  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return await $api<ResetPasswordResponse>("/auth/reset-password", {
      method: "POST",
      body: data,
    });
  },
};
