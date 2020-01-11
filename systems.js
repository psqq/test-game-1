import * as ecs from "./ecs.js";
import * as c from "./components.js";

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

export class Move extends ecs.System {
  /**
   * @param {Entity[]} entities
   * @param {number} deltaTime
   */
  update(entities, deltaTime) {
    for(let entity of entities) {
      if (!entity.has(c.Position, c.Move)) {
        continue;
      }
      const pos = entity.get(c.Position);
      const move= entity.get(c.Move);
      pos.x += move.dx;
      pos.y += move.dy;
      move.erase();
    }
  }
}
