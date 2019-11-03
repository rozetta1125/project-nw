import { Component, OnInit } from '@angular/core';
import { welcomeService } from './welcome.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  private welcomeCanvas = 'welcomeCanvas';

  constructor(private welService: welcomeService) { }

  ngOnInit() {
    this.welService.InitThree(this.welcomeCanvas);
    this.welService.ZeroInit();
  }

}
