import {Component, OnInit} from 'angular2/core';
import {Card} from './card';
import {Logo} from './logo';
import {LogoService} from './logo.service';
import {NgStyle} from 'angular2/common'


/*
 <img [hidden]="!card.visible" src="{{logos[card.idLogo].image}}">
*/
@Component({
  selector: 'my-app',
  template:`
    <h1>{{title}}</h1>
    <div class="panel-top">
      <button class="reset" (click)="onReset()">{{textButton}}</button>
      {{textInfo}}

    </div>
    <div class="cards">
      <span *ngFor="#card of cards"
        [ngStyle]="{'background-image': card.image}"
        [class.found]="card.found"
        (click)="onFlip(card)">
      </span>
    </div>
  `,
  styles:[`
    h1 {
      color: #4CAF50;
    }
    .cards {
    }
    .cards span {
      display:inline-block;
      cursor: pointer;
      background-color:#4CAF50;
      background-image:url("img/cover.jpg");
      background-size: 80px 80px;
      margin: 10px 10px;
      border-radius: 4px;
      width:80px !important;
      height:80px !important;
      -webkit-transition: background-color 2s;
      transition: background-color 2s;
    }.cards span.found {
      background-color: #FFFFFF !important;
      cursor: auto !important;

    }
    .cards span:hover {
      border-bottom-right-radius:15px;
      background-color: #448AA5;
    }
    img {
    	width:80px;
    	height:80px;
    }
    .panel-top {
      margin-top:10px;
      color: #4CAF50;
      font-size: 20px;
    }
    button.reset {
      cursor: pointer;
      text-align: center;
      background-color: #448AA5;
      border: none;
      border-radius: 4px;
      color: white;
      padding: 15px 32px;
      margin: 10px;
      text-align: center;
      display: inline-block;
    }

  `],
  providers: [LogoService],
  directives: [NgStyle]
})
export class AppComponent implements OnInit {
  public title: string = 'Concentration Game';
  public textInfo: string = 'Flip the cards';
  public textButton: string = 'Reset';
  public logos: Logo[];
  public cards: Card[];
  public previousCard: Card;
  public canFlip: boolean = false;
  public updateBoard;
  public showAll;
  public record: number = Infinity;
  public nbRound: number;

  constructor(private _logoService: LogoService) { }

  getLogos() {
      this._logoService.getLogos().then(logos => { 
          this.logos = logos; 
          this.initBoard();
      });
  }

  ngOnInit() {
    this.getLogos();
  }

  initBoard() {
    this.nbRound = 0;
    this.cards = [];
    var size = 2*(this.logos.length);
    this.logos.forEach(logo => {
        var firstDone = false;
        var secondDone = false;
        while (!firstDone || !secondDone) {
            var index = Math.floor(size * Math.random());
            if (this.cards[index] == undefined) {
                this.cards[index] = {"idLogo" : logo.id ,
                    "found": false, "image": "none"};
                if (firstDone) {
                    secondDone = true;
                }
                firstDone = true;
            }
        }
    });
    this.canFlip = true;
  }

  onFlip(card: Card) {
    if (this.canFlip && card != this.previousCard && card.found != true) {
        this.nbRound++;
        card.image = "url(" + this.logos[card.idLogo].image + ")";
      if (this.previousCard == undefined) {
          this.previousCard = card;
      }
      else {
          this.canFlip = false;
          this.updateBoard = setTimeout(() => {
              if (card.idLogo == this.previousCard.idLogo) {
                  card.found = true;
                  this.previousCard.found = true;

                  var gameOver = true;
                  this.cards.forEach(card => {
                      if (!card.found) { gameOver = false; }
                  });
                  if (gameOver) { 
                      
                      this.previousCard.found = true;
                      this.showAll = setTimeout(() => {
                        if (this.nbRound < this.record) { 
                            this.textInfo = "Best: " + this.nbRound / 2 + " rounds";
                            this.record = this.nbRound;
                          }
                        this.textButton = "Try again";
                        this.cards.forEach((card) => {
                            card.found = false;
                            card.image = "url(" + this.logos[card.idLogo].image + ")";
                            this.canFlip = false;
                        });
                      }, 1500);
                      
                  }
              }
              card.image = "none";
              this.previousCard.image = "none";
              this.previousCard = undefined;
              this.canFlip = true;
          }, 500);
      }
    }
  }

  onReset() {
      clearTimeout(this.updateBoard);
      clearTimeout(this.showAll);
      this.textButton = "Reset";
      this.initBoard();
      this.previousCard = undefined;

  }

}
