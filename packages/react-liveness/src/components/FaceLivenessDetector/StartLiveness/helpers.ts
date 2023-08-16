export function getVideoConstraints(
  isMobileScreen?: boolean
): MediaTrackConstraints {
  if (isMobileScreen) {
    // We're requesting opposite values here because we've focused on
    // portrait first.
    const idealHeight = window.innerWidth;
    const idealWidth = window.innerHeight;

    return {
      width: {
        min: 320,
        ideal: idealWidth,
      },
      height: {
        min: 240,
        ideal: idealHeight,
      },
      frameRate: { min: 15, ideal: 30, max: 30 },
      facingMode: 'user',
    };
  } else {
    return {
      width: {
        min: 320,
        ideal: 640,
      },
      height: {
        min: 240,
        ideal: 480,
      },
      frameRate: { min: 15, ideal: 30, max: 30 },
      facingMode: 'user',
    };
  }
}
