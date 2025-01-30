# Changelog

All notable changes to this project will be documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - v0.1.0

> 🚧 This version is under active development and not ready for use.

### In Progress

- Mongo DB Page
  - Work Area
    - [ ] Document List, Create, Update, and Delete
    - [ ] Query Editor
    - [ ] Query Results
    - [ ] Query Stats

### Added

- Initial implementation of DB Nexus home page.
- Support for MongoDB connections and CRUD operations.
- Dynamic schema loading with Mongoose for MongoDB.
- UI support for attaching Mongoose schemas to collections.
- Keyboard shortcuts for navigation and operations.
- JSON-based metadata storage for database connections.
- Mongo DB Page
  - [x] Command Center
  - [x] Top Bar
    - [x] Connection Status
  - Left Panel
    - [x] Collection List
    - [x] Pinned Collections
    - [x] Connection Stats
  - Work Area
    - [x] Database List, Create, and Delete
    - [x] Collection List, Create, and Delete
    - [x] Query Stats

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
