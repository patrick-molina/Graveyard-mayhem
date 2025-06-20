import { GameManager } from 'GameManager';
import * as hz from 'horizon/core';

/*******************************************************
* Class that manages shooting, projecticle collision, etc.
* 
* TODO: implement an audio manager, with prop definition
* that can be called instead of linking sounds/vfx 
* directly from this class
********************************************************/
class Shoot extends hz.Component<typeof Shoot> {

  static propsDefinition = {
    launcher: { type: hz.PropTypes.Entity },
    objHitForceMultipler: { type: hz.PropTypes.Number },

    //SFX
    fireSFX: { type: hz.PropTypes.Entity },
    zombieHitSFX: { type: hz.PropTypes.Entity },
    ghostHitSFX: { type: hz.PropTypes.Entity },
    propHitSFX: { type: hz.PropTypes.Entity },
    rockHitSFX: { type: hz.PropTypes.Entity },

    //VFX
    objHitVFX: { type: hz.PropTypes.Entity },
  };

  // The game manager
  private _gameManager!: GameManager

  // The options to use when launching the projectile.
  private _launcherOptions: hz.LaunchProjectileOptions = { speed: 100 };

  private _launcherGizmo?: hz.ProjectileLauncherGizmo;

  start() {
    console.log("initialiazing shoot script")

    //get game manager
    this._gameManager = GameManager.getInstance();

    console.log('shooting scrip with Game Manager:' + this._gameManager.entityId);

    // Store a reference to the projectile gizmo in the launcherGizmo variable.
    this._launcherGizmo = this.props.launcher?.as(hz.ProjectileLauncherGizmo);

    if (this._launcherGizmo ) {
   
      // Connecting the event to handle trigger down
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnIndexTriggerDown,
      this.handleTriggerDown.bind(this));

    // Connecting the event to handle collisiton with the projectile gizmo.

      this.connectCodeBlockEvent(
        this._launcherGizmo ,
        hz.CodeBlockEvents.OnProjectileHitEntity, 
        this.handleCollision.bind(this));
    }
    
    else {
      console.error("No projectile launcher gizmo found on the entity.");
    }      
  } 
  

  // This function is called when the trigger is pressed down.
  // It will play a sound and launch the projectile.
  private handleTriggerDown(player: hz.Player) {
    console.log("shot fired");

    // firing sound
    let shootSFX = this.props.fireSFX?.as(hz.AudioGizmo);

    if (shootSFX) {
      shootSFX.position.set(this.entity.position.get());
      shootSFX.play();
    }
    // launch the gizmo
    if (this._launcherGizmo) {
      this._launcherGizmo.launch(this._launcherOptions);
    }
  }

  // This function is called when the projectile collides with an object.
  // It will apply a force to the object hit and play the appropriate sound. 
  private handleCollision(objectHit: hz.Entity, position: hz.Vec3, normal: hz.Vec3) {
    console.log("collision detected");

    // the sound that will be played later
    let hitSound;

    // apply force (as long as object are interactable)
    console.log("Applying foce: " + this.props.objHitForceMultipler);

    objectHit.as(hz.PhysicalEntity)?.applyForceAtPosition(
      normal.mulInPlace(-1 * this.props.objHitForceMultipler),
      position,
      hz.PhysicsForceMode.Impulse);

    // determine if the object hit is killable (i.e. a mob). 
    if (objectHit.tags.contains("killable")) {

      // object is a mob that can be killed
      console.log("projectile hit a mob");

      // increment score
      this._gameManager.incrementScore();
    }

    // determine the sound to be played
    if (objectHit.tags.contains("prop")) {
      hitSound = this.props.propHitSFX?.as(hz.AudioGizmo);
    } else if (objectHit.tags.contains("zombie")) {
      hitSound = this.props.zombieHitSFX?.as(hz.AudioGizmo);
    } else if (objectHit.tags.contains("ghost")) {
      hitSound = this.props.ghostHitSFX?.as(hz.AudioGizmo);
    }  else {
      hitSound = this.props.rockHitSFX?.as(hz.AudioGizmo);
    }
    if (hitSound) {
      hitSound.position.set(position);
      hitSound.play();
    }
  }
}

hz.Component.register(Shoot)