export interface IMongoDatabaseStats {
  sizeOnDisk?: number;
  empty?: boolean;
}

export interface IMongoDatabaseList {
  databases: {
    [key: string]: IMongoDatabaseStats;
  }
  totalSize?: number;
  ok: 1 | 0;
}

export interface IMongoCollectionList {
  collections: Array<{
    name: string;
    size: number;
    numOfDocuments: number;
    numOfIndexes: number;
  }>;
  ok: 1 | 0;
}