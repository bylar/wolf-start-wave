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