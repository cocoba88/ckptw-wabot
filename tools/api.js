const APIs = {
    agatz: {
        baseURL: "https://api.agatz.xyz"
    },
    aggelos_007: {
        baseURL: "https://api.aggelos-007.xyz"
    },
    chiwa: {
        baseURL: "https://api.chiwa.my.id"
    },
    fasturl: {
        baseURL: "https://fastrestapis.fasturl.cloud"
    },
    nyxs: {
        baseURL: "https://api.nyxs.pw"
    },
    ngodingaja: {
        baseURL: "https://api.ngodingaja.my.id"
    },
    sanzy: {
        baseURL: "https://api.sanzy.co"
    },
    ssa: {
        baseURL: "https://ssa-api.vercel.app/"
    },
    vkrdownloader: {
        baseURL: "https://vkrdownloader.vercel.app"
    },
    widipe: {
        baseURL: "https://widipe.com"
    }
};

exports.createAPIUrl = (apiNameOrURL, endpoint, params = {}, apiKeyParamName) => {
    const api = APIs[apiNameOrURL];

    if (!api) {
        try {
            const url = new URL(apiNameOrURL);
            apiNameOrURL = url;
        } catch (error) {
            throw new Error(`Invalid API name or custom URL: ${apiNameOrURL}`);
        }
    }

    const queryParams = new URLSearchParams(params);

    if (apiKeyParamName && api && "APIKey" in api) queryParams.set(apiKeyParamName, api.APIKey);

    const apiUrl = new URL(endpoint, api ? api.baseURL : apiNameOrURL.origin);
    apiUrl.search = queryParams.toString();

    return apiUrl.toString();
};

exports.listAPIUrl = () => {
    return APIs;
}