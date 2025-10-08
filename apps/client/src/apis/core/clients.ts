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

const DEFAULT_RETRY_LIMIT = 1;

const handleTokenRefresh: BeforeRetryHook = async ({ error, retryCount }) => {
  const httpError = error as HTTPError;
  console.log(httpError);
  if (httpError.response?.status !== 401) {
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
    const json = await res.json();

    localStorage.setItem("accessToken", JSON.stringify(json.data.accessToken));
    localStorage.setItem(
      "refreshToken",
      JSON.stringify(json.data.refreshToken)
    );
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
    "Access-Control-Request-Headers": "Authorization",
    "Access-Control-Request-Method": "GET, POST, PUT, DELETE, OPTIONS",
  },
});

const authenticatedApiClient = ky.create({
  prefixUrl: HOST,
  timeout: 10000,
  // retry: {
  //   limit: DEFAULT_RETRY_LIMIT,
  //   backoffLimit: 1000,
  //   methods: ["get", "post", "put", "delete"],
  //   statusCodes: [401, 408, 413, 429, 500, 502, 503, 504],
  // },
  headers: {
    "Access-Control-Request-Headers": "Authorization",
    "Access-Control-Request-Method": "GET, POST, PUT, DELETE, OPTIONS",
  },
  hooks: {
    beforeRetry: [handleTokenRefresh],
    beforeRequest: [setAuthorizationHeader],
  },
});

export default authenticatedApiClient;
