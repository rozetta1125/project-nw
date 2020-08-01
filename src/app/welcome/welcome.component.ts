import { Component, OnInit } from '@angular/core';
import { ThreeService } from './three.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  private welcomeCanvas = 'welcomeCanvas';

  constructor(private ThreeService: ThreeService) { }

  ngOnInit() {
    this.ThreeService.InitThree(this.welcomeCanvas);
    this.ThreeService.FirstInit();
  }

}
