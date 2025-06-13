import * as hz from 'horizon/core';
import { Binding } from 'horizon/ui';

/*******************************************************
* Game manager singleton class for the game. Currently 
* tracking score only.
* 
* A Binding is used to update the UI, but a copy of the
* score is kept as simple number for internal logic.
* 
* TODO: make it multiplayer friendly, right now there's
* single score 
* 
* TODO: implement a score/leaderboard manager class
********************************************************/
export class GameManager extends hz.Component<typeof GameManager> {
  //export class GameManager  {
  static propsDefinition = {};
  private static _instance: GameManager;

  //game properties
  private score: number = 0;
  private _score: Binding<number>;
  
  //TODO (currently not in use)
  zombies!: number
  Ghosts!: number

  constructor() {
    super();
    
    console.log('constructing Game Manager');
    
    GameManager._instance = this;
    
    // initialize properties
    this._score = new Binding<number>(0);
    this.score = 0;
    this.zombies = 0;
    this.Ghosts = 0;
  }
    
  
  start() {
    console.log('starting Game Manager');
  }

  // return the instance
  public static getInstance(): GameManager {
    if (!this._instance) {
      this._instance = new GameManager();
    }
    return this._instance;
  }

  public getScoreBinding(): Binding<number> {
        return this._score;
    }


    // Method to update the score (using the functional update pattern)
    public addPoints(amount: number) {

      // Update the Binding (for ui purpose only)
      this._score.set(prevScore => prevScore + amount);

      // Update the internal variable (for game logic)
      this.score+=amount;
    }

  
  public getScore():number {
   return this.score 
  }

  public incrementScore() {
    console.log("incrementing score...");
    this.score += 10;
    this._score.set(prevScore => prevScore + 10); 
  }

}

hz.Component.register(GameManager);