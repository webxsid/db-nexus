// src/renderer/components/Registry.tsx
import { ComponentType } from "react";
import { TMongoValueKind, TMongoValueNormalized } from "./ejson/kind";

export type TRendererProps = {
  fieldName: string;
  norm: TMongoValueNormalized;
  level: number;
  path: string[];
};

const registry = new Map<TMongoValueKind, ComponentType<TRendererProps>>();

export function register(kind: TMongoValueKind, c: ComponentType<TRendererProps>): void {
  registry.set(kind, c);
}

export function getRenderer(kind: TMongoValueKind): ComponentType<TRendererProps> | undefined {
  return registry.get(kind);
}

export function getAllKinds(): TMongoValueKind[] {
  return Array.from(registry.keys());
}
