import { GameManager } from 'GameManager';
import * as hz from 'horizon/core';

class Shoot extends hz.Component<typeof Shoot> {

  static propsDefinition = {
    launcher: { type: hz.PropTypes.Entity },
    objHitForceMultipler: { type: hz.PropTypes.Number },
    fireSFX: { type: hz.PropTypes.Entity },
    objHitSFX: { type: hz.PropTypes.Entity },
    objHitVFX: { type: hz.PropTypes.Entity },
    rockHitSFX: { type: hz.PropTypes.Entity },
  };

  // The game manager
  _gameManager!: GameManager

  // The options to use when launching the projectile.
  _launcherOptions: hz.LaunchProjectileOptions = { speed: 100 };


  start() {
    console.log("initialiazing shoot script")

    //get game manager
    this._gameManager = GameManager.getInstance();
    console.log('shooting scrip with Game Manager:' + this._gameManager.entityId);

    // Store a reference to the projectile gizmo in the launcherGizmo variable.
    let launcherGizmo = this.props.launcher?.as(hz.ProjectileLauncherGizmo);

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnIndexTriggerDown, (player: hz.Player) => {
      console.log("shot fired");

      // firing sound
      let shootSFX = this.props.fireSFX?.as(hz.AudioGizmo);
      if (shootSFX) {
        shootSFX.position.set(this.entity.position.get());
        shootSFX.play();
      }

      // launch the gizmo
      launcherGizmo?.launch(this._launcherOptions);
    });

    if (launcherGizmo) {
      this.connectCodeBlockEvent(
        launcherGizmo,
        hz.CodeBlockEvents.OnProjectileHitEntity,
        (objectHit: hz.Entity, position: hz.Vec3, normal: hz.Vec3) => {
          console.log("collision detected");

          // the sound that will be played later
          let hitSound;

          // apply force (as long as object are interactable)
          console.log("Applying foce: " + this.props.objHitForceMultipler);

          objectHit.as(hz.PhysicalEntity)?.applyForceAtPosition(
            normal.mulInPlace(-1 * this.props.objHitForceMultipler),
            position,
            hz.PhysicsForceMode.Impulse);

          // determine if the object hit is killable. 
          if (objectHit.tags.contains("killable")) {

            // object is a mob that can be killed
            console.log("projectile hit a mob");

            // increment score
            this._gameManager.incrementScore();

            // Play a sound (enemy hit)
            hitSound = this.props.objHitSFX?.as(hz.AudioGizmo);

          }
          // else if (objectHit.tags.contains("destructible")) {
          else {

            // assume it's a tomb
            console.log("projectile hit something else");

            // Play a sound (enemy hit)
            hitSound = this.props.rockHitSFX?.as(hz.AudioGizmo);

            // Do not increment score
          }
        
          // lastly, play the relevant SFX set earlier
          if (hitSound) {
            hitSound.position.set(position);
            hitSound.play();
          }
        },
      );
    }
  }
}

hz.Component.register(Shoot);