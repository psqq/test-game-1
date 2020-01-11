import * as ecs from "./ecs.js";
import * as c from "./components.js";
import BaseSystem from "./base-system.js";
import Victor from "victor";

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
    for (let entity of entities) {
      if (!entity.has(c.Position, c.Glyph)) {
        continue;
      }
      const { x, y } = entity.get(c.Position);
      const { fg, bg, ch } = entity.get(c.Glyph);
      this.display.draw(x, y, ch, fg, bg);
    }
  }
}

export class DisplayAllInfo extends ecs.System {
  constructor() {
    super();
    this.el = document.querySelector(".all-info");
  }
  /**
   * @param {Entity[]} entities
   * @param {number} deltaTime
   */
  update(entities, deltaTime) {
    let s = "";
    for (let e of this.engine.getAllEntities()) {
      if (s != "") {
        s += "\n";
      }
      // ecs.Group
      let ident = "";
      const group = e.get(ecs.Group);
      if (group) {
        s += ident;
        s += `${group.name}:\n`;
      }
      // c.Position
      ident += "  ";
      const position = e.get(c.Position);
      if (position) {
        s += ident;
        s += `Position: ${position.repr()}\n`;
      }
      // c.Gold
      const gold = e.get(c.Gold);
      if (gold) {
        s += ident;
        s += `Gold: ${gold.amount}\n`;
      }
    }
    this.el.innerText = s;
  }
}

export class Move extends BaseSystem {
  /**
   * @param {ecs.Entity[]} entities
   * @param {number} deltaTime
   */
  update(entities, deltaTime) {
    for (let entity of entities) {
      if (!entity.has(c.Position, c.Move)) {
        continue;
      }
      const move = entity.get(c.Move);
      const pos = entity.get(c.Position);
      if (!move.isInitialized()) {
        continue;
      }
      const newPos =
        new Victor()
          .copy(pos)
          .add(new Victor(move.dx, move.dy));
      if (!this.isMovable(newPos)) {
        move.erase();
        continue;
      }
      if (deltaTime <= 0) {
        continue;
      }
      pos.x += move.dx;
      pos.y += move.dy;
      move.erase();
      this.interact(entity, deltaTime);
    }
  }
}
