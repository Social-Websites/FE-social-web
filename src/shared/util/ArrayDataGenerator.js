const ArrayDataGenerator = ({ count, digit }) => {
  const array = [];
  for (let index = 0; index < count; index++) {
    const element = Math.round(Math.random() * digit);
    array.push(element);
  }
  return array;
};

const randomValueGenerator = ({ digit }) => {
  const elm = Math.round(Math.random() * digit);
  return elm;
};

export { randomValueGenerator, ArrayDataGenerator };
