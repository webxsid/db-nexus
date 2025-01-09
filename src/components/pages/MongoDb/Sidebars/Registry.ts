import { TMongoSidebarModule } from "@/store";
import { ReactNode } from "react";

export class _MongoSidebarModuleRegistry {
  private static _instance: _MongoSidebarModuleRegistry;
  private _thumbnails: Map<TMongoSidebarModule, ReactNode> = new Map();
  private _panels: Map<TMongoSidebarModule, ReactNode> = new Map();

  private constructor() {}

  public static get Instance(): _MongoSidebarModuleRegistry {
    if (!this._instance) {
      this._instance = new _MongoSidebarModuleRegistry();
    }
    return this._instance;
  }

  public registerModule(module: TMongoSidebarModule, thumbnail: ReactNode, panel: ReactNode): void {
    this._thumbnails.set(module, thumbnail);
    this._panels.set(module, panel);
  };

  public getModuleThumbnail(module: TMongoSidebarModule): ReactNode {
    return this._thumbnails.get(module);
  }

  public getModulePanel(module: TMongoSidebarModule): ReactNode {
    return this._panels.get(module);
  }

  public unregisterModule(module: TMongoSidebarModule): void {
    this._thumbnails.delete(module);
    this._panels.delete(module);
  }

  public clear(): void {
    this._thumbnails.clear();
    this._panels.clear();
  }
}

export const MongoSidebarModuleRegistry = _MongoSidebarModuleRegistry.Instance;