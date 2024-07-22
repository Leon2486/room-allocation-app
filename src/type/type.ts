export type Guest = {
  adult: number;
  child: number;
};

export type Room = {
  roomPrice: number;
  adultPrice: number;
  childPrice: number;
  capacity: number;
};

export type AllocationResult = {
  adult: number;
  child: number;
  price: number;
};
