import * as THREE from 'three';
import * as CANNON from 'cannon';
import { gsap } from 'gsap';
import * as OrbitControls from 'three-orbitcontrols';
import GLTFLoader from 'three-gltf-loader';
// import thisWork from 'three-dragcontrols';
import { Injectable } from '@angular/core';
import * as dat from 'dat.gui';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Resources } from './Resources.service';


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

  private meshes03 = [];
  private bodies03 = [];

  private Remeshes03 = [];
  private Rebodies03 = [];
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
  gui = new dat.GUI();
  



  raycaster = new THREE.Raycaster();

  mouse = new THREE.Vector2();
  private offset = new THREE.Vector3();
  private intersection = new THREE.Vector3();




  private DynamicShadows = [];
  private ScenePhase:number;

  Goal = new THREE.Vector3();
  EasedGoal = new THREE.Vector3();
  GoalAngle = new THREE.Vector3();
  
  
  InitThree(elementId: string): void {
    this.canvas = <HTMLCanvasElement>document.getElementById(elementId);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      // antialias: true // smooth edges
    });
    this.renderer.gammaOutput=true;
    this.renderer.gammaFactor=2.2;
    // this.renderer.toneMapping = THREE.LinearToneMapping;
    // this.renderer.toneMappingExposure = 1;
    
    this.renderer.setPixelRatio(2);
    this.textureLoader = new THREE.TextureLoader();
    this.clock = new THREE.Clock();

    var width = window.innerWidth;
    var height = window.innerHeight;
    this.renderer.setSize(width,height);
    // this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.setClearColor("#a8b3d3", 0);
    // this.renderer.autoClearColor=false;
    // create the scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000);

    this.scene.add(this.camera);

    this.raycaster.linePrecision=.012;
    //  this.raycaster.params.Line.threshold = 1000;

    // loader 
    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('assets/draco/');
    this.loader.setDRACOLoader(this.dracoLoader);


    // this.GoalAngle.set(0,1.4,8);
    this.GoalAngle.set(0,1.3,8);
    this.camera.position.copy(this.GoalAngle);
    this.camera.lookAt(new THREE.Vector3(-12,0,0));

    this.Goal.set(-12,1,0)
    this.EasedGoal.copy(this.Goal);

    // gsap.delayedCall(1+1,()=>{
    //    document.getElementById('Main').classList.add('BG2');
    // });
    
    // gsap.to(this.Goal,1,{delay:1+1,x:0,ease:"inOut"})
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
    
  
    var bg = this.gui.addFolder("Background");
    bg.addColor(bgparams, "background")
      .onChange(() => {
        canvas.setAttribute("style","background:linear-gradient(to bottom, "+ bgparams.background+" 0%," + bgparams.background+" 35%," + bgparams.background02+" 35%," +bgparams.background02+" 100%);");
      });
    bg.addColor(bgparams, "background02")
      .onChange(() => {
        canvas.setAttribute("style","background:linear-gradient(to bottom, "+ bgparams.background+" 0%," + bgparams.background+" 35%," + bgparams.background02+" 35%," +bgparams.background02+" 100%);");
      });

    // bg.addColor(bgparams, "background")
    //   .onChange(() => {
    //     canvas.setAttribute("style","background:"+ bgparams.background+";");
    //   });
  }


  private BaseMatcap;
  FirstInit(): void {

    this.ScenePhase=1;

    this.Loading();
    this.AddEvent();
    this.BOOPMaterial();
    // this.ThirdInit();
    // this.CreateBalloonCursor();
    
    // document.addEventListener('mousemove',e=>{
    //   // cursor.setAttribute("style","top:"+e.pageY+"px;left:"+e.pageX+"px;");
    //   // gsap.to(cursor,.3,{css:{left:e.pageX,top:e.pageY}})
    //   console.log("asdf")
    // },false);

    // document.addEventListener('mousedown',this.CursorDown,false);
    // document.addEventListener('mouseup',this.CursorUp,false);
    

    this.canvas.addEventListener("mousemove", (e) => {
      this.renderThreePosition(e.x, e.y);
    });


    // this.canvas.addEventListener("touchmove", (e) => {
    //   this.renderThreePosition(e.touches[0].clientX, e.touches[0].clientY);
    // });

    // this.canvas.addEventListener("touchend", (e) => {
    //   // this.renderThreePosition(e.touches[0].clientX, e.touches[0].clientY);
    //     this.canvas.ontouchmove = null;
    //     if (this.collided) {
    //       this.FirstCursor.copy(this.LastCursor);
    //     } else {
    //       TweenLite.to(this.FirstCursor, .5, {
    //         x: this.LastCursor.x,
    //         y: this.LastCursor.y, z: this.LastCursor.z
    //       })
    //       this.CheckLetterIntersect()
    //     }
    // });
  }

  CursorDown = ()=>{
    let outer = document.querySelector('.cursor .svg-cursor');
    gsap.to(outer,.2,{css:{scale:.7}});
  }

  CursorUp = ()=>{
    let outer = document.querySelector('.cursor .svg-cursor');
    gsap.to(outer,.2,{css:{scale:1}});
  }


  AddEvent(): void {
    this.render();
    window.addEventListener('resize', () => {
      this.resize();
    });
  }

   BasePosition = new THREE.Vector2();
   LBvec = new THREE.Vector3();
  renderThreePosition(x, y) {
    this.vec.set(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1,
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

  private GoalEasing = .1;
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
  }


  Loading(){
    let blue = this.textureLoader.load('assets/matcaps/01/97ADD9.png');
    blue.encoding=THREE.sRGBEncoding;

    let mate = new THREE.MeshMatcapMaterial({
      matcap:blue,
      color:0xffffff,
      side:2
    })
    let Mesh = new THREE.Mesh(new THREE.CylinderBufferGeometry(.4,.4,.2,16,1,false,0,Math.PI),mate);
    Mesh.rotation.set(Math.PI/2,-Math.PI/4,0)
    Mesh.position.set(-12,0,0);
    this.scene.add(Mesh);

    gsap.to(Mesh.position,1,{x:"+=1",repeat:-1,repeatDelay:1,ease:"out"});
    gsap.to(Mesh.position,1,{x:"-=1",repeat:-1,repeatDelay:1,ease:"out",delay:1});
    gsap.to(Mesh.rotation,1,{y:"-="+Math.PI/2,repeat:-1,repeatDelay:1});
    gsap.to(Mesh.rotation,1,{y:"+="+Math.PI/2,repeat:-1,repeatDelay:1,delay:1});
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
      gsap.fromTo(this.BOOPArray[this.BOOPCurrent].children[i].children[0].position,.3,{x:0},{x:"+=.17"});
      gsap.fromTo(this.BOOPArray[this.BOOPCurrent].children[i].children[0].scale,.75,{x:1,y:1,z:1},{x:.1,y:.1,z:.1});
      gsap.fromTo(this.BOOPArray[this.BOOPCurrent].children[i].children[0].material,.1,{opacity:1},{opacity:0,delay:1});
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

    let width = window.innerWidth;
    let height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}


