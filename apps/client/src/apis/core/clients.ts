import ky, {
  type BeforeRequestHook,
  type BeforeRetryHook,
  HTTPError,
} from "ky";
import { Refresh } from "../services/user/refresh";

const HOST = import.meta.env.VITE_APP_API_SERVER_URL as string;

const setAuthorizationHeader: BeforeRequestHook = (request) => {
  const rawAccessToken = localStorage.getItem("accessToken");
  if (!rawAccessToken) return;

  const parsedAccessToken = JSON.parse(rawAccessToken);
  request.headers.set("Authorization", `Bearer ${parsedAccessToken}`);
};

const DEFAULT_RETRY_LIMIT = 3;

const handleTokenRefresh: BeforeRetryHook = async ({ error, retryCount }) => {
  const httpError = error as HTTPError;

  if (httpError.response?.status !== 401) {
    console.log("401이 아닌 에러 발생, 중단", httpError);
    return ky.stop;
  }

  if (retryCount === DEFAULT_RETRY_LIMIT - 1) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";

    return ky.stop;
  }

  const rawRefreshToken = localStorage.getItem("refreshToken");
  if (!rawRefreshToken) {
    console.log("refreshToken이 없음");
    return ky.stop;
  }

  const refreshToken = JSON.parse(rawRefreshToken);

  const res = await Refresh({ refreshToken });
  console.log(res);
  const json = await res.json();

  localStorage.setItem("accessToken", JSON.stringify(json.data.accessToken));
  localStorage.setItem("refreshToken", JSON.stringify(json.data.refreshToken));
};

export const baseApiClient = ky.extend({
  prefixUrl: HOST,
  headers: {
    "Access-Control-Request-Headers": "Authorization",
    "Access-Control-Request-Method": "GET, POST, PUT, DELETE, OPTIONS",
  },
});

const authenticatedApiClient = baseApiClient.extend({
  timeout: 10000,
  retry: {
    limit: DEFAULT_RETRY_LIMIT,
    backoffLimit: 3000,
    methods: ["get", "put", "delete", "patch", "post"],
    statusCodes: [401],
  },
  hooks: {
    beforeRequest: [setAuthorizationHeader],
    beforeRetry: [handleTokenRefresh],
  },
});

export default authenticatedApiClient;
