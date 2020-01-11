import * as ecs from "./ecs.js";
import * as c from "./components.js";
import Victor from "victor";

export default class BaseSystem extends ecs.System {
  /**
   * @param {Entity} e
   * @param {number} dt
   */
  interact(e, dt) {
    for(let goldEntity of this.engine.getEntitiesInGroup('gold')) {
      const pos = new Victor().copy(goldEntity.get(c.Position));
      if (pos.isEqualTo(e.get(c.Position))) {
        e.get(c.Gold).amount += goldEntity.get(c.Gold).amount;
        this.engine.removeEntity(goldEntity);
      }
    }
  }
}
