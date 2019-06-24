export const concatArrayWithData = (originalArr, data) => {
  return data.new.concat(originalArr).concat(data.old);
};

export const removeItemFromArrayWithItemId = (originalArr, id) => {
  for (let i = 0; i < originalArr.length; i++) {
    if (originalArr[i]._id === id) {
      originalArr.splice(i, 1);
      break;
    }
  }
};

export const getNewMessageCount = (messages, lastMessageId) => {
  if (messages && messages.length > 0) {
    let count = 0;
    for (let i = 0; i < messages.length; i++) {
      if (messages[i]._id === lastMessageId) {
        break;
      }
      count++;
    }

    return count;
  }
  return 0;
};

export const normalizeData = (data, numColumns) => {
  if (data.length > 0 && data.length < numColumns) {
    while (data.length < numColumns) {
      data.push({
        _id: `empty-${data.length}`,
        type: "empty"
      });
    }
    return data;
  }
  return data;
};

export const clone = obj => {
  if (null == obj || typeof obj !== "object") return obj;
  let copy = obj.constructor();
  for (let attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
};
