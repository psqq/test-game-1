import * as ecs from "./ecs.js";

export class Gold extends ecs.Component {
  constructor() {
    super();
    this.amount = 0;
  }
}

export class Type extends ecs.Component {
  constructor() {
    super();
    this.name = '';
  }
}

export class Position extends ecs.Component {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
  }
}

export class Move extends ecs.Component {
  constructor() {
    super();
    this.dx = 0;
    this.dy = 0;
    this.erase();
  }
  isNeedUpdate() {
    return this.isInitialized();
  }
}

export class Glyph extends ecs.Component {
  constructor() {
    super();
    this.fg = 0;
    this.bg = 0;
    this.ch = ' ';
  }
}
