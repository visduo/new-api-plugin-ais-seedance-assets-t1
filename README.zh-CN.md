---
locale: zh-CN
---
# AIS Service Seedance 素材库 T1

通过 New API 将公网图片、视频和音频导入 Seedance 素材组。

## 渠道设置

渠道类型选任务插件（61），绑定 `AIS Service Seedance 素材库 T1`。Base URL 和密钥从 AIS Service 网关控制台中获取。插件不内置默认地址，渠道 Base URL 为必填项。

如果上游是另一台 New API 网关，渠道类型选 New API（60），填写该网关的地址和令牌。上游网关也需要安装本插件。

## 模型与接口

| 接口 | 用途 |
| --- | --- |
| `POST /ais-seedance-assets-t1/v1/import` | 将单个公网素材导入素材组 |
| `POST /ais-seedance-assets-t1/v1/groups/create` | 创建素材组 |
| `POST /ais-seedance-assets-t1/v1/groups/get` | 查询素材组 |
| `POST /ais-seedance-assets-t1/v1/groups/delete` | 删除素材组 |
| `POST /ais-seedance-assets-t1/v1/asset/list` | 列出素材组内的素材 |
| `POST /ais-seedance-assets-t1/v1/asset/get` | 查询单个素材 |
| `POST /ais-seedance-assets-t1/v1/asset/status` | 查询单个素材的处理状态 |
| `POST /ais-seedance-assets-t1/v1/asset/delete` | 删除单个素材 |

插件声明模型 `doubao-seedance-assets-t1`。所有接口均在一次请求内返回结果，无需轮询任务。

## 示例

    curl https://gateway.example.com/ais-seedance-assets-t1/v1/import \
      -H "Authorization: Bearer sk-..." \
      -H "Content-Type: application/json" \
      -d '{"url": "https://example.com/demo.png", "asset_type": "Image", "name": "demo"}'

## 限制

- `url` 必须是上游可访问的公网 `http` 或 `https` 地址。
- `asset_type` 为 `Image`、`Video` 或 `Audio`，不区分大小写。
- `page_size` 为 1 到 100 的整数；`page_number` 从 1 开始。
- `group_id` 可选。省略时由上游网关使用其账号配置的默认素材组。
