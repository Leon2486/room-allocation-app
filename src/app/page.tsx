"use client";

import RoomAllocation from "@/views/room-allocation";

const testData = {
  guest: { adult: 3, child: 6 },
  rooms: [
    { roomPrice: 500, adultPrice: 500, childPrice: 200, capacity: 4 },
    { roomPrice: 500, adultPrice: 100, childPrice: 300, capacity: 4 },
    { roomPrice: 0, adultPrice: 500, childPrice: 300, capacity: 8 },
    { roomPrice: 500, adultPrice: 1000, childPrice: 200, capacity: 2 },
  ],
};

export default function Home() {
  return (
    <main className="p-5">
      <RoomAllocation
        rooms={testData.rooms}
        guest={testData.guest}
        onChange={(result) => console.log(result)}
      />
    </main>
  );
}
