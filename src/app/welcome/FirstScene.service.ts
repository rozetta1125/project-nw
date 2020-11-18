import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { TimelineMax,TweenMax,Power1 } from 'gsap';
import { ThreeService } from './three.service';
import { Resources } from './Resources.service';

@Injectable({
  providedIn: 'root'
})


export class FirstScene {
  constructor(
    private RS: Resources,
    private ThreeService: ThreeService) 
  {}

  InitFirstScene(){
    this.CreateParkObject();
    this.ParkStaticShadow();
    this.CreateSmokes();
    this.FirstSceneRender();
    this.AddEvent();
  }

  AddEvent(){
    this.ThreeService.canvas.addEventListener("click", this.ClickEvent,false);
    document.addEventListener('visibilitychange', this.VisilibityChange,false);
  }

  ClickEvent = ()=>{
    this.FirstSceneClickEvent();
  }

  VisilibityChange = ()=>{
    if(document.hidden){
      this.elapsedTime=(typeof performance === 'undefined' ? Date : performance).now();
    } else {
      this.elapsedTime=(typeof performance === 'undefined' ? Date : performance).now()-this.elapsedTime;
    }
  }

  CancelFirstScene(){
    cancelAnimationFrame(this.render);
    this.ThreeService.canvas.removeEventListener("click", this.ClickEvent);
    document.removeEventListener('visibilitychange', this.VisilibityChange);
  }
  
  private ParkObjects=[];
  private CarnivalPlane4;
  private SwingS = [];
  private FerrisAnimation;
  private TrainAnimation;
  private SwingTween = new TimelineMax();
  private SmokePipe = [];
  private TrainPosition = [];
  private FerrisShadow = new THREE.Object3D();
  private FerrisShadows = [];
  private FlagMixer;
  CreateParkObject() {
    this.SetCarnival();
    this.SetSwing();
    this.SetTrain();
    this.SetFerris();
  }

  SetSwing(){
    this.RS.Swing.scene.position.set(-.25, .04, -.87);
    this.RS.Swing.scene.scale.set(.9, .9, .9);
    this.RS.Swing.scene.rotation.set(0, 25 * Math.PI / 180, 0)

    // Shadow
    let uniforms00 = {
      tShadow: { value: this.RS.SwingShadow01 },
      uShadowColor: { value: new THREE.Color("#000000") },
      uAlpha: { value: .5 }
    }
    let material00 = new THREE.ShaderMaterial({
      wireframe: false, transparent: true, uniforms: uniforms00, depthWrite: false,
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent
    });
    let shadow01 = new THREE.Mesh(new THREE.PlaneBufferGeometry(3.15, 3.15), material00)
    shadow01.rotation.set(-Math.PI / 2, 0, 25 * Math.PI / 180)
    shadow01.position.x = this.RS.Swing.scene.children[0].position.x - .017
    shadow01.position.z = this.RS.Swing.scene.children[0].position.z + .017
    shadow01.position.y = .064;
    this.ThreeService.scene.add(shadow01);

    let uniforms = {
      tShadow: { value: this.RS.SwingShadow02 },
      uShadowColor: { value: new THREE.Color("#000000") },
      uAlpha: { value: .1 }
    }
    let material = new THREE.ShaderMaterial({
      wireframe: false, transparent: true, uniforms, depthWrite: false,
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent
    });
    let shadow02 = new THREE.Mesh(new THREE.PlaneBufferGeometry(3.15, 3.15), material)


    let ShadowTween = new THREE.Object3D();
    ShadowTween.add(shadow02);
    ShadowTween.position.x = this.RS.Swing.scene.children[0].position.x - .017
    ShadowTween.position.z = this.RS.Swing.scene.children[0].position.z + .017
    ShadowTween.position.y = .064;
    ShadowTween.rotation.set(-Math.PI / 2, 0, 25 * Math.PI / 180)
    this.ThreeService.scene.add(ShadowTween);
    this.SwingS.push(shadow02);

    for (var i = 0; i < this.RS.Swing.scene.children.length; i++) {
      if (this.RS.Swing.scene.children[i].name == "Swing01") {
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        let mate02 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSblue
        })
        let mate03 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        this.RS.Swing.scene.children["" + i + ""].children[0].material = mate01;
        this.RS.Swing.scene.children["" + i + ""].children[1].material = mate02;
        this.RS.Swing.scene.children["" + i + ""].children[2].material = mate03;
        this.SwingS.push(this.RS.Swing.scene.children["" + i + ""]);

        this.SwingTween.pause();
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 1.8, { ease: Power1.easeInOut, y: 15 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 1.8, { ease: Power1.easeInOut, y: -15 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 2, { ease: Power1.easeInOut, y: 25 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 2, { ease: Power1.easeInOut, y: -25 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 2, { ease: Power1.easeInOut, y: 35 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 2, { ease: Power1.easeInOut, y: -35 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 2, { ease: Power1.easeInOut, y: 45 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 2, { ease: Power1.easeInOut, y: -45 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 2.1, { ease: Power1.easeInOut, y: 50 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 2.1, { ease: Power1.easeInOut, y: -50 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 2.2, { ease: Power1.easeInOut, y: 45 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 2.2, { ease: Power1.easeInOut, y: -45 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 2.2, { ease: Power1.easeInOut, y: 40 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 2.2, { ease: Power1.easeInOut, y: -40 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 2, { ease: Power1.easeInOut, y: 30 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 2, { ease: Power1.easeInOut, y: -30 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 1.8, { ease: Power1.easeInOut, y: 15 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 1.6, { ease: Power1.easeInOut, y: -12 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 1.4, { ease: Power1.easeInOut, y: 12 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 1.2, { ease: Power1.easeInOut, y: -8 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, 1, { ease: Power1.easeInOut, y: 6 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, .9, { ease: Power1.easeInOut, y: -4 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, .8, { ease: Power1.easeInOut, y: 2 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, .6, { ease: Power1.easeInOut, y: -1 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, .4, { ease: Power1.easeInOut, y: 1 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, .3, { ease: Power1.easeInOut, y: -.5 * Math.PI / 180 })
        this.SwingTween.to(this.RS.Swing.scene.children["" + i + ""].rotation, .2, { ease: Power1.easeInOut, y: 0 * Math.PI / 180 })
      } else if (this.RS.Swing.scene.children[i].name == "Star02") {
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSblue
        })
        this.RS.Swing.scene.children["" + i + ""].material = mate01;
        // this.RS.Swing.scene.remove(this.RS.Swing.scene.children["" + i + ""])
      } else {
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        this.RS.Swing.scene.children["" + i + ""].material = mate01;
      }
    }

    this.ParkObjects.push(this.RS.Swing.scene);
    this.ThreeService.scene.add(this.RS.Swing.scene)
  }

  SetCarnival(){
    this.RS.Carnival.scene.scale.set(.9, .9, .9);
    this.RS.Carnival.scene.position.set(-0.01, .02, 0.54);
    this.RS.Carnival.scene.rotation.set(0, 0, 0);
    // Carnival
    for (var i = 0; i < this.RS.Carnival.scene.children.length; i++) {
      if (this.RS.Carnival.scene.children[i].name == "Carnival02") {
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        let mate02 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSblue
        })
        this.RS.Carnival.scene.children[""+i+""].children[0].material = mate02;
        this.RS.Carnival.scene.children[""+i+""].children[1].material = mate01;
      } else if (this.RS.Carnival.scene.children[i].name == "CarnivalStar1"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSblue
        })
        this.RS.Carnival.scene.children[""+i+""].material = mate01
      } else {
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        this.RS.Carnival.scene.children[""+i+""].material = mate01
      }
    }
    this.CarnivalTween.pause();
    this.CarnivalTween.to(this.RS.Carnival.scene.rotation, 40, { ease: Power1.easeInOut, y: this.RS.Carnival.scene.rotation.y - Math.PI * 6 });
    
    this.ThreeService.scene.add(this.RS.Carnival.scene);
    this.ParkObjects.push(this.RS.Carnival.scene)

    let shadow3d = new THREE.Object3D();
    let uniforms00 = {
      tShadow: { value: this.RS.CarnivalShadow02 },
      uShadowColor: { value: new THREE.Color("#000000") },
      uAlpha: { value: .16 }
    }
    let material00 = new THREE.ShaderMaterial({
      wireframe: false, transparent: true, uniforms: uniforms00, depthWrite: false,
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent
    });

    let shadow00 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1.8, 1.8), material00)
    shadow00.rotation.set(-Math.PI / 2, 0, 0)
    shadow00.position.set(0, .16, 0.54)
    this.ThreeService.scene.add(shadow00)

    let Carnivalshadow01 = shadow00.clone();
    Carnivalshadow01.scale.set(.5, .5, .5);
    Carnivalshadow01.position.set(0.105, .197, 0.54)
    Carnivalshadow01.rotation.set(-Math.PI / 2, 0, 0)
    this.ThreeService.scene.add(Carnivalshadow01);

    let uniforms = {
      tShadow: { value: this.RS.CarnivalShadow01 },
      uShadowColor: { value: new THREE.Color("#000000") },
      uAlpha: { value: .35 }
    }
    let material = new THREE.ShaderMaterial({
      wireframe: false, transparent: true, uniforms, depthWrite: false,
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent
    });

    let shadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(.7, .7), material)
    shadow.rotation.set(-Math.PI / 2, 0, 0)
    shadow.position.set(-0.603, .16, 0)
    shadow3d.add(shadow);

    let shadow02 = shadow.clone();
    shadow02.position.set(0.603, .16, 0)
    shadow3d.add(shadow02);

    let shadow03 = shadow.clone();
    shadow03.position.set(0, .16, -0.603)
    shadow3d.add(shadow03);

    let shadow04 = shadow.clone();
    shadow04.position.set(0, .16, 0.603)
    shadow3d.add(shadow04);


    shadow3d.position.set(-0.01, 0, .54);
    this.ThreeService.scene.add(shadow3d)
    this.CarnivalTween.to(shadow3d.rotation, 40, { ease: Power1.easeInOut, y: shadow3d.rotation.y - Math.PI * 6 }, '-=40')
    this.CarnivalTween.to(shadow3d.children[0].rotation, 40, { ease: Power1.easeInOut, z: shadow3d.rotation.z + Math.PI * 6 }, '-=40')
    this.CarnivalTween.to(shadow3d.children[1].rotation, 40, { ease: Power1.easeInOut, z: shadow3d.rotation.z + Math.PI * 6 }, '-=40')
    this.CarnivalTween.to(shadow3d.children[2].rotation, 40, { ease: Power1.easeInOut, z: shadow3d.rotation.z + Math.PI * 6 }, '-=40')
    this.CarnivalTween.to(shadow3d.children[3].rotation, 40, { ease: Power1.easeInOut, z: shadow3d.rotation.z + Math.PI * 6 }, '-=40')


    // Plane
    this.CarnivalPlane4 = new THREE.Object3D();
    let Plane01 = new THREE.Object3D();
    let Plane02 = new THREE.Object3D();
    let Plane03 = new THREE.Object3D();
    let Plane04 = new THREE.Object3D();
    let Fan = new THREE.Object3D();
    let PlanePart = new THREE.Object3D();
    for (var i = 0; i < 2; i++) {
      if (this.RS.CarnivalPlane.scene.children[i].name == "CarnivalPlane00") {
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSblue
        })
        let mate02 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSpink
        })
        PlanePart = this.RS.CarnivalPlane.scene.children[i].clone();
        PlanePart.children["0"].material = mate01;
        PlanePart.children["1"].material = mate02;
      } else {
        let mate02 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSblue
        })
        this.RS.CarnivalPlane.scene.children["" + i + ""].material = mate02;
        Fan = this.RS.CarnivalPlane.scene.children[i].clone();
      }
    }
    Fan.position.z = .65;
    PlanePart.position.z = .65;
    Plane01.add(Fan);
    Plane01.add(PlanePart)
    Plane01.scale.set(.9, .9, .9)
    Plane01.position.set(0, .5, 0);
    Plane01.rotation.set(0, -4 * Math.PI / 180, 0)
    Plane01.children[0].name = "Plane01W";
    Plane01.children[1].children[0].name = "Plane01";
    Plane01.children[1].children[1].name = "Plane01";
    this.PlaneTween01.pause();
    this.PlaneTween01.to(Plane01.children[0].rotation, 5, { x: Math.PI * 10 });
    this.CarnivalTween.to(Plane01.position, 2, { ease: Power1.easeInOut, y: .65, repeat: 11, yoyo: true }, '-=36');
    this.CarnivalPlane4.add(Plane01)

    Plane02 = Plane01.clone();
    Plane02.children[0].name = "Plane02W";
    Plane02.children[1].children[0].name = "Plane02";
    Plane02.children[1].children[1].name = "Plane02";
    Plane02.rotation.set(0, (-90 - 4) * Math.PI / 180, 0)
    this.PlaneTween02.pause();
    this.PlaneTween02.to(Plane02.children[0].rotation, 5, { x: Math.PI * 10 });
    this.CarnivalTween.to(Plane02.position, 2, { ease: Power1.easeInOut, y: .65, repeat: 11, yoyo: true }, '-=33');
    this.CarnivalPlane4.add(Plane02)

    Plane03 = Plane01.clone();
    Plane03.children[0].name = "Plane03W";
    Plane03.children[1].children[0].name = "Plane03";
    Plane03.children[1].children[1].name = "Plane03";
    Plane03.position.set(0, .5, 0);
    Plane03.rotation.set(0, (-180 - 4) * Math.PI / 180, 0)
    this.PlaneTween03.pause();
    this.PlaneTween03.to(Plane03.children[0].rotation, 5, { x: Math.PI * 10 });
    this.CarnivalTween.to(Plane03.position, 2, { ease: Power1.easeInOut, y: .65, repeat: 11, yoyo: true }, '-=34');
    this.CarnivalPlane4.add(Plane03)

    Plane04 = Plane01.clone();
    Plane04.children[0].name = "Plane04W";
    Plane04.children[1].children[0].name = "Plane04";
    Plane04.children[1].children[1].name = "Plane04";
    Plane04.position.set(0, .5, 0);
    Plane04.rotation.set(0, (-270 - 4) * Math.PI / 180, 0)
    this.PlaneTween04.pause();
    this.PlaneTween04.to(Plane04.children[0].rotation, 5, { x: Math.PI * 10 });
    this.CarnivalTween.to(Plane04.position, 2, { ease: Power1.easeInOut, y: .65, repeat: 11, yoyo: true }, '-=35');
    this.CarnivalPlane4.add(Plane04)

    this.CarnivalPlane4.position.set(-0.01, 0, .54)
    this.CarnivalTween.to(this.CarnivalPlane4.rotation, 40, { ease: Power1.easeInOut, y: this.CarnivalPlane4.rotation.y - Math.PI * 6 }, '-=40');
    this.ParkObjects.push(this.CarnivalPlane4)
    this.ThreeService.scene.add(this.CarnivalPlane4);


    // // Flag
    // this.FlagMixer = new THREE.AnimationMixer(this.RS.Flag01.scene);
    // this.FlagMixer.timeScale = 1;

    // let animation = this.FlagMixer.clipAction(this.RS.Flag01.animations[0]);
    // animation.play();

    // this.RS.Flag01.scene.children[0].scale.set(1,1,.8);
    // this.RS.Flag01.scene.children[0].position.set(0,0,0);

    // let FlagMate = new THREE.MeshMatcapMaterial({
    //   color:0x97ADD9,
    //   side:2,
    //   matcap:this.RS.SSwhite,
    //   morphTargets:true,
    // })

    // this.RS.Flag01.scene.children["0"].material = FlagMate;
    // this.RS.Flag01.scene.position.set(.37, 1.9, 0.54);

    // this.ThreeService.scene.add(this.RS.Flag01.scene);
  }

  SetTrain(){
    this.mixer02 = new THREE.AnimationMixer(this.RS.Train.scene);

    this.mixer02.timeScale = .25;
    this.RS.Train.scene.position.set(0, .045, 0);

    let uniforms = {
      tShadow: { value: this.RS.TrainShadow },
      uShadowColor: { value: new THREE.Color("#cbaa94") },
      uAlpha: { value: 1 }
    }
    let material = new THREE.ShaderMaterial({
      wireframe: false, transparent: true, uniforms, depthWrite: false,
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent
    });

    let trainShadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(1.2, 1.2), material);
    trainShadow.rotation.set(-Math.PI / 2, 0.01, -Math.PI / 2)
    trainShadow.position.set(.3, 0.01, -.45);
    let TrainShadow3d01 = new THREE.Object3D();
    TrainShadow3d01.add(trainShadow);

    this.ThreeService.scene.add(TrainShadow3d01);

    let TrainShadow3d02 = TrainShadow3d01.clone();
    this.ThreeService.scene.add(TrainShadow3d02);
    this.TrainPosition.push(TrainShadow3d01);

    this.TrainPosition.push(TrainShadow3d02);

    var u = 0;
    // Train
    for (var i = 0; i < this.RS.Train.scene.children.length; i++) {
      if (this.RS.Train.scene.children[i].name == "Rail") {
        let mate02 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSblue
        })
        this.RS.Train.scene.children[""+i+""].material = mate02;
        this.RS.Train.scene.children[""+i+""].scale.y=1.4;
      } else if (this.RS.Train.scene.children[i].name == "SmokePipe") {
        let mate02 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSblue
        })
        this.RS.Train.scene.children[""+i+""].material = mate02
        this.SmokePipe.push(this.RS.Train.scene.children[i]);
      } else {
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        let mate02 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSblue
        })
        this.RS.Train.scene.children[""+i+""].children[0].material = mate02;
        this.RS.Train.scene.children[""+i+""].children[1].material = mate01;
        this.TrainPosition[u].position.x = this.RS.Train.scene.children[i].position.x;
        this.TrainPosition[u].position.z = this.RS.Train.scene.children[i].position.z;
        this.ParkObjects.push(this.RS.Train.scene.children[i]);
        this.TrainPosition.push(this.RS.Train.scene.children[i]);
        u++;
      }
    }
    this.ThreeService.scene.add(this.RS.Train.scene);
  }

  SetFerris(){

    this.RS.FerrisWheel.scene.scale.set(.9, .9, .9);
    this.RS.FerrisWheel.scene.position.set(.4, .035, -1.02);
    this.RS.FerrisWheel.scene.rotation.set(0, -30 * Math.PI / 180, 0);


    let uniforms00 = {
      tShadow: { value: this.RS.FerrisShadow01 },
      uShadowColor: { value: new THREE.Color("#000000") },
      uAlpha: { value: .3 }
    }
    let material00 = new THREE.ShaderMaterial({
      wireframe: false, transparent: true, uniforms: uniforms00, depthWrite: false,
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent
    });
    let shadow01 = new THREE.Mesh(new THREE.PlaneBufferGeometry(3.15, 3.15), material00)
    shadow01.rotation.set(-Math.PI / 2, 0, -30 * Math.PI / 180)

    shadow01.position.y = .064;
    this.ThreeService.scene.add(shadow01);



    let uniforms = {
      tShadow: { value: this.RS.FerrisShadow02 },
      uShadowColor: { value: new THREE.Color("#000000") },
      uAlpha: { value: .3 }
    }
    let material = new THREE.ShaderMaterial({
      wireframe: false, transparent: true, uniforms, depthWrite: false,
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent
    });
    let shadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(1.8, 1.8), material)
    shadow.rotation.set(-Math.PI / 2, 0, 0)
    shadow.position.y = .064;

    this.FerrisShadow.add(shadow);
    this.FerrisShadows.push(shadow);
    this.ThreeService.scene.add(this.FerrisShadow);

    this.FerrisShadow.rotation.set(0, -30 * Math.PI / 180, 0);

    for (var i = 0; i < this.RS.FerrisWheel.scene.children.length; i++) {
      if (this.RS.FerrisWheel.scene.children[i].name == "Star") {
        let mate02 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSblue
        })
        this.RS.FerrisWheel.scene.children[i].material = mate02
      } else if (this.RS.FerrisWheel.scene.children[i].name == "FerrisWheel00") {
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        this.RS.FerrisWheel.scene.children[i].material = mate01

        shadow01.position.x = this.RS.FerrisWheel.scene.children[i].position.x - .003
        shadow01.position.z = this.RS.FerrisWheel.scene.children[i].position.z + .08
      } else {
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        this.RS.FerrisWheel.scene.children[i].material = mate01
      }
    }

    this.ParkObjects.push(this.RS.FerrisWheel.scene)
    this.ThreeService.scene.add(this.RS.FerrisWheel.scene);

    // 8 Ferris
    this.mixer01 = new THREE.AnimationMixer(this.RS.Ferris.scene);
    this.mixer01.timeScale = .1;

    this.RS.Ferris.scene.scale.set(.9, .9, .9);
    this.RS.Ferris.scene.position.set(.4, .035, -1.02);
    this.RS.Ferris.scene.rotation.set(0, -30 * Math.PI / 180, 0);

    // Ferris
    for (var i = 0; i < this.RS.Ferris.scene.children.length; i++) {
      if (this.RS.Ferris.scene.children[i].name == "F01") {
        this.TweenF01.pause();
        var t = .15;
        this.TweenF01.to(this.RS.Ferris.scene.children[i].rotation, .75, { z: t,ease:Power1.easeOut })
        this.TweenF01.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.2,ease:Power1.easeInOut }) 
        this.TweenF01.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*1.6,ease:Power1.easeInOut })
        this.TweenF01.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.6,ease:Power1.easeInOut })
        this.TweenF01.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*1.2,ease:Power1.easeInOut })
        this.TweenF01.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.2,ease:Power1.easeInOut })
        this.TweenF01.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*.6,ease:Power1.easeInOut })
        this.TweenF01.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*.6,ease:Power1.easeInOut })
        this.TweenF01.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: 0,ease:Power1.easeInOut })


        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        let mate03 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSpink
        })
        this.RS.Ferris.scene.children[i].children[1].material = mate03
        this.RS.Ferris.scene.children[i].children[0].material = mate01
      } else if (this.RS.Ferris.scene.children[i].name == "F02") {
        this.TweenF02.pause();
        var t = .15;
        this.TweenF02.to(this.RS.Ferris.scene.children[i].rotation, .75, { z: t,ease:Power1.easeOut })
        this.TweenF02.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.2,ease:Power1.easeInOut }) 
        this.TweenF02.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*1.6,ease:Power1.easeInOut })
        this.TweenF02.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.6,ease:Power1.easeInOut })
        this.TweenF02.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*1.2,ease:Power1.easeInOut })
        this.TweenF02.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.2,ease:Power1.easeInOut })
        this.TweenF02.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*.6,ease:Power1.easeInOut })
        this.TweenF02.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*.6,ease:Power1.easeInOut })
        this.TweenF02.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: 0,ease:Power1.easeInOut })
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        let mate02 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSblue
        })
        this.RS.Ferris.scene.children[i].children[1].material = mate02
        this.RS.Ferris.scene.children[i].children[0].material = mate01
      } else if (this.RS.Ferris.scene.children[i].name == "F03") {
        this.TweenF03.pause();
        var t = .15;
        this.TweenF03.to(this.RS.Ferris.scene.children[i].rotation, .75, { z: t,ease:Power1.easeOut })
        this.TweenF03.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.2,ease:Power1.easeInOut }) 
        this.TweenF03.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*1.6,ease:Power1.easeInOut })
        this.TweenF03.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.6,ease:Power1.easeInOut })
        this.TweenF03.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*1.2,ease:Power1.easeInOut })
        this.TweenF03.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.2,ease:Power1.easeInOut })
        this.TweenF03.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*.6,ease:Power1.easeInOut })
        this.TweenF03.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*.6,ease:Power1.easeInOut })
        this.TweenF03.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: 0,ease:Power1.easeInOut })
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        let mate03 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSpink
        })
        this.RS.Ferris.scene.children[i].children[1].material = mate03
        this.RS.Ferris.scene.children[i].children[0].material = mate01
      } else if (this.RS.Ferris.scene.children[i].name == "F04") {
        this.TweenF04.pause();
        var t = .15;
        this.TweenF04.to(this.RS.Ferris.scene.children[i].rotation, .75, { z: t,ease:Power1.easeOut })
        this.TweenF04.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.2,ease:Power1.easeInOut }) 
        this.TweenF04.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*1.6,ease:Power1.easeInOut })
        this.TweenF04.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.6,ease:Power1.easeInOut })
        this.TweenF04.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*1.2,ease:Power1.easeInOut })
        this.TweenF04.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.2,ease:Power1.easeInOut })
        this.TweenF04.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*.6,ease:Power1.easeInOut })
        this.TweenF04.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*.6,ease:Power1.easeInOut })
        this.TweenF04.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: 0,ease:Power1.easeInOut })
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        let mate02 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSblue
        })
        this.RS.Ferris.scene.children[i].children[1].material = mate02
        this.RS.Ferris.scene.children[i].children[0].material = mate01
      } else if (this.RS.Ferris.scene.children[i].name == "F05") {
        this.TweenF05.pause();
        var t = .15;
        this.TweenF05.to(this.RS.Ferris.scene.children[i].rotation, .75, { z: t,ease:Power1.easeOut })
        this.TweenF05.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.2,ease:Power1.easeInOut }) 
        this.TweenF05.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*1.6,ease:Power1.easeInOut })
        this.TweenF05.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.6,ease:Power1.easeInOut })
        this.TweenF05.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*1.2,ease:Power1.easeInOut })
        this.TweenF05.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.2,ease:Power1.easeInOut })
        this.TweenF05.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*.6,ease:Power1.easeInOut })
        this.TweenF05.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*.6,ease:Power1.easeInOut })
        this.TweenF05.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: 0,ease:Power1.easeInOut })
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        let mate03 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSpink
        })
        this.RS.Ferris.scene.children[i].children[1].material = mate03
        this.RS.Ferris.scene.children[i].children[0].material = mate01
      } else if (this.RS.Ferris.scene.children[i].name == "F06") {
        this.TweenF06.pause();
        var t = .15;
        this.TweenF06.to(this.RS.Ferris.scene.children[i].rotation, .75, { z: t,ease:Power1.easeOut })
        this.TweenF06.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.2,ease:Power1.easeInOut }) 
        this.TweenF06.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*1.6,ease:Power1.easeInOut })
        this.TweenF06.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.6,ease:Power1.easeInOut })
        this.TweenF06.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*1.2,ease:Power1.easeInOut })
        this.TweenF06.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.2,ease:Power1.easeInOut })
        this.TweenF06.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*.6,ease:Power1.easeInOut })
        this.TweenF06.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*.6,ease:Power1.easeInOut })
        this.TweenF06.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: 0,ease:Power1.easeInOut })
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        let mate02 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSblue
        })
        this.RS.Ferris.scene.children[i].children[1].material = mate02
        this.RS.Ferris.scene.children[i].children[0].material = mate01
      } else if (this.RS.Ferris.scene.children[i].name == "F07") {
        this.TweenF07.pause();
        var t = .15;
        this.TweenF07.to(this.RS.Ferris.scene.children[i].rotation, .75, { z: t,ease:Power1.easeOut })
        this.TweenF07.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.2,ease:Power1.easeInOut }) 
        this.TweenF07.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*1.6,ease:Power1.easeInOut })
        this.TweenF07.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.6,ease:Power1.easeInOut })
        this.TweenF07.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*1.2,ease:Power1.easeInOut })
        this.TweenF07.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.2,ease:Power1.easeInOut })
        this.TweenF07.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*.6,ease:Power1.easeInOut })
        this.TweenF07.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*.6,ease:Power1.easeInOut })
        this.TweenF07.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: 0,ease:Power1.easeInOut })
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        let mate03 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSpink
        })
        this.RS.Ferris.scene.children[i].children[1].material = mate03
        this.RS.Ferris.scene.children[i].children[0].material = mate01
      } else if (this.RS.Ferris.scene.children[i].name == "F08") {
        this.TweenF08.pause();
        var t = .15;
        this.TweenF08.to(this.RS.Ferris.scene.children[i].rotation, .75, { z: t,ease:Power1.easeOut })
        this.TweenF08.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.2,ease:Power1.easeInOut }) 
        this.TweenF08.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*1.6,ease:Power1.easeInOut })
        this.TweenF08.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.6,ease:Power1.easeInOut })
        this.TweenF08.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*1.2,ease:Power1.easeInOut })
        this.TweenF08.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*1.2,ease:Power1.easeInOut })
        this.TweenF08.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: t*.6,ease:Power1.easeInOut })
        this.TweenF08.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: -t*.6,ease:Power1.easeInOut })
        this.TweenF08.to(this.RS.Ferris.scene.children[i].rotation, 1, { z: 0,ease:Power1.easeInOut })
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        let mate02 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSblue
        })
        this.RS.Ferris.scene.children[i].children[1].material = mate02
        this.RS.Ferris.scene.children[i].children[0].material = mate01
      } else {
        let mate01 = new THREE.MeshMatcapMaterial({
          color: 0xffffff,
          side: 2,
          matcap: this.RS.FSwhite
        })
        this.RS.Ferris.scene.children[i].material = mate01
      }
      if (this.RS.Ferris.scene.children[i].position.y < .65) {
        this.FerrisShadows[0].position.x = this.RS.Ferris.scene.children[i].position.x - .4
        this.FerrisShadows[0].position.z = this.RS.Ferris.scene.children[i].position.z - .9
        this.FerrisShadows[0].material.uniforms.uAlpha.value =
          (.65 - this.RS.Ferris.scene.children[i].position.y) * 4;
      }
    }

    this.ParkObjects.push(this.RS.Ferris.scene);
    this.ThreeService.scene.add(this.RS.Ferris.scene);
  }

  ParkStaticShadow(){
    let uniforms = {
      tShadow:{value:this.RS.ParkShadow},
      uShadowColor:{value:new THREE.Color("#cbaa94")},
      uAlpha:{value:1}
    }
    let material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})

    let railshadow = new THREE.Mesh(new THREE.PlaneGeometry(12*1.1,12*1.1),material);
    railshadow.rotation.set(-Math.PI/2,0,-Math.PI/2)
    railshadow.position.set(0,0,0);

    this.ThreeService.scene.add(railshadow);
  }

  CreateSmokes() {
    this.Smoke = new THREE.Mesh(new THREE.SphereBufferGeometry(.04, 10, 10));
    for (var i = 0; i < 80; i++) {
      let smokeClone = this.Smoke.clone();
      let mate = new THREE.MeshMatcapMaterial({ transparent: true,color:0xffffff, matcap: this.RS.Smoke, opacity: 0, depthWrite: false });
      smokeClone.material = mate;
      this.Smokes.push(smokeClone);
      this.ThreeService.scene.add(smokeClone);
    }
  }

  SwingShadow() {
    if (!this.SwingTween.isActive()) {
    } else {
      this.SwingS[0].position.x = this.SwingS[1].rotation.y / 1.5;
      setTimeout(() => {
        this.SwingShadow();
      }, 16);
    }
  }

  FerrisWheelShadow() {
    for (var i = 0; i < this.RS.Ferris.scene.children.length; i++) {
      if (this.RS.Ferris.scene.children[i].position.y < .65) {
        this.FerrisShadows[0].position.x = this.RS.Ferris.scene.children[i].position.x - .4
        this.FerrisShadows[0].material.uniforms.uAlpha.value =
          (.65 - this.RS.Ferris.scene.children[i].position.y) * 4;
        break;
      } else {
        this.FerrisShadows[0].material.uniforms.uAlpha.value = 0;
      }
    }

    if (this.FerrisAnimation == null) {

    } else {
      setTimeout(() => {
        this.FerrisWheelShadow();
      }, 16);
    }
  }

  private render;
  FirstSceneRender() {
    this.render = requestAnimationFrame(()=>{
      this.FirstSceneRender();
    });
    // Animation
    this.Runanimation();

    // Mouse
    this.MouseRaycaster();
  }

  MouseRaycaster(){
    this.ThreeService.raycaster.setFromCamera(this.ThreeService.mouse,this.ThreeService.camera);
    var intersect = this.ThreeService.raycaster.intersectObjects(this.ParkObjects,true)
    if(intersect.length>0){
      document.body.style.cursor="pointer";
    } else {
      document.body.style.cursor="default";
    }

  }

  private oldTime=0;
  private elapsedTime=0;
  private diff
  private mixer01: THREE.AnimationMixer;
  private mixer02: THREE.AnimationMixer;
  Runanimation(){
    var newTime=(typeof performance === 'undefined' ? Date : performance).now();
    if(this.elapsedTime!=0){
      this.diff = ((newTime-this.oldTime-this.elapsedTime)/1000);
      this.elapsedTime=0;
    } else {
      this.diff = (newTime-this.oldTime)/1000;
    }
    this.oldTime=newTime;

    
    if (this.mixer01){
      this.mixer01.update(this.diff);
    } 
    if (this.mixer02){
      this.mixer02.update(this.diff);
    }
    if (this.FlagMixer){
      this.FlagMixer.update(this.diff);
    }
  }

  private TweenF01 = new TimelineMax();
  private TweenF02 = new TimelineMax();
  private TweenF03 = new TimelineMax();
  private TweenF04 = new TimelineMax();
  private TweenF05 = new TimelineMax();
  private TweenF06 = new TimelineMax();
  private TweenF07 = new TimelineMax();
  private TweenF08 = new TimelineMax();
  private CarnivalTween = new TimelineMax();
  private PlaneTween01 = new TimelineMax();
  private PlaneTween02 = new TimelineMax();
  private PlaneTween03 = new TimelineMax();
  private PlaneTween04 = new TimelineMax();
  FirstSceneClickEvent() {
    this.ThreeService.raycaster.setFromCamera(this.ThreeService.mouse, this.ThreeService.camera);
    var intersect = this.ThreeService.raycaster.intersectObjects(this.ParkObjects, true)
    if (intersect.length > 0) {
      console.log(intersect[0].object.name)
      switch (intersect[0].object.name) {
        case "FerrisWheel00":
        case "FerrisWheel01":
        case "FerrisWheel02":
          if (this.FerrisAnimation != null) {
          } else {
            for (var i = 0; i < this.RS.Ferris.animations.length; i++) {
              this.FerrisAnimation = this.mixer01.clipAction(this.RS.Ferris.animations[i]);
              this.FerrisAnimation.setLoop(THREE.LoopOnce);
              this.FerrisAnimation.clampWhenFinished = true;
              this.FerrisAnimation.reset();
              this.FerrisAnimation.play();
            }
            this.FerrisWheelShadow();
            TweenMax.delayedCall(25, () => {
              this.FerrisAnimation = null;
              console.log('asdf')
            });
          }
          break;
        case "Swing01_0":
        case "Swing01_1":
        case "Swing01_2":
        case "Swing02":
        case "Swing03":
          if (!this.SwingTween.isActive()) {
            this.SwingTween.restart();
            this.SwingShadow();
          }
          break;
        case "Plane01":
        case "Plane01W":
          if (!this.PlaneTween01.isActive()) {
            this.PlaneTween01.restart();
          }
          break;
        case "Plane02":
        case "Plane02W":
          if (!this.PlaneTween02.isActive()) {
            this.PlaneTween02.restart();
          }
          break;
        case "Plane03":
        case "Plane03W":
          if (!this.PlaneTween03.isActive()) {
            this.PlaneTween03.restart();
          }
          break;
        case "Plane04":
        case "Plane04W":
          if (!this.PlaneTween04.isActive()) {
            this.PlaneTween04.restart();
          }
          break;
        case "Carnival01":
        case "Carnival02_0":
        case "Carnival02_1":
          if (!this.CarnivalTween.isActive()) {
            this.CarnivalTween.restart();
          }
          break;
        case "F01_1":
          if (!this.TweenF01.isActive()) {
            this.TweenF01.restart();
          }
          break;
        case "F02_1":
          if (!this.TweenF02.isActive()) {
            this.TweenF02.restart();
          }
          break;
        case "F03_1":
          if (!this.TweenF03.isActive()) {
            this.TweenF03.restart();
          }
          break;
        case "F04_1":
          if (!this.TweenF04.isActive()) {
            this.TweenF04.restart();
          }
          break;
        case "F05_1":
          if (!this.TweenF05.isActive()) {
            this.TweenF05.restart();
          }
          break;
        case "F06_1":
          if (!this.TweenF06.isActive()) {
            this.TweenF06.restart();
          }
          break;
        case "F07_1":
          if (!this.TweenF07.isActive()) {
            this.TweenF07.restart();
          }
          break;
        case "F08_1":
          if (!this.TweenF08.isActive()) {
            this.TweenF08.restart();
          }
          break;
        case "Train01_0":
        case "Train01_1":
        case "Train02_0":
        case "Train02_1":
          if (this.TrainAnimation != null) {
          } else {
            for (var i = 0; i < this.RS.Train.animations.length; i++) {
              this.TrainAnimation = this.mixer02.clipAction(this.RS.Train.animations[i]);
              this.TrainAnimation.setLoop(THREE.LoopOnce);
              this.TrainAnimation.play().reset();
            }
            this.TrainSmoke();
            TweenMax.delayedCall(20, () => {
              this.TrainAnimation = null;
            });
          }
          break;
      }
    }
  }

  private Smoke;
  private Smokes = [];
  private SmokeI = 0;
  TrainSmoke() {
    if (this.SmokeI == this.Smokes.length) {
      this.SmokeI = 0;
    }
    // Shadow
    TweenMax.to(this.TrainPosition[0].position, .1, { x: this.TrainPosition[2].position.x, z: this.TrainPosition[2].position.z, delay: .1 })
    TweenMax.to(this.TrainPosition[1].position, .1, { x: this.TrainPosition[3].position.x, z: this.TrainPosition[3].position.z, delay: .1 })

    this.TrainPosition[0].rotation.y = this.TrainPosition[2].rotation.y;
    this.TrainPosition[1].rotation.y = this.TrainPosition[3].rotation.y;
    // Position
    TweenMax.fromTo(this.Smokes[this.SmokeI].position, 1.6,
      { x: this.SmokePipe[0].position.x, z: this.SmokePipe[0].position.z, y: this.SmokePipe[0].position.y },
      { x: this.SmokePipe[0].position.x + (.3 - Math.random() * .3), z: this.SmokePipe[0].position.z + (.3 - Math.random() * .3), y: this.SmokePipe[0].position.y + Math.random() * .4 + .4 });
    // Scale
    TweenMax.fromTo(this.Smokes[this.SmokeI].scale, 1.6,
      { x: 1, z: 1, y: 1 },
      { x: .1, z: .1, y: .1, ease: "none" });
    // // Opacity
    TweenMax.fromTo(this.Smokes[this.SmokeI].material, 1.6,
      { opacity: 1 },
      { opacity: 0, ease: "none" });
    this.SmokeI++;
    if (this.TrainAnimation == null) {
    } else {
      setTimeout(() => {
        this.TrainSmoke();
      }, 16);
    }
  }


}