import { Component, Entity, PropTypes, Vec3, Quaternion, World } from 'horizon/core';

/*******************************************************
* AI generated classes to animate flying ghosts in a 
* circular pattern. 
* Currently not use as this is conflicting with the 
* Physics interactions, notably when hit by a projectile
*********************************************************/
class FlyingGhost extends Component<typeof FlyingGhost> {
  static propsDefinition = {
    ghost: { type: PropTypes.Entity },
    radius: { type: PropTypes.Number, default: 5 },
    speed: { type: PropTypes.Number, default: 1 }
  };

  private angle: number = 0;
  private speed!: number;

  start() {
    this.speed = Math.random() * this.props.speed! * 2 - this.props.speed!; // Randomize speed between -speed and speed
    this.connectLocalBroadcastEvent(World.onUpdate, this.onUpdate.bind(this));
  }

  onUpdate({ deltaTime }: { deltaTime: number }) {
    const ghost = this.props.ghost!;
    const center = this.entity.position.get();
    const radius = this.props.radius!;

    this.angle += this.speed * deltaTime;
    const x = center.x + radius * Math.cos(this.angle);
    const z = center.z + radius * Math.sin(this.angle);
    const position = new Vec3(x, center.y, z);
    ghost.position.set(position);

    // Make the ghost face the center
    const direction = center.sub(position).normalize();
    const rotation = Quaternion.lookRotation(direction);
    ghost.rotation.set(rotation);
  }
}

Component.register(FlyingGhost);