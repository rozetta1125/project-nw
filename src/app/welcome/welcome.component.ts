import { Component, OnInit } from '@angular/core';
import { Resources } from './Resources.service';
import { ThreeService } from './three.service';
import { FirstScene } from './FirstScene.service';
import { NextScene } from "./NextScene.service";
import { SecondScene } from './SecondScene.service';
import { ThirdScene } from './ThirdScene.service';
import { TweenLite,Power1 } from 'gsap';

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

  private LoadingTime = {value:0};
  ngOnInit() {
    this.ThreeService.InitThree(this.welcomeCanvas);
    this.ThreeService.FirstInit();
    this.ThreeService.Loader.subscribe((value)=>{
      if(value){
        console.log("Loading");
        // Start Timer
        TweenLite.to(this.LoadingTime,3,{value:1});
        this.RS.InitResources();

        this.RS.ResourcesCompleted.subscribe((value)=>{
          if(value){
            console.log('Loaded');
            this.Start();

            // if Timer
            if(this.LoadingTime.value==1){
              // TweenLite.to(this.ThreeService.Goal,1.5,{ease:Power1.easeInOut,x:0});
              // TweenLite.delayedCall(3,()=>{
              //   this.NS.restart();
              // })

            } else {
              // TweenLite.to(this.ThreeService.Goal,1.5,{ease:Power1.easeInOut,x:0,delay:3});
              // TweenLite.delayedCall(3,()=>{
              //   this.NS.restart();
              // })
            }
          }
        });
      }
    });


    

  }

  Start(){
    // this.FS.InitFirstScene();
    // this.SS.InitSecondScene();
    // this.NS.nextStageFunction();
    
    // gradient
    // var rule = CSSRulePlugin.getRule(".canvas:before");

    // this.NS.ScenePhaseChange.subscribe((value)=>{
    //   switch(value){
    //     case 1: 
    //       document.getElementById('Main').classList.add('BG2');
    //       this.FS.CancelFirstScene();
    //       this.SS.StartSecondScene();
    //       this.TS.InitThirdScene();
    //     break;
    //     case 2:
    //       TweenLite.set('.Background',{css:{background:"linear-gradient( to bottom,#c9e9f2 0%,#c9e9f2 31%,#aee3f2 31%,#aee3f2 100%)"}});
    //       document.getElementById('Main').classList.remove('BG2');
    //       this.SS.CancelSecondScene();
    //       this.TS.StartThirdScene();
    //     break;
    //   }
    // });

    // testing
    this.TS.InitThirdScene();
    this.TS.StartThirdScene();
  }

  // render() {
  //   requestAnimationFrame(() => {
  //     this.render();
  //   });

  //   this.ThreeService.render();
  // }

}
