import * as THREE from 'three';
import * as CANNON from 'cannon';
import { TweenMax, Power1, TimelineLite, TimelineMax, Power0, Power3 } from 'gsap';
import * as OrbitControls from 'three-orbitcontrols';
import GLTFLoader from 'three-gltf-loader';
// import thisWork from 'three-dragcontrols';
import { Injectable } from '@angular/core';
// import * as dat from 'dat.gui';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Resources } from './Resources.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class ThreeService {
  constructor(private RS: Resources){}

  // THREE BASIC SETUP
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  scene: THREE.Scene;

  loader: GLTFLoader;
  textureLoader;
  private dracoLoader;


  private clock = new THREE.Clock();


  // FPS
  private times = [];
  fps:number;
  private now:number;

  smokeThree: THREE.Mesh;
  FETHREE = new THREE.Group();
  FETap = new THREE.Mesh();
  SmokePoint = new THREE.Mesh();
  MovePoint = new THREE.Mesh();
  ForcePoint = new THREE.Mesh();
  ResetPoint = new THREE.Mesh();
  FEcannon = [];
  FEthree = [];
  Pipe = new THREE.Mesh();
  PipeCannon = [];
  PipeThree = [];
  vec = new THREE.Vector3();
  pos = new THREE.Vector3();
  
  lockConstraint;
  ThreeStuff = new THREE.Mesh();

  // Smoke
  sphereShape = new CANNON.Sphere(0.068);
  tweenTime = 0.6; // seconds

  // GUI
  // gui = new dat.GUI();
  
  // Shader
  composer1; composer2; fxaaPass;



  raycaster = new THREE.Raycaster();

  mouse = new THREE.Vector2();


  Goal = new THREE.Vector3();
  EasedGoal = new THREE.Vector3();
  GoalAngle = new THREE.Vector3();

  public Loader: Subject<Boolean> = new Subject<Boolean>();
  
  
  InitThree(elementId: string): void {
    this.canvas = <HTMLCanvasElement>document.getElementById(elementId);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      // antialias: true // smooth edges
    });
    this.renderer.gammaOutput=true;
    this.renderer.gammaFactor=2;
    var pixelRatio=2;

    this.renderer.setPixelRatio(pixelRatio);

    this.textureLoader = new THREE.TextureLoader();
    this.clock = new THREE.Clock();

    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;
    this.renderer.setSize(width,height);
        

    // disable right click on canvas
    // this.canvas.addEventListener('contextmenu',(e)=>{e.preventDefault()})
    
    // create the scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, document.documentElement.clientWidth / document.documentElement.clientHeight, .1, 1000);
    this.scene.add(this.camera);


    // loader 
    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('assets/draco/');
    this.loader.setDRACOLoader(this.dracoLoader);


    // Angle depend on screen width

    if(width<769){
      this.GoalAngle.set(0,1,7);
      this.Goal.set(-15,.75,0)
    } else if (width>769 && width<1025){
      this.GoalAngle.set(0,1.1,7);
      this.Goal.set(-15,.9,0)
    } else{
      this.GoalAngle.set(0,1.25,8.4);
      this.Goal.set(-15,1,0)
    }


    // camera stuffs
    this.camera.position.copy(this.GoalAngle);
    this.camera.lookAt(new THREE.Vector3(-15,0,0));
    this.EasedGoal.copy(this.Goal);
    


    // TweenMax.delayedCall(1+1,()=>{
    //    document.getElementById('Main').classList.add('BG2');
    // });
    
    // TweenMax.to(this.Goal,1,{delay:1+1,x:0,ease:"inOut"})
    // OrbitControls
    // this.controls = new OrbitControls(this.camera, this.canvas);
    // this.controls.target.set(0,1,0);
    // this.controls.update();
    // this.controls.enableRotate = true;
    // this.gui.add(this.controls,'enableRotate');



    // second
    // this.GoalAngle.set(0,5,6);
    // this.controls.target.set(0,.5,0);
    // this.controls.update();


    // this.controls.minAzimuthAngle=.5;
    // this.controls.maxAzimuthAngle=.5;

    // this.controls.autoRotate=true;
    // this.controls.autoRotateSpeed=2;
    // this.controls.minPolarAngle=Math.PI/3;
    // this.controls.maxPolarAngle=Math.PI/2-0.1;
    // this.controls.enableRotate = false;
    // this.controls.enableZoom=false;
    // this.controls.enablePan=false;
    // this.controls.rotateSpeed=0.5;

    let bgparams = {
      background: "#ffffff",
      background02: "#ffffff"
    }

    const canvas = document.querySelector('canvas');
    
  
    // var bg = this.gui.addFolder("Background");
    // bg.addColor(bgparams, "background")
    //   .onChange(() => {
    //     canvas.setAttribute("style","background:linear-gradient(to bottom, "+ bgparams.background+" 0%," + bgparams.background+" 35%," + bgparams.background02+" 35%," +bgparams.background02+" 100%);");
    //   });
    // bg.addColor(bgparams, "background02")
    //   .onChange(() => {
    //     canvas.setAttribute("style","background:linear-gradient(to bottom, "+ bgparams.background+" 0%," + bgparams.background+" 35%," + bgparams.background02+" 35%," +bgparams.background02+" 100%);");
    //   });

    // bg.addColor(bgparams, "background")
    //   .onChange(() => {
    //     canvas.setAttribute("style","background:"+ bgparams.background+";");
    //   });

  }

  
  FirstInit(): void {
    this.Loading();
    this.AddEvent();
    this.BOOPMaterial();

  
  }

  CursorDown = ()=>{
    let outer = document.querySelector('.cursor .svg-cursor');
    TweenMax.to(outer,.2,{css:{scale:.7}});
  }

  CursorUp = ()=>{
    let outer = document.querySelector('.cursor .svg-cursor');
    TweenMax.to(outer,.2,{css:{scale:1}});
  }


  AddEvent(): void {
    this.render();
    window.addEventListener('resize', () => {
      this.resize();
    });

    this.canvas.addEventListener("mousemove", (e) => {
      this.renderThreePosition(e.x, e.y);
      TweenMax.set('#Golf',{css:{top:e.y,left:e.x}})
    },{passive:false});

    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      window.scrollTo(0, 1);
      this.renderThreePosition(e.touches[0].clientX, e.touches[0].clientY);
      TweenMax.set('#Golf',{css:{top:e.touches[0].clientY,left:e.touches[0].clientX}})
    },{passive:false});
  }

   BasePosition = new THREE.Vector2();
   LBvec = new THREE.Vector3();
  renderThreePosition(x, y) {
    this.vec.set(
      (x / document.documentElement.clientWidth) * 2 - 1,
      -(y / document.documentElement.clientHeight) * 2 + 1,
      0.5);

    this.BasePosition.set(x,y);
    this.mouse.set(this.vec.x,this.vec.y);
    this.LBvec=this.vec;

    this.vec.unproject(this.camera);
    this.vec.sub(this.camera.position).normalize();
    
    var distance = - this.camera.position.z / this.vec.z;

    this.pos.copy(this.camera.position).add(this.vec.multiplyScalar(distance));

    // this.raycaster.setFromCamera(this.mouse, this.camera);

    // this.plane.setFromNormalAndCoplanarPoint(this.camera.getWorldDirection(this.plane.normal), this.pos);

    // var rect = this.canvas.getBoundingClientRect();

    // this.mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
    // this.mouse.y = -((y - rect.top) / rect.height) * 2 + 1;

    // this.raycaster.setFromCamera(this.mouse, this.camera);

    // if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
    //   this.pos.copy(this.intersection.sub(this.offset));
    // }
  }

  private GoalEasing = .2;
  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    // this.controls.update();

    // Camera 
    this.EasedGoal.x+=(this.Goal.x - this.EasedGoal.x) * this.GoalEasing;
    this.EasedGoal.y+=(this.Goal.y - this.EasedGoal.y) * this.GoalEasing;
    this.EasedGoal.z+=(this.Goal.z - this.EasedGoal.z) * this.GoalEasing;

    this.camera.position.copy(this.EasedGoal).add(this.GoalAngle.clone().normalize().multiplyScalar(this.GoalAngle.z))
    this.camera.lookAt(this.EasedGoal,0,0);

    // Calculate FPS
    this.now = performance.now();
    if (this.times.length > 0 && this.times[0] <= this.now - 1000) {
      this.times.shift();
    }
    this.times.push(this.now);
    this.fps = this.times.length;


    this.renderer.render(this.scene, this.camera);
    // this.composer1.render();
    // this.composer2.render();
  }


  Loading(){
    let blue = this.textureLoader.load('assets/matcaps/01/E39FA1.png');
    blue.encoding=THREE.sRGBEncoding;

    let mate = new THREE.MeshMatcapMaterial({
      matcap:blue,
      color:0xffffff,
      side:2
    })

    let pink = this.textureLoader.load('assets/matcaps/01/E39FA1.png');
    pink.encoding=THREE.sRGBEncoding;

    let mate02 = new THREE.MeshMatcapMaterial({
      matcap:pink,
      color:0xffffff,
      side:2
    })

    let Loader = new THREE.Object3D();
    this.scene.add(Loader);
    Loader.position.set(-15,.2,0);
    Loader.rotation.set(0*Math.PI/180,0*Math.PI/180,0);


    let Texture = this.textureLoader.load('assets/shadow/Cylinder.png');
    let uniforms = {
      tShadow:{value:Texture},
      uShadowColor:{value:new THREE.Color("#d1b8a7")},
      uAlpha:{value:1}
    }
    let material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})
      
    let shadow = new THREE.Mesh(new THREE.PlaneGeometry(5,5),material);
    shadow.rotation.set(-Math.PI/2,0,0)

    this.scene.add(shadow);
    shadow.position.set(Loader.position.x,-.2,0);

    // Top Shadow Sphere
    let Texture02 = this.textureLoader.load('assets/shadow/Sphere.png');
    let uniforms02 = {
      tShadow:{value:Texture02},
      uShadowColor:{value:new THREE.Color("#d6b3b4")},
      uAlpha:{value:1}
    }
    let material02 = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms:uniforms02,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})
      
    let shadow02 = new THREE.Mesh(new THREE.PlaneGeometry(.8,.2),material02);
    shadow02.rotation.set(-Math.PI/2,0,0)
    shadow02.position.set(0,-.099,.02);

    // Bot Shadow Sphere
    let Texture03 = this.textureLoader.load('assets/shadow/Sphere02.png');
    let uniforms03 = {
      tShadow:{value:Texture03},
      uShadowColor:{value:new THREE.Color("#d1b8a7")},
      uAlpha:{value:0}
    }
    let material03 = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms:uniforms03,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})
      
    let shadow03 = new THREE.Mesh(new THREE.PlaneGeometry(5,5),material03);
    shadow03.rotation.set(-Math.PI/2,0,0);
    shadow03.position.set(-12,-.2,0);
    this.scene.add(shadow03);
    
    let GLB;
    this.loader.load('assets/model/Loader03.glb',(gltf)=>{ 
      GLB = gltf.scene;

      let Sphere;
      let Cylinder;
      for(var i=0;i<GLB.children.length;i++){
        if(GLB.children[i].name=="Sphere"){
          Sphere = GLB.children[i];
          console.log(Sphere);
          GLB.children[i].material = mate;
        } else {
          Cylinder = GLB.children[i];
          GLB.children[i].material = mate02;
        }
      }

      Sphere.position.x+=.2;
      Sphere.add(shadow02);
      Loader.add(Cylinder);
      Loader.add(Sphere);

      this.Loader.next(true);

    // Next Scene
    TweenMax.to('#nextStage',2,{ease:Power1.easeOut,delay:4,css:{opacity:1}});
    TweenMax.set('#nextStage',{css:{visibility:"visible"},delay:4});

      // Minimum Timer
      let MinimumLoadingTime = {value:0};
      TweenMax.to(MinimumLoadingTime,4,{value:1,ease:Power0.easeNone});

      // Check if Content Ready
      let ready = false;
      this.RS.LoadedCompleted.subscribe((value)=>{
        if(value){
          if(MinimumLoadingTime.value!==1){
            // if faster than minimum loading time, wait 
            TweenMax.delayedCall(4-MinimumLoadingTime.value,()=>{
              ready=true;
              // Start Introduction
              TweenMax.delayedCall(1,()=>{
                this.Introduction('A short','Experience');
              })
            })
          } else {
            // if lower than minimum loading time
            ready=true;
            this.Introduction('A short','Experience');
          }
        }
      })

      // Loading Animation
      let delayStart = 1.1;
      let LoopEnd=false;
      TweenMax.delayedCall(1,()=>{
        // Start
        TweenMax.to(shadow.position,delayStart,{x:"-=.3",ease:Power1.easeInOut})
        TweenMax.to(Loader.position,delayStart,{x:"-=.3",ease:Power1.easeInOut})
        TweenMax.to(Loader.rotation,delayStart,{z:31.5*Math.PI/180,ease:Power1.easeInOut})

        TweenMax.to(Sphere.position,delayStart+.4,{x:"-=.5",ease:Power1.easeInOut,delay:.5})
        TweenMax.fromTo(shadow02.scale,delayStart+.4,{x:".4"},{x:"+=.6",ease:Power1.easeInOut,delay:.5})

        // Loop until End Loading
        let tm1,tm2,tm3,tm4,tm5;
        tm1 = TweenMax.to(shadow.position,1,{x:"+=.6",ease:Power1.easeInOut,repeat:3,yoyo:true,delay:delayStart})
        tm2 = TweenMax.to(Loader.position,1,{x:"+=.6",ease:Power1.easeInOut,repeat:3,yoyo:true,delay:delayStart})
        tm3 = TweenMax.to(Loader.rotation,1,{z:-31.5*Math.PI/180,ease:Power1.easeInOut,repeat:3,yoyo:true,delay:delayStart,onComplete:()=>{
          if(ready){
            tm1.kill();
            tm2.kill();
            tm3.kill();
            LoopEnd=true;
            TweenMax.to(shadow.position,1,{x:"+=.6",ease:Power1.easeInOut})
            TweenMax.to(Loader.position,1,{x:"+=.6",ease:Power1.easeInOut})
            TweenMax.to(Loader.rotation,1,{z:-31.5*Math.PI/180,ease:Power1.easeInOut});
            TweenMax.to(shadow.position,1.25,{x:"-=.3",delay:1,ease:Power1.easeInOut})
            TweenMax.to(Loader.position,1.25,{x:"-=.3",delay:1,ease:Power1.easeInOut})
            TweenMax.to(Loader.rotation,1.25,{z:0*Math.PI/180,delay:1,ease:Power1.easeInOut});
          } else {
            tm1.restart();
            tm2.restart();
            tm3.restart();
          }
        }});

        tm4 = TweenMax.to(Sphere.position,1,{x:"+=.6",ease:Power1.easeInOut,repeat:3,yoyo:true,delay:.88+delayStart})
        tm5 = TweenMax.to(shadow02.scale,1,{x:"-=.6",ease:Power1.easeInOut,repeat:3,yoyo:true,delay:.88+delayStart,onComplete:()=>{
          if(LoopEnd){
            tm4.kill();
            tm5.kill();
            // x
            TweenMax.to(Sphere.position,1.25,{x:"+=.6",ease:Power1.easeInOut});
            TweenMax.to(Sphere.position,3.6,{x:"+=2.4",ease:Power1.easeOut,delay:.65});
            TweenMax.fromTo(shadow03.position,3.6,{x:-14.98},{x:"+=2.4",ease:Power1.easeOut,delay:.65});

            // y 
            TweenMax.to(Sphere.position,.2,{y:"-=.418",ease:Power1.easeOut,delay:1.05})
            TweenMax.to(Sphere.position,.15,{y:"+=.11",ease:Power1.easeOut,delay:1.0+.2})
            TweenMax.to(Sphere.position,.15,{y:"-=.11",ease:Power1.easeIn,delay:1.0+.2+.15})

            TweenMax.to(Sphere.position,.075,{y:"+=.04",ease:Power1.easeOut,delay:1.0+.2+.15+.15})
            TweenMax.to(Sphere.position,.075,{y:"-=.04",ease:Power1.easeIn,delay:1.0+.2+.15+.15+.075})

            // Shadow
            TweenMax.to(uniforms02.uAlpha,.1,{value:0,delay:.65});
            TweenMax.to(uniforms03.uAlpha,.1,{value:1,delay:1.1});
            
          } else {
            tm4.restart();
            tm5.restart();
          }
        }})
      })
    });
  }

  Introduction(span:string,h3:string){
    
    TweenMax.set('.Text',{css:{visibility:"visible"}});
    
    // Text Content
    document.getElementById('Introduction-span').innerHTML=span;
    document.getElementById('Introduction-h3').innerHTML=h3;

    // Text Animation
    TweenMax.to('#Introduction-span',1.2,{css:{opacity:1},ease:Power1.easeInOut});

    TweenMax.to('#Introduction-h3',1.2,{css:{opacity:1,y:0},delay:1.2,ease:Power1.easeInOut});

    TweenMax.to('#Introduction-span',2,{css:{opacity:0},delay:4});
    TweenMax.to('#Introduction-h3',2,{css:{opacity:0},delay:4,onComplete:()=>{
      TweenMax.set('.Text',{css:{visibility:"hidden"},});
    }});


    // // Next Scene
    // TweenMax.to('#nextStage',2,{ease:Power1.easeOut,delay:4,css:{opacity:1}});
    // TweenMax.set('#nextStage',{css:{visibility:"visible"},delay:4});
  }

  BOOPArray=[];
  BOOPCurrent=0;
  BOOPMaterial(){
    for(var i=0;i<5;i++){
      let B1 = new THREE.Object3D();
      B1.scale.set(1,1,1);
      B1.rotation.set(10*Math.PI/180,0,0);
      this.scene.add(B1);
      this.BOOPArray.push(B1);

      let boopMat = new THREE.MeshBasicMaterial({ color: 0xf0f0f0,transparent:true,opacity:0 });
      let meshB = new THREE.Mesh(new THREE.BoxBufferGeometry(.2, .05, .05),boopMat);

      for(var j=0;j<5;j++){
        let layer2 = new THREE.Object3D();
        
        let layer3 = meshB.clone();
        layer3.position.set(0,0,0);
        
        layer2.add(layer3);
        layer2.rotation.set(0,j*72*Math.PI/180,0);
        
        B1.add(layer2);
      }
    }
  }

  BOOP(Ox: number, Oy: number, Oz: number) {
    if(this.BOOPCurrent == 5){
      this.BOOPCurrent=0;
    }
    
    this.BOOPArray[this.BOOPCurrent].position.set(Ox, Oy, Oz);
    for(var i=0;i<this.BOOPArray[this.BOOPCurrent].children.length;i++){
      // this.BOOPArray[this.BOOPCurrent].children[i].children[0].material.color.setHex(color);
      TweenMax.fromTo(this.BOOPArray[this.BOOPCurrent].children[i].children[0].position,.3,{x:0},{x:"+=.17"});
      TweenMax.fromTo(this.BOOPArray[this.BOOPCurrent].children[i].children[0].scale,.75,{x:1,y:1,z:1},{x:.1,y:.1,z:.1});
      TweenMax.fromTo(this.BOOPArray[this.BOOPCurrent].children[i].children[0].material,.1,{opacity:1},{opacity:0,delay:1});
    }
    this.BOOPCurrent++;
  }

  // private CursorMoveObject: CANNON.Body;
  // CreateCursorMoveObject() {
  //   this.CursorMoveObject = new CANNON.Body({ mass: 0 });
  //   this.CursorMoveObject.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, 1)));
  //   // this.CursorMoveObject.addShape(new CANNON.Sphere(0.2))
  //   this.world.addBody(this.CursorMoveObject);
  // }

  PointToAngle(x1,y1,x2,y2){
    var deltaX = x2-x1;
    var deltaY = y2-y1;
    var rad = Math.atan2(deltaY,deltaX);
    return rad * (180/Math.PI);
  }

  distanceVec2(x,y,x2,y2){
    var a = x-x2;
    var b = y-y2;
    return Math.sqrt(a*a + b*b)
  }

  distance(x, y, z, vx, vy, vz) {
    var dx = x - vx;
    var dy = y - vy;
    var dz = z - vz;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  resize() {
    var PixelRatio = 1;

    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}


