'use strict';

const { fromLocalInput, toLocalInput, formatDateTime } = require('./dates');

function text(value) {
  return String(value == null ? '' : value).trim();
}

function isImagePath(value) {
  return /^\/images\/[^\s]+$/.test(value) || /^https?:\/\/[^\s]+$/i.test(value);
}

function isUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function readFields(fields, body, existing = {}) {
  const item = { ...existing };
  const errors = {};

  for (const field of fields) {
    const raw = body[field.key];
    const value = text(raw);

    if (field.type === 'textarea') {
      item[field.key] = value;
      if (field.required && !value) errors[field.key] = `请填写${field.label}`;
      continue;
    }

    if (field.type === 'datetime') {
      if (!value) {
        if (field.required) errors[field.key] = `请填写${field.label}`;
        item[field.key] = '';
        continue;
      }
      const iso = fromLocalInput(value);
      if (!iso) {
        errors[field.key] = `${field.label}格式不正确`;
        continue;
      }
      item[field.key] = iso;
      continue;
    }

    if (field.type === 'date') {
      if (!value) {
        if (field.required) errors[field.key] = `请填写${field.label}`;
        item[field.key] = '';
        continue;
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value + 'T00:00:00+08:00'))) {
        errors[field.key] = `${field.label}格式不正确（YYYY-MM-DD）`;
        continue;
      }
      item[field.key] = value;
      continue;
    }

    if (field.type === 'select') {
      const allowed = (field.options || []).map((option) => option.value);
      if (!value) {
        if (field.required) errors[field.key] = `请选择${field.label}`;
        item[field.key] = field.options?.[0]?.value || '';
      } else if (!allowed.includes(value)) {
        errors[field.key] = `${field.label}取值不合法`;
      } else {
        item[field.key] = value;
      }
      continue;
    }

    if (field.type === 'image') {
      if (!value) {
        if (field.required) errors[field.key] = `请填写${field.label}路径`;
        item[field.key] = '';
      } else if (!isImagePath(value)) {
        errors[field.key] = `${field.label}需以 /images/ 或 http(s):// 开头`;
      } else {
        item[field.key] = value;
      }
      continue;
    }

    if (field.type === 'url') {
      if (!value) {
        if (field.required) errors[field.key] = `请填写${field.label}`;
        item[field.key] = '';
      } else if (!isUrl(value)) {
        errors[field.key] = `${field.label}必须是 http(s) 链接`;
      } else {
        item[field.key] = value;
      }
      continue;
    }

    if (field.type === 'number') {
      if (!value) {
        if (field.required) errors[field.key] = `请填写${field.label}`;
        item[field.key] = '';
        continue;
      }
      const number = Number(value);
      if (!Number.isFinite(number)) {
        errors[field.key] = `${field.label}必须是数字`;
      } else if (field.min != null && number < field.min) {
        errors[field.key] = `${field.label}不能小于 ${field.min}`;
      } else {
        item[field.key] = number;
      }
      continue;
    }

    item[field.key] = value;
    if (field.required && !value) errors[field.key] = `请填写${field.label}`;
  }

  if (item.start && item.end && Date.parse(item.end) <= Date.parse(item.start)) {
    errors.end = '结束时间必须晚于开始时间';
  }

  return { item, errors };
}

function formValues(fields, item) {
  const values = {};
  for (const field of fields) {
    const value = item?.[field.key];
    values[field.key] = field.type === 'datetime' ? toLocalInput(value) : value ?? '';
  }
  return values;
}

function displayValue(field, item) {
  const value = item?.[field.key];
  if (field.type === 'datetime') return formatDateTime(value);
  if (field.type === 'image') return value || '';
  return value == null ? '' : String(value);
}

function truncate(value, length = 70) {
  const textValue = String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
  return textValue.length > length ? textValue.slice(0, length) + '…' : textValue;
}

module.exports = { readFields, formValues, displayValue, truncate, isImagePath };
