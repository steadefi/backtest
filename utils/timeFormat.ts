import moment from "moment";
import "moment-duration-format";

export function formatDuration(d: moment.Duration) {
  const str = d.format(" D [days], H [hrs], m [mins], s [secs]");
  if (Math.abs(d.asMinutes()) > 5) {
    return `(${str})`.red;
  } else if (d.asMinutes() > 1) {
    return `(${str})`.magenta;
  } else {
    return `(${str})`.cyan;
  }
}

export function elapsed(from: number, to = Date.now()) {
  const duration = moment.duration(to - from, "ms");
  return formatDuration(duration);
}

export function getDuration(from: Date, to: Date): moment.Duration {
  return moment.duration(to.getTime() - from.getTime(), "ms");
}
