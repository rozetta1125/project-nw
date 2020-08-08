import { Component, OnInit } from '@angular/core';
import { Resources } from './Resources.service';
import { ThreeService } from './three.service';
import { FirstScene } from './FirstScene.service';
import { NextScene } from "./NextScene.service";
import { SecondScene } from './SecondScene.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  private welcomeCanvas = 'welcomeCanvas';
  private ScenePhase:number;

  constructor(
    private RS: Resources,
    private ThreeService: ThreeService,
    private FS: FirstScene,
    private NS: NextScene,
    private SS: SecondScene,
  ) { }

  ngOnInit() {
    this.RS.ResourcesCompleted.subscribe((value)=>{
      if(value){
        console.log('Loaded')
        this.ThreeService.InitThree(this.welcomeCanvas);
        this.ThreeService.FirstInit();
        this.NS.nextStageFunction();
        this.FS.InitFirstScene();
        this.SS.InitSecondScene();
        // this.Start();
      }
    });
    this.RS.InitResources();
  }

  Start(){
    this.ThreeService.InitThree(this.welcomeCanvas);
    this.ThreeService.FirstInit();
    this.FS.InitFirstScene();
    this.SS.InitSecondScene();
    this.NS.nextStageFunction();
    this.NS.ScenePhaseChange.subscribe((value)=>{
      if(value==1){
        this.FS.CancelFirstScene();
        console.log('canceled first scene')
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
