"use client";

import CustomInputNumber from "@/components/custom-input-number";
import { RoomAllocationContext } from "@/context/room-allocation-context";
import { Room } from "@/type/type";
import clsx from "clsx";
import { useContext, useEffect, useState } from "react";

interface RoomAllocationBlockProps {
  index: number;
  maxAdult: number;
  maxChild: number;
  room: Room;
  className?: string;
}

const RoomAllocationBlock: React.FC<RoomAllocationBlockProps> = (props) => {
  const { maxAdult, maxChild, room, className, index } = props;
  const { result, setResult } = useContext(RoomAllocationContext);
  const allocation = result[index] || { adult: 0, child: 0, price: 0 };

  return (
    <div className={clsx(className, "flex flex-col gap-y-3")}>
      <h2>
        房間: <span>{allocation.adult + allocation.child}</span>
      </h2>
      <h3>
        最多可住<span>{room.capacity}</span>人
      </h3>
      <div className="flex justify-between">
        <div>
          大人
          <p className="text-xs text-gray-500 text-opacity-50">年齡 20 +</p>
        </div>
        <CustomInputNumber
          name="adult"
          min={allocation.child === 0 ? 0 : 1}
          max={Math.min(maxAdult, room.capacity - allocation.child)}
          step={1}
          value={allocation.adult}
          onChange={(e) =>
            setResult((prev) => {
              const newArr = JSON.parse(JSON.stringify(prev)) as typeof prev;
              const item = newArr[index];
              const adultNum = parseInt(e.target.value) || 0;

              newArr[index] = item
                ? {
                    ...item,
                    adult: adultNum,
                    price:
                      room.adultPrice * adultNum +
                      room.childPrice * item.child +
                      room.roomPrice,
                  }
                : {
                    child: 0,
                    adult: adultNum,
                    price: room.adultPrice * adultNum + +room.roomPrice,
                  };
              return newArr;
            })
          }
        />
      </div>
      <div className="flex justify-between">
        <div>小孩</div>
        <CustomInputNumber
          name="child"
          min={0}
          max={Math.min(maxChild, room.capacity - allocation.adult)}
          step={1}
          value={allocation.child}
          disabled={allocation.adult === 0}
          onChange={(e) =>
            setResult((prev) => {
              const newArr = JSON.parse(JSON.stringify(prev)) as typeof prev;
              let item = newArr[index];
              const childNum = parseInt(e.target.value) || 0;

              newArr[index] = item
                ? {
                    ...item,
                    child: childNum,
                    price:
                      room.adultPrice * item.adult +
                      room.childPrice * childNum +
                      room.roomPrice,
                  }
                : {
                    child: childNum,
                    adult: 0,
                    price: room.childPrice * childNum + +room.roomPrice,
                  };

              return newArr;
            })
          }
        />
      </div>
    </div>
  );
};

export default RoomAllocationBlock;
