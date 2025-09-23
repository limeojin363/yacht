import ky, {
  type BeforeRequestHook,
  type BeforeRetryHook,
  HTTPError,
} from "ky";
import { Refresh } from "../services/user/refresh";

const HOST = import.meta.env.VITE_APP_API_SERVER_URL as string;

const setAuthorizationHeader: BeforeRequestHook = (request) => {
  console.log("setAuthorizationHeader");
  const rawAccessToken = localStorage.getItem("accessToken");
  if (!rawAccessToken) return;

  const parsedAccessToken = JSON.parse(rawAccessToken);
  request.headers.set("Authorization", `Bearer ${parsedAccessToken}`);
};

const DEFAULT_RETRY_LIMIT = 3;

const handleTokenRefresh: BeforeRetryHook = async ({ error, retryCount }) => {
  console.log("refresh");

  const httpError = error as HTTPError;
  if (httpError.response.status !== 401) {
    console.log("401이 아닌 에러 발생, 중단", httpError);
    return ky.stop;
  }

  if (retryCount === DEFAULT_RETRY_LIMIT - 1) {
    window.location.href = "/login";
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    console.error("재시도 한도 도달, 로그아웃");

    return ky.stop;
  }

  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("refreshToken이 없음");
    }

    const res = await Refresh({ refreshToken });
    const data = await res.json();

    localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
    localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
  } catch (error) {
    window.location.href = "/login";
    console.error("Token refresh 실패, 로그아웃", error);
    // await AuthApi.Logout();
    return ky.stop;
  }
};

export const baseApiClient = ky.create({
  prefixUrl: HOST,
  headers: {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, locale",
    "Access-Control-Allow-Credentials": "true",
  },
});

const authenticatedApiClient = ky.extend({
  prefixUrl: HOST,
  timeout: 10000,
  retry: {
    limit: DEFAULT_RETRY_LIMIT,
    backoffLimit: 1000,
    methods: ["get", "post", "put", "delete"],
    statusCodes: [401, 408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRetry: [handleTokenRefresh],
    beforeRequest: [setAuthorizationHeader],
  },
});

export default authenticatedApiClient;
