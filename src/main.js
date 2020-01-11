import * as ecs from "./ecs";
import * as c from "./components";
import * as s from "./systems";
import { make, getDirectionByKeyboardEvent } from "./tools";
import * as rot from "rot-js";

function main() {
  const display = new rot.Display({
    width: 30,
    height: 30,
    forceSquareRatio: true,
  });

  const appEl = document.querySelector(".app");

  appEl.appendChild(display.getContainer());

  const engine = new ecs.Engine({
    fixedDeltaTime: 1,
  });

  const player = engine.createEntity(
    make(c.Position, o => {
      o.x = 10;
      o.y = 2;
    }),
    make(c.Move, o => { o.erase(); }),
    make(c.Glyph, o => {
      o.ch = '@';
    }),
    make(ecs.Group, o => { o.name = 'player'; }),
    make(ecs.Group, o => { o.name = 'being'; }),
    make(c.Gold, o => { o.amount = 0; }),
  );

  engine.createEntity(
    make(c.Position, o => {
      o.x = 5;
      o.y = 5;
    }),
    make(c.Glyph, o => {
      o.ch = '$';
      o.fg = 'gold';
    }),
    make(c.Gold, o => { o.amount = 10; }),
    make(ecs.Group, o => { o.name = 'gold'; }),
    make(ecs.Group, o => { o.name = 'not-player'; }),
  );

  engine.addSystem(new s.Move());
  engine.addSystem(new s.DisplayAll());
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
    engine.update(
      [
        engine.getSystem(s.Display),
        engine.getSystem(s.DisplayAll),
      ],
      engine.getAllEntities(),
      0,
    );
  }

  display.clear();
  engine.update(
    [
      engine.getSystem(s.Display),
      engine.getSystem(s.DisplayAll),
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
