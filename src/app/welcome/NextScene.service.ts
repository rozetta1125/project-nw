import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { TweenMax,Power1 } from 'gsap';
import { ThreeService } from './three.service';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class NextScene{
  public ScenePhase:number=0;
  public ScenePhaseChange: Subject<number> = new Subject<number>();
  constructor(private ThreeService: ThreeService) {
  }

  private firstClientX:number=0;
  private CurrentGoal:number=-15;
  private NextGoal:number=0;
  private onNextLeft:boolean=false;

  nextStageFunction(){
    this.ScenePhase = -1;
    this.ScenePhaseChange.next(this.ScenePhase);
    // let Mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(.5,.5,.5))
    // Mesh.position.set(15,0,0);
    // this.ThreeService.scene.add(Mesh);

    // let Mesh02 = Mesh.clone();
    // Mesh02.position.set(30,0,0);
    // this.ThreeService.scene.add(Mesh02);

    document.querySelector('#nextStage .nextLeft').addEventListener("mousedown", throttle(this.Start,200), false);
    document.addEventListener("mouseup", ()=>{
      if(this.onNextLeft){
        document.removeEventListener("mousemove", this.Moving, false);
        this.firstClientX=0;
        this.onNextLeft=false;
        this.nextCancel();
      }
    })
  }

  Start = (e) => {
    console.log("clicked")
    if(!this.onNextLeft){
      document.addEventListener("mousemove", this.Moving);
      this.firstClientX=e.clientX;
      this.onNextLeft = true;
      console.log('start')
    }
  }

  Moving = (e) => {
    var num = e.clientX-this.firstClientX > 0 ? e.clientX-this.firstClientX : 0;

    if(num>0){
      if(num>=250){
        this.Succeed();
      } else {
        TweenMax.set(this.ThreeService.Goal,{x:(this.CurrentGoal+num*.01)});
        TweenMax.set('#nextStage .nextLeft',{css:{left:num+"px"}});
        TweenMax.set('#nextStage .mid .svg',{css:{width:(200-num)+"px"}});
      }
    }
  }

  Succeed(){
    // Phase, Camera, Goal
    this.ScenePhase += 1;
    this.ScenePhaseChange.next(this.ScenePhase);
    console.log('Go to Scene'+this.ScenePhase);
    TweenMax.to(this.ThreeService.Goal,2,{ease:Power1.easeInOut,x:this.NextGoal});
    
    switch(this.ScenePhase){
      case 1:
        TweenMax.to(this.ThreeService.GoalAngle,1.5,{ease:Power1.easeInOut,y:2,z:8});
      break;
      case 2:
        TweenMax.to(this.ThreeService.GoalAngle,1.5,{ease:Power1.easeInOut,y:1.35,z:8.4});
      break;
    }
    this.CurrentGoal+=15;
    this.NextGoal+=15;


    // NextScene Animation 
    TweenMax.to('#nextStage .nextLeft',.15,{css:{opacity:0},ease:Power1.easeInOut});
    TweenMax.set('#nextStage .mid',{css:{opacity:0}});
    TweenMax.to('.active',.3,{xPercent:100,delay:.15,ease:Power1.easeInOut});
    TweenMax.to('#nextStage',.3,{ease:Power1.easeInOut,css:{opacity:0},delay:.7});
    TweenMax.set('#nextStage',{css:{visibility:"hidden"},delay:1});
    
    // var offsetl = document.querySelector('#nextStage .nextRight') as HTMLElement;
    // TweenMax.to('#nextStage .nextLeft',.2,{css:{left:offsetl.offsetLeft+"px"}});
    // TweenMax.to('#nextStage .mid .svg',.2,{css:{width:0+"px"}});


    // Remove event
    document.removeEventListener("mousemove", this.Moving, false);
    this.firstClientX=0;
    this.onNextLeft=false;

    // Restart After ?s
    TweenMax.delayedCall(1,()=>{
      this.restart();
    })
  }

  
  nextCancel(){
    console.log('cancel')
    TweenMax.to('#nextStage .nextLeft',.4,{ease:Power1.easeOut,css:{left:0+"px"}});
    TweenMax.to('#nextStage .mid .svg',.4,{ease:Power1.easeOut,css:{width:200+"px"}});
    TweenMax.to(this.ThreeService.Goal,.4,{ease:Power1.easeOut,x:this.CurrentGoal})
  }

  restart(){
    TweenMax.set('#nextStage .nextLeft',{css:{opacity:1}});
    TweenMax.set('#nextStage .mid',{css:{opacity:1}});
    TweenMax.set('.active',{xPercent:0});

    TweenMax.set('#nextStage .nextLeft',{ease:Power1.easeInOut,css:{left:0+"px"}});
    TweenMax.set('#nextStage .mid .svg',{ease:Power1.easeInOut,css:{width:200+"px"}});
    TweenMax.to('#nextStage',1,{ease:Power1.easeInOut,css:{opacity:1}});
    TweenMax.set('#nextStage',{css:{visibility:"visible"},delay:.5});
  }
}

function throttle(fn: Function, wait: number) {
  let isCalled = false;

  return function (...args) {
    if (!isCalled) {
      fn(...args);
      isCalled = true;
      setTimeout(function () {
        isCalled = false;
      }, wait)
    }
  };
}
