import dayjs from "dayjs";

export function timestampToMinsAgo(timestamp) {
  const minDiff = dayjs().diff(dayjs(timestamp), 'minute');
  if (minDiff === 0) {
    return 'Less than a min ago';
  }
  return minDiff + ' mins ago';
}

export function readableDuration(timestamp1, timestamp2) {
  const secondsDiff = dayjs(timestamp2).diff(dayjs(timestamp1), 'second');

  if (secondsDiff <= 1) {
    return secondsDiff + ' sec';
  }
  if (secondsDiff < 60) {
    return secondsDiff + ' secs';
  }

  const minDiff = Math.floor(secondsDiff / 60);

  if (minDiff < 1) {
    return '< 1 min';
  }
  if (minDiff === 1) {
    return '1 min';
  }
  if (minDiff < 60) {
    return minDiff + ' mins';
  }

  const hourDiff = Math.floor(minDiff / 60);
  if (hourDiff === 1) {
    return '1 hr'
  }
  return hourDiff + ' hrs';
}

export function readableTimeAgo(timestamp) {
  return readableDuration(timestamp, dayjs());
}
