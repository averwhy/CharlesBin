// @ts-nocheck


export const routes = {
  "meta": {},
  "id": "_default",
  "name": "",
  "file": {
    "path": "src/routes/_module.svelte",
    "dir": "src/routes",
    "base": "_module.svelte",
    "ext": ".svelte",
    "name": "_module"
  },
  "asyncModule": () => import('../src/routes/_module.svelte'),
  "rootName": "default",
  "routifyDir": import.meta.url,
  "children": [
    {
      "meta": {
        "dynamic": true,
        "order": false,
        "dynamicSpread": true
      },
      "id": "_default_____404__svelte",
      "name": "[...404]",
      "file": {
        "path": "src/routes/[...404].svelte",
        "dir": "src/routes",
        "base": "[...404].svelte",
        "ext": ".svelte",
        "name": "[...404]"
      },
      "asyncModule": () => import('../src/routes/[...404].svelte'),
      "children": []
    },
    {
      "meta": {
        "isDefault": true
      },
      "id": "_default_index_svelte",
      "name": "index",
      "file": {
        "path": "src/routes/index.svelte",
        "dir": "src/routes",
        "base": "index.svelte",
        "ext": ".svelte",
        "name": "index"
      },
      "asyncModule": () => import('../src/routes/index.svelte'),
      "children": []
    },
    {
      "meta": {},
      "id": "_default_me",
      "name": "me",
      "module": false,
      "file": {
        "path": "src/routes/me",
        "dir": "src/routes",
        "base": "me",
        "ext": "",
        "name": "me"
      },
      "children": [
        {
          "meta": {
            "isDefault": true
          },
          "id": "_default_me_index_svelte",
          "name": "index",
          "file": {
            "path": "src/routes/me/index.svelte",
            "dir": "src/routes/me",
            "base": "index.svelte",
            "ext": ".svelte",
            "name": "index"
          },
          "asyncModule": () => import('../src/routes/me/index.svelte'),
          "children": []
        }
      ]
    },
    {
      "meta": {},
      "id": "_default_p",
      "name": "p",
      "module": false,
      "file": {
        "path": "src/routes/p",
        "dir": "src/routes",
        "base": "p",
        "ext": "",
        "name": "p"
      },
      "children": [
        {
          "meta": {
            "dynamic": true,
            "order": false
          },
          "id": "_default_p__paste__svelte",
          "name": "[paste]",
          "file": {
            "path": "src/routes/p/[paste].svelte",
            "dir": "src/routes/p",
            "base": "[paste].svelte",
            "ext": ".svelte",
            "name": "[paste]"
          },
          "asyncModule": () => import('../src/routes/p/[paste].svelte'),
          "children": []
        }
      ]
    }
  ]
}
export default routes