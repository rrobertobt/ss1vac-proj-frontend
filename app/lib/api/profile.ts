import { $api } from '@/utils/plain-fetch'

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface TwoFaVerifyPayload {
  challengeId: string
  code: string
}

export interface UpdateProfilePayload {
  username?: string
  phone?: string
  email?: string
  address?: string
  gender?: string
  marital_status?: string
  occupation?: string
  education_level?: string
  emergency_contact_name?: string
  emergency_contact_relationship?: string
  emergency_contact_phone?: string
}

export const profileApi = {
  // Actualizar perfil
  updateProfile: (payload: UpdateProfilePayload) =>
    $api('/auth/me', {
      method: 'PATCH',
      body: payload,
    }),
  // Cambiar contraseña
  changePassword: (payload: ChangePasswordPayload) =>
    $api('/auth/change-password', {
      method: 'POST',
      body: payload,
    }),

  // 2FA - Activar: solicitar código
  requestEnable2fa: () =>
    $api<{ challengeId: string }>('/auth/2fa/enable/request', {
      method: 'POST',
    }),

  // 2FA - Activar: confirmar con código
  confirmEnable2fa: (payload: TwoFaVerifyPayload) =>
    $api<{ twoFaEnabled: boolean }>('/auth/2fa/enable/confirm', {
      method: 'POST',
      body: payload,
    }),

  // 2FA - Desactivar: solicitar código
  requestDisable2fa: () =>
    $api<{ challengeId: string }>('/auth/2fa/disable/request', {
      method: 'POST',
    }),

  // 2FA - Desactivar: confirmar con código
  confirmDisable2fa: (payload: TwoFaVerifyPayload) =>
    $api<{ twoFaEnabled: boolean }>('/auth/2fa/disable/confirm', {
      method: 'POST',
      body: payload,
    }),
}
