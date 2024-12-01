# Changelog

All notable changes to this project will be documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - v0.1.0
> 🚧 This version is under active development and not ready for production use.

### Added
- Initial implementation of DB Nexus home page.
- Support for MongoDB connections and CRUD operations.
- Dynamic schema loading with Mongoose for MongoDB.
- UI support for attaching Mongoose schemas to collections.
- Keyboard shortcuts for navigation and operations.
- JSON-based metadata storage for database connections.

### Changed
- Optimized `connect` and `disconnect` methods for unified MongoDB and Mongoose handling.
- Improved document listing to prioritize Mongoose schema if available.

### Fixed
- Addressed redundant logic in `connect` and `disconnect` methods.
- Resolved compatibility issues with schema storage and retrieval.

### Planned
- UI aggregation pipeline creator for MongoDB.
- Real-time query monitoring and optimization suggestions.
- Support for additional databases, starting with Firestore.
- Advanced caching for frequent queries and bulk operation optimization.
- Inbuilt graphing for data visualization.

---

## v0.0.1
### Added
- Project initialization with:
    - Core structure scaffolding.
    - Initial setup for Electron, Mongoose, and database managers.
    - Dependency management.