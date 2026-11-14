/* 与页面共用的一套时间 / 状态计算（服务端与浏览器端同源） */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PCRTime = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var DAY = 86400000;
  var HOUR = 3600000;
  var MINUTE = 60000;
  var formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  });

  function parse(value) {
    if (value instanceof Date) return value.getTime();
    if (typeof value === 'number') return value;
    return Date.parse(String(value));
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function parts(value) {
    var date = new Date(parse(value));
    if (Number.isNaN(date.getTime())) return null;
    var out = {};
    formatter.formatToParts(date).forEach(function (part) {
      if (part.type !== 'literal') out[part.type] = part.value;
    });
    return out;
  }

  function clock(value) {
    var p = parts(value == null ? Date.now() : value);
    if (!p) return '';
    return p.year + '.' + p.month + '.' + p.day + ' ' + p.hour + ':' + p.minute + ':' + p.second;
  }

  function clockShort(value) {
    var p = parts(value == null ? Date.now() : value);
    if (!p) return '';
    return p.month + '.' + p.day + ' ' + p.hour + ':' + p.minute;
  }

  function monthOf(value) {
    var p = parts(value == null ? Date.now() : value);
    return p ? Number(p.month) : 1;
  }

  function range(start, end) {
    var a = parts(start);
    var b = parts(end);
    if (!a || !b) return '';
    return a.month + '.' + a.day + ' ' + a.hour + ':' + a.minute +
      ' — ' + b.month + '.' + b.day + ' ' + b.hour + ':' + b.minute;
  }

  function statusOf(start, end, now) {
    var s = parse(start);
    var e = parse(end);
    var n = now == null ? Date.now() : now;
    if (n < s) return 'upcoming';
    if (n > e) return 'ended';
    return 'ongoing';
  }

  function isVisible(start, end, now, beforeDays, afterDays) {
    var s = parse(start);
    var e = parse(end);
    var n = now == null ? Date.now() : now;
    if (n < s) return (s - n) / DAY <= beforeDays;
    if (n > e) return (n - e) / DAY <= afterDays;
    return true;
  }

  function countdown(start, end, now) {
    var s = parse(start);
    var e = parse(end);
    var n = now == null ? Date.now() : now;
    if (n < s) {
      var days = Math.ceil((s - n) / DAY);
      return days <= 1 ? '即将开始' : '即将开始：剩' + days + '天';
    }
    if (n > e) return '已结束';
    var left = e - n;
    var d = Math.floor(left / DAY);
    var h = Math.floor((left % DAY) / HOUR);
    var m = Math.floor((left % HOUR) / MINUTE);
    if (d > 0) return '结束时间：剩 ' + d + '天 ' + h + '时';
    if (h > 0) return '结束时间：剩 ' + h + '时 ' + m + '分';
    return '剩 ' + m + '分';
  }

  function progressOf(start, end, now) {
    var s = parse(start);
    var e = parse(end);
    var n = now == null ? Date.now() : now;
    if (n <= s) return 0;
    if (n >= e) return 100;
    return Math.round(((n - s) / (e - s)) * 100);
  }

  function stateLabel(kind, status) {
    if (kind === 'weapon') {
      return status === 'upcoming' ? 'SOON' : status === 'ongoing' ? 'OPEN' : 'ENDED';
    }
    return status === 'upcoming' ? 'UPCOMING' : status === 'ongoing' ? 'ONGOING' : 'ENDED';
  }

  function stateCN(kind, status) {
    if (kind === 'weapon') {
      return status === 'upcoming' ? '待开专' : status === 'ongoing' ? '已开专' : '已结束';
    }
    return status === 'upcoming' ? '即将开始' : status === 'ongoing' ? '进行中' : '已结束';
  }

  return {
    DAY: DAY,
    HOUR: HOUR,
    MINUTE: MINUTE,
    parse: parse,
    pad: pad,
    parts: parts,
    clock: clock,
    clockShort: clockShort,
    monthOf: monthOf,
    range: range,
    statusOf: statusOf,
    isVisible: isVisible,
    countdown: countdown,
    progressOf: progressOf,
    stateLabel: stateLabel,
    stateCN: stateCN
  };
});
