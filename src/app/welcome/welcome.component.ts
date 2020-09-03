import { Component, OnInit } from '@angular/core';
import { Resources } from './Resources.service';
import { ThreeService } from './three.service';
import { FirstScene } from './FirstScene.service';
import { NextScene } from "./NextScene.service";
import { SecondScene } from './SecondScene.service';
import { ThirdScene } from './ThirdScene.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  private welcomeCanvas = 'ThreeJSCanvas';
  private ScenePhase:number;

  constructor(
    private RS: Resources,
    private ThreeService: ThreeService,
    private FS: FirstScene,
    private NS: NextScene,
    private SS: SecondScene,
    private TS: ThirdScene,
  ) { }

  ngOnInit() {
    this.ThreeService.InitThree(this.welcomeCanvas);
    this.ThreeService.FirstInit();
    // this.RS.ResourcesCompleted.subscribe((value)=>{
    //   if(value){
    //     console.log('Loaded')
    //     this.Start();
    //   }
    // });
    // this.RS.InitResources();

  }

  Start(){
    this.FS.InitFirstScene();
    this.SS.InitSecondScene();
    this.NS.nextStageFunction();
    
    // gradient
    // var rule = CSSRulePlugin.getRule(".canvas:before");

    this.NS.ScenePhaseChange.subscribe((value)=>{
      switch(value){
        case 1: 
          document.getElementById('Main').classList.add('BG2');
          this.FS.CancelFirstScene();
          this.SS.StartSecondScene();
          this.TS.InitThirdScene();
        break;
        case 2:
          gsap.set('.Background',{css:{background:"linear-gradient( to bottom,#c9e9f2 0%,#c9e9f2 33%,#aee3f2 33%,#aee3f2 100%)"}});
          document.getElementById('Main').classList.remove('BG2');
          this.SS.CancelSecondScene();
          this.TS.StartThirdScene();
        break;
      }
    });
  }

  // render() {
  //   requestAnimationFrame(() => {
  //     this.render();
  //   });

  //   this.ThreeService.render();
  // }

}
