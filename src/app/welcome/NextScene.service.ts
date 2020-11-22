import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { TweenMax,Power1,Power2 } from 'gsap';
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

    // PC
    document.querySelector('#nextStage .nextLeft').addEventListener("mousedown", throttle(this.Start,200));
    document.addEventListener("mouseup", ()=>{
      if(this.onNextLeft){
        document.removeEventListener("mousemove", this.Moving);
        this.firstClientX=0;
        this.onNextLeft=false;
        this.nextCancel();
      }
    })

    // Mobile
    document.querySelector('#nextStage .nextLeft').addEventListener("touchstart", throttle(this.TouchStart,200));
    document.addEventListener("touchend", ()=>{
      if(this.onNextLeft){
        document.removeEventListener("touchmove", this.TouchMoving);
        this.firstClientX=0;
        this.onNextLeft=false;
        this.nextCancel();
      }
    })
  }

  // Click, PC event;
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

  // Touch, mobile event;
  TouchStart = (e) => {
    e.preventDefault();
    console.log("touched")
    if(!this.onNextLeft){
      document.addEventListener("touchmove", this.TouchMoving);
      this.firstClientX=e.touches[0].clientX;
      this.onNextLeft = true;
      console.log('start')
    }
  }
  
  TouchMoving = (e) => {
    e.preventDefault();
    var num = e.touches[0].clientX-this.firstClientX > 0 ? e.touches[0].clientX-this.firstClientX : 0;
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
    TweenMax.to(this.ThreeService.Goal,2,{ease:Power2.easeInOut,x:this.NextGoal});


    let width = window.innerWidth;
    switch(this.ScenePhase){
      case 1:
        if(width<769){
          TweenMax.to(this.ThreeService.GoalAngle,1.5,{ease:Power2.easeInOut,y:"+=.65",z:"-=1"});
          TweenMax.to(this.ThreeService.Goal,1.5,{ease:Power2.easeInOut,y:"-=.2"});
        } else {
          TweenMax.to(this.ThreeService.GoalAngle,1.5,{ease:Power2.easeInOut,y:"+=.7",z:"-=.5"});
          TweenMax.to(this.ThreeService.Goal,1.5,{ease:Power2.easeInOut,y:"-=.1"});
        }
      break;
      case 2:
        if(width<769){
          TweenMax.to(this.ThreeService.GoalAngle,1.5,{ease:Power2.easeInOut,y:"-=.25",z:"+=.6"});
          TweenMax.to(this.ThreeService.Goal,1.5,{ease:Power2.easeInOut,y:"+=.1"});
        } else {
          TweenMax.to(this.ThreeService.GoalAngle,1.5,{ease:Power2.easeInOut,y:"-=.5",z:"+=.3"});
        }
      break;
    }
    this.CurrentGoal+=15;
    this.NextGoal+=15;


    // NextScene Animation 
    TweenMax.to('#nextStage .nextLeft',.15,{css:{opacity:0},ease:Power2.easeInOut});
    TweenMax.set('#nextStage .mid',{css:{opacity:0}});
    TweenMax.to('#nextStage .active',.6,{x:0,delay:.15,ease:Power2.easeInOut});
    TweenMax.to('#nextStage',.3,{ease:Power2.easeInOut,css:{opacity:0},delay:1});
    TweenMax.set('#nextStage',{css:{visibility:"hidden"},delay:1.5});
    
    // var offsetl = document.querySelector('#nextStage .nextRight') as HTMLElement;
    // TweenMax.to('#nextStage .nextLeft',.2,{css:{left:offsetl.offsetLeft+"px"}});
    // TweenMax.to('#nextStage .mid .svg',.2,{css:{width:0+"px"}});


    // Remove event
    document.removeEventListener("mousemove", this.Moving);
    this.firstClientX=0;
    this.onNextLeft=false;

    document.removeEventListener("touchmove", this.TouchMoving);


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
    TweenMax.set('#nextStage .active',{x:-1000});

    TweenMax.set('#nextStage .nextLeft',{css:{left:0+"px"}});
    TweenMax.set('#nextStage .mid .svg',{css:{width:200+"px"}});
    TweenMax.to('#nextStage',1,{ease:Power2.easeInOut,css:{opacity:1}});
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
