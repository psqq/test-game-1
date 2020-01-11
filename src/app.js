import * as ecs from "./ecs";
import * as c from "./components";
import * as s from "./systems";
import { make, getDirectionByKeyboardEvent } from "./tools";
import * as rot from "rot-js";
import config from "./config";

export default class App {
  constructor() {
    this.display = new rot.Display(config.rotjsDisplayOptions);
    /** @type {HTMLDivElement} */
    this.appEl = document.querySelector(".app");
    this.engine = new ecs.Engine({
      fixedDeltaTime: 1,
    });
    /** @type {ecs.Entity} */
    this.player = null;
  }
  init() {
    this.appEl.appendChild(this.display.getContainer());
    this.player = this.engine.createEntity(
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
    this.engine.createEntity(
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
    this.engine.addSystem(new s.Move());
    this.engine.addSystem(new s.DisplayAllInfo());
    this.engine.addSystem(new s.Display(this.display));
    document.addEventListener('keydown', (e) => {
      const dir = getDirectionByKeyboardEvent(e);
      if (!dir) {
        return;
      }
      const move = this.player.get(c.Move);
      move.dx = dir.x;
      move.dy = dir.y;
      this.update();
    });
  }
  draw() {
    this.engine.update([
      this.engine.getSystem(s.Display),
      this.engine.getSystem(s.DisplayAllInfo),
    ],
      this.engine.getAllEntities(), 0,
    );
  }
  update() {
    this.display.clear();
    this.engine.updateAll(0);
    let k = 100;
    while (this.player.isNeedUpdate() && k > 0) {
      this.engine.updateEntitiesGroup('player', 1);
      this.engine.updateEntitiesGroup('not-player', 1);
      k--;
    }
    if (k <= 0) {
      console.warn(
        "Update used max iteration! player.isNeedUpdate():",
        this.player.isNeedUpdate()
      );
    }
    this.draw();
  }
  run() {
    this.draw();
  }
}
