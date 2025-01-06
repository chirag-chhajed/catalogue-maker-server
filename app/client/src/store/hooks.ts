import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearImages, setImages } from "@/store/features/imageSlice";
import {
  changeOrganizationId,
  clearOrganizationId,
} from "@/store/features/organizationId";
import type { AppDispatch, RootState } from "@/store/store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useOrganitionIdDispatch = () => {
  const dispatch = useAppDispatch();

  return {
    changeOrganizationId: (orgId: string) =>
      dispatch(changeOrganizationId(orgId)),
    clearOrganizationId: () => dispatch(clearOrganizationId()),
  };
};
export const useOrganizationIdSelector = () => {
  const { organizationId } = useAppSelector((state) => state.orgId);
  const { changeOrganizationId, clearOrganizationId } =
    useOrganitionIdDispatch();

  // Handle initial state and local changes
  useEffect(() => {
    if (!organizationId) {
      const storedId = localStorage.getItem("user_preferred_org");
      // console.log(
      //   `[Init] State organizationId: ${organizationId}, localStorage: ${storedId}`
      // );
      if (storedId) {
        changeOrganizationId(storedId);
      } else {
        clearOrganizationId();
      }
    }
  }, [organizationId]);

  // Handle cross-tab changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user_preferred_org") {
        // console.log(
        //   `[Storage Event] New value: ${e.newValue}, Current state: ${organizationId}`
        // );
        if (e.newValue) {
          changeOrganizationId(e.newValue);
        } else {
          clearOrganizationId();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return organizationId;
};

export const useGetImages = () => {
  const images = useAppSelector((state) => state.image);
  return images;
};

export const useDispatchImages = () => {
  const dispatch = useAppDispatch();
  return {
    setImages: (
      images: {
        uri: string;
        name: string;
        type: string;
      }[]
    ) => dispatch(setImages(images)),
    clearImages: () => dispatch(clearImages()),
  };
};

export const useUserState = () => {
  const { user } = useAppSelector((state) => state.hello);

  return user;
};
