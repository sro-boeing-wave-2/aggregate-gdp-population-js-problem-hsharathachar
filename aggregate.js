const fs = require('fs');

const readFileAsync = path => new Promise((resolve, reject) => {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});


const sumofgdp = new Map();
const sumofpop = new Map();

const readMap = (info) => {
  const split3 = info.split('\n');
  const map3 = new Map();
  for (let j = 1; j < split3.length; j += 1) {
    const split4 = split3[j].split(',');
    map3.set(split4[0], split4[1]);
  }
  return (map3);
};

const readCSV = (data, map3) => {
  const split1 = data.split('\n');
  const map1 = new Map();
  const map2 = new Map();
  const map4 = new Map();
  for (let i = 1; i < split1.length - 1; i += 1) {
    const split2 = split1[i].split(',');
    map1.set(split2[0].slice(1, -1), split2[4].slice(1, -1));
    map2.set(split2[0].slice(1, -1), split2[7].slice(1, -1));
    map4.set(split2[0].slice(1, -1), map3.get(split2[0].slice(1, -1)));
  }
  return ([map1, map2, map4]);
};

const aggregate = filePath => new Promise((resolve, reject) => {
  Promise.all([readFileAsync('cc-mapping.txt'), readFileAsync(filePath)]).then((values) => {
    const map3 = readMap(values[0]);
    const maps = readCSV(values[1], map3);
    const map1 = maps[0];
    const map2 = maps[1];
    const map4 = maps[2];
    map4.forEach((value, key) => {
      if (sumofgdp.has(value)) {
        sumofgdp.set(value, parseFloat(sumofgdp.get(value)) + parseFloat(map2.get(key)));
      } else {
        sumofgdp.set(value, parseFloat(map2.get(key)));
      }

      if (sumofpop.has(value)) {
        sumofpop.set(value, parseFloat(sumofpop.get(value)) + parseFloat(map1.get(key)));
      } else {
        sumofpop.set(value, parseFloat(map1.get(key)));
      }
    });
    const jsonFormat = {};
    const outputfile = './output.json';
    sumofgdp.forEach((value, key) => {
      jsonFormat[key] = {
        GDP_2012: value,
        POPULATION_2012: sumofpop.get(key),
      };
    });
    fs.writeFile(outputfile, JSON.stringify(jsonFormat), (err) => {
      if (!err) resolve();
      else reject();
    });
  });
});
module.exports = aggregate;
