import * as hz from 'horizon/core';
import { Binding } from 'horizon/ui';

export class GameManager extends hz.Component<typeof GameManager> {
  //export class GameManager  {
  static propsDefinition = {};
  private static _instance: GameManager;

  //game properties
  score: number = 0;
  kills!: number
  zombies!: number
  Ghosts!: number
  private _score: Binding<number>;

  constructor() {
    super();
    console.log('constructing Game Manager');
    GameManager._instance = this;
   this._score = new Binding<number>(0); // Initialize score to 0

  }
    start() {
    console.log('creating Game Manager');

    // initialize properties
    this.score = 0;
    this.kills = 0;
    this.zombies = 0;
    this.Ghosts = 0;

    //this._score= new Binding<number>(0);
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
        this._score.set(prevScore => prevScore + amount);
        //console.log(`Score updated to: ${this._score.get()}`); // .get() should work here for debugging
    }

  // return the instance
  public getScore():number {
   return this.score 
  }

    // return the instance
  public incrementScore() {
    console.log("incrementing score...");
    this.score += 10;
    this._score.set(prevScore => prevScore + 10); 
  }

 // public get gameStateChangedEvent(): any {
  //  if (!this._gameStateChangedEvent) {
  //    this._gameStateChangedEvent = new Event("gameStateChanged");
  //  }
   // return this._gameStateChangedEvent;
  //}

  private publishEvent(eventName: string, eventData: any) {
    // Logic to publish the event (e.g., using the Horizon Worlds event system)
    // For simplicity, just log the event here
    console.log(`Event ${eventName} published with data:`, eventData);
  }



}

hz.Component.register(GameManager);