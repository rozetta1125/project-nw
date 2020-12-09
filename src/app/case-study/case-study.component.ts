import { Component, HostListener, OnInit } from '@angular/core';
import { Power1,Power3, TweenMax,TimelineMax } from 'gsap';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-case-study',
  templateUrl: './case-study.component.html',
  styleUrls: ['./case-study.component.scss']
})
export class CaseStudyComponent implements OnInit {

  constructor(private TitleService:Title) {
    this.TitleService.setTitle('Tran Vinh Nhan - Case Study')
   }

  ngOnInit() {
    this.CreateSlideEvent();
    this.ImageRoll();
    this.CreateSideMenuEvent();
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
    window.location.reload();
  }

  ImageRoll(){
    let TLM = new TimelineMax({repeat:-1});
    TLM.to('#imageRoll .subImage',1.2,{yPercent:"-=25",ease:Power3.easeInOut,delay:4});
    TLM.to('#imageRoll .subImage',1.2,{yPercent:"-=25",ease:Power3.easeInOut,delay:4});
    TLM.to('#imageRoll .subImage',1.2,{yPercent:"-=25",ease:Power3.easeInOut,delay:4});
    TLM.set('#imageRoll .subImage',{yPercent:"0",delay:1.2});
  }
  
  CreateSlideEvent(){
    // scroll down event
    document.addEventListener('wheel',this.SlideScroll);
    // swipe down event
    document.addEventListener('touchstart',this.SlideStart)
    document.addEventListener('touchmove',this.SlideMove,{passive:false})
    document.addEventListener('touchend',this.SlideEnd)
  }

  CreateSideMenuEvent(){
    
  }

  // Side menu enter event
  IntroductionEnter(){
    // TweenMax. = ('.sideMenuSlider .introduction .line');
  }

  private Paging=0;
  private TotalPage = 12;
  private TotalPagePercent = 100/this.TotalPage;
  // true mean waiting, false ready
  private SlideThrottle=false;
  SlideScroll = (e)=>{
    if(!this.SlideThrottle){
      if(e.deltaY>0){
        // Down
        if(this.Paging != (this.TotalPage-1) ){
          this.SlideDown();
          this.MenuDown();
        }
      } else {
        // Up
        if(this.Paging!=0){
          this.SlideUp();
          this.MenuUp();
        }
      }
    }
  }


  SlideUp(){
    TweenMax.to('.slider',1.2,{yPercent:"+="+this.TotalPagePercent,ease:Power3.easeInOut})
    this.Paging-=1;

    this.SlideThrottle=true;
    setTimeout(() => {
      this.SlideThrottle=false;
    }, 1200);
  }

  SlideDown(){
    TweenMax.to('.slider',1.2,{yPercent:"-="+this.TotalPagePercent,ease:Power3.easeInOut})
    this.Paging+=1;

    this.SlideThrottle=true;
    setTimeout(() => {
      this.SlideThrottle=false;
    }, 1200);
  }

  

  MenuUp(){
    switch(this.Paging){
      case 0:
        TweenMax.to('.menuSlider .introduction .l1',1.2,{attr:{x2:"-=50"},ease:Power3.easeInOut})
        TweenMax.to('#imageRoll',1.2,{yPercent:"+=200",ease:Power3.easeInOut})
      break;
      case 1:
        TweenMax.to('.menuSlider',1.2,{xPercent:"+=25",ease:Power3.easeInOut})
        TweenMax.to('.sideMenuSlider .introduction .line',.9,{css:{marginLeft:'0%',className:"+=active"},ease:Power3.easeInOut});
        TweenMax.to('.sideMenuSlider .research .line',.9,{css:{marginLeft:'40%',className:"-=active"},ease:Power3.easeInOut});
      break;
      case 2:
        TweenMax.to('.menuSlider .research .l1',1.2,{attr:{x2:"-=33.33"},ease:Power3.easeInOut})
      break;
      case 3:
        TweenMax.to('.menuSlider .research .l1',1.2,{attr:{x2:"-=33.33"},ease:Power3.easeInOut})
      break;
      case 4:
        TweenMax.to('.menuSlider',1.2,{xPercent:"+=25",ease:Power3.easeInOut})
        TweenMax.to('.sideMenuSlider .research .line',.9,{css:{marginLeft:'0%',className:"+=active"},ease:Power3.easeInOut});
        TweenMax.to('.sideMenuSlider .ideation .line',.9,{css:{marginLeft:'40%',className:"-=active"},ease:Power3.easeInOut});
      break;
      case 5:
        TweenMax.to('.menuSlider .ideation .l1',1.2,{attr:{x2:"-=25"},ease:Power3.easeInOut})
      break;
      case 6:
        TweenMax.to('.menuSlider .ideation .l1',1.2,{attr:{x2:"-=25"},ease:Power3.easeInOut})
      break;
      case 7:
        TweenMax.to('.menuSlider .ideation .l1',1.2,{attr:{x2:"-=25"},ease:Power3.easeInOut})
      break;
      case 8:
        TweenMax.to('.menuSlider',1.2,{xPercent:"+=25",ease:Power3.easeInOut})
        TweenMax.to('.sideMenuSlider .ideation .line',.9,{css:{marginLeft:'0%',className:"+=active"},ease:Power3.easeInOut});
        TweenMax.to('.sideMenuSlider .challenge .line',.9,{css:{marginLeft:'40%',className:"-=active"},ease:Power3.easeInOut});
      break;
      case 9:
        TweenMax.to('.menuSlider .challenge .l1',1.2,{attr:{x2:"-=33.33"},ease:Power3.easeInOut})

      break;
      case 10:
        TweenMax.to('.menuSlider .challenge .l1',1.2,{attr:{x2:"-=33.33"},ease:Power3.easeInOut})
        TweenMax.to('.CSscroll',1.2,{opacity:1,ease:Power3.easeInOut})
      break;
    }
  }

  MenuDown(){
    switch(this.Paging){
      case 1:
        TweenMax.to('.menuSlider .introduction .l1',1.2,{attr:{x2:"+=50"},ease:Power3.easeInOut})
        TweenMax.to('#imageRoll',1.2,{yPercent:"-=200",ease:Power3.easeInOut})
      break;
      case 2:
        TweenMax.to('.menuSlider',1.2,{xPercent:"-=25",ease:Power3.easeInOut})
        TweenMax.to('.sideMenuSlider .introduction .line',.9,{css:{marginLeft:'40%',className:"-=active"},ease:Power3.easeInOut});
        TweenMax.to('.sideMenuSlider .research .line',.9,{css:{marginLeft:'0%',className:"+=active"},ease:Power3.easeInOut});
      break;
      case 3:
        TweenMax.to('.menuSlider .research .l1',1.2,{attr:{x2:"+=33.33"},ease:Power3.easeInOut})
      break;
      case 4:
        TweenMax.to('.menuSlider .research .l1',1.2,{attr:{x2:"+=33.33"},ease:Power3.easeInOut})
      break;
      case 5:
        TweenMax.to('.menuSlider',1.2,{xPercent:"-=25",ease:Power3.easeInOut})
        TweenMax.to('.sideMenuSlider .research .line',.9,{css:{marginLeft:'40%',className:"-=active"},ease:Power3.easeInOut});
        TweenMax.to('.sideMenuSlider .ideation .line',.9,{css:{marginLeft:'0%',className:"+=active"},ease:Power3.easeInOut});
      break;
      case 6:
        TweenMax.to('.menuSlider .ideation .l1',1.2,{attr:{x2:"+=25"},ease:Power3.easeInOut})
      break;
      case 7:
        TweenMax.to('.menuSlider .ideation .l1',1.2,{attr:{x2:"+=25"},ease:Power3.easeInOut})
      break;
      case 8:
        TweenMax.to('.menuSlider .ideation .l1',1.2,{attr:{x2:"+=25"},ease:Power3.easeInOut})
      break;
      case 9:
        TweenMax.to('.menuSlider',1.2,{xPercent:"-=25",ease:Power3.easeInOut})
        TweenMax.to('.sideMenuSlider .ideation .line',.9,{css:{marginLeft:'40%',className:"-=active"},ease:Power3.easeInOut});
        TweenMax.to('.sideMenuSlider .challenge .line',.9,{css:{marginLeft:'0%',className:"+=active"},ease:Power3.easeInOut});
      break;
      case 10:
        TweenMax.to('.menuSlider .challenge .l1',1.2,{attr:{x2:"+=33.33"},ease:Power3.easeInOut})
      break;
      case 11:
        TweenMax.to('.menuSlider .challenge .l1',1.2,{attr:{x2:"+=33.33"},ease:Power3.easeInOut})
        TweenMax.to('.CSscroll',1.2,{opacity:0,ease:Power3.easeInOut})
      break;
    }
  }

  sideIntroduction(){
    if(!this.SlideThrottle){
      let n = 0;
      this.calculateScroll(this.Paging,n)
      TweenMax.to('.menuSlider',1.2,{xPercent:"0%",ease:Power3.easeInOut})
      TweenMax.to('.sideMenuSlider .introduction .line',.9,{css:{marginLeft:'0%',className:"+=active"},ease:Power3.easeInOut})
      TweenMax.to('#imageRoll',1.2,{yPercent:"0",ease:Power3.easeInOut})
    }
  }
  sideResearch(){
    if(!this.SlideThrottle){
      let n = 2;
      this.calculateScroll(this.Paging,n)
      TweenMax.to('.menuSlider',1.2,{xPercent:"-25%",ease:Power3.easeInOut})
      TweenMax.to('.sideMenuSlider .research .line',.9,{css:{marginLeft:'0%',className:"+=active"},ease:Power3.easeInOut})
      TweenMax.to('#imageRoll',1.2,{yPercent:"-200",ease:Power3.easeInOut})
    }
  }
  sideIdeation(){
    if(!this.SlideThrottle){
      let n = 5;
      this.calculateScroll(this.Paging,n)
      TweenMax.to('.menuSlider',1.2,{xPercent:"-50%",ease:Power3.easeInOut})
      TweenMax.to('.sideMenuSlider .ideation .line',.9,{css:{marginLeft:'0%',className:"+=active"},ease:Power3.easeInOut})
      TweenMax.to('#imageRoll',1.2,{yPercent:"-200",ease:Power3.easeInOut})
    }
  }
  sideChallenge(){
    if(!this.SlideThrottle){
      let n = 9;
      this.calculateScroll(this.Paging,n)
      TweenMax.to('.menuSlider',1.2,{xPercent:"-75%",ease:Power3.easeInOut})
      TweenMax.to('.sideMenuSlider .challenge .line',.9,{css:{marginLeft:'0%',className:"+=active"},ease:Power3.easeInOut})
      TweenMax.to('#imageRoll',1.2,{yPercent:"-200",ease:Power3.easeInOut})
    }
  }

  calculateScroll(p0:number,p1:number){
    // Menu Reset
    TweenMax.to('.menuSlider .introduction .l1',1.2,{attr:{x2:"50%"},ease:Power3.easeInOut})
    TweenMax.to('.menuSlider .research .l1',1.2,{attr:{x2:"33%"},ease:Power3.easeInOut})
    TweenMax.to('.menuSlider .ideation .l1',1.2,{attr:{x2:"25%"},ease:Power3.easeInOut})
    TweenMax.to('.menuSlider .challenge .l1',1.2,{attr:{x2:"33%"},ease:Power3.easeInOut})

    // SideMenu Reset
    TweenMax.to('.sideMenuSlider .introduction .line',.9,{css:{marginLeft:'40%',className:"-=active"},ease:Power3.easeInOut})
    TweenMax.to('.sideMenuSlider .research .line',.9,{css:{marginLeft:'40%',className:"-=active"},ease:Power3.easeInOut})
    TweenMax.to('.sideMenuSlider .ideation .line',.9,{css:{marginLeft:'40%',className:"-=active"},ease:Power3.easeInOut})
    TweenMax.to('.sideMenuSlider .challenge .line',.9,{css:{marginLeft:'40%',className:"-=active"},ease:Power3.easeInOut})

    if(p0>p1){
      let d = p0-p1;
      TweenMax.to('.slider',1.2,{yPercent:"+="+(this.TotalPagePercent*d),ease:Power3.easeInOut})
      this.Paging=p1;
    } else {
      let d = p1-p0;
      TweenMax.to('.slider',1.2,{yPercent:"-="+(this.TotalPagePercent*d),ease:Power3.easeInOut})
      this.Paging=p1;
    }

    // Throttle
    this.SlideThrottle=true;
    setTimeout(() => {
      this.SlideThrottle=false;
    }, 1200);
  }

  xStart=0;yStart=0;
  xMove=0;yMove=0;
  xDiff=0;yDiff=0;
  SlideStart = (e)=>{
    this.xStart=e.touches[0].clientX;
    this.yStart=e.touches[0].clientY;
  }

  SlideMove = (e)=>{
    e.preventDefault();
    this.xMove=e.touches[0].clientX;
    this.yMove=e.touches[0].clientY;
  }

  SlideEnd = (e)=>{
    if(!this.SlideThrottle){
      this.xDiff=this.xStart - this.xMove;
      this.yDiff=this.yStart - this.yMove;
      if(Math.abs(this.xDiff) < Math.abs(this.yDiff)){
        if(this.yDiff>0){
          // up
          if(this.Paging != (this.TotalPage-1) ){
            this.SlideDown();
            this.MenuDown();
          }
        } else {
          // down
          if(this.Paging!=0){
            this.SlideUp();
            this.MenuUp();
          }
        }
      }
      this.SlideThrottle=true;
      setTimeout(() => {
        this.SlideThrottle=false;
      }, 1200);
    }
  }
}
