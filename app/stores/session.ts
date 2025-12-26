import { defineStore } from "pinia";
import { $api } from "~/utils/plain-fetch";

// Tipos que devuelve el backend
export interface PatientModel {
  id: number;
  firstName: string;
  lastName: string;
  dob: string | null;
  phone: string | null;
  email: string | null;
  status: string;
}

export interface EmployeeModel {
  id: number;
  firstName: string;
  lastName: string;
  employeeType: string;
  status: string;
}
export interface PublicUser {
  id: number;
  email: string;
  username: string;
  roleId: number;
  roleName: string | null;
  roleLabel: string | null;
  twoFaEnabled: boolean;
  employee?: any;
  patient?: any;
}

// Respuesta de login sin 2FA
export interface LoginSuccessResponse {
  accessToken: string;
  user: PublicUser;
}

// Respuesta de login con 2FA
export interface LoginTwoFaResponse {
  twoFaRequired: true;
  challengeId: string;
}

// Respuesta de verificación de 2FA
export interface TwoFaVerifyResponse {
  accessToken: string;
  user: PublicUser;
}

// Respuesta de /auth/me
export interface MeResponse {
  user: {
    id: number;
    email: string;
    username: string;
    roleId: number;
    roleName?: string | null;
    roleLabel?: string | null;
    twoFaEnabled?: boolean;
    permissions?: string[];
  };
}

export const useSessionStore = defineStore("session", () => {
  const sessionUser = ref<PublicUser>();
  const loadingLogin = ref(false);
  const loading2fa = ref(false);
  const challengeId = ref("");

  async function login(credentials: { emailOrUsername: string; password: string }) {
    loadingLogin.value = true;
    try {
      const loginResponse = await $api<LoginSuccessResponse | LoginTwoFaResponse>("/auth/login", {
        method: "POST",
        body: credentials,
      });

      // Si tiene 2FA activado
      if ("twoFaRequired" in loginResponse && loginResponse.twoFaRequired) {
        challengeId.value = loginResponse.challengeId;
        return {
          error: false,
          twoFaRequired: true,
          data: loginResponse,
        };
      }

      // Si NO tiene 2FA, ya viene el accessToken
      const { setToken } = useNuxtApp().$authCookie;

      if (!("accessToken" in loginResponse)) {
        throw {
          data: {
            message: "Respuesta de login inválida",
            code: "INVALID_LOGIN_RESPONSE",
          },
        };
      }
      setToken(loginResponse.accessToken);
      sessionUser.value = loginResponse.user;

      // Navegar según el rol
      navigateByRole(loginResponse.user.roleName);

      return {
        error: false,
        twoFaRequired: false,
        data: loginResponse,
      };
    } catch (error: any) {
      return {
        error: true,
        message: error.data?.message || "Error desconocido",
        code: error.data?.code || "UNKNOWN_ERROR",
      };
    } finally {
      loadingLogin.value = false;
    }
  }

  async function verify2FA(code: string) {
    loading2fa.value = true;
    try {
      const response = await $api<TwoFaVerifyResponse>("/auth/2fa/verify", {
        method: "POST",
        body: {
          challengeId: challengeId.value,
          code,
        },
      });

      const { setToken } = useNuxtApp().$authCookie;
      setToken(response.accessToken);
      sessionUser.value = response.user;

      // Navegar según el rol
      navigateByRole(response.user.roleName);

      return {
        error: false,
        data: response,
      };
    } catch (error: any) {
      return {
        error: true,
        message: error.data?.message || "Error desconocido",
        code: error.data?.code || "UNKNOWN_ERROR",
      };
    } finally {
      loading2fa.value = false;
    }
  }

  function navigateByRole(roleName: string | null) {
    navigateTo("/app/dashboard");
    return

    if (!roleName) {
      navigateTo("/");
      return;
    }

    // Ajusta estas rutas según los roles reales de tu aplicación
    const roleRoutes: Record<string, string> = {
      SUPER_ADMIN: "/admin/dashboard",
      ADMIN_STAFF: "/admin/dashboard",
      PSYCHOLOGIST: "/specialist/dashboard",
      PSYCHIATRIST: "/specialist/dashboard",
      TECHNICIAN: "/technician/dashboard",
      MAINTENANCE: "/maintenance/dashboard",
      PATIENT: "/patient/dashboard",
    };

    const route = roleRoutes[roleName] || "/";
    navigateTo(route);
  }

  async function recoverSession() {
    try {
      const { getToken } = useNuxtApp().$authCookie;
      if (!getToken()) return;

      const response = await $api<MeResponse>("/auth/me");

      // Mapear la respuesta de /auth/me a PublicUser
      // sessionUser.value = {
      //   id: response.user.sub,
      //   email: response.user.email,
      //   username: response.user.username,
      //   roleId: response.user.roleId,
      //   roleName: response.user.roleName ?? null,
      //   roleLabel: response.user.roleLabel ?? null,
      //   twoFaEnabled: response.user.twoFaEnabled ?? false,
      // };

      sessionUser.value = response.user

      return {
        error: false,
        data: response,
      };
    } catch (error: any) {
      return {
        error: true,
        message: error.data?.message || "Error desconocido",
        code: error.data?.code || "UNKNOWN_ERROR",
      };
    }
  }

  function logOut() {
    navigateTo("/login");
    sessionUser.value = undefined;
    challengeId.value = "";
    const { removeToken } = useNuxtApp().$authCookie;
    removeToken();
  }

  const role = computed(() => {
    return sessionUser.value?.roleName?.toLowerCase() || "";
  });

  const roleLabel = computed(() => {
    return sessionUser.value?.roleLabel || "";
  });

  const isAuthenticated = computed(() => {
    return !!sessionUser.value;
  });

  return {
    sessionUser,
    loadingLogin,
    loading2fa,
    challengeId,
    role,
    roleLabel,
    isAuthenticated,
    verify2FA,
    login,
    logOut,
    recoverSession,
  };
});