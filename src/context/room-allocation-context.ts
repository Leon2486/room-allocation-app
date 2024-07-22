import { AllocationResult } from "@/type/type";
import { createContext, Dispatch, SetStateAction } from "react";

type RoomAllocationContextType = {
  result: AllocationResult[];
  setResult: Dispatch<SetStateAction<AllocationResult[]>>;
};

export const RoomAllocationContext = createContext<RoomAllocationContextType>({
  result: [],
  setResult: () => {},
});
