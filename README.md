---
translations:
  zh-CN: README.zh-CN.md
---
# EchoStack Seedance Assets T1

Imports public images, videos and audio into Seedance asset groups through New API.

## Channel setup

Choose the Task Plugin (61) channel type and bind `EchoStack Seedance Assets T1`. Enter the Base URL and key from the EchoStack gateway console. The plugin ships no default address, so the channel Base URL is required.

If the upstream is another New API gateway, choose the New API (60) channel type and enter that gateway's address and token. The upstream gateway also needs this plugin installed.

## Models and endpoints

| Endpoint | Purpose |
| --- | --- |
| `POST /ais-seedance-assets-t1/v1/import` | Import one public asset into a group |
| `POST /ais-seedance-assets-t1/v1/groups/create` | Create an asset group |
| `POST /ais-seedance-assets-t1/v1/groups/get` | Read an asset group |
| `POST /ais-seedance-assets-t1/v1/groups/delete` | Delete an asset group |
| `POST /ais-seedance-assets-t1/v1/asset/list` | List the assets of a group |
| `POST /ais-seedance-assets-t1/v1/asset/get` | Read one asset |
| `POST /ais-seedance-assets-t1/v1/asset/status` | Read one asset's processing status |
| `POST /ais-seedance-assets-t1/v1/asset/delete` | Delete one asset |

The plugin declares the model `doubao-seedance-assets-t1`. All endpoints answer in one request; there is no task to poll.

## Example

    curl https://gateway.example.com/ais-seedance-assets-t1/v1/import \
      -H "Authorization: Bearer sk-..." \
      -H "Content-Type: application/json" \
      -d '{"url": "https://example.com/demo.png", "asset_type": "Image", "name": "demo"}'

## Limits

- `url` must be a public `http` or `https` address the upstream can reach.
- `asset_type` is `Image`, `Video` or `Audio`, matched without regard to case.
- `page_size` is an integer from 1 to 100; `page_number` starts at 1.
- `group_id` is optional. When omitted, the upstream gateway uses the default group configured for its account.
