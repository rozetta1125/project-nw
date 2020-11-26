import * as THREE from 'three';
import * as CANNON from 'cannon';
import { TweenMax,Power1,Power0, Power4 } from 'gsap';
import { Injectable } from '@angular/core';
import { ThreeService } from './three.service';
import { Resources } from './Resources.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FourthScene{
  constructor(
    private RS:Resources,
    private ThreeService:ThreeService,
  ){}

  private render;
  private FourthSceneObject=[];
  private MousePosition=new THREE.Vector3();
  public InformationClicked: Subject<Boolean> = new Subject<Boolean>();
  StartFourthScene(){
    this.FourthSceneRender();

    this.ThreeService.canvas.addEventListener("click", this.ClickEvent);
  }

  ClickEvent = () => {
    this.FourthClickEvent();
  }

  Raycaster(){
    this.ThreeService.raycaster.setFromCamera(this.ThreeService.mouse,this.ThreeService.camera);
    var intersect = this.ThreeService.raycaster.intersectObjects(this.FourthSceneObject,true)
    if(intersect.length>0){
      this.MousePosition.copy(intersect[0].point)
      this.MeasureDistance();
      // document.body.style.cursor="pointer";
      // console.log(intersect[0].object)
      if(intersect[0].object.name=="linkedinbutton"||intersect[0].object.name=="refreshbutton"||intersect[0].object.name=="inforbutton"){
        document.body.style.cursor="pointer";
      }
    } else {
      document.body.style.cursor="default";
    }
  }

  FourthClickEvent(){
    this.ThreeService.raycaster.setFromCamera(this.ThreeService.mouse,this.ThreeService.camera);
    var intersect = this.ThreeService.raycaster.intersectObjects(this.FourthSceneObject,true)
    if(intersect.length>0){
      this.MousePosition.copy(intersect[0].point);
      if(intersect[0].object.name=="linkedinbutton"){
        console.log('linkedin')
      } else if (intersect[0].object.name=="refreshbutton"){
        console.log('refresh')
      } else if (intersect[0].object.name=="inforbutton"){
        this.InformationClicked.next(true);
        TweenMax.delayedCall(1,()=>{
          this.InformationClicked.next(false);
        })
      } 
    }
  }

  map(distance,start,end,min,max){
    return (distance - start) / (end - start) * (max - min) + min;
  }

  MeasureDistance(){
    for(var i=0;i<this.HoverStuffArray.length;i++){
      var d = this.ThreeService.distanceVec2(
        this.MousePosition.x,this.MousePosition.z,
        this.HoverStuffArray[i].position.x,this.HoverStuffArray[i].position.z
      );

      var heightY=.2;
      if(this.HoverStuffArray[i].OriginalPos.z<1){
        heightY=.4;
      }

      var resultY = this.map(d,1,0,0,heightY);
      var resultX = this.map(d,1,0,this.HoverStuffArray[i].OriginalPos.x,this.HoverStuffArray[i].OriginalPos.x+.07)
      var resultZ = this.map(d,1,0,this.HoverStuffArray[i].OriginalPos.z,this.HoverStuffArray[i].OriginalPos.z-.09)
      var resultOpacity = this.map(d,1,0,1,.2);
      var rotationX = this.map(d,1,0,0,.45);

      // console.log(d)
      // console.log(result)
      TweenMax.to(this.HoverStuffArray[i].object[0].position,.25,{y:resultY < 0 ? 0 : resultY,});
      TweenMax.to(this.HoverStuffArray[i].object[1].material.uniforms.uAlpha,.25,{value:resultOpacity > 1 ? 1 : resultOpacity });
      TweenMax.to(this.HoverStuffArray[i].object[1].position,.25,{
        x:resultX < this.HoverStuffArray[i].OriginalPos.x ? this.HoverStuffArray[i].OriginalPos.x : resultX,
        z:resultZ > this.HoverStuffArray[i].OriginalPos.z ? this.HoverStuffArray[i].OriginalPos.z : resultZ,
      })
      TweenMax.to(this.HoverStuffArray[i].object[0].rotation,.25,{x:rotationX < 0 ? 0 : rotationX,});

      // console.log(this.HoverStuffArray[i].object[1].position.z)
      // console.log(this.HoverStuffArray[i].object[1].position.x)
      // console.log()
      // console.log(this.HoverStuffArray[i].object[1].material.uniforms.uAlpha.value)

      // console.log(this.HoverStuffArray[i].object[0])
      // console.log(this.HoverStuffArray[i].object[0].position.y)
    }
  }

  FourthSceneRender(){
    this.Raycaster();



    this.render=requestAnimationFrame(()=>{
      this.FourthSceneRender();
    });
  }

  private HoverStuffArray=[];
  lastScreen(){
    let LastScreen = new THREE.Object3D();
    LastScreen.position.set(45,-.21,-1.8);
    LastScreen.rotation.set(26*Math.PI/180,-12.5*Math.PI/180,0);
    LastScreen.scale.set(1.05,1.05,1.05);
    this.ThreeService.scene.add(LastScreen);

    let mate = new THREE.MeshMatcapMaterial({matcap:this.RS.FSpink});
    let mate02 = new THREE.MeshMatcapMaterial({matcap:this.RS.FSblue});
    let mate03 = new THREE.MeshMatcapMaterial({matcap:this.RS.FSwhite,color:0xffffff});


    let pos = new THREE.Vector3();
    for(var i=0;i<this.RS.Text.scene.children.length;i++){
      if(this.RS.Text.scene.children[i].name=="linkedin"||this.RS.Text.scene.children[i].name=="refresh"){
        this.RS.Text.scene.children[i].material=mate02;

        // Create clickable plane button
        let plane = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(.4,.4),
          new THREE.MeshBasicMaterial({transparent:true,opacity:0})
        );
        plane.name=this.RS.Text.scene.children[i].name+'button';
        plane.rotation.set(-Math.PI/2,0,0);
        this.RS.Text.scene.children[i].add(plane);
        this.FourthSceneObject.push(plane);
      } else if(this.RS.Text.scene.children[i].name=="infor"){
        this.RS.Text.scene.children[i].children[0].material=mate02;
        this.RS.Text.scene.children[i].children[1].material=mate03;

        // custom i shadow
        let shadow = this.CreateShadow('i');
        shadow.rotation.set(-Math.PI/2,0,0);
        shadow.position.set(0,-.01,0);
        this.RS.Text.scene.children[i].add(shadow);
        this.RS.Text.scene.children[i].children[2].material.uniforms.uShadowColor.value = new THREE.Color('#a1b1c9');

        // Create clickable plane button
        let plane = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(.4,.4),
          new THREE.MeshBasicMaterial({transparent:true,opacity:0})
        );
        plane.name=this.RS.Text.scene.children[i].name+'button';
        plane.rotation.set(-Math.PI/2,0,0);
        this.RS.Text.scene.children[i].add(plane);
        this.FourthSceneObject.push(plane);
      } else {
        this.RS.Text.scene.children[i].material=mate;
      }
    }
    LastScreen.add(this.RS.Text.scene);


    // Create hover position, stuff to use in measuredistance()
    TweenMax.delayedCall(1,()=>{
      for(var i=0;i<this.RS.Text.scene.children.length;i++){
        // if(this.RS.Text.scene.children[i].name=="linkedin"||this.RS.Text.scene.children[i].name=="infor"||this.RS.Text.scene.children[i].name=="refresh"){
        //   let abc = new HoverStuff;
        //   pos.setFromMatrixPosition(this.RS.Text.scene.children[i].matrixWorld);
        //   abc.position = new THREE.Vector3();
        //   abc.position.copy(pos);
  
        //   abc.object = [];
        //   abc.object.push(this.RS.Text.scene.children[i]);
  
        //   this.HoverStuffArray.push(abc);
        //   console.log(abc.position)
        //   console.log(abc.object[0].name)
        // }
        // if(this.RS.Text.scene.children[i].name=="infor"){
          let abc = new HoverStuff;
          pos.setFromMatrixPosition(this.RS.Text.scene.children[i].matrixWorld);
          abc.position = new THREE.Vector3();
          abc.position.copy(pos);
  
          abc.OriginalPos = new THREE.Vector3();
          abc.OriginalPos.copy(this.RS.Text.scene.children[i].position);
          
  
          // array[0] is object array[1] is shadow
          abc.object = [];
          abc.object.push(this.RS.Text.scene.children[i]);
  
          // 
          let shadow = this.CreateShadow(this.RS.Text.scene.children[i].name);
          shadow.position.copy(this.RS.Text.scene.children[i].position);
          shadow.position.y=-.058;
          shadow.rotation.set(-90*Math.PI/180,0,0);
          abc.object.push(shadow);
          LastScreen.add(shadow);
                  
          this.HoverStuffArray.push(abc);
        // }
      }
    })

    // Raycaster Plane
    let plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5,5),new THREE.MeshBasicMaterial({transparent:true,opacity:0}));
    plane.position.set(0,-.06,1)
    plane.rotation.set(-90*Math.PI/180,0,0);
    plane.name="raycasterPlane";
    this.FourthSceneObject.push(plane);
    LastScreen.add(plane);

  }

  CreateShadow(name:string){
    let abc = this.ThreeService.textureLoader.load('assets/shadow/Text/'+name+'.jpg');

    let uniforms = {
      tShadow:{value:abc},
      uShadowColor:{value:new THREE.Color("#d1b8a7")},
      uAlpha:{value:1}
    }
    let material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})
    let shadow = new THREE.Mesh(new THREE.PlaneGeometry(5,5),material);
    return shadow;
  }
}

class HoverStuff{
  position: THREE.Vector3
  object: any
  OriginalPos: THREE.Vector3
}