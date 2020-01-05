const rot = ROT;

const display = rot.Display();

document.body.appendChild(display.getContainer());

display.draw(1, 1, '@', 'white', 'black');
