import { Component, OnInit } from '@angular/core';
import { Resources } from './Resources.service';
import { ThreeService } from './three.service';
import { FirstScene } from './FirstScene.service';
import { NextScene } from "./NextScene.service";
import { SecondScene } from './SecondScene.service';
import { ThirdScene } from './ThirdScene.service';
import { Power1,Power3, TweenMax } from 'gsap';
import { FourthScene } from './FourthScene.service';

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
    private FourthS: FourthScene,
  ) { }

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
        this.RS.InitResources();
        this.RS.ResourcesCompleted.subscribe((value)=>{
          if(value){
            console.log('Loaded');
            this.Start();
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
          TweenMax.delayedCall(3,()=>{
            document.getElementById('Main').classList.add('BG3');
          })
          this.SS.CancelSecondScene();
          this.TS.StartThirdScene();
          this.FourthS.lastScreen();
        break;
        case 3:
          // TweenMax.set('.Background',{css:{background:"linear-gradient( to bottom,#e5c2b6 0%,#e5c2b6 31%,#e8d8cd 31%,#e8d8cd 100%)"}});
          document.getElementById('Main').classList.add('BG2');
          document.getElementById('arrow-fill').style.fill="#e8d8cd";
          this.FourthS.StartFourthScene();
        break;
      }
    });

    // testing
    // this.TS.InitThirdScene();
    // this.TS.StartThirdScene();
  }

  changeBackground(color:string){
    

  }

  // render() {
  //   requestAnimationFrame(() => {
  //     this.render();
  //   });

  //   this.ThreeService.render();
  // }

}

