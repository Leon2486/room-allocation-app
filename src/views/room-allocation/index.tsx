"use client";

import CustomInputNumber from "@/components/custom-input-number";
import { AllocationResult, Guest, Room } from "@/type/type";
import RoomAllocationBlock from "./components/room-allocation-block";
import { useEffect, useMemo, useState, Context } from "react";
import { RoomAllocationContext } from "@/context/room-allocation-context";
import { getDefaultRoomAllocation } from "@/util/get-default-room-allocation";

interface RoomAllocationProps {
  guest: Guest;
  rooms: Room[];
  onChange: (result: AllocationResult) => void;
  className?: string;
}

const RoomAllocation: React.FC<RoomAllocationProps> = (props) => {
  const { className, guest, rooms, onChange } = props;
  const [result, setResult] = useState<AllocationResult[]>(() =>
    getDefaultRoomAllocation(guest, rooms)
  );

  const currentAllocation = useMemo(() => {
    return result.reduce(
      (acc, cal) => {
        if (!cal) return acc;
        return {
          adult: acc.adult + cal.adult,
          child: acc.child + cal.child,
          price: acc.price + cal.price,
        };
      },
      { adult: 0, child: 0, price: 0 }
    );
  }, [result]);

  useEffect(
    function onAllocationChange() {
      onChange(currentAllocation);
    },
    [currentAllocation, onChange]
  );

  return (
    <RoomAllocationContext.Provider
      value={useMemo(() => ({ result, setResult }), [result])}
    >
      <div className={className}>
        <h1>
          住客人數: <span>{guest.adult}</span>位大人 <span>{guest.child}</span>
          位小孩 / <span>{rooms.length}</span> 房
        </h1>
        <section>
          尚未分配人數 <span>{guest.adult - currentAllocation.adult}</span>
          位大人 <span>{guest.child - currentAllocation.child}</span>位小孩{" "}
        </section>
        <section className="py-3 my-3 border-t border-b">
          {rooms.map((room, index) => {
            return (
              <RoomAllocationBlock
                key={index}
                index={index}
                maxAdult={
                  guest.adult - currentAllocation.adult + result[index].adult
                }
                maxChild={
                  guest.child - currentAllocation.child + result[index].child
                }
                room={room}
              />
            );
          })}
        </section>
        <div>總價: {currentAllocation.price}</div>
      </div>
    </RoomAllocationContext.Provider>
  );
};

export default RoomAllocation;
