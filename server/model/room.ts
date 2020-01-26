export interface Room {
  id: string;
}

//TODO: pull this out and use some kind of persistence
export const getRoomInfo = (roomId: string): Room | null => {
  if (roomId === 'nu') {
    return { id: 'nu' };
  } else {
    return null;
  }
};
