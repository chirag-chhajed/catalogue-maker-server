import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type OrganizationId = { organizationId: string | null };

const initialState: OrganizationId = {
  organizationId: null,
};

export const helloSlice = createSlice({
  name: "default_organization",
  initialState,
  reducers: {
    changeOrganizationId: (_state, action: PayloadAction<string>) => {
      localStorage.setItem("user_preferred_org", action.payload);
      return { organizationId: action.payload };
    },
    clearOrganizationId: () => {
      localStorage.removeItem("user_preferred_org");
      return { organizationId: null };
    },
  },
});

export const { changeOrganizationId, clearOrganizationId } = helloSlice.actions;
