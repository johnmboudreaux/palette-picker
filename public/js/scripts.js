
const generateColors = () => {
  const red = generateColorNumber();
  const green = generateColorNumber();
  const blue = generateColorNumber();

  return `#${red}${green}${blue}`;
};

const generateColorNumber = () => {
  const value = Math.floor(Math.random() * 255).toString(16);
  return value;
};
