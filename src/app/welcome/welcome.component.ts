import { Component, OnInit } from '@angular/core';
import { Resources } from './Resources.service';
import { ThreeService } from './three.service';
import { FirstScene } from './FirstScene.service';
import { NextScene } from "./NextScene.service";
import { SecondScene } from './SecondScene.service';
import { ThirdScene } from './ThirdScene.service';
import { Power1,Power3, TweenMax } from 'gsap';

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

    // ABOUT PAGE
    let AboutButton = document.getElementById("about-button");
    AboutButton.addEventListener('click',()=>{
      this.AboutMenu();
    });

    let HomeButton = document.getElementById("home-button");
    HomeButton.addEventListener('click',()=>{
      this.CloseAboutMenu();
    });

    // THREE STUFF
    this.ThreeService.InitThree(this.welcomeCanvas);
    this.ThreeService.FirstInit();
    this.ThreeService.Loader.subscribe((value)=>{
      if(value){
        console.log("Loading");
        // Start Timer
        TweenMax.to(this.LoadingTime,3,{value:1});
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

  private AboutPage=0;
  // true mean waiting, false ready
  private AboutPageThrottle=false;
  AboutMenu(){
    document.getElementById("content-about").classList.add('open');
    document.addEventListener('wheel',(e)=>{
      if(!this.AboutPageThrottle){
        if(e.deltaY>0){
          // Down
          if(this.AboutPage!=-2){
            TweenMax.to('.slide-wrapper',1.2,{yPercent:"-=33",ease:Power3.easeInOut})
            TweenMax.to('.bar .l1',1.2,{attr:{x2:"+=33"},ease:Power3.easeInOut})
            this.AboutPage-=1;

            if(this.AboutPage==-2){
              TweenMax.to('.scroll',1.2,{opacity:0,ease:Power3.easeInOut})
            }
          }
        } else {
          // Up
          if(this.AboutPage!=0){
            TweenMax.to('.slide-wrapper',1.2,{yPercent:"+=33",ease:Power3.easeInOut})
            TweenMax.to('.bar .l1',1.2,{attr:{x2:"-=33"},ease:Power3.easeInOut})
            this.AboutPage+=1;

            if(this.AboutPage==-1){
              TweenMax.to('.scroll',1.2,{opacity:1,ease:Power3.easeInOut})
            }
          }
        }
        this.AboutPageThrottle=true;
        setTimeout(() => {
          this.AboutPageThrottle=false;
        }, 1200);
      }

    })
  }

  CloseAboutMenu(){
    document.getElementById("content-about").classList.remove('open');
  }

  Start(){
    this.FS.InitFirstScene();
    this.SS.InitSecondScene();
    this.NS.nextStageFunction();
    
    this.NS.ScenePhaseChange.subscribe((value)=>{
      switch(value){
        case 0:
          TweenMax.to('#about-button',1,{opacity:1})
          TweenMax.set('#about-button',{visibility:'visible'});
          break;
        case 1: 
          document.getElementById('Main').classList.add('BG2');
          document.getElementById('arrow-fill').style.fill="#CDD9C6";
          
          this.FS.CancelFirstScene();
          this.SS.StartSecondScene();
          this.TS.InitThirdScene();
          
        break;
        case 2:
          TweenMax.set('.Background',{css:{background:"linear-gradient( to bottom,#c9e9f2 0%,#c9e9f2 31%,#aee3f2 31%,#aee3f2 100%)"}});
          document.getElementById('Main').classList.remove('BG2');
          document.getElementById('arrow-fill').style.fill="#AEE3F2";
          this.SS.CancelSecondScene();
          this.TS.StartThirdScene();
        break;
      }
    });

    // testing
    // this.TS.InitThirdScene();
    // this.TS.StartThirdScene();
  }

  // render() {
  //   requestAnimationFrame(() => {
  //     this.render();
  //   });

  //   this.ThreeService.render();
  // }

}

