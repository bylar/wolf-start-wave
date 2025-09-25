export const randomUUID = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const getLocalPcID = function () {
  const lastPCId = read('pcId');
  if (lastPCId) {
    return lastPCId;
  }
  const uuid = randomUUID();
  write('pcId', uuid);
  return uuid;
}

export const write = function (key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const read = function (key: string) {
  return JSON.parse(localStorage.getItem(key) || 'null');
}

export const isNull = function (value: any) {
  return value === null || value === undefined;
}

// @ts-ignore
export const copyText = async (value: string) => {
  // 适配常见浏览器
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(value);
    // @ts-ignore
  } else if (window.clipboardData && window.clipboardData.setData) {
    // @ts-ignore
    return window.clipboardData.setData('Text', value);
    // @ts-ignore
  } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    var textarea = document.createElement('textarea');
    textarea.textContent = value;
    textarea.style.position = 'fixed';  // Avoid scrolling to bottom
    document.body.appendChild(textarea);
    textarea.select();
    try {
      // @ts-ignore
      return document.execCommand('copy');  // Security exception may be thrown by some browsers
    } catch (ex) {
      console.warn('Copy to clipboard failed.', ex);
      return false;
    }
  }
}

export const clone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
}


export const shuffle = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j]!, array[i]!];
  }
  return array;
}