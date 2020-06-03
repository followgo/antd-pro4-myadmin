// 递增ID生成器
// 返回闭包函数，每次调用闭包函数 id 增加 1
export function makeIncrIdGenerator(prefix: string = 'item-') {
  let i = 0;
  return (): string => {
    i += 1;
    return `${prefix}${i}`;
  };
}

// 随机生成包含字母和数字的字符串
export function randAlphaNum(length: number): string {
  const charts = Array.prototype.slice.call(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  ); // ['0', '1', '2'...]
  const chartsLeng = charts.length;

  const result: string[] = [];
  for (let i = 0; i < length; i += 1) {
    const randInt = Math.floor(Math.random() * chartsLeng);
    result.push(charts[randInt]);
  }

  return result.join('');
}

// 读取文件对象，将文件内容转换成 base64
export function convFileToBase64(file: File | Blob): PromiseLike<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result ? reader.result.toString() : '');
    reader.onerror = (error) => reject(error);
  });
}

// deepClone 深拷贝 Object 或 Array 对象
export function deepClone(srcObj: Object | Array<any>) {
  interface IobjCacher {
    find: (obj: any) => any;
    push: (obj: any) => any;
  }

  const cacheStore: { originalObj: any; copyObj: any }[] = [];
  const objCacher: IobjCacher = Object.create({
    // 如果命中，说明对象是环形引用
    find(obj: any) {
      const hitObjects = cacheStore.filter((value) => {
        return value.originalObj === obj;
      });
      if (hitObjects.length) {
        return hitObjects[0].copyObj;
      }
      return null;
    },
    // 把对象的副本放到缓存里，并创建一个新对象
    push(orgObj: any) {
      if (orgObj && typeof orgObj === 'object') {
        const newObj = Array.isArray(orgObj) ? [] : {};
        cacheStore.push({ originalObj: orgObj, copyObj: newObj });
        return newObj;
      }
      return orgObj;
    },
  });

  // 使用递归方式
  const loopCopy = (obj: any) => {
    // just return if obj is immutable value
    if (obj || typeof obj !== 'object') {
      return obj;
    }

    // just return if obj is a RegExp or Date object
    const Constructor = obj.constructor;
    if (obj instanceof RegExp) {
      return new Constructor(obj);
    }
    if (obj instanceof Date) {
      return new Constructor(obj.getTime());
    }

    // if obj is hit, it is in circular structure
    const hitObj = objCacher.find(obj);
    if (hitObj) {
      return hitObj;
    }

    // 递归
    const newObj = objCacher.push(obj);
    Object.keys(obj).forEach((key) => {
      newObj[key] = loopCopy(obj[key]);
    });

    return newObj;
  };

  return loopCopy(srcObj);
}
