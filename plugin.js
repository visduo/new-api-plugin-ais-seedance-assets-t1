const MODEL = "doubao-seedance-assets-t1";
const ASSET_TYPES = ["Image", "Video", "Audio"];

export const meta = {
    apiVersion: 1,
    key: "visduo_ais-seedance-assets-t1",
    name: "EchoStack Seedance Assets T1",
    description: {
        en: "Import public images, videos and audio into Seedance asset groups",
        zh: "将公网图片、视频和音频导入 Seedance 素材组",
    },
    version: "1.2.1",
    author: { name: "多栈科技" },
    website: "https://www.echostack.net/",
    fetchMode: "per_task",
    upstreams: ["new_api"],
    models: ["doubao-seedance-assets-t1"],
    usageSchema: {
        requests: {
            type: "number",
            unit: "count",
            unitLabel: { en: "call", zh: "次" },
            description: {
                en: "Asset service call unit price",
                zh: "素材服务调用单价",
            },
        },
    },
    usageExamples: [{ label: "1 次调用", facts: { requests: 1 } }],
    routes: [
        {
            method: "POST",
            path: "/ais-seedance-assets-t1/v1/import",
            type: "submit",
            decode: "decodeImport",
            render: "imported",
            retainResult: false,
        },
        {
            method: "POST",
            path: "/ais-seedance-assets-t1/v1/groups/create",
            type: "submit",
            decode: "decodeGroupCreate",
            render: "result",
            retainResult: false,
        },
        {
            method: "POST",
            path: "/ais-seedance-assets-t1/v1/groups/get",
            type: "submit",
            decode: "decodeGroupGet",
            render: "result",
            retainResult: false,
        },
        {
            method: "POST",
            path: "/ais-seedance-assets-t1/v1/groups/delete",
            type: "submit",
            decode: "decodeGroupDelete",
            render: "result",
            retainResult: false,
        },
        {
            method: "POST",
            path: "/ais-seedance-assets-t1/v1/asset/list",
            type: "submit",
            decode: "decodeAssetList",
            render: "result",
            retainResult: false,
        },
        {
            method: "POST",
            path: "/ais-seedance-assets-t1/v1/asset/get",
            type: "submit",
            decode: "decodeAssetGet",
            render: "result",
            retainResult: false,
        },
        {
            method: "POST",
            path: "/ais-seedance-assets-t1/v1/asset/status",
            type: "submit",
            decode: "decodeAssetStatus",
            render: "result",
            retainResult: false,
        },
        {
            method: "POST",
            path: "/ais-seedance-assets-t1/v1/asset/delete",
            type: "submit",
            decode: "decodeAssetDelete",
            render: "result",
            retainResult: false,
        },
    ],
};

function object(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function trimmed(value) {
    return String(value === undefined || value === null ? "" : value).trim();
}

function optionalString(value) {
    return trimmed(value);
}

function requiredString(value, name) {
    const text = optionalString(value);
    if (!text) {
        throw new Error(name + " is required");
    }
    return text;
}

function publicUrl(value) {
    const url = requiredString(value, "url");
    if (!/^https?:\/\/[^\s]+$/i.test(url)) {
        throw new Error("url must be a public http(s) URL");
    }
    return url;
}

function assetType(value) {
    const type = requiredString(value, "asset_type");
    for (const allowed of ASSET_TYPES) {
        if (type.toLowerCase() === allowed.toLowerCase()) {
            return allowed;
        }
    }
    throw new Error("asset_type must be Image, Video or Audio");
}

function pageNumber(value, name) {
    if (value === undefined || value === null || value === "") {
        return 1;
    }
    const number = Number(value);
    if (!Number.isInteger(number) || number < 1) {
        throw new Error(name + " must be a positive integer");
    }
    return number;
}

function pageSize(value) {
    if (value === undefined || value === null || value === "") {
        return 10;
    }
    const number = Number(value);
    if (!Number.isInteger(number) || number < 1 || number > 100) {
        throw new Error("page_size must be an integer from 1 to 100");
    }
    return number;
}

function assetId(body) {
    return requiredString(body.id || body.asset_id, "id");
}

function groupPayload(value) {
    const groupId = optionalString(value);
    return groupId ? { group_id: groupId } : {};
}

function importPayload(body) {
    return Object.assign(
        { url: publicUrl(body.url), asset_type: assetType(body.asset_type) },
        groupPayload(body.group_id),
        optionalString(body.name) ? { name: optionalString(body.name) } : {}
    );
}

function groupCreatePayload(body) {
    return Object.assign(
        { name: requiredString(body.name, "name") },
        optionalString(body.description) ? { description: optionalString(body.description) } : {}
    );
}

function groupDeletePayload(body) {
    return { id: requiredString(body.id || body.group_id, "id") };
}

function assetListPayload(body) {
    return Object.assign(
        { page_number: pageNumber(body.page_number, "page_number"), page_size: pageSize(body.page_size) },
        groupPayload(body.group_id)
    );
}

function assetPayload(body) {
    return { id: assetId(body) };
}

function jsonBody(ctx) {
    if (!ctx.body || ctx.body.kind !== "json") {
        throw new Error("JSON body required");
    }
    return object(ctx.body.value) ? ctx.body.value : {};
}

function submit(action, requestBody) {
    return { kind: "submit", model: MODEL, action: action, requestBody: requestBody };
}

function decodeImport(ctx) {
    return submit("import", importPayload(jsonBody(ctx)));
}

function decodeGroupCreate(ctx) {
    return submit("groupCreate", groupCreatePayload(jsonBody(ctx)));
}

function decodeGroupGet(ctx) {
    const body = jsonBody(ctx);
    return submit("groupGet", groupPayload(body.group_id));
}

function decodeGroupDelete(ctx) {
    return submit("groupDelete", groupDeletePayload(jsonBody(ctx)));
}

function decodeAssetList(ctx) {
    return submit("assetList", assetListPayload(jsonBody(ctx)));
}

function decodeAssetGet(ctx) {
    return submit("assetGet", assetPayload(jsonBody(ctx)));
}

function decodeAssetStatus(ctx) {
    return submit("assetStatus", assetPayload(jsonBody(ctx)));
}

function decodeAssetDelete(ctx) {
    return submit("assetDelete", assetPayload(jsonBody(ctx)));
}

function authorization(ctx) {
    const key = typeof ctx.apiKey === "string" ? ctx.apiKey.trim() : "";
    if (key) {
        const token = key.replace(/^Bearer\s+/i, "");
        if (!token || /\s/.test(token)) {
            throw new Error("invalid upstream channel key");
        }
        return "Bearer " + token;
    }
    const header = typeof ctx.authHeader === "string" ? ctx.authHeader.trim() : "";
    if (/^Bearer\s+[^\s]+$/i.test(header)) {
        return header;
    }
    throw new Error("upstream channel key is missing");
}

function upstreamBase(ctx) {
    const base = trimmed(ctx.baseUrl).replace(/\/+$/, "");
    if (!/^https?:\/\/[^\s]+$/i.test(base)) {
        throw new Error("channel Base URL must be an absolute http(s) URL");
    }
    return base;
}

export function buildSubmitRequest(ctx) {
    const body = object(ctx.requestBody) ? ctx.requestBody : {};
    const base = upstreamBase(ctx);
    const headers = {
        Authorization: authorization(ctx),
        "Content-Type": "application/json",
    };
    const publicTaskId = trimmed(ctx.publicTaskId);
    if (/^[A-Za-z0-9._-]{1,128}$/.test(publicTaskId)) {
        headers["Idempotency-Key"] = publicTaskId;
    }
    const post = (path, requestBody) => ({
        url: base + "/ais-seedance-assets-t1" + path,
        method: "POST",
        headers: headers,
        body: requestBody,
    });
    switch (ctx.action) {
        case "import":
            return post("/v1/import", importPayload(body));
        case "groupCreate":
            return post("/v1/groups/create", groupCreatePayload(body));
        case "groupGet":
            return post("/v1/groups/get", groupPayload(body.group_id));
        case "groupDelete":
            return post("/v1/groups/delete", groupDeletePayload(body));
        case "assetList":
            return post("/v1/asset/list", assetListPayload(body));
        case "assetGet":
        case "assetStatus":
            return post("/v1/asset/get", assetPayload(body));
        case "assetDelete":
            return post("/v1/asset/delete", assetPayload(body));
    }
    throw new Error("unsupported action: " + (trimmed(ctx.action) || "<empty>"));
}

function upstreamMessage(body) {
    if (!object(body)) {
        return "";
    }
    if (typeof body.message === "string" && body.message) {
        return body.message;
    }
    if (typeof body.msg === "string" && body.msg) {
        return body.msg;
    }
    if (typeof body.error === "string" && body.error) {
        return body.error;
    }
    if (object(body.error) && typeof body.error.message === "string" && body.error.message) {
        return body.error.message;
    }
    return "";
}

function upstreamErrorCode(body) {
    if (object(body) && object(body.error) && typeof body.error.code === "string" && body.error.code) {
        return body.error.code;
    }
    return "upstream_error";
}

function hasError(body) {
    return body.success === false ||
        (typeof body.error === "string" && body.error !== "") ||
        object(body.error);
}

function importedData(ctx, body) {
    const result = object(body.result) ? body.result : {};
    const request = object(ctx.requestBody) ? ctx.requestBody : {};
    const assetIdValue = optionalString(body.asset_id) || optionalString(result.Id) || optionalString(result.id);
    if (!assetIdValue) {
        throw new Error("upstream did not return an asset id");
    }
    if (!/^[A-Za-z0-9._:-]{1,128}$/.test(assetIdValue)) {
        throw new Error("upstream returned an unsupported asset id");
    }
    return {
        asset_id: assetIdValue,
        name: optionalString(body.name) || optionalString(result.Name) || optionalString(result.name) || optionalString(request.name),
        asset_type: optionalString(body.asset_type) ||
            optionalString(result.AssetType) ||
            optionalString(result.asset_type) ||
            optionalString(request.asset_type),
        status: optionalString(body.status) || optionalString(result.Status) || optionalString(result.status) || "Processing",
        url: optionalString(body.url) ||
            optionalString(result.URL) ||
            optionalString(result.Url) ||
            optionalString(result.url) ||
            optionalString(request.url),
    };
}

export function parseSubmitResponse(ctx, response) {
    const body = response && response.body;
    if (!object(body)) {
        throw new Error("upstream did not return a JSON object");
    }
    if (hasError(body)) {
        return {
            taskId: ctx.publicTaskId,
            taskData: body,
            immediate: {
                status: "FAILURE",
                progress: "100%",
                reason: upstreamMessage(body) || "Seedance asset service rejected the request",
                errorCode: upstreamErrorCode(body),
            },
        };
    }
    if (ctx.action === "import") {
        const data = importedData(ctx, body);
        return {
            taskId: data.asset_id,
            taskData: data,
            immediate: { status: "SUCCESS" },
        };
    }
    return {
        taskId: ctx.publicTaskId,
        taskData: { payload: body },
        immediate: { status: "SUCCESS" },
    };
}

export function extractUsage() {
    return { requests: 1 };
}

export function buildQueryRequest(ctx) {
    const base = upstreamBase(ctx);
    return {
        url: base + "/ais-seedance-assets-t1/v1/asset/get",
        method: "POST",
        headers: {
            Authorization: authorization(ctx),
            "Content-Type": "application/json",
        },
        body: { id: requiredString(ctx.taskId, "id") },
    };
}

export function parseTaskResult(ctx, body) {
    const result = object(body) && object(body.result) ? body.result : {};
    const status = trimmed(result.Status || result.status || (object(body) ? body.status : ""));
    if (status === "Active" || status === "Success" || status === "Succeeded") {
        return { status: "SUCCESS", progress: "100%" };
    }
    if (status === "Processing" || status === "Pending" || status === "Queued") {
        return { status: "IN_PROGRESS", progress: "50%" };
    }
    if (status === "Failed" || status === "Failure" || status === "Error") {
        return {
            status: "FAILURE",
            progress: "100%",
            reason: upstreamMessage(body) || "Seedance asset processing failed",
        };
    }
    return { status: "UNKNOWN" };
}

function copyObject(value) {
    const output = {};
    for (const key of Object.keys(value)) {
        output[key] = value[key];
    }
    return output;
}

function passthrough(data) {
    if (!object(data)) {
        return { success: true };
    }
    const output = copyObject(data);
    if (output.success === undefined && output.error === undefined) {
        output.success = true;
    }
    return output;
}

export const native = {
    decodeImport: decodeImport,
    decodeGroupCreate: decodeGroupCreate,
    decodeGroupGet: decodeGroupGet,
    decodeGroupDelete: decodeGroupDelete,
    decodeAssetList: decodeAssetList,
    decodeAssetGet: decodeAssetGet,
    decodeAssetStatus: decodeAssetStatus,
    decodeAssetDelete: decodeAssetDelete,

    imported(ctx, task) {
        const data = object(task.data) ? task.data : {};
        return {
            success: true,
            asset_id: trimmed(data.asset_id),
            name: trimmed(data.name),
            asset_type: trimmed(data.asset_type),
            status: trimmed(data.status),
            url: trimmed(data.url),
            task_id: task.task_id,
        };
    },

    result(ctx, task) {
        const data = object(task.data) ? task.data.payload : null;
        return passthrough(data);
    },

    error(ctx, error) {
        return {
            success: false,
            error: {
                code: error.code || "invalid_request",
                message: error.message,
            },
        };
    },
};
