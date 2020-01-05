const rot = ROT;

const display = rot.Display({
  width: 30,
  height: 30,
});

document.body.appendChild(display.getContainer());

display.draw(1, 1, '@', 'white', 'black');
