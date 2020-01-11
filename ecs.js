
export class Engine {
  /**
   * @param {Object} options
   * @param {number} options.fixedDeltaTime
   */
  constructor(options) {
    /** @type {System[]} */
    this.systems = [];
    /** @type {Map<number, Entity>} */
    this.entities = new Map();
    this.fixedDeltaTime = options.fixedDeltaTime || 0;
    this._uid = 0;
  }
  getSystem(SystemClass) {
    for(let system of this.systems) {
      if (system instanceof SystemClass) {
        return system;
      }
    }
  }
  /**
   * @param {Entity} entity
   */
  removeEntity(entity) {
    this.entities.delete(entity.id);
  }
  /**
   * @type {System} system
   */
  addSystem(system) {
    system.setEngine(this);
    this.systems.push(system);
  }
  getAllSystems() {
    return this.systems;
  }
  getAllEntities() {
    return this.entities.values();
  }
  getEntitiesInGroup(groupName) {
    let result = [];
    for(let e of this.entities.values()) {
      for(let g of e.gets(Group)) {
        if (g.name == groupName) {
          result.push(e);
        }
      }
    }
    return result;
  }
  /**
   * @param {Component[]} components
   */
  createEntity(...components) {
    let id = this._uid++;
    let entity = new Entity(id, components);
    this.entities.set(id, entity);
    return entity;
  }
  isNeedUpdate() {
    for(let e of this.entities.values()) {
      if (e.isNeedUpdate()) {
        return true;
      }
    }
    return false;
  }
  /**
   * @param {System[]} systems
   * @param {Entity[]} entities
   * @param {number} deltaTime
   */
  update(systems, entities, deltaTime) {
    if (!systems || systems.length == 0 || !entities || entities.length == 0) {
      return;
    }
    for(let system of systems) {
      system.update(entities, deltaTime);
    }
  }
}

export class Entity {
  /**
   * @param {number} id
   * @param {Component[]} components
   */
  constructor(id, components) {
    this.id = id;
    this.components = components || [];
  }
  isNeedUpdate() {
    for(let c of this.components) {
      if (c.isNeedUpdate()) {
        return true;
      }
    }
    return false;
  }
  _hasOne(ComponentClass) {
    return !!this.get(ComponentClass);
  }
  gets(ComponentClass) {
    let result = [];
    for(let component of this.components) {
      if (component instanceof ComponentClass) {
        result.push(component);
      }
    }
    return result;
  }
  get(ComponentClass) {
    return this.gets(ComponentClass)[0];
  }
  has(...ComponentClasses) {
    for(let ComponentClass of ComponentClasses) {
      if (!this._hasOne(ComponentClass)) {
        return false;
      }
    }
    return true;
  }
}

export class Component {
  constructor() {}
  erase() {
    for(let key in this) {
      this[key] = null;
    }
  }
  isInitialized() {
    for(let key in this) {
      if (this[key] != null) {
        return true;
      }
    }
    return false;
  }
  isNeedUpdate() {
    return false;
  }
}

export class System {
  constructor() {
    this.engine = null;
  }
  setEngine(engine) {
    this.engine = engine;
  }
  /**
   * @param {Entity[]} entities
   * @param {number} deltaTime
   */
  update(entities, deltaTime) { }
}

export class Group extends Component {
  constructor() {
    super();
    this.name = '';
  }
}
