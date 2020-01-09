const rot = ROT;

const display = new rot.Display({
  width: 30,
  height: 30,
  forceSquareRatio: true,
});

document.body.appendChild(display.getContainer());

display.draw(3, 1, '@', 'white', 'black');
