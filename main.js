import * as ecs from "./ecs.js";
import * as c from "./components.js";
import * as s from "./systems.js";
import { make, getDirectionByKeyboardEvent } from "./tools.js";

function main() {
  const rot = ROT;

  const display = new rot.Display({
    width: 30,
    height: 30,
    forceSquareRatio: true,
  });

  document.body.appendChild(display.getContainer());

  const engine = new ecs.Engine({
    fixedDeltaTime: 1,
  });

  const player = engine.createEntity(
    make(c.Position, o => {
      o.x = 10;
      o.y = 2;
    }),
    make(c.Move, o => {
      o.erase();
    }),
    make(c.Glyph, o => {
      o.ch = '@';
    }),
    make(ecs.Group, o => {
      o.name = 'player';
    }),
  );

  engine.addSystem(new s.Move());
  engine.addSystem(new s.Display(display));

  function update() {
    display.clear();
    let k = 100;
    while (player.isNeedUpdate() && k > 0) {
      engine.update(
        engine.getAllSystems(),
        engine.getEntitiesInGroup('player'),
        1,
      );
      engine.update(
        engine.getAllSystems(),
        engine.getEntitiesInGroup('not-player'),
        1,
      );
      k--;
    }
    if (k <= 0) {
      console.warn(
        "Update used max iteration! player.isNeedUpdate():",
        player.isNeedUpdate()
      );
    }
  }

  display.clear();
  engine.update(
    [
      engine.getSystem(s.Display),
    ],
    engine.getAllEntities(),
    0,
  );

  document.addEventListener('keydown', (e) => {
    const dir = getDirectionByKeyboardEvent(e);
    if (!dir) {
      return;
    }
    const move = player.get(c.Move);
    move.dx = dir.x;
    move.dy = dir.y;
    update();
  });
}

document.body.onload = () => main();
