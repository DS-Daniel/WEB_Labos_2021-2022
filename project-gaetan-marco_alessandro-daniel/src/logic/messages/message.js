export default class Message {
  constructor(action, object) {
    this.action = action;
    this.type = object.constructor.name;
    this.object = object;
  }
}
