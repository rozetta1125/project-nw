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
    
    HomeButton.addEventListener('mouseover',()=>{
      HomeButton.classList.add('animation');
    })
  
    HomeButton.addEventListener('animationend',()=>{
      HomeButton.classList.remove('animation');
    })

    // THREE STUFF
    this.ThreeService.InitThree(this.welcomeCanvas);
    this.ThreeService.FirstInit();
    this.ThreeService.Loader.subscribe((value)=>{
      if(value){
        console.log("Loading");
        this.RS.InitResources();
        this.RS.ResourcesCompleted.subscribe((value)=>{
          if(value){
            console.log('Start');
            this.Start();
          }
        });
      }
    });

  }



  AboutMenu(){
    document.getElementById("content-about").classList.add('open');

    TweenMax.delayedCall(1.2,()=>{
      // scroll down event
      document.addEventListener('wheel',this.AboutMenuScroll);

      // swipe down event
      document.addEventListener('touchstart',this.AboutMenuStart)
      document.addEventListener('touchmove',this.AboutMenuMove,{passive:false})
      document.addEventListener('touchend',this.AboutMenuEnd)
    })
  }


  PageUp(){
    if(this.AboutPage!=0){
      TweenMax.to('.slide-wrapper',1.2,{yPercent:"+=33.33",ease:Power3.easeInOut})
      TweenMax.to('.bar .l1',1.2,{attr:{x2:"-=33.33"},ease:Power3.easeInOut})
      this.AboutPage-=1;

      if(this.AboutPage==(this.TotalPage-2)){
        TweenMax.to('.scroll',1.2,{opacity:1,ease:Power3.easeInOut})
      }
      this.AboutPageThrottle=true;
      setTimeout(() => {
        this.AboutPageThrottle=false;
      }, 1200);
    }
  }

  PageDown(){
    if(this.AboutPage != (this.TotalPage-1) ){
      TweenMax.to('.slide-wrapper',1.2,{yPercent:"-=33.33",ease:Power3.easeInOut})
      TweenMax.to('.bar .l1',1.2,{attr:{x2:"+=33.33"},ease:Power3.easeInOut})
      this.AboutPage+=1;

      if(this.AboutPage==(this.TotalPage-1)){
        TweenMax.to('.scroll',1.2,{opacity:0,ease:Power3.easeInOut})
      }
      this.AboutPageThrottle=true;
      setTimeout(() => {
        this.AboutPageThrottle=false;
      }, 1200);
    }
  }

  private AboutPage=0;
  private TotalPage=3;
  // true mean waiting, false ready
  private AboutPageThrottle=false;
  AboutMenuScroll = (e)=>{
    if(!this.AboutPageThrottle){
      if(e.deltaY>0){
        // Down
        this.PageDown();
      } else {
        // Up
        this.PageUp();
      }

    }
  }

  xStart=0;yStart=0;
  xMove=0;yMove=0;
  xDiff=0;yDiff=0;
  AboutMenuStart = (e)=>{
    this.xStart=e.touches[0].clientX;
    this.yStart=e.touches[0].clientY;
  }

  AboutMenuMove = (e)=>{
    e.preventDefault();
    this.xMove=e.touches[0].clientX;
    this.yMove=e.touches[0].clientY;
  }

  AboutMenuEnd = (e)=>{
    if(!this.AboutPageThrottle){
      this.xDiff=this.xStart - this.xMove;
      this.yDiff=this.yStart - this.yMove;
      if(Math.abs(this.xDiff) < Math.abs(this.yDiff)){
        if(this.yDiff>0){
          // up
          this.PageDown();
        } else {
          // down
          this.PageUp();
        }
      }
      this.AboutPageThrottle=true;
      setTimeout(() => {
        this.AboutPageThrottle=false;
      }, 1200);
    }
  }

  CloseAboutMenu(){
    document.getElementById("content-about").classList.remove('open');
    
    // scroll down event
    document.removeEventListener('wheel',this.AboutMenuScroll);

    // swipe down event
    document.removeEventListener('touchstart',this.AboutMenuStart)
    document.removeEventListener('touchmove',this.AboutMenuMove)
    document.removeEventListener('touchend',this.AboutMenuEnd)
  }

  Start(){
    this.FS.InitFirstScene();
    this.SS.InitSecondScene();
    this.NS.nextStageFunction();
    this.NS.ScenePhaseChange.subscribe((value)=>{
      switch(value){
        case 0:
          TweenMax.to('#about-button',2,{opacity:1,delay:3})
          TweenMax.set('#about-button',{visibility:'visible',delay:3});
          break;
        case 1: 
          // change bg color
          TweenMax.delayedCall(.5,()=>{
            document.getElementById('Main').classList.add('BG2');
          })

          // next scene button arrow
          document.getElementById('arrow-fill').style.fill="#CDD9C6";
          
          // delay cancel old scene
          TweenMax.delayedCall(2,()=>{
            this.FS.CancelFirstScene();
          });
          this.SS.StartSecondScene();
          this.TS.InitThirdScene();
        break;
        case 2:
          TweenMax.set('.Background',{css:{background:"linear-gradient( to bottom,#c9e9f2 0%,#c9e9f2 var(--BGPercent),#aee3f2 var(--BGPercent),#aee3f2 100%)"}});
          TweenMax.delayedCall(.5,()=>{
            document.getElementById('Main').classList.remove('BG2');
          })
          document.getElementById('arrow-fill').style.fill="#AEE3F2";
          TweenMax.delayedCall(3,()=>{
            document.getElementById('Main').classList.add('BG3');
          })

          this.SS.CancelSecondScene();
          this.TS.StartThirdScene();
          this.FourthS.lastScreen();
        break;
        case 3:
          TweenMax.delayedCall(.5,()=>{
            document.getElementById('Main').classList.add('BG2');
          })
          document.getElementById('arrow-fill').style.fill="#e8d8cd";
          this.FourthS.StartFourthScene();
          this.FourthS.InformationClicked.subscribe((value)=>{
            if(value){
              this.AboutMenu();
            }
          });
        break;
      }
    });

    // testing
    // this.TS.InitThirdScene();
    // this.TS.StartThirdScene();
  }
}

