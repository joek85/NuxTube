import moment from 'moment'
export default {
  formatNumbers(number) {
    return format(number)
  },
  convertTime(time) {
    return converttime(time)
  },
  formatDate(time) {
    return moment(time).fromNow()
  },
  getLocalPath() {
    return require('path').resolve(__dirname, '..')
  },
  bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  },
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

let pow = Math.pow;
let floor = Math.floor;
let abs = Math.abs;
let log = Math.log;

function round(n, precision) {
  let prec = Math.pow(10, precision);
  return Math.round(n * prec) / prec
}
function format(n) {
  let base = floor(log(abs(n)) / log(1000));
  let suffix = 'KMB'[base - 1];
  return suffix ? round(n / pow(1000, base), 0) + suffix : '' + n
}
function converttime(duration) {
  // Hours, minutes and seconds
  let hrs = ~~(duration / 3600);
  let mins = ~~((duration % 3600) / 60);
  let secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;
  return ret
}
function timemoment(t) {
  // console.log(t)
  return moment(t).utcOffset("+02:00").calendar(null, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY'
  });
}
