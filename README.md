# 百度云-对象存储BOS-客户端

[![Build Status][travis-image]][travis-url]
[![Build Status][appveyor-image]][appveyor-url]
[![Dependency Status][david_img]][david_site]
[![devDependency Status][david_dev_img]][david_dev_site]

![](./build/bce-logo.png)

## 使用文档

- [Wiki](https://github.com/baidubce/bce-client/wiki)
- [BOS](https://cloud.baidu.com/doc/BOS/index.html)

## 自动更新

- `Window`、`OSX`可以在重启的时候自动更新

## 需求与建议

- [Issue](https://github.com/baidubce/bce-client/issues)

## 版本发布

- [Releases](https://github.com/baidubce/bce-client/releases)

## License
MIT © BAIDU

[travis-url]: https://travis-ci.org/mudio/bce-client
[travis-image]: https://img.shields.io/travis/mudio/bce-client/master.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9Imljb24tbWFjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMTUgMTUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE1IDE1OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6bm9uZTtzdHJva2U6IzlEOUQ5RDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQo8L3N0eWxlPgo8ZyBpZD0ibWFjIj4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yLjA2LDkuMDc1YzAtMC4xODUsMC0wLjM3MSwwLTAuNTU2QzIuMDYzLDguNSwyLjA2OCw4LjQ4MiwyLjA3LDguNDY0YzAuMDI2LTAuMjEzLDAuMDQtMC40MjgsMC4wODEtMC42MzgKCQljMC4xNDEtMC43MzEsMC40NTItMS4zNzksMC45OTEtMS45YzAuNTUzLTAuNTM0LDEuMjE2LTAuODI3LDEuOTktMC44NDdDNS40ODUsNS4wNyw1LjgxNyw1LjE3Myw2LjE0Niw1LjI4NwoJCWMwLjI4OSwwLjEsMC41NzgsMC4yMDMsMC44NjgsMC4zMDNjMC4xMzQsMC4wNDYsMC4yNjcsMC4wNDUsMC40MDItMC4wMDNjMC4yNzMtMC4wOTgsMC41NDgtMC4xOSwwLjgyMS0wLjI4OAoJCWMwLjMwNy0wLjExMSwwLjYyLTAuMjAxLDAuOTQ1LTAuMjQyYzAuMjgxLTAuMDM1LDAuNTU4LTAuMDA1LDAuODM1LDAuMDQ2YzAuNTc4LDAuMTA4LDEuMDkzLDAuMzQyLDEuNTE4LDAuNzU3CgkJYzAuMTMzLDAuMTI5LDAuMjUxLDAuMjcxLDAuMzUyLDAuNDI0Yy0wLjAwNiwwLjAwOC0wLjAwOCwwLjAxMi0wLjAxMSwwLjAxNGMtMC4wMTQsMC4wMS0wLjAyOCwwLjAxOS0wLjA0MiwwLjAyOAoJCWMtMC4zNSwwLjIyNy0wLjY1NywwLjUwMS0wLjg4MywwLjg1NWMtMC40MiwwLjY1Ny0wLjQ5LDEuMzcyLTAuMzMzLDIuMTE4YzAuMTMxLDAuNjIsMC40NzIsMS4xMTMsMC45NjEsMS41MDgKCQljMC4xOTQsMC4xNTYsMC40MDIsMC4yOSwwLjYzNiwwLjM4MWMwLDAuMDA4LDAsMC4wMTcsMCwwLjAyNWMtMC4wMDUsMC4wMDktMC4wMTEsMC4wMTctMC4wMTQsMC4wMjcKCQljLTAuMDY5LDAuMTgzLTAuMTMzLDAuMzY4LTAuMjA4LDAuNTQ4Yy0wLjIzNSwwLjU2Ny0wLjU1MywxLjA4Ni0wLjkyMSwxLjU3NmMtMC4yMTMsMC4yODMtMC40MzUsMC41NTgtMC43MTcsMC43NzgKCQljLTAuMzQ4LDAuMjcyLTAuNzM1LDAuNC0xLjE3OSwwLjMyM2MtMC4yNjMtMC4wNDUtMC41MTItMC4xMzMtMC43NTctMC4yMzRDOC4wODYsMTQuMDk0LDcuNzQyLDE0LDcuMzc5LDE0CgkJYy0wLjI3OCwwLTAuNTQ4LDAuMDUyLTAuODEsMC4xNDJjLTAuMjQyLDAuMDgzLTAuNDgsMC4xODEtMC43MjMsMC4yNmMtMC4xMzcsMC4wNDUtMC4yODEsMC4wNjctMC40MjIsMC4wOTkKCQljLTAuMDg0LDAtMC4xNjksMC0wLjI1MywwYy0wLjA5MS0wLjAyNC0wLjE4NC0wLjA0MS0wLjI3My0wLjA3MmMtMC4yOS0wLjEtMC41Mi0wLjI5MS0wLjczMy0wLjUwMQoJCWMtMC4zMy0wLjMyNS0wLjU5NS0wLjcwMy0wLjg1My0xLjA4NWMtMC40MTItMC42MTEtMC43MDQtMS4yNzktMC45MjMtMS45ODFDMi4yMzIsMTAuMzU5LDIuMTI0LDkuODQ2LDIuMDgzLDkuMzIKCQlDMi4wNzYsOS4yMzcsMi4wNjcsOS4xNTYsMi4wNiw5LjA3NXoiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik05LjkzLDAuNWMwLjAyLDAuMjY1LDAuMDEyLDAuNTMtMC4wMzUsMC43OTJjLTAuMSwwLjU0Ni0wLjM0NCwxLjAyMy0wLjY5MiwxLjQ0OQoJCUM4LjksMy4xMTEsOC41NDMsMy40MTMsOC4wOTMsMy41OUM3LjgsMy43MDUsNy40OTYsMy43NTIsNy4xODIsMy43M2MtMC4wMTktMC4wMDEtMC4wMzctMC4wMDUtMC4wNi0wLjAwOAoJCWMwLTAuMTgxLTAuMDE1LTAuMzYxLDAuMDAyLTAuNTM5YzAuMTEtMS4xMjEsMS4wMjctMi4zLDIuNDM2LTIuNjMyQzkuNjUsMC41MzEsOS43NDEsMC41MTcsOS44MzEsMC41CgkJQzkuODY0LDAuNSw5Ljg5NywwLjUsOS45MywwLjV6Ii8%2BCjwvZz4KPC9zdmc%2BCg%3D%3D

[appveyor-url]: https://ci.appveyor.com/project/mudio/bos
[appveyor-image]: https://img.shields.io/appveyor/ci/mudio/bos/master.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48ZyBmaWxsPSIjMUJBMUUyIiB0cmFuc2Zvcm09InNjYWxlKDgpIj48cGF0aCBkPSJNMCAyLjI2NWw2LjUzOS0uODg4LjAwMyA2LjI4OC02LjUzNi4wMzd6Ii8%2BPHBhdGggZD0iTTYuNTM2IDguMzlsLjAwNSA2LjI5My02LjUzNi0uODk2di01LjQ0eiIvPjxwYXRoIGQ9Ik03LjMyOCAxLjI2MWw4LjY3LTEuMjYxdjcuNTg1bC04LjY3LjA2OXoiLz48cGF0aCBkPSJNMTYgOC40NDlsLS4wMDIgNy41NTEtOC42Ny0xLjIyLS4wMTItNi4zNDV6Ii8%2BPC9nPjwvc3ZnPg==

[david_img]: https://david-dm.org/mudio/bce-client/status.svg
[david_site]: https://david-dm.org/mudio/bce-client

[david_dev_img]: https://david-dm.org/mudio/bce-client/dev-status.svg
[david_dev_site]: https://david-dm.org/mudio/bce-client?type=dev
