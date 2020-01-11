import * as ecs from "./ecs.js";
import * as c from "./components.js";
import BaseSystem from "./base-system.js";

export class Display extends ecs.System {
  constructor(display) {
    super();
    this.display = display;
  }
  /**
   * @param {Entity[]} entities
   * @param {number} deltaTime
   */
  update(entities, deltaTime) {
    for(let entity of entities) {
      if (!entity.has(c.Position, c.Glyph)) {
        continue;
      }
      const {x, y} = entity.get(c.Position);
      const {fg, bg, ch} = entity.get(c.Glyph);
      this.display.draw(x, y, ch, fg, bg);
    }
  }
}

export class DisplayAll extends ecs.System {
  constructor() {
    super();
    this.el = document.querySelector(".all-info");
  }
  /**
   * @param {Entity[]} entities
   * @param {number} deltaTime
   */
  update(entities, deltaTime) {
    this.el.innerText = "";
    const p = (...args) => {
      this.el.innerText += args.join("");
    };
    for(let e of this.engine.getAllEntities()) {
      if (this.el.innerText) {
        this.el.innerText += "\n";
      }
      const typeName = e.get(ecs.Group).name;
      const res = { [typeName]: {
        id: e.id,
        components: [],
      }};
      for(let c of e.components) {
        res[typeName].components.push({
          [c.constructor.name]: c,
        });
      }
      p(JSON.stringify(res, null, 2));
    }
  }
}

export class Move extends BaseSystem {
  /**
   * @param {Entity[]} entities
   * @param {number} deltaTime
   */
  update(entities, deltaTime) {
    for(let entity of entities) {
      if (!entity.has(c.Position, c.Move)) {
        continue;
      }
      const move = entity.get(c.Move);
      const pos = entity.get(c.Position);
      if (!move.isInitialized()) {
        continue;
      }
      pos.x += move.dx;
      pos.y += move.dy;
      move.erase();
      this.interact(entity, deltaTime);
    }
  }
}
