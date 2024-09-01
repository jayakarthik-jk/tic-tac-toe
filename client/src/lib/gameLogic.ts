export function getIndexByTrack(track: Uint8Array) {
  return track.reduce(
    (prev, curr, i) => prev + 9 ** (track.length - i - 1) * curr,
    0
  );
}

export function getIndexes(track: Uint8Array) {
  // converting track to index.
  const index = getIndexByTrack(track);
  // extracting array index and byte index from index
  const arrayIndex = Math.floor(index / 8);
  const byteIndex = arrayIndex === 0 ? index : index % (8 * arrayIndex);
  return [arrayIndex, byteIndex] as const;
}

export function isSelected(
  arrayIndex: number,
  byteIndex: number,
  state: Uint8Array
) {
  return (state[arrayIndex] >> byteIndex) % 2 === 1;
}

export function isValidTrackToSelect(
  track: Uint8Array,
  mine: Uint8Array,
  other: Uint8Array
) {
  const [arrayIndex, byteIndex] = getIndexes(track);
  const mineSelected = isSelected(arrayIndex, byteIndex, mine);
  const otherSelected = isSelected(arrayIndex, byteIndex, other);
  return !mineSelected && !otherSelected;
}

export function getUpdatedState(
  state: Uint8Array,
  track: Uint8Array,
  isSet: boolean
) {
  const [arrayIndex, byteIndex] = getIndexes(track);

  const newMine = new Uint8Array(state);

  const temp = 1 << byteIndex;

  if (isSet) {
    newMine[arrayIndex] |= temp;
  } else {
    newMine[arrayIndex] &= ~temp;
  }
  return newMine;
}

export function getLevelBasedGameState(
  state: Uint8Array,
  track: Uint8Array,
  level: number
) {
  if (!track.length) return state;
  const trackToSkip = new Uint8Array(track.length + 1);
  trackToSkip.set(track);
  trackToSkip[track.length] = 0;

  const [arrayIndex, byteIndex] = getIndexes(trackToSkip);

  const subState = state.slice(arrayIndex);
  const updatedState = new Uint8Array(Math.ceil(9 ** level / 8));

  for (let i = 0; i < updatedState.length; i++) {
    const a = subState[i] >> byteIndex;
    let b = 0;
    if (byteIndex !== 0 && i + 1 < subState.length) {
      b = subState[i + 1] << (8 - byteIndex);
    }
    updatedState[i] = a | b;
  }

  return updatedState;
}
