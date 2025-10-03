const generateRandomHexColor = () => {
  // Generate a random number between 0 and 16777215 (0xFFFFFF)
  let randomNumber = Math.floor(Math.random() * 16777215);

  // Convert the number to a hexadecimal string
  let hexColor = randomNumber.toString(16);

  // Pad the string with leading zeros if necessary to ensure 6 characters
  // For example, if hexColor is "ff", it becomes "0000ff"
  let paddedHexColor = hexColor.padStart(6, '0');

  // Prepend '#' to form a valid CSS color code
  return `#${paddedHexColor}`;
}

export default generateRandomHexColor;
