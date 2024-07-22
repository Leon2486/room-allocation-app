import { AllocationResult, Guest, Room } from "@/type/type";

export function getDefaultRoomAllocation(
  guest: Guest,
  rooms: Room[]
): AllocationResult[] {
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
  if (totalCapacity < guest.adult + guest.child) {
    return rooms.map(() => ({ adult: 0, child: 0, price: 0 }));
  }

  const n = rooms.length;
  const dp = Array.from({ length: guest.adult + 1 }, () =>
    Array.from({ length: guest.child + 1 }, () => Infinity)
  );

  const allocation = Array.from({ length: guest.adult + 1 }, () =>
    Array.from<unknown, { adult: number; child: number }[]>(
      { length: guest.child + 1 },
      () => []
    )
  );

  dp[0][0] = 0;
  allocation[0][0] = Array.from({ length: n }, () => ({
    adult: 0,
    child: 0,
  }));

  rooms.forEach((room, roomIndex) => {
    for (let a = guest.adult; a >= 0; a--) {
      for (let c = guest.child; c >= 0; c--) {
        for (let i = 1; i <= room.capacity; i++) {
          for (let j = 0; j + i <= room.capacity; j++) {
            if (a >= i && c >= j) {
              const cost =
                dp[a - i][c - j] +
                room.roomPrice +
                room.adultPrice * i +
                room.childPrice * j;

              if (cost < dp[a][c]) {
                dp[a][c] = cost;
                allocation[a][c] = (allocation[a - i][c - j] || []).map(
                  (alloc, index) =>
                    index === roomIndex ? { adult: i, child: j } : alloc
                );
              }
            }
          }
        }
      }
    }
  });

  const result = allocation[guest.adult][guest.child].map((alloc, index) => ({
    ...alloc,
    price:
      alloc.adult * rooms[index].adultPrice +
      alloc.child * rooms[index].childPrice +
      (alloc.adult !== 0 ? rooms[index].roomPrice : 0),
  }));

  return result;
}
