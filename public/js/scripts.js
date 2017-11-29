const generateRandomHex = () => {
  const value = Math.floor(Math.random() * 255).toString(16);

  return value.length === 1 ? '0' + value : value;
};

const generateColor = () => {
  const red = generateRandomHex();
  const green = generateRandomHex();
  const blue = generateRandomHex();

  return `#${red}${green}${blue}`;
};

const setColor = (color, position) => {
  $('.palette-' + position).find('h3').text(color);
  $('.palette-' + position).css('background', color);
};


const setAllColors = () => {
  for (var i = 1; i < 6; i++) {
    setColor(generateColor(), i);
  }
};

setAllColors();
