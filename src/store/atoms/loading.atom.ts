import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { toast } from "react-toastify";
import IRootState, { ILoadingState } from "../types";
import { CoreAtom } from "@/store";

export const LoadingAtom = focusAtom(
  CoreAtom,
  (optic) => optic.prop("loading"),
);

LoadingAtom.debugLabel = "LoadingAtom";

export const startLoadingAtom = atom(
  null,
  (_get, set, payload: Omit<ILoadingState, "active">) => {
    // trigger a react-toastify notification
    toast.loading(payload.message, {
      toastId: payload.reason,
      position: "bottom-center",
    });
    set(LoadingAtom, { ...payload, active: true });
  },
);

export const stopLoadingAtom = atom(
  null,
  (_get, set, payload: Omit<ILoadingState, "active">) => {
    // dismiss the react-toastify notification
    if (toast.isActive(payload.reason)) toast.dismiss(payload.reason);
    switch (payload.status) {
      case "success":
        toast.success(payload.message, {
          toastId: payload.reason,
          position: "bottom-center",
        });
        break;
      case "error":
        toast.error(payload.message, {
          toastId: payload.reason,
          position: "bottom-center",
        });
        break;
      case "warning":
        toast.warning(payload.message, {
          toastId: payload.reason,
          position: "bottom-center",
        });
        break;
      case "info":
        toast.info(payload.message, {
          toastId: payload.reason,
          position: "bottom-center",
        });
        break;
      default:
          break;
    }

    set(LoadingAtom, { active: false, reason: "", message: "" });
  },
);
