/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */
const fs = require('fs');

const aggregate = (filePath) => {
  const map1 = new Map();
  const map2 = new Map();
  const map3 = new Map();
  const map4 = new Map();
  const sumofgdp = new Map();
  const sumofpop = new Map();

  const info = fs.readFileSync('cc-mapping.txt', 'utf8');
  const split3 = info.split('\n');
  for (let j = 1; j < split3.length; j += 1) {
    const split4 = split3[j].split(',');
    map3.set(split4[0], split4[1]);
  }

  const data = fs.readFileSync(filePath, 'utf8');
  const split1 = data.split('\n');
  for (let i = 1; i < split1.length - 2; i += 1) {
    const split2 = split1[i].split(',');
    map1.set(split2[0].slice(1, -1), split2[4].slice(1, -1));
    map2.set(split2[0].slice(1, -1), split2[7].slice(1, -1));
    map4.set(split2[0].slice(1, -1), map3.get(split2[0].slice(1, -1)));
  }

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
  console.log(sumofgdp);
  console.log(sumofpop);

  const jsonFormat = {};
  const outputfile = './output/output.json';
  sumofgdp.forEach((value, key) => {
    jsonFormat[key] = {
      GDP_2012: value,
      POPULATION_2012: sumofpop.get(key),
    };
  });
  fs.writeFileSync(outputfile, JSON.stringify(jsonFormat));
};

module.exports = aggregate;
