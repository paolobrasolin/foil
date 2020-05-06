# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Master file path is no more explicitly resolved (output is clearer when using a container).

## [0.2.0] - 2020-05-02
### Added
- `Dockerfile` for containerized execution.
- Support for [`xournalpp`](https://github.com/xournalpp/xournalpp)'s `XOPP` annotations
- Logging and log levels with cli flags to control them.

### Changed
- `XML` based format are prettified on peeling.

## [0.1.0] - 2020-04-28
### Added
- Very first working prototype; supports only XFDF.

[Unreleased]: https://github.com/paolobrasolin/foil/compare/v0.2.0...development
[0.2.0]: https://github.com/paolobrasolin/foil/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/paolobrasolin/foil/releases/tag/v0.1.0