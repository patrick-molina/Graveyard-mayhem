import { Text, Binding, UIComponent, UINode, View } from 'horizon/ui';
import { GameManager } from 'GameManager';

class UI extends UIComponent<typeof UI> {
  protected panelHeight: number = 300;
  protected panelWidth: number = 500;
  static propsDefinition = {};

  _gameManager!: GameManager;

  initializeUI(): UINode {
    // initializing UI 
  
    // retrieving game manager
    this._gameManager = GameManager.getInstance();
    console.log('Initializing UI with Game Manager:' + this._gameManager.entityId);
    
    // binding score
    const scoreBinding = this._gameManager.getScoreBinding();
    
    return View({
      children: [
        Text({
          text: 'Your Score: ',
          style: {
            fontSize: 32,
            textAlign: 'center',
            textAlignVertical: 'top',
            fontFamily: 'Optimistic', 
          }
        }),
        Text({
          text: scoreBinding.derive(scoreValue => String(scoreValue)),
          style: {
            fontSize: 32,
            textAlign: 'center',
            textAlignVertical: 'top',
            height: this.panelHeight,
            width: this.panelWidth,
            fontFamily: 'Bangers',
            color: 'gold', 
          }
        })
      ],
      style: {
        //backgroundColor: '#333333',
        height: this.panelHeight,
        width: this.panelWidth,
        padding: 0.05,
        borderRadius: 0.02,
        flexDirection: 'row',
      }
    }); 
  }
}

UIComponent.register(UI);

export { UI };
