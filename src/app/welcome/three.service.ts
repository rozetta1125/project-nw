import * as THREE from 'three';
import * as CANNON from 'cannon';
import { TweenLite,Power0,Power1,Power2,gsap } from 'gsap';
import * as OrbitControls from 'three-orbitcontrols';
import GLTFLoader from 'three-gltf-loader';
// import thisWork from 'three-dragcontrols';
import { Injectable } from '@angular/core';
import * as dat from 'dat.gui';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { Resources } from './Resources.service';


class GiftBalloon{
  GB: THREE.Object3D
  GBBody: CANNON.Body

  Balloon3d: THREE.Object3D
  BalloonBody: CANNON.Body
  BalloonAttach: THREE.Mesh

  Box3d: THREE.Object3D
  BoxBody: CANNON.Body
  BoxTopBody: CANNON.Body
  BoxThree: THREE.Scene
  BoxLid: THREE.Scene
  BoxAttach: THREE.Mesh
  BoxConstraint: CANNON.LockConstraint

  Shadow: THREE.Mesh
  
  Curve: THREE.LineCurve3
  CurvePoint: any

  NormalGeo: THREE.Geometry
  NormalLine: THREE.Line

  Lines01: CANNON.Body[]
  Catmull01: THREE.CatmullRomCurve3
  LinePoints01: any
  StringPoints01: LineGeometry
  StringLine01: Line2
  LockConstrain01: CANNON.LockConstraint
  DisConstrain01: CANNON.DistanceConstraint[]

  Lines02: CANNON.Body[]
  Catmull02: THREE.CatmullRomCurve3
  LinePoints02: any
  StringPoints02: LineGeometry
  StringLine02: Line2
  LockConstrain02: CANNON.LockConstraint
  DisConstrain02: CANNON.DistanceConstraint[]

  Boop:Boolean
  State:Boolean
}

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
  // CANNON BASIC SETUP
  private world03 = new CANNON.World();


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
  private gui = new dat.GUI();
  

  // Balloon Cursor
  private StringM;
  private BalloonM = new THREE.MeshMatcapMaterial();
  private FirstCursor = new THREE.Vector3();
  private LastCursor = new THREE.Vector3();
  private LetterArray = [];
  private GiftBalloonArray = [];


  // Drag Stuffs
  private curvePipe = new THREE.Mesh();

  private plane = new THREE.Plane();
  raycaster = new THREE.Raycaster();

  mouse = new THREE.Vector2();
  private mouseF = new THREE.Vector2();
  private mouseL = new THREE.Vector2();
  private offset = new THREE.Vector3();
  private intersection = new THREE.Vector3();
  private Lines=[];



  private DynamicShadows = [];
  private ScenePhase:number;

  Goal = new THREE.Vector3();
  private EasedGoal = new THREE.Vector3();
  private GoalAngle = new THREE.Vector3();
  
  
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
    // this.camera.position.set(3,2,6);
    // this.camera.position.set(0,1,6);

    // this.camera.position.set(0, 2.4, 8);
    this.camera.position.set(0, 2.5, 7.5);

    this.scene.add(this.camera);

    this.raycaster.linePrecision=.012;
    //  this.raycaster.params.Line.threshold = 1000;

    // loader 
    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('assets/draco/');
    this.loader.setDRACOLoader(this.dracoLoader);


    // this.GoalAngle.set(0,1.4,8);
    this.GoalAngle.set(0,1.4,8);
    this.camera.position.copy(this.GoalAngle);
    this.camera.lookAt(new THREE.Vector3(0,0,0));

    this.Goal.set(0,1,0)
    this.EasedGoal.copy(this.Goal);


    // OrbitControls
    // this.controls = new OrbitControls(this.camera, this.canvas);
    // this.controls.target.set(0,1,0);
    // this.controls.update();
    // this.controls.enableRotate = false;
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
    // bg.addColor(bgparams, "background")
    //   .onChange(() => {
    //     canvas.setAttribute("style","background:linear-gradient(to bottom, "+ bgparams.background+" 0%,"+bgparams.background02+" 100%);");
    //   });
    // bg.addColor(bgparams, "background02")
    //   .onChange(() => {
    //     canvas.setAttribute("style","background:linear-gradient(to bottom, "+ bgparams.background+" 0%,"+bgparams.background02+" 100%);");
    //   });

    bg.addColor(bgparams, "background")
      .onChange(() => {
        canvas.setAttribute("style","background:"+ bgparams.background+";");
      });
  }


  private BaseMatcap;
  FirstInit(): void {

    this.ScenePhase=1;
    // this.FS.InitFirstScene();

    this.StringM = new LineMaterial({
      color:0xeeeeee,
      linewidth:.0012,
    })

    this.AddEvent();

    // this.ThirdInit();
    // this.CreateBalloonCursor();

    let cursor = document.querySelector('.cursor');

    document.addEventListener('mousemove',e=>{
      cursor.setAttribute("style","top:"+e.pageY+"px;left:"+e.pageX+"px;");
    });
    document.addEventListener('mousedown',this.CursorDown,false);
    document.addEventListener('mouseup',this.CursorUp,false);
    

    this.canvas.addEventListener("mousemove", (e) => {
      this.renderThreePosition(e.x, e.y);
    });


    // this.canvas.addEventListener("touchmove", (e) => {
    //   this.renderThreePosition(e.touches[0].clientX, e.touches[0].clientY);
    // });
    // this.canvas.addEventListener("mousedown", (e) => {
    //   if (e.which == 1) {
    //     this.CursorBegin();
    //     // this.canvas.onmousemove = () => {
    //     //   this.BalloonCursor();
    //     // };
    //     this.canvas.addEventListener("mousemove",this.ThirdSceneMouseMove,false);
    //   }
    // });

    // this.canvas.addEventListener("mouseup", (e) => {
    //   if (e.which == 1) {
    //     // this.canvas.onmousemove = null;
    //     this.canvas.removeEventListener("mousemove",this.ThirdSceneMouseMove,false);
    //     TweenLite.to(this.FirstCursor, .5, {
    //       x: this.LastCursor.x,
    //       y: this.LastCursor.y, z: this.LastCursor.z
    //     })
    //     this.CheckIntersect();
    //     // if (this.collided) {
    //     //   this.FirstCursor.copy(this.LastCursor);
    //     // } else {
    //     //   TweenLite.to(this.FirstCursor, .5, {
    //     //     x: this.LastCursor.x,
    //     //     y: this.LastCursor.y, z: this.LastCursor.z
    //     //   })
    //     //   this.CheckIntersect()
    //     // }
    //   }
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


  ThirdSceneMouseMove = ()=>{
    this.BalloonCursor();
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



  private GoalEasing = .2;
  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    this.now = performance.now();

    // Camera 
    this.EasedGoal.x+=(this.Goal.x - this.EasedGoal.x) * this.GoalEasing;
    this.EasedGoal.y+=(this.Goal.y - this.EasedGoal.y) * this.GoalEasing;
    this.EasedGoal.z+=(this.Goal.z - this.EasedGoal.z) * this.GoalEasing;

    this.camera.position.copy(this.EasedGoal).add(this.GoalAngle.clone().normalize().multiplyScalar(this.GoalAngle.z))


    if (this.times.length > 0 && this.times[0] <= this.now - 1000) {
      this.times.shift();
    }

    this.times.push(this.now);
    this.fps = this.times.length;

    // this.MiniGolfRender();
    // this.ThirdSceneRender();

    this.renderer.render(this.scene, this.camera);
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

  // THIRD SCENE SETUP
  ThirdInit(){
    this.InitThirdWorld();
    this.BOOPMaterial();
    this.CreateGiftBalloon(-5,3,-1);
    // this.CreateGiftBalloon(-2,2.7,0);
    // this.CreateGiftBalloon(2,2.5,.5);

    this.CreateIsland(0,-0.075,-.5);
    this.canvas.addEventListener("click", throttle(
      () => {
      this.ThirdClickEvent();
      },600));

    this.canvas.addEventListener("touchstart", throttle((e) => {
      this.renderThreePosition(e.touches[0].clientX, e.touches[0].clientY);
      this.ThirdClickEvent();
    },600));
  }


  private IslandRock:THREE.Object3D;
  private Island:THREE.Object3D;
  private Tent:THREE.Object3D;
  private House:THREE.Object3D;
  private Hammer:THREE.Object3D;
  private SmokeTexture:THREE.Object3D;
  private SmokeTexture02:THREE.Object3D;
  CreateIsland(Ix,Iy,Iz){
    // Material
    let tent01 = this.textureLoader.load('assets/matcaps/03/tent01.png',()=>{
      tent01.encoding=THREE.sRGBEncoding;
    });
    let tent02 = this.textureLoader.load('assets/matcaps/03/tent02.png',()=>{
      tent02.encoding=THREE.sRGBEncoding;
    });
    let tree = this.textureLoader.load('assets/matcaps/03/tree.png',()=>{
      tree.encoding=THREE.sRGBEncoding;
    });
    let wood = this.textureLoader.load('assets/matcaps/03/wood.png',()=>{
      wood.encoding=THREE.sRGBEncoding;
    });
    let land = this.textureLoader.load('assets/matcaps/03/land.png',()=>{
      land.encoding=THREE.sRGBEncoding;
    });
    let sea = this.textureLoader.load('assets/matcaps/03/sea.png',()=>{
      sea.encoding=THREE.sRGBEncoding;
    });
    let white = this.textureLoader.load('assets/matcaps/03/white.png',()=>{
      white.encoding=THREE.sRGBEncoding;
    });
    let yellow = this.textureLoader.load('assets/matcaps/03/coin.png',()=>{
      yellow.encoding=THREE.sRGBEncoding;
    });

    var ScaleMultiplier = 1.75;
    var mateOpacity = 1;


    // Island 
    this.loader.load(
      'assets/model/Island05.glb',
      (gltf) => {
        this.Island = gltf.scene;
        this.Island.scale.set(ScaleMultiplier,ScaleMultiplier,ScaleMultiplier);
        this.Island.rotation.set(0,0*Math.PI/180,0)
        this.Island.position.set(Ix,Iy,Iz);

        for(var i=0;i<this.Island.children.length;i++){
          if(this.Island.children[""+i+""].name=="Land"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:land,transparent:true,opacity:mateOpacity,
            });
            this.Island.children[""+i+""].children[0].material=mate01;
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:tree,transparent:true,opacity:mateOpacity,
            });
            this.Island.children[""+i+""].children[1].material=mate02;
          } else if(this.Island.children[""+i+""].name=="Tree01"||this.Island.children[""+i+""].name=="Tree02"){
              let mate01 = new THREE.MeshMatcapMaterial({
                color:0xffffff,side:2,matcap:wood,transparent:true,opacity:mateOpacity,
              });
              this.Island.children[""+i+""].children[0].material=mate01;
              let mate02 = new THREE.MeshMatcapMaterial({
                color:0xffffff,side:2,matcap:tree,transparent:true,opacity:mateOpacity,
              });
            this.Island.children[""+i+""].children[1].material=mate02;
            this.ThirdSceneObject.push(this.Island.children[""+i+""]);
          } else if(this.Island.children[""+i+""].name=="Mail"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:wood,transparent:true,opacity:mateOpacity,
            });
            this.Island.children[""+i+""].children[0].material=mate01;
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xcccccc,side:2,matcap:wood,transparent:true,opacity:mateOpacity,
            });
            this.Island.children[""+i+""].children[1].material=mate02;
          } else if(this.Island.children[""+i+""].name=="Sea"){
            var seaMate = new THREE.MeshBasicMaterial({color:0x81d2e8});
            let bgparams = {
              sea: "#81d2e8",
            }
          
            var bg = this.gui.addFolder("Sea Inner");
            bg.addColor(bgparams, "sea")
              .onChange(() => {
                seaMate.color.set(new THREE.Color(bgparams.sea));
              });
            this.Island.children[""+i+""].material=seaMate;
            this.Island.children[""+i+""].scale.set(1.1,1.1,1.1);
            // this.Island.children[""+i+""].position.y=.2

            // gsap.fromTo(this.Island.children[""+i+""].rotation,1.5,{z:.02},{z:-.02,repeat:-1,yoyo:true,ease:"power1.inOut"});
            gsap.fromTo(this.Island.children[""+i+""].position,1.5,{y:"+=.07"},{y:"-=.07",repeat:-1,yoyo:true,ease:"power1.inOut"});
          } else if(this.Island.children[""+i+""].name=="OuterSea"){
            
            var seaMate = new THREE.MeshBasicMaterial({color:0x81d2e8});
            let bgparams = {
              sea: "#81d2e8",
            }
          
            var bg = this.gui.addFolder("Sea Outer");

            bg.addColor(bgparams, "sea")
              .onChange(() => {
                seaMate.color.set(new THREE.Color(bgparams.sea));
              });
            this.Island.children[""+i+""].material=seaMate;
            // this.Island.children[""+i+""].scale.set(1.1,1.1,1.1);
            gsap.fromTo(this.Island.children[""+i+""].scale,1.5,{x:1.1,z:1.1},{x:1.18,z:1.18,repeat:-1,yoyo:true,ease:"power1.inOut"});
          }
        }

        // Island Shadow 
        var texture = this.textureLoader.load('assets/shadow/Island.png');

        var uniforms = {
          tShadow:{value:texture},
          uShadowColor:{value:new THREE.Color("#78b75e")},
          uAlpha:{value:.7}
        }
        var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
          vertexShader:document.getElementById('vertexShader').textContent,
          fragmentShader:document.getElementById('fragmentShader').textContent})

        var shadow = new THREE.Mesh(new THREE.PlaneGeometry(6,6),material);
        shadow.rotation.set(-Math.PI/2,0,0)
        shadow.position.set(0,.151,0);

        this.Island.add(shadow);
        this.scene.add(this.Island);
      }
    );



    // Hammer
    this.loader.load(
      'assets/model/Hammer.glb',
      (gltf) => {
        this.Hammer = gltf.scene;
        for(var i=0;i<this.Hammer.children.length;i++){
          if(this.Hammer.children[""+i+""].name=="Hammer"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:white,transparent:true,opacity:mateOpacity,
            });
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xfefefe,side:2,matcap:wood,transparent:true,opacity:mateOpacity,
            });
            this.Hammer.children[""+i+""].children[0].material=mate01;
            this.Hammer.children[""+i+""].children[1].material=mate02;
          }
        }
      }
    )

    // Smoke Texture Center
    var texture = this.textureLoader.load('assets/shadow/Smoke02.png');
  
    var uniforms = {
      tShadow:{value:texture},
      uShadowColor:{value:new THREE.Color("#eeeeee")},
      uAlpha:{value:.4}
    }
    var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})
      
    this.SmokeTexture = new THREE.Mesh(new THREE.PlaneGeometry(2,2),material);
    this.SmokeTexture.rotation.set(0,0,0)
    this.SmokeTexture.position.set(Ix,Iy+.85,Iz+.75);
    this.SmokeTexture.renderOrder=2;

    // Smoke Texture 02
    var uniforms = {
      tShadow:{value:texture},
      uShadowColor:{value:new THREE.Color("#f2f2f2")},
      uAlpha:{value:.7}
    }
    var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})
      
    this.SmokeTexture02 = new THREE.Mesh(new THREE.PlaneGeometry(2,2),material);
    this.SmokeTexture02.rotation.set(0,0,0)
    this.SmokeTexture02.position.set(Ix,Iy+.85,Iz+.75);

    // Tent
    this.loader.load(
      'assets/model/Tent.glb',
      (gltf) => {
        this.Tent = gltf.scene;
        this.Tent.scale.set(ScaleMultiplier,ScaleMultiplier,ScaleMultiplier);
        this.Tent.position.set(Ix,Iy,Iz);

        for(var i=0;i<this.Tent.children.length;i++){
          if(this.Tent.children[""+i+""].name=="Tent"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:tent01,transparent:true,opacity:mateOpacity,
            });
            this.Tent.children[""+i+""].children[0].material=mate01;
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:tent02,transparent:true,opacity:mateOpacity,
            });
            this.Tent.children[""+i+""].children[1].material=mate02;
          } else if(this.Tent.children[""+i+""].name=="Pillar"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:wood,transparent:true,opacity:mateOpacity,
            });
            this.Tent.children[""+i+""].material=mate01;
          } else if(this.Tent.children[""+i+""].name=="Rope"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:wood,transparent:true,opacity:mateOpacity,
            });
            this.Tent.children[""+i+""].material=mate01;
          } 
        }

        var texture = this.textureLoader.load('assets/shadow/Tent.png');

        var uniforms = {
          tShadow:{value:texture},
          uShadowColor:{value:new THREE.Color("#78b75e")},
          uAlpha:{value:.75}
        }
        var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
          vertexShader:document.getElementById('vertexShader').textContent,
          fragmentShader:document.getElementById('fragmentShader').textContent})

        var shadow = new THREE.Mesh(new THREE.PlaneGeometry(6,6),material);
        shadow.rotation.set(-Math.PI/2,0,0)
        shadow.position.set(0,0.151,0);

        this.Tent.add(shadow);
        this.scene.add(this.Tent);
      }
    );


    let HousePaint = this.textureLoader.load('assets/matcaps/03/F8E1B5.png',()=>{
      HousePaint.encoding=THREE.sRGBEncoding;
    });

    // House
    this.loader.load(
      'assets/model/House01.glb',
      (gltf) => {
        this.House = gltf.scene;
        this.House.scale.set(1.7,1.7,1.7);
        this.House.position.set(Ix-.1,Iy+.01,Iz);
        this.House.rotation.set(0,0*Math.PI/180,0);
        // this.scene.add(this.House);

        // blue
        var ma01 = new THREE.MeshMatcapMaterial({
          color:0xE79D7C,side:2,matcap:white,transparent:true,opacity:mateOpacity,
        });
        let ma01params = {
          ma01: "#E79D7C",
        }
        // white
        var ma02 = new THREE.MeshMatcapMaterial({
          color:0xfff3d8,side:2,matcap:white,transparent:true,opacity:mateOpacity,
        });
        let ma02params = {
          ma02: "#fff3d8",
        }
        // wood
        var ma03 = new THREE.MeshMatcapMaterial({
          color:0xE7CE9B,side:2,matcap:white,transparent:true,opacity:mateOpacity,
        });
        let ma03params = {
          ma03: "#E7CE9B",
        }
        // sea
        var ma04 = new THREE.MeshMatcapMaterial({
          color:0xd3f5ff,side:2,matcap:white,transparent:true,opacity:mateOpacity,
        });
        let ma04params = {
          ma04: "#d3f5ff",
        }
        var House = this.gui.addFolder("House");
        House.addColor(ma01params, "ma01")
          .onChange(() => {
            ma01.color.set(new THREE.Color(ma01params.ma01));
          });
        House.addColor(ma02params, "ma02")
        .onChange(() => {
          ma02.color.set(new THREE.Color(ma02params.ma02));
        });
        House.addColor(ma03params, "ma03")
        .onChange(() => {
          ma03.color.set(new THREE.Color(ma03params.ma03));
        });
        House.addColor(ma04params, "ma04")
        .onChange(() => {
          ma04.color.set(new THREE.Color(ma04params.ma04));
        });
        for(var i=0;i<this.House.children.length;i++){
          if(this.House.children[""+i+""].name=="House"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:HousePaint,transparent:true,opacity:mateOpacity,
            });
            this.House.children[""+i+""].children[0].material=mate01;
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:HousePaint,transparent:true,opacity:mateOpacity,
            });
            this.House.children[""+i+""].children[1].material=mate02;
            let mate03 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:wood,transparent:true,opacity:mateOpacity,
            });
            this.House.children[""+i+""].children[2].material=mate03;
            
            // Testing
            this.House.children[""+i+""].children[0].material=ma02;
            this.House.children[""+i+""].children[1].material=ma03;
            this.House.children[""+i+""].children[2].material=ma01;
          } else if(this.House.children[""+i+""].name=="Door"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:wood,transparent:true,opacity:mateOpacity,
            });
            this.House.children[""+i+""].children[0].material=mate01;
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xeeeeee,side:2,matcap:wood,transparent:true,opacity:mateOpacity,
            });
            this.House.children[""+i+""].children[1].material=mate02;

            // testing
            this.House.children[""+i+""].children[0].material=ma03;
          } else if(this.House.children[""+i+""].name=="Window"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:wood,transparent:true,opacity:mateOpacity,
            });
            this.House.children[""+i+""].children[0].material=mate01;
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:white,transparent:true,opacity:mateOpacity,
            });
            var seaMate = new THREE.MeshBasicMaterial({color:0xaee3f2});
            this.House.children[""+i+""].children[1].material=mate02;

            // testing
            this.House.children[""+i+""].children[0].material=ma03;
            this.House.children[""+i+""].children[1].material=ma04;
          } else if(this.House.children[""+i+""].name=="Lamp"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:white,transparent:true,opacity:mateOpacity,
            });
            this.House.children[""+i+""].children[0].material=mate01;
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:wood,transparent:true,opacity:mateOpacity,
            });
            this.House.children[""+i+""].children[1].material=mate02;

            // testing
            this.House.children[""+i+""].children[0].material=ma02;
            this.House.children[""+i+""].children[1].material=ma03;
          } else if(this.House.children[""+i+""].name=="SmokePipe"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:wood,transparent:true,opacity:mateOpacity,
            });
            this.House.children[""+i+""].material=mate01;
            // testing
            this.House.children[""+i+""].material=ma01;
          }
        }

        var texture = this.textureLoader.load('assets/shadow/House.png');

        var uniforms = {
          tShadow:{value:texture},
          uShadowColor:{value:new THREE.Color("#78b75e")},
          uAlpha:{value:.5}
        }
        var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
          vertexShader:document.getElementById('vertexShader').textContent,
          fragmentShader:document.getElementById('fragmentShader').textContent})

        var shadow = new THREE.Mesh(new THREE.PlaneGeometry(6,6),material);
        shadow.rotation.set(-Math.PI/2,0,0)
        shadow.position.set(0,0.151,0);

        this.House.add(shadow);
      }
    );

    // Rock
    this.loader.load(
      'assets/model/Rock.glb',
      (gltf)=>{
        this.IslandRock = gltf.scene;
        this.IslandRock.scale.set(ScaleMultiplier,ScaleMultiplier,ScaleMultiplier)
        this.IslandRock.position.set(Ix+1.8,Iy,Iz+.2);
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xe6e6e6,side:2,matcap:white,transparent:true,opacity:mateOpacity,
        });
        this.IslandRock.children["0"].material=mate01;
        this.ThirdSceneObject.push(this.IslandRock.children["0"]);

        this.scene.add(this.IslandRock)

        let texture = this.textureLoader.load('assets/shadow/Rock.png');

        let uniforms = {
          tShadow:{value:texture},
          uShadowColor:{value:new THREE.Color("#78b75e")},
          uAlpha:{value:.75}
        }
        let material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
          vertexShader:document.getElementById('vertexShader').textContent,
          fragmentShader:document.getElementById('fragmentShader').textContent})
    
        let shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.05,2.05),material);
        shadow.renderOrder = 1

        shadow.rotation.set(-Math.PI/2,0,0)
        shadow.position.set(0,.151,0.01);
        this.IslandRock.add(shadow);
      }
    )
    
    // CANNON 
    var something = new THREE.Mesh();
    something.rotation.set(0,0,0);
    var quat = new CANNON.Quaternion();
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    // Tree
    let BodyTree = new CANNON.Body({mass:0});
    BodyTree.addShape(new CANNON.Sphere(.38),new CANNON.Vec3(0,1.1,0));
    BodyTree.addShape(new CANNON.Sphere(.38),new CANNON.Vec3(0,.9,0));
    BodyTree.addShape(new CANNON.Box(new CANNON.Vec3(.07,.15,.07)),new CANNON.Vec3(0,.35,0));
    BodyTree.position.set(Ix-1.62,Iy+.08,Iz-.8);
    this.world03.addBody(BodyTree);

    let BodyTree02 = new CANNON.Body({mass:0});
    BodyTree02.addShape(new CANNON.Sphere(.42),new CANNON.Vec3(0,1.2,0));
    BodyTree02.addShape(new CANNON.Sphere(.42),new CANNON.Vec3(0,1,0));
    BodyTree02.addShape(new CANNON.Box(new CANNON.Vec3(.07,.15,.07)),new CANNON.Vec3(0,.35,0));
    BodyTree02.position.set(Ix+1.46,Iy+.08,Iz-2.1);
    this.world03.addBody(BodyTree02);

    // Tent 
    let BodyTent = new CANNON.Body({mass:0});
    var quat = new CANNON.Quaternion();

    something.rotation.set(0,0,42.5*Math.PI/180);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    BodyTent.addShape(new CANNON.Box(new CANNON.Vec3(.04,.7,.88)),new CANNON.Vec3(.45,1,-.35),quat);

    something.rotation.set(0,0,-42.5*Math.PI/180);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    BodyTent.addShape(new CANNON.Box(new CANNON.Vec3(.04,.7,.88)),new CANNON.Vec3(-.45,1,-.35),quat);

    something.rotation.set(0,0,-45*Math.PI/180);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    BodyTent.addShape(new CANNON.Box(new CANNON.Vec3(.65,.65,.88)),new CANNON.Vec3(0,0.47,-.35),quat);

    // Pillar
    something.rotation.set(15*Math.PI/180,0,-15*Math.PI/180);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    BodyTent.addShape(new CANNON.Box(new CANNON.Vec3(.06,.1,.06)),new CANNON.Vec3(1.1,0.3,0.6),quat);

    something.rotation.set(-15*Math.PI/180,0,-15*Math.PI/180);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    BodyTent.addShape(new CANNON.Box(new CANNON.Vec3(.06,.1,.06)),new CANNON.Vec3(1.08,0.3,-1.3),quat);

    something.rotation.set(15*Math.PI/180,0,15*Math.PI/180);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    BodyTent.addShape(new CANNON.Box(new CANNON.Vec3(.06,.1,.06)),new CANNON.Vec3(-1.08,0.3,0.58),quat);

    something.rotation.set(-15*Math.PI/180,0,15*Math.PI/180);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    BodyTent.addShape(new CANNON.Box(new CANNON.Vec3(.06,.1,.06)),new CANNON.Vec3(-1.08,0.3,-1.3),quat);

    // MailBox
    BodyTent.addShape(new CANNON.Box(new CANNON.Vec3(.03,.2,.03)),new CANNON.Vec3(-.69,0.47,.88))
    BodyTent.addShape(new CANNON.Box(new CANNON.Vec3(.13,.06,.07)),new CANNON.Vec3(-.69,0.6,.97))

    this.world03.addBody(BodyTent)
    BodyTent.position.set(Ix,Iy,Iz)

    something.rotation.set(-Math.PI/2,0,0);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    // Land
    let BodyLand = new CANNON.Body({mass:0,material: this.LandMaterial});
    BodyLand.addShape(new CANNON.Cylinder(2.95,2.95,.2,16),new CANNON.Vec3(0.05,.163,-.45),quat);

    BodyLand.addShape(new CANNON.Cylinder(3.05,3.05,.2,16),new CANNON.Vec3(0.05,.11,-.45),quat);

    this.world03.addBody(BodyLand);
    BodyLand.position.set(Ix,Iy,Iz);
  }



  private SmokeTextureArray = [];
  private SmokeTexture02Array = [];
  UpgradeFunction(Ix,Iy,Iz){
    // Hammer
    this.Hammer.position.set(.85,.9,0);
    this.Hammer.scale.set(2,2,2);
    this.scene.add(this.Hammer);
    gsap.fromTo(this.Hammer.rotation,.14,{z:0},{z:1.2,yoyo:true,repeat:3,ease:"none",onComplete:()=>{
      this.Hammer.position.set(-.8,1.1,0);
      gsap.fromTo(this.Hammer.rotation,.14,{z:0},{z:-1.2,yoyo:true,repeat:3,ease:"none",onComplete:()=>{
        this.Hammer.position.set(.65,1.25,0);
        gsap.fromTo(this.Hammer.rotation,.14,{z:0},{z:1.2,yoyo:true,repeat:3,ease:"none",onComplete:()=>{
          this.scene.remove(this.Hammer);
        }});
      }});
    }});

    // center
    for(var i=0;i<3;i++){
      if(this.SmokeTextureArray.length<3){
        let shadow = this.SmokeTexture.clone();
        this.scene.add(shadow);
        this.SmokeTextureArray.push(shadow);
      }

      this.scene.add(this.SmokeTextureArray[i])
      gsap.set(this.SmokeTextureArray[i].material.uniforms.uAlpha,{value:.4});

      // Scale
      gsap.fromTo(this.SmokeTextureArray[i].scale,1,{x:.4,y:.4,z:.4},{x:1.,y:1.,z:1.,ease:"none"});

      // Rotation
      gsap.fromTo(this.SmokeTextureArray[i].rotation,4,{z:Math.random()*3.15},{z:"+="+(Math.random()*40-20),ease:"none"})
      
      // Explosion
      gsap.to(this.SmokeTextureArray[i].material.uniforms.uAlpha,.1,{value:1.5,delay:1.4});
      gsap.to(this.SmokeTextureArray[i].scale,.2,{x:1.8,y:1.8,z:1.8,delay:1.5});
      gsap.to(this.SmokeTextureArray[i].scale,.2,{x:1.5,y:1.5,z:1.5,delay:1.7});
      let k = i;
      gsap.to(this.SmokeTextureArray[i].material.uniforms.uAlpha,.2,{value:0,delay:1.7,ease:"none",onComplete:()=>{
        this.scene.remove(this.SmokeTextureArray[k])
      }});
    }
    gsap.delayedCall(1.6,()=>{
      this.scene.remove(this.Tent);
      
      gsap.fromTo(this.House.scale,.4,{x:"-=.8",y:"-=1.6",z:"-=1.6"},{x:"+=.8",y:"+=1.6",z:"+=1.6",delay:.1,ease:"in"});
      gsap.to(this.House.scale,.15,{x:"-=.2",y:"-=.2",z:"-=.2",delay:.5,ease:"out"});
      gsap.to(this.House.scale,.15,{x:"+=.2",y:"+=.2",z:"+=.2",delay:.65,ease:"in"});
      this.scene.add(this.House);
    })

    // outer
    gsap.delayedCall(.2,()=>{
      for(var i=0;i<12;i++){
        let shadow = this.SmokeTexture02.clone();
        this.scene.add(shadow);

        var delayI = i*.1;
        // Scale
        gsap.fromTo(shadow.scale,.5,{x:.6,y:.6,z:.6},{x:.01,y:.01,z:.01,delay:delayI,ease:"none"});
  
        // Position
        gsap.fromTo(shadow.position,.5,{x:Math.random()*.5-.25,y:.5,z:-.1},
          {x:"+="+(Math.random()*2-1),y:"+="+(Math.random()*1+.6),z:.3,delay:delayI});
  
        // Rotation
        gsap.fromTo(shadow.rotation,1,{z:Math.random()*3.15},{z:"+="+(Math.random()*10-5),ease:"none",delay:delayI})
  
        gsap.delayedCall(1+delayI,()=>{
          this.scene.remove(shadow);
        })
      }
    })

    // last 
    var randomArray=[];
    randomArray = this.GenerateRandomPosition(10,-1.5,1.5,.7,2,1,1,1.5);
    gsap.delayedCall(1.5,()=>{
    for(var i=0;i<10;i++){
        let shadow = this.SmokeTexture02.clone();
        this.scene.add(shadow);

        // Scale
        gsap.fromTo(shadow.scale,.3,{x:1,y:1,z:1},{x:.01,y:.01,z:.01,ease:"none"});
        
        // Position
        gsap.fromTo(shadow.position,.3,{x:Math.random()*.5-.25,y:.5,z:-.1},
          {x:randomArray[i].x,y:randomArray[i].y,z:randomArray[i].z});

        // Rotation
        gsap.fromTo(shadow.rotation,1,{z:Math.random()*3.15},{z:"+="+(Math.random()*10-5),ease:"none"})

        gsap.delayedCall(1,()=>{
          this.scene.remove(shadow);
        })
      }
    })
  }

  GenerateRandomPosition(n:number,minx,maxx,miny,maxy,minz,maxz,distance){
    let Array = [];
    
    while(Array.length<n){
      var Vec3 = new THREE.Vector3(
        Math.random()*(maxx-minx+1)+minx,
        Math.random()*(maxy-miny+1)+miny,
        Math.random()*(maxz-minz+1)+minz
      );
      for(var j=0;j<Array.length;j++){
        var overlap:boolean=false;
        if(this.distance(Vec3.x,Vec3.y,Vec3.z,Array[j].x,Array[j].y,Array[j].z)<distance){
          overlap=true;  
        }
      }
      if(!overlap){
        Array.push(Vec3);
      }
    }
    return Array;
  }

  private LandMaterial: CANNON.Material
  private GiftMaterial:CANNON.Material
  InitThirdWorld(): void {
    this.world03 = new CANNON.World();
    this.world03.gravity.set(0, 0, 0);

    gsap.delayedCall(1,()=>{
      this.world03.gravity.set(0, -5.5, 0);
    })

    this.debugger03 = new CannonDebugRenderer(this.scene, this.world03);
    this.PlaneMaterial = new CANNON.Material("PlaneMaterial");
    this.LandMaterial = new CANNON.Material("LandMaterial");
    this.GiftMaterial = new CANNON.Material("GiftMaterial");

    let c = new CANNON.ContactMaterial(this.GiftMaterial,this.LandMaterial,{
      restitution:0.1,
      friction:0.1,
    });
    this.world03.addContactMaterial(c);

    let shape = new CANNON.Plane();
    let plane = new CANNON.Body({ mass: 0, material: this.PlaneMaterial});
    plane.addShape(shape);
    plane.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    plane.position.set(0, 0, 0);
    this.world03.addBody(plane);
  }

  private ThirdSceneObject = [];
  CreateGiftBalloon(Px,Py,Pz){
    if(this.GiftBalloonArray.length>4){
      
    } else {
      let E = new GiftBalloon;
      this.GiftBalloonArray.push(E);
  
      // false: uncut, true: cut
      E.State=false;
      // false: The gift hasn't broken
      E.Boop=false;
          
      E.Lines01=[];
      E.Lines02=[];
      E.DisConstrain01=[];
      E.DisConstrain02=[];
  
      // Material
      let mate02 = new THREE.MeshBasicMaterial({
        color:0xffffff,
        transparent:true,
        opacity:0,
      })
  
  
      // GB (top force)
      E.GBBody = new CANNON.Body({mass:0});
      E.GBBody.addShape(new CANNON.Sphere(.02));
      E.GBBody.position.set(Px,Py,Pz);
      this.world03.addBody(E.GBBody);
  
      // Balloon 3d
      E.Balloon3d = new THREE.Object3D();
      this.loader.load(
        'assets/model/balloon01.glb',
        (gltf) => {
          var s = gltf.scene;
          s.scale.set(1.15,1.15,1.15)
          s.children["0"].position.set(0,0,0);
          let mate01 = new THREE.MeshMatcapMaterial({
            color:0xffffff,
            side:2,
            transparent:true,
            opacity:1,
            matcap:this.RS.red
          })
          s.children["0"].material=mate01;
          E.Balloon3d.add(s);
        }
      );
  
      // Balloon Attach
      E.BalloonAttach = new THREE.Mesh(new THREE.BoxBufferGeometry(.02,.02,.02),mate02)
      E.BalloonAttach.position.set(0,-.16,0);
      E.Balloon3d.add(E.BalloonAttach);
      E.Balloon3d.position.set(0,0,0);
      this.scene.add(E.Balloon3d);
  
      var linearDamping = .3;
      var angularDamping = .3;
  
      // Balloon body
      E.BalloonBody = new CANNON.Body({ mass: 10});
      E.BalloonBody.addShape(new CANNON.Sphere(.15),new CANNON.Vec3(0,0.06,0));
      E.BalloonBody.angularDamping = angularDamping;
      E.BalloonBody.linearDamping = linearDamping;
      this.world03.addBody(E.BalloonBody);
  
      E.BalloonBody.position.set( Px, Py-.3, Pz);
      
      // Balloon Constraint
      var c = new CANNON.PointToPointConstraint(E.BalloonBody,new CANNON.Vec3(0,.15,0),E.GBBody,new CANNON.Vec3(0,-.15,0));
      this.world03.addConstraint(c);
  
  
      // Box 
      E.Box3d = new THREE.Object3D();
      this.loader.load(
        'assets/model/Box02.glb',
        (gltf) => {
          E.BoxThree = gltf.scene;
          E.BoxThree.scale.set(1.25,1.25,1.25)
          E.BoxThree.position.set(0,0,0);
          let mate01 = new THREE.MeshMatcapMaterial({
            color:0xffffff,
            side:2,
            transparent:true,
            opacity:1,
            matcap:this.RS.red
          })
          let mate03 = new THREE.MeshMatcapMaterial({
            color:0xfefefe,
            side:2,
            transparent:true,
            opacity:1,
            matcap:this.RS.white
          })
          E.BoxThree.children["0"].children[0].material=mate03;
          E.BoxThree.children["0"].children[1].material=mate01;
          E.Box3d.add(E.BoxThree);
        }
      );
      


      this.loader.load(
        'assets/model/Lid.glb',
        (gltf) => {
          E.BoxLid = gltf.scene;
          E.BoxLid.scale.set(1.25,1.25,1.25)
          E.BoxLid.position.set(0,0,0);
          let mate01 = new THREE.MeshMatcapMaterial({
            color:0xffffff,
            side:2,
            transparent:true,
            opacity:1,
            matcap:this.RS.red
          })
          let mate03 = new THREE.MeshMatcapMaterial({
            color:0xfefefe,
            side:2,
            transparent:true,
            opacity:1,
            matcap:this.RS.white
          })
          E.BoxLid.children["0"].children[0].material=mate03;
          E.BoxLid.children["0"].children[1].material=mate01;
          E.Box3d.add(E.BoxLid);
        }
      );
      
  
      E.BoxAttach = new THREE.Mesh(new THREE.BoxBufferGeometry(.02,.02,.02),mate02)
      E.BoxAttach.position.set(0,.12,0);
      E.Box3d.add(E.BoxAttach);
      this.scene.add(E.Box3d);

  
      E.BoxBody = new CANNON.Body({ mass: 6,material:this.GiftMaterial });
      E.BoxBody.addShape(new CANNON.Box(new CANNON.Vec3(.125,.08,.125)),new CANNON.Vec3(0,-.025,0));
      this.world03.addBody(E.BoxBody);
  
      E.BoxTopBody = new CANNON.Body({ mass: 2 });
      E.BoxTopBody.addShape(new CANNON.Box(new CANNON.Vec3(.135,.033,.135)),new CANNON.Vec3(0,0.08,0));
  
      // Bowtie
      // var something = new THREE.Mesh();
      // something.rotation.set(0,0,40*Math.PI/180);
      // var quat = new CANNON.Quaternion();
      // quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
  
      // E.BoxTopBody.addShape(new CANNON.Box(new CANNON.Vec3(.04,.035,.035)),new CANNON.Vec3(0.1,0.15,0),quat);
  
      // var something = new THREE.Mesh();
      // something.rotation.set(0,0,-40*Math.PI/180);
      // var quat = new CANNON.Quaternion();
      // quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
      // E.BoxTopBody.addShape(new CANNON.Box(new CANNON.Vec3(.04,.035,.035)),new CANNON.Vec3(-0.1,0.15,0),quat);
      this.world03.addBody(E.BoxTopBody);
  
      // Gift Box Position
      E.BoxBody.position.set(Px, Py-.9, Pz);
      E.BoxTopBody.position.set(Px, Py-.9, Pz);
      
      var b = new CANNON.LockConstraint(E.BoxBody,E.BoxTopBody);
      b.collideConnected=false;
      this.world03.addConstraint(b)
  
      E.BoxBody.addEventListener('collide',(e)=>{
        if(e.body.material){
          if(e.body.material.name=="PlaneMaterial"&&!E.Boop){
            E.Boop=true;
            gsap.to(E.Box3d.scale,.3,{x:.1,y:.1,z:.1})
            gsap.to(E.Shadow.scale,.3,{x:.1,y:.1,z:.1})
            this.scene.remove(E.StringLine02)
            gsap.delayedCall(.2,()=>{
              this.BOOP(E.BoxBody.position.x,E.BoxBody.position.y,E.BoxBody.position.z);
              this.scene.remove(E.Box3d);
              this.scene.remove(E.Shadow);
              this.world03.remove(E.BoxBody);
              this.world03.remove(E.BoxTopBody);
              for(var i=0;i<E.Lines02.length;i++){
                this.world03.remove(E.Lines02[i])
              }
            })
          };
        }
      });
  
      E.BoxTopBody.addEventListener('collide',(e)=>{
        if(e.body.material){
          if(e.body.material.name=="LandMaterial"&&!E.Boop){
            E.Boop=true;
            gsap.to(E.Box3d.scale,.3,{x:.1,y:.1,z:.1})
            gsap.to(E.Shadow.scale,.3,{x:.1,y:.1,z:.1})
            this.scene.remove(E.StringLine02)
            gsap.delayedCall(.2,()=>{
              this.BOOP(E.BoxBody.position.x,E.BoxBody.position.y,E.BoxBody.position.z);
              this.scene.remove(E.Box3d);
              this.scene.remove(E.Shadow);
              this.world03.remove(E.BoxBody);
              this.world03.remove(E.BoxTopBody);
              for(var i=0;i<E.Lines02.length;i++){
                this.world03.remove(E.Lines02[i])
              }
            })
          };
        }
      });
  
      E.BoxBody.angularDamping = angularDamping;
      E.BoxBody.linearDamping = linearDamping;
  
  
      // Box Constraint
      E.BoxConstraint = new CANNON.LockConstraint(E.BoxBody, E.BalloonBody);
      this.world03.addConstraint(E.BoxConstraint);
  
  
      // Create Line2 (First Line)
      E.LinePoints01 = [];
  
      E.LinePoints01.push(Px,Py-.2,Pz,Px,Py-1,Pz);
  
      
      E.StringPoints01 = new LineGeometry();
      E.StringPoints01.setPositions(E.LinePoints01);
  
      E.StringLine01 = new Line2(
        E.StringPoints01,this.StringM
      )
      this.scene.add(E.StringLine01)
  
      // Normal Line (to cut)
      E.NormalGeo = new THREE.Geometry();
      E.NormalGeo.vertices.push(
        E.BalloonAttach.position,
        E.BoxAttach.position
      )
      E.NormalLine = new THREE.Line(E.NormalGeo,new THREE.LineBasicMaterial({color:0x0000ff}));
  
      this.Lines.push(E.NormalLine);
      // this.scene.add(E.NormalLine);
  
  
      var adp = .3;
      var ldp = .3;
      // Create Lines01
      for (var i = 0; i < 4; i++) {
        let body = new CANNON.Body({ mass: i == 0 ? 20 : .1});
        body.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
  
        body.angularDamping = adp;
        body.linearDamping = ldp;
  
        E.Lines01.push(body);
      }
      E.Catmull01 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Px,Py,Pz),new THREE.Vector3(Px,Py-.5,Pz),new THREE.Vector3(Px,Py-1,Pz),new THREE.Vector3(Px,Py-1,Pz)
      ])
  
      // Create Lines02
      for (var i = 0; i < 4; i++) {
        let body = new CANNON.Body({ mass: i == 0 ? .1 : .1});
        body.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
  
        body.angularDamping = adp;
        body.linearDamping = ldp;
  
        E.Lines02.push(body);
      }
      E.Catmull02 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Px,Py,Pz),new THREE.Vector3(Px,Py-.5,Pz),new THREE.Vector3(Px,Py-1,Pz),new THREE.Vector3(Px,Py-1,Pz)
      ])
  
  
      // SHADOW
      var texture = this.textureLoader.load('assets/shadow/Gift.png');
  
      let uniforms = {
        tShadow:{value:texture},
        uShadowColor:{value:new THREE.Color("#78b75e")},
        uAlpha:{value:.75}
      }
      let material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
        vertexShader:document.getElementById('vertexShader').textContent,
        fragmentShader:document.getElementById('fragmentShader').textContent})
        
      E.Shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.2),material);
      E.Shadow.rotation.set(-Math.PI/2,0,0)
      
      E.Shadow.position.set(Px,Py,Pz);
  
      this.scene.add(E.Shadow);
  
      gsap.delayedCall(Math.random()*1+1,()=>{
        gsap.to(E.GBBody.position,1.8,{x:"+=.4",ease:"power1.in"});
        gsap.to(E.GBBody.position,1.8,{x:"+=.4",ease:"power1.out",delay:1.5});
        gsap.to(E.GBBody.position,1.8,{z:"+=.2",ease:"power1.in"});
        gsap.to(E.GBBody.position,1.8,{z:"-=.2",ease:"power1.out",delay:1.5});
  
        gsap.to(E.GBBody.position,0,{repeat:15,repeatDelay:3,
          onRepeat:()=>{
            // gsap.to(E.GB.position,2,{x:"+=.4",ease:"power1.in"});
            // gsap.to(E.GB.position,2,{x:"+=.4",ease:"power1.out",delay:2,});
            if(!E.State){
              gsap.to(E.GBBody.position,1.8,{x:"+=.4",ease:"power1.in"});
              gsap.to(E.GBBody.position,1.8,{x:"+=.4",ease:"power1.out",delay:1.5});
              gsap.to(E.GBBody.position,1.8,{z:"+=.2",ease:"power1.in"});
              gsap.to(E.GBBody.position,1.8,{z:"-=.2",ease:"power1.out",delay:1.5});
            }
          }});
      })
    }

  }

  ThirdRaycaster(){
    this.raycaster.setFromCamera(this.mouse,this.camera);
    var intersect = this.raycaster.intersectObjects(this.ThirdSceneObject,true)
    let outer = document.querySelector('.cursor .outer');
    let inner = document.querySelector('.cursor .inner');
    if(intersect.length>0){
      gsap.to(outer,.2,{attr:{r:22}});
      gsap.to(inner,.2,{attr:{r:19}});
    } else {
      gsap.to(outer,.2,{attr:{r:13}});
      gsap.to(inner,.2,{attr:{r:0}});
    }
  }

  private ScoreMax = 6*3*4;
  private ScoreCurrent = 0;
  private ScoreLast = 0;
  private CoinArray=[];
  private CoinCurrent = 0;
  private GolfScore=[];
  CreateScoreMaterial(){
    // Score
    let Score01 = new THREE.Mesh(new THREE.BoxBufferGeometry(.05,.08,.005),
      new THREE.MeshMatcapMaterial({color:0xffffff,matcap:this.RS.blue02,transparent:true}));
    let Score02 = new THREE.Mesh(new THREE.BoxBufferGeometry(.08,.05,.005),
      new THREE.MeshMatcapMaterial({color:0xffffff,matcap:this.RS.red,transparent:true}));
    let Score03 = new THREE.Mesh(new THREE.BoxBufferGeometry(.05,.08,.005),
      new THREE.MeshMatcapMaterial({color:0xffffff,matcap:this.RS.yellow,transparent:true}));
    Score01.position.set(0,5,0)
    Score02.position.set(0,5,0)
    Score03.position.set(0,5,0)
    for (var i=0;i<this.ScoreMax/3;i++){
      let mesh = Score01.clone();
      this.scene.add(mesh);
      this.GolfScore.push(mesh);
      
      let mesh02 = Score02.clone();
      this.scene.add(mesh02);
      this.GolfScore.push(mesh02);

      let mesh03 = Score03.clone();
      this.scene.add(mesh03);
      this.GolfScore.push(mesh03);
    }
    // let Score02 = new THREE.Mesh(new THREE.CylinderBufferGeometry(.04,.04,.02,8,1),
    //   new THREE.MeshMatcapMaterial({color:0xffffff,matcap:this.RS.blue02,transparent:true}));
    // Score02.position.set(0,5,0)
    // for(var i=0;i<this.ScoreMax/3;i++){
    //   let mesh = Score02.clone();
    //   this.scene.add(mesh);
    //   this.GolfScore.push(mesh);
    // }
    // let Score03 = new THREE.Mesh(new THREE.CylinderBufferGeometry(.04,.04,.02,8,1),
    //   new THREE.MeshMatcapMaterial({color:0xffffff,matcap:this.pink,transparent:true}));
    // Score03.position.set(0,5,0)
    // for(var i=0;i<this.ScoreMax/3;i++){
    //   let mesh = Score03.clone();
    //   this.scene.add(mesh);
    //   this.GolfScore.push(mesh);
    // }

    // let yellow = this.textureLoader.load('assets/matcaps/03/FFEB40.png',()=>{
    //   yellow.encoding=THREE.sRGBEncoding;
    // });
    this.loader.load(
      'assets/model/Coin.glb',
      (gltf) => {
        let coin = new THREE.Object3D();

        gltf.scene.scale.set(2.75,2.75,2.75)
        gltf.scene.position.set(0,0,0);
        gltf.scene.rotation.set(40*Math.PI/180,0,20*Math.PI/180)

        coin.add(gltf.scene);

        for(var i=0;i<4;i++){
          let mesh = coin.clone();
          mesh.name="Coin";
          let mate01 = new THREE.MeshMatcapMaterial({
            color:0xffffff,
            side:2,
            transparent:true,
            opacity:1,
            matcap:this.RS.yellow
          })
          let mate02 = new THREE.MeshMatcapMaterial({
            color:0xeeeeee,
            side:2,
            transparent:true,
            opacity:1,
            matcap:this.RS.yellow
          })

          mesh.children["0"].children[0].children[0].material=mate01;
          mesh.children["0"].children[0].children[1].material=mate02;

          
          // Shadow
          let texture = this.textureLoader.load('assets/shadow/Coin.png');

          let uniforms = {
            tShadow:{value:texture},
            uShadowColor:{value:new THREE.Color("#78b75e")},
            uAlpha:{value:0}
          }
          let material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
            vertexShader:document.getElementById('vertexShader').textContent,
            fragmentShader:document.getElementById('fragmentShader').textContent})
      
          let shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.8,2.8),material);
          shadow.renderOrder = 1
  
          shadow.rotation.set(-Math.PI/2,0,0)
          shadow.position.set(-0.01,-0.085,0.01);
          mesh.add(shadow);

          this.ThirdSceneObject.push(mesh.children["0"]);
          this.scene.add(mesh);
          this.CoinArray.push(mesh);
        }
      });
  }

  private ScoreDistance = .25;
  ScoreFunction(Po:CANNON.Vec3){
    if(this.ScoreCurrent >= this.ScoreMax){
      this.ScoreCurrent=24;
      this.ScoreLast=0;
      this.CoinCurrent=0;
    } else {
      this.ScoreCurrent+=24;
    }

    var j=0;
    for(var i=this.ScoreLast;i<this.ScoreCurrent;i++){

      var ranX = Po.x + Math.random()*1.2-.6;
      var ranZ = Po.z + Math.random()*1.2-.6;

      var distance = this.distanceVec2(ranX,ranZ,Po.x,Po.z);
      if(distance>this.ScoreDistance){
        var randomDelay = j;
        j+=.01;

        // Distance duration
        var DD = (distance - this.ScoreDistance);

        var PoDuration = .35 + DD;
        
        // Position
        gsap.fromTo(this.GolfScore[i].position,PoDuration,
          {x:Po.x,z:Po.z},
          {x:ranX,z:ranZ,delay:randomDelay,ease:"power1.out"});


        gsap.fromTo(this.GolfScore[i].position,PoDuration/2,{y:Po.y},{ease:"power1.out",y:DD+.4,delay:randomDelay})
        gsap.to(this.GolfScore[i].position,PoDuration/2,{ease:"power1.in",delay:(PoDuration/2)+randomDelay,y:0.28})

        // Rotation
        gsap.fromTo(this.GolfScore[i].rotation,PoDuration,{x:0,y:0,z:0},{x:Math.random()*24-12,y:Math.random()*24-12,z:Math.random()*24-12,delay:randomDelay,ease:"none"});

        // Scale
        // gsap.set(this.GolfScore[i].scale,{x:Math.random()*.3+.7,y:Math.random()*.3+.7,z:Math.random()*.3+.7});
        gsap.to(this.GolfScore[i].scale,PoDuration,{delay:PoDuration+.1,x:.1,y:.1,z:.1})
      } else {
        i--;
      }
    }
    this.ScoreLast = this.ScoreCurrent;

    // Coin
    this.CoinArray[this.CoinCurrent].position.set(Po.x,Po.y,Po.z);
    gsap.fromTo(this.CoinArray[this.CoinCurrent].position,.35,{y:Po.y},{delay:0,ease:"power1.out",y:"+=.6"})
    gsap.to(this.CoinArray[this.CoinCurrent].position,.35,{ease:"power1.in",delay:.35,y:0.28})

    // Opacity
    gsap.to(this.CoinArray[this.CoinCurrent].children[1].material.uniforms.uAlpha,
      .3,{value:.6,delay:.6})
    this.CoinCurrent+=1;
  }

  private RockClickNum:number=0;
  ThirdClickEvent(){
    this.raycaster.setFromCamera(this.mouse,this.camera);
    var intersect = this.raycaster.intersectObjects(this.ThirdSceneObject,true)
    if(intersect.length>0){
      console.log(intersect[0])
      switch (intersect[0].object.name) {
        case "Rock":
          var Vector = new THREE.Vector3();
          Vector.setFromMatrixPosition(intersect[0].object.matrixWorld);

          // Coin && Rock
          if(this.CoinCurrent<4 && this.RockClickNum<3){
            // Rock
            gsap.to(intersect[0].object.parent.position,.3,{x:"+=.1",z:"-=.1",ease:"out"});
            gsap.to(intersect[0].object.parent.position,.3,{x:"-=.1",z:"+=.1",ease:"in",delay:.3});

            // scale
            gsap.fromTo(this.CoinArray[this.CoinCurrent].scale,.3,{x:.2,y:.2,z:.2},{x:1,y:1,z:1})
            // Opacity
            gsap.to(this.CoinArray[this.CoinCurrent].children[1].material.uniforms.uAlpha,
              .3,{value:.6,delay:.6})

            // X Z
            if(this.RockClickNum==0){
              gsap.fromTo(this.CoinArray[this.CoinCurrent].position,1,{x:Vector.x,z:Vector.z},{x:"+=.45",z:"+=.45",ease:"power1.out"});
            } else if (this.RockClickNum==1){
              gsap.fromTo(this.CoinArray[this.CoinCurrent].position,1,{x:Vector.x,z:Vector.z},{x:"+=0",z:"+=.45",ease:"power1.out"});
            } else  {
              gsap.fromTo(this.CoinArray[this.CoinCurrent].position,1,{x:Vector.x,z:Vector.z},{x:"-=.45",z:"+=.45",ease:"power1.out"});
            }
            this.RockClickNum++;

            // Y
            gsap.fromTo(this.CoinArray[this.CoinCurrent].position,.3,{y:Vector.y},{ease:"power1.out",y:"+=.6"})
            gsap.to(this.CoinArray[this.CoinCurrent].position,.3,{ease:"power1.in",delay:.3,y:0.28})

            gsap.to(this.CoinArray[this.CoinCurrent].position,.2,{delay:0.6,ease:"power1.out",y:"+=.12"})
            gsap.to(this.CoinArray[this.CoinCurrent].position,.2,{ease:"power1.in",delay:.8,y:0.28})

            this.CoinCurrent+=1;
          }

          // Star 
          Vector.y+=.3;
          Vector.x-=.1;
          Vector.project(this.camera);
          var Px = (Vector.x+1)*window.innerWidth/2;
          var Py = - (Vector.y-1)*window.innerHeight/2;

          for(var i=0;i<3;i++){
            var xmlns = "http://www.w3.org/2000/svg";
            var star = document.createElementNS(xmlns,'svg');
            star.setAttributeNS(null,"viewBox","-20 -20 40 40");
            star.setAttribute("class", "star");
  
            var path = document.createElementNS(xmlns,"path");
            path.setAttributeNS(null, "d", "M6,-4C20,0 20,0 6,4C6,19 6,19 -2,7C-16,12 -16,12 -8,0C-16,-12 -16,-12 -2,-7C6,-19 6,-19 6,-4");
  
            document.getElementById('welcome').appendChild(star);
            star.appendChild(path);
  
            // Set Position, rotate
            gsap.set(star,{css:{left:Px,top:Py}});
            gsap.set(star,{css:{rotate:Math.random()*90}});
            //
            gsap.to(star,.25,{css:{opacity:0},delay:.4,ease:"in"})
            gsap.to(star,.5,{css:{rotate:"-=180"},ease:"power1.out"})
            if(i==0){
              gsap.set(star,{css:{scale:.8}});
              var rL = 20 + Math.random()*10-5;
              var rT = 70 + Math.random()*10-5;
              gsap.to(star,.25,{ease:"out",css:{left:"-="+rL,top:"-="+rT}});
              gsap.to(star,.2,{ease:"none",delay:.25,css:{left:"-=15",top:"+=15"}});
            } else if (i==1){
              gsap.set(star,{css:{scale:1.1}});
              var rL = 65 + Math.random()*14-7;
              var rT = 65 + Math.random()*14-7;
              gsap.to(star,.25,{ease:"out",css:{left:"-="+rL,top:"-="+rT}});
              gsap.to(star,.2,{ease:"none",delay:.25,css:{left:"-=15",top:"+=15"}});
            } else {
              var rL = 70 + Math.random()*10-5;
              var rT = 20 + Math.random()*10-5;
              gsap.to(star,.25,{ease:"out",css:{left:"-="+rL,top:"-="+rT}});
              gsap.to(star,.2,{ease:"none",delay:.25,css:{left:"-=15",top:"+=15"}});
            }
          }
          break;
      }
      switch (intersect[0].object.parent.name){
        case "Tree01":
        case "Tree02":
          this.UpgradeFunction(0,-0.075,-.5);
          var Vector = new THREE.Vector3();

          // Vibrate
          gsap.to(intersect[0].object.parent.rotation,.075,{z:-.02,ease:"none"});
          gsap.to(intersect[0].object.parent.rotation,.15,{z:.02,ease:"none",delay:.075});
          gsap.to(intersect[0].object.parent.rotation,.15,{z:-.02,ease:"none",delay:.225});
          gsap.to(intersect[0].object.parent.rotation,.075,{z:0,ease:"none",delay:.375});


          // Leaf
          gsap.delayedCall(.2,()=>{
            for(var i=0;i<4;i++){
              let leaf = document.createElement('div');
              leaf.className = "leaf";
              document.getElementById('welcome').appendChild(leaf);
  
              Vector.setFromMatrixPosition(intersect[0].object.parent.matrixWorld);
              
              Vector.x += Math.random()*.8-.4 - .1;
              Vector.y += Math.random()*.8-.4 + .75;
              Vector.project(this.camera);
              var Px = (Vector.x+1)*window.innerWidth/2;
              var Py = - (Vector.y-1)*window.innerHeight/2;
              
              
              gsap.set(leaf,{css:{rotate:Math.random()*360-180}});
              gsap.to(leaf,.3,{css:{opacity:1},delay:i*.2});

              var rX = Math.random()*40-20;
              var rY = Math.random()*40+40;
              gsap.fromTo(leaf,1.5,{css:{left:Px,top:Py}},{css:{top:"+="+rY,left:"+="+rX},ease:"none"});
              
              gsap.fromTo(leaf,1.5,{css:{scale:Math.random()*.5+.5}},{css:{scale:.01},delay:i*.2,ease:"none"});

              gsap.delayedCall(2,()=>{
                document.getElementById('welcome').removeChild(leaf);
              })
            }

            // Coin
            if(this.CoinCurrent<4){
              // scale
              gsap.fromTo(this.CoinArray[this.CoinCurrent].scale,.6,{x:.2,y:.2,z:.2},{x:1,y:1,z:1})
              // Opacity
              gsap.to(this.CoinArray[this.CoinCurrent].children[1].material.uniforms.uAlpha,
                .3,{value:.6,delay:.6})
  
              Vector.setFromMatrixPosition(intersect[0].object.parent.matrixWorld);
              Vector.x+=.21;
              Vector.z+=.21;
  
              // X Z
              gsap.set(this.CoinArray[this.CoinCurrent].position,{x:Vector.x,z:Vector.z,});
              gsap.to(this.CoinArray[this.CoinCurrent].position,.35,{x:"+=.15",z:"+=.15",delay:.4});
  
              // Y
              gsap.fromTo(this.CoinArray[this.CoinCurrent].position,.4,{y:.28+.6},{ease:"power1.in",y:"-=.6"})
  
              gsap.to(this.CoinArray[this.CoinCurrent].position,.2,{delay:0.4,ease:"power1.out",y:"+=.15"})
              gsap.to(this.CoinArray[this.CoinCurrent].position,.2,{ease:"power1.in",delay:.6,y:0.28})
  
              this.CoinCurrent+=1;
            }
          })
          break;
        case "Coin":
          // Coin
          gsap.to(intersect[0].object.parent.parent.position,.4,{y:"+=.3",ease:"none"});
          gsap.to(intersect[0].object.parent.parent.scale,.4,{delay:.2,x:.1,y:.1,z:.1,ease:"none"});
          gsap.to(intersect[0].object.parent.parent.parent.children["1"].material.uniforms.uAlpha,
            .4,{value:0,delay:.1})

          // +1
          var plus1 = document.createElement('div');
          plus1.innerHTML = "+1";
          plus1.className = "plus1";
          document.getElementById('welcome').appendChild(plus1);

          var Vector = new THREE.Vector3()
          Vector.setFromMatrixPosition(intersect[0].object.matrixWorld);

          Vector.project(this.camera);
          
          var Px = (Vector.x+1)*window.innerWidth/2;
          var Py = - (Vector.y-1)*window.innerHeight/2;
          Vector.y+=.2;
          var Py2 = - (Vector.y-1)*window.innerHeight/2;
          gsap.set(plus1,{css:{left:Px}})
          gsap.fromTo(plus1,.8,{css:{top:Py}},{css:{top:Py2},ease:"power1.out"})
          gsap.to(plus1,.4,{css:{opacity:1},delay:.1})
          gsap.to(plus1,.8,{css:{opacity:0},delay:.6})
          
          gsap.delayedCall(1,()=>{
            document.getElementById('welcome').removeChild(plus1);
            this.scene.remove(intersect[0].object.parent.parent.parent);
          })
          break;
      }
    }
  }

  ThirdSceneRender(){
    // this.islandSea.verticesNeedUpdate=true;
    // this.raycaster.setFromCamera(this.mouse,this.camera);
    // var intersects = this.raycaster.intersectObjects(this.Lines,true)
    // // for(var j=0;j<intersect.length;j++){
    // //   // intersect[""+j+""].object.material=Ma;
    // //   // this.Cutletter(intersect[""+j+""].object.id,intersect[""+j+""].point);
    // //   console.log('cut',intersect[""+j+""].object)
    // // }
    // if ( intersects.length > 0 ) {
    //   this.sphereInter.visible = true;
    //   console.log('cuttttt')
    //   console.log(intersects)
    //   this.sphereInter.position.copy( intersects[ 0 ].point );
    // } else {
    //   this.sphereInter.visible = false;
    // }

    this.ThirdRaycaster();
    this.world03.step(1 / this.fps);
    this.RenderMouseCursor();
    // this.debugger03.update();
    // for (var i = 0; i < this.meshes03.length; i++) {
    //   this.meshes03[i].position.copy(this.bodies03[i].position);
    //   this.meshes03[i].quaternion.copy(this.bodies03[i].quaternion);
    // }
    // for (var i = 0; i < this.Remeshes03.length; i++) {
    //   this.Rebodies03[i].position.copy(this.Remeshes03[i].position);
    //   this.Rebodies03[i].quaternion.copy(this.Remeshes03[i].quaternion);
    // }

    // GiftBalloon
    for(var i=0;i<this.GiftBalloonArray.length;i++){
      // Base Position
      this.GiftBalloonArray[i].Balloon3d.position.copy(this.GiftBalloonArray[i].BalloonBody.position);
      this.GiftBalloonArray[i].Balloon3d.quaternion.copy(this.GiftBalloonArray[i].BalloonBody.quaternion);
      this.GiftBalloonArray[i].Box3d.position.copy(this.GiftBalloonArray[i].BoxBody.position);
      this.GiftBalloonArray[i].Box3d.quaternion.copy(this.GiftBalloonArray[i].BoxBody.quaternion);

      // Shadow Position
      this.GiftBalloonArray[i].Shadow.position.set(this.GiftBalloonArray[i].Box3d.position.x,
        this.GiftBalloonArray[i].Box3d.position.y -.1,this.GiftBalloonArray[i].Box3d.position.z)
      this.GiftBalloonArray[i].Shadow.material.uniforms.uAlpha.value = 
        (.6 - this.GiftBalloonArray[i].Box3d.position.y)*1.5;

      
      // Attach Position
      var Po = new THREE.Vector3();
      Po.setFromMatrixPosition(this.GiftBalloonArray[i].BalloonAttach.matrixWorld);
      var Po2 = new THREE.Vector3();
      Po2.setFromMatrixPosition(this.GiftBalloonArray[i].BoxAttach.matrixWorld);
      
      if(!this.GiftBalloonArray[i].State){
        // String Line
        this.GiftBalloonArray[i].LinePoints01 = [];
        this.GiftBalloonArray[i].LinePoints01.push(Po.x,Po.y,Po.z,Po2.x,Po2.y,Po2.z);
        this.GiftBalloonArray[i].StringPoints01.setPositions(this.GiftBalloonArray[i].LinePoints01);
  
        // Normal Line
        this.GiftBalloonArray[i].NormalGeo.vertices[0] = Po
        this.GiftBalloonArray[i].NormalGeo.vertices[1] = Po2
        this.GiftBalloonArray[i].NormalGeo.verticesNeedUpdate=true;
        this.GiftBalloonArray[i].NormalLine.geometry.computeBoundingSphere();
      } else {
        // Top Line
        for(var j=0;j<4;j++){
          this.GiftBalloonArray[i].Catmull01.points[j].copy(this.GiftBalloonArray[i].Lines01[j].position);
        }

        this.GiftBalloonArray[i].CurvePoint = this.GiftBalloonArray[i].Catmull01.getPoints(9);
        this.GiftBalloonArray[i].LinePoints01 = [];
        for(var j=0;j<10;j++){
          this.GiftBalloonArray[i].LinePoints01.push(this.GiftBalloonArray[i].CurvePoint[j].x,this.GiftBalloonArray[i].CurvePoint[j].y,this.GiftBalloonArray[i].CurvePoint[j].z);
        }
        this.GiftBalloonArray[i].StringPoints01.setPositions(this.GiftBalloonArray[i].LinePoints01);

        // Bottom Line
        for(var j=0;j<4;j++){
          this.GiftBalloonArray[i].Catmull02.points[j].copy(this.GiftBalloonArray[i].Lines02[j].position);
        }

        this.GiftBalloonArray[i].CurvePoint = this.GiftBalloonArray[i].Catmull02.getPoints(9);
        this.GiftBalloonArray[i].LinePoints02 = [];
        for(var j=0;j<10;j++){
          this.GiftBalloonArray[i].LinePoints02.push(this.GiftBalloonArray[i].CurvePoint[j].x,this.GiftBalloonArray[i].CurvePoint[j].y,this.GiftBalloonArray[i].CurvePoint[j].z);
        }
        this.GiftBalloonArray[i].StringPoints02.setPositions(this.GiftBalloonArray[i].LinePoints02);
      }
    }
  }

  CursorBegin() {
    this.FirstCursor.set(this.pos.x, this.pos.y, this.pos.z);
    this.LastCursor.set(this.pos.x, this.pos.y, this.pos.z);
    this.mouseF.copy(this.mouse);
    this.mouseL.copy(this.mouse);
  }

  CheckIntersect() {
    var LineCurve2 = new THREE.LineCurve(this.mouseF,this.mouseL);
    var dis = this.distanceVec2(this.mouseF.x,this.mouseF.y,this.mouseL.x,this.mouseL.y);
    var Points = LineCurve2.getPoints(Math.floor(dis/0.004));
    var Ma = new THREE.MeshBasicMaterial({color:0x000000})
    var intersect;
    for(var i=0;i<Points.length;i++){
      this.raycaster.setFromCamera(Points[i],this.camera);
      intersect = this.raycaster.intersectObjects(this.Lines,true)
      for(var j=0;j<intersect.length;j++){
        this.CutGB(intersect[""+j+""].object.id,intersect[""+j+""].point);
      }
    }
  }

  CutGB(id,Ipoint:THREE.Vector3){
    for(var i=0;i<this.GiftBalloonArray.length;i++){
      if(this.GiftBalloonArray[i].NormalLine.id==id && !this.GiftBalloonArray[i].State){
        this.GiftBalloonArray[i].State=true;

        var Po = new THREE.Vector3();
        Po.setFromMatrixPosition(this.GiftBalloonArray[i].BalloonAttach.matrixWorld);
        var Po2 = new THREE.Vector3();
        Po2.setFromMatrixPosition(this.GiftBalloonArray[i].BoxAttach.matrixWorld);

        // Setup top line
        this.GiftBalloonArray[i].Curve = new THREE.LineCurve3(Po,Ipoint);

        this.GiftBalloonArray[i].CurvePoint = this.GiftBalloonArray[i].Curve.getPoints(3);

        var distance = this.distance(Ipoint.x, Ipoint.y, Ipoint.z,
          Po.x, Po.y, Po.z);

        for(var j=0;j<4;j++){
          this.GiftBalloonArray[i].Lines01[j].position.copy(this.GiftBalloonArray[i].CurvePoint[j]);
          this.world03.addBody(this.GiftBalloonArray[i].Lines01[j]);
        }

        // Lock Constraint
        this.GiftBalloonArray[i].LockConstrain01
         = new CANNON.LockConstraint(this.GiftBalloonArray[i].Lines01[0],this.GiftBalloonArray[i].BalloonBody);
        this.world03.addConstraint(this.GiftBalloonArray[i].LockConstrain01);

        // Distance Constraint
        for(var j=0;j<3;j++){
          var c = new CANNON.DistanceConstraint(this.GiftBalloonArray[i].Lines01[j],this.GiftBalloonArray[i].Lines01[j+1],distance/4);
          // var c = new CANNON.LockConstraint(this.GiftBalloonArray[i].Lines01[j],this.GiftBalloonArray[i].Lines01[j+1]);
          this.GiftBalloonArray[i].DisConstrain01.push(c);
          this.world03.addConstraint(c);
        }

        // Remove old Line2
        this.scene.remove(this.GiftBalloonArray[i].StringLine01)

        // Replace Catmull points
        for(var j=0;j<4;j++){
          this.GiftBalloonArray[i].Catmull01.points[j].copy(this.GiftBalloonArray[i].Lines01[j].position);
        }

        // get Points to create LineGeometry
        this.GiftBalloonArray[i].CurvePoint = this.GiftBalloonArray[i].Catmull01.getPoints(9);
        this.GiftBalloonArray[i].LinePoints01 = [];

        for(var j=0;j<10;j++){
          this.GiftBalloonArray[i].LinePoints01.push(this.GiftBalloonArray[i].CurvePoint[j].x,this.GiftBalloonArray[i].CurvePoint[j].y,this.GiftBalloonArray[i].CurvePoint[j].z);
        }

        // Create new Line2 
        this.GiftBalloonArray[i].StringPoints01 = new LineGeometry();
        this.GiftBalloonArray[i].StringPoints01.setPositions(this.GiftBalloonArray[i].LinePoints01);
        this.GiftBalloonArray[i].StringLine01 = new Line2(this.GiftBalloonArray[i].StringPoints01,this.StringM)
        this.scene.add(this.GiftBalloonArray[i].StringLine01)
        
        this.world03.removeConstraint(this.GiftBalloonArray[i].BoxConstraint);


        // Setup bottom line
        this.GiftBalloonArray[i].Curve = new THREE.LineCurve3(Po2,Ipoint);

        this.GiftBalloonArray[i].CurvePoint = this.GiftBalloonArray[i].Curve.getPoints(3);

        var distance = this.distance(Ipoint.x, Ipoint.y, Ipoint.z,
          Po2.x, Po2.y, Po2.z);

        for(var j=0;j<4;j++){
          this.GiftBalloonArray[i].Lines02[j].position.copy(this.GiftBalloonArray[i].CurvePoint[j]);
          this.world03.addBody(this.GiftBalloonArray[i].Lines02[j]);
        }

        // Lock Constraint
        this.GiftBalloonArray[i].LockConstrain02
         = new CANNON.LockConstraint(this.GiftBalloonArray[i].Lines02[0],this.GiftBalloonArray[i].BoxBody);
        this.world03.addConstraint(this.GiftBalloonArray[i].LockConstrain02);

        // Distance Constraint
        for(var j=0;j<3;j++){
          var c = new CANNON.DistanceConstraint(this.GiftBalloonArray[i].Lines02[j],this.GiftBalloonArray[i].Lines02[j+1],distance/4);
          this.GiftBalloonArray[i].DisConstrain02.push(c);
          this.world03.addConstraint(c);
        }

        // Replace Catmull points
        for(var j=0;j<4;j++){
          this.GiftBalloonArray[i].Catmull02.points[j].copy(this.GiftBalloonArray[i].Lines02[j].position);
        }

        // get Points to create LineGeometry
        this.GiftBalloonArray[i].CurvePoint = this.GiftBalloonArray[i].Catmull02.getPoints(9);
        this.GiftBalloonArray[i].LinePoints02 = [];

        for(var j=0;j<10;j++){
          this.GiftBalloonArray[i].LinePoints02.push(this.GiftBalloonArray[i].CurvePoint[j].x,this.GiftBalloonArray[i].CurvePoint[j].y,this.GiftBalloonArray[i].CurvePoint[j].z);
        }

        // Create new Line2
        this.GiftBalloonArray[i].StringPoints02 = new LineGeometry();
        this.GiftBalloonArray[i].StringPoints02.setPositions(this.GiftBalloonArray[i].LinePoints02);
        this.GiftBalloonArray[i].StringLine02 = new Line2(this.GiftBalloonArray[i].StringPoints02,this.StringM)
        this.scene.add(this.GiftBalloonArray[i].StringLine02)
        
        this.world03.removeConstraint(this.GiftBalloonArray[i].BoxConstraint);

        gsap.to(this.GiftBalloonArray[i].GBBody.position,2,{y:"+=2",ease:"power1.in"});
        
        // this.GiftBalloonArray[i].BoxBody.velocity.y=-1;

        var k = i;
        gsap.delayedCall(2,()=>{
          if(!this.GiftBalloonArray[k].Boop){
            // Success Animation
            gsap.to(this.GiftBalloonArray[k].Box3d.scale,.25,{x:.9,y:.9,z:.9,ease:"power1.out"});
            gsap.to(this.GiftBalloonArray[k].BoxLid.position,.25,{y:"-=.05",ease:"power1.out"});
            gsap.to(this.GiftBalloonArray[k].BoxThree.position,.25,{y:"-=.05",ease:"power1.out"});

            gsap.to(this.GiftBalloonArray[k].Box3d.scale,.25,{x:1,y:1,z:1,delay:.25,ease:"power1.in"});
            gsap.to(this.GiftBalloonArray[k].BoxLid.position,.25,{y:"+=.05",delay:.25,ease:"power1.in"});
            gsap.to(this.GiftBalloonArray[k].BoxThree.position,.25,{y:"+=.05",delay:.25,ease:"power1.in"});
            
            gsap.to(this.GiftBalloonArray[k].BoxLid.position,.2,{y:"+=.1",x:"+=.1",z:"-=.1",delay:.4,ease:"power1.in"})
            gsap.to(this.GiftBalloonArray[k].BoxLid.rotation,.2,{x:"-=.35",z:"-=.35",delay:.4,ease:"power1.in"})
            gsap.to(this.GiftBalloonArray[k].BoxLid.children[0].children[0].material,.1,{opacity:0,delay:.7,ease:"power1.in"})
            gsap.to(this.GiftBalloonArray[k].BoxLid.children[0].children[1].material,.1,{opacity:0,delay:.7,ease:"power1.in"})
            
            gsap.delayedCall(.6,()=>{
              this.ScoreFunction(this.GiftBalloonArray[k].BoxBody.position);
              gsap.to(this.GiftBalloonArray[k].BoxThree.children[0].children[0].material,.3,{opacity:0,delay:.4,ease:"power1.in"})
              gsap.to(this.GiftBalloonArray[k].BoxThree.children[0].children[1].material,.3,{opacity:0,delay:.4,ease:"power1.in"})
            })
            gsap.delayedCall(1,()=>{
              this.scene.remove(this.GiftBalloonArray[k].Box3d);
              this.scene.remove(this.GiftBalloonArray[k].Shadow);
            })

            // remove stuff
            this.scene.remove(this.GiftBalloonArray[k].StringLine02)
            this.world03.remove(this.GiftBalloonArray[k].BoxBody);
            this.world03.remove(this.GiftBalloonArray[k].BoxTopBody);
            for(var j=0;j<this.GiftBalloonArray[k].Lines02.length;j++){
              this.world03.remove(this.GiftBalloonArray[k].Lines02[j])
            }
          }
        })
      }
    }
  }

  
  createTestString(){
    let Center = new THREE.Object3D();
    this.scene.add(Center);

    let fff = new THREE.MeshMatcapMaterial({
      color:0xf7f7f7,
      matcap:this.BaseMatcap
    })
    let color = new THREE.MeshMatcapMaterial({
      color:0xFFA6A0,
      matcap:this.BaseMatcap
    })
    let mirror = new THREE.MeshMatcapMaterial({
      color:0xcfcfcf,
      matcap:this.BaseMatcap
    })

    //
    let Torus01;
    this.loader.load(
      'assets/model/'+"Holder"+'.glb',
      (gltf) => {
        Torus01 = gltf.scene;
        Torus01.scale.set(.75,.75,.75)
        Torus01.position.set(0,-1.4,0);
        Torus01.rotation.set(0,-45*Math.PI/180,0)
        Torus01.children["0"].rotation.z=0;
        Torus01.children["0"].material=color;
        Center.add(Torus01);
      }
    );


    let Torus02;
    this.loader.load(
      'assets/model/'+"Holder"+'.glb',
      (gltf) => {
        Torus02 = gltf.scene;
        Torus02.scale.set(1.1,1.1,1.1)
        Torus02.position.set(0,-2.45,0);
        Torus02.children["0"].rotation.z=0;
        Torus02.children["0"].material=color;
        Center.add(Torus02);
      }
    );



    let Planet = new THREE.Object3D();
    this.loader.load(
      'assets/model/'+"GayPlanet"+'.glb',
      (gltf) => {
        Planet = gltf.scene;
        Planet.scale.set(.75,.75,.75)
        Planet.position.set(0,0,0);
        Planet.children["0"].children[0].material=fff;
        Planet.children["0"].children[1].material=color;
        Center.add(Planet);
      }
    );

    let string = new LineMaterial({
      color:0xe7e7e7,
      linewidth:.001,
    })


    // Plane 
    let Plane = new THREE.Object3D();
    let PlaneMid = new THREE.Object3D();
    this.loader.load(
      'assets/model/'+"PlaneMid"+'.glb',
      (gltf) => {
        PlaneMid = gltf.scene;
        // Plane.scale.set(1,1,1)
        // PlaneMid.position.set(2,1.5,0);
        PlaneMid.children["0"].children[0].material=fff;
        PlaneMid.children["0"].children[1].material=color;
        Plane.add(PlaneMid);
      }
    );
    let PlaneLeft = new THREE.Object3D();
    this.loader.load(
      'assets/model/'+"PlaneLeft"+'.glb',
      (gltf) => {
        PlaneLeft = gltf.scene;
        PlaneLeft.children["0"].children[0].material=fff;
        PlaneLeft.children["0"].children[1].material=color;
        Plane.add(PlaneLeft);
      }
    );
    let PlaneRight = new THREE.Object3D();
    this.loader.load(
      'assets/model/'+"PlaneRight"+'.glb',
      (gltf) => {
        PlaneRight = gltf.scene;
        PlaneRight.children["0"].children[0].material=fff;
        PlaneRight.children["0"].children[1].material=color;
        Plane.add(PlaneRight);
      }
    );
    Plane.position.set(-1.1,-.2,0);
    Plane.rotation.set(30*Math.PI/180,-135*Math.PI/180,0*Math.PI/180);

    let Pgeo = new LineGeometry();
    let Pcurve = [];
    Pcurve.push(Plane.position.x,Plane.position.y,Plane.position.z);
    Pcurve.push(Plane.position.x,1,Plane.position.z);
    Pgeo.setPositions(Pcurve);
    let PlaneString = new Line2(
      Pgeo,string
    )
    Center.add(PlaneString)
    Center.add(Plane);

    // Rocket 
    let Rocket = new THREE.Object3D();
    let RocketMid = new THREE.Object3D();
    this.loader.load(
      'assets/model/'+"RocketMid"+'.glb',
      (gltf) => {
        RocketMid = gltf.scene;
        // Planet.scale.set(1,1,1)
        // PlaneMid.position.set(2,1.5,0);
        RocketMid.children["0"].children[0].material=fff;
        RocketMid.children["0"].children[1].material=color;
        RocketMid.children["0"].children[2].material=mirror;
        Rocket.add(RocketMid);
      }
    );
    let RocketTop = new THREE.Object3D();
    this.loader.load(
      'assets/model/'+"RocketTop"+'.glb',
      (gltf) => {
        RocketTop = gltf.scene;
        RocketTop.children["0"].material=color;
        Rocket.add(RocketTop);
      }
    );
    let RocketBot = new THREE.Object3D();
    this.loader.load(
      'assets/model/'+"RocketBot"+'.glb',
      (gltf) => {
        RocketBot = gltf.scene;
        RocketBot.children["0"].children[0].material=fff;
        RocketBot.children["0"].children[1].material=color;
        Rocket.add(RocketBot);
      }
    );
    Rocket.position.set(1.1,0,0);
    Rocket.rotation.set(-45*Math.PI/180,0*Math.PI/180,-45*Math.PI/180);
    let Rcurve = [];
    Rcurve.push(Rocket.position.x,Rocket.position.y,Rocket.position.z);
    Rcurve.push(Rocket.position.x,1,Rocket.position.z);
    let Rgeo = new LineGeometry();
    Rgeo.setPositions(Rcurve);
    let RocketString = new Line2(
      Rgeo,string
    )
    Center.add(RocketString)
    Center.add(Rocket);

    
    // UFO 
    let UFO = new THREE.Object3D();
    let UFOTop = new THREE.Object3D();
    this.loader.load(
      'assets/model/'+"UFOTop"+'.glb',
      (gltf) => {
        UFOTop = gltf.scene;
        // Planet.scale.set(1,1,1)
        // PlaneMid.position.set(2,1.5,0);
        UFOTop.children["0"].children[0].material=fff;
        UFOTop.children["0"].children[1].material=color;
        UFO.add(UFOTop);
      }
    );
    let UFOBot = new THREE.Object3D();
    this.loader.load(
      'assets/model/'+"UFOBot"+'.glb',
      (gltf) => {
        UFOBot = gltf.scene;
        UFOBot.children["0"].children[0].material=fff;
        UFOBot.children["0"].children[1].material=color;
        UFO.add(UFOBot);
      }
    );
    UFO.position.set(0,.2,-1.5);
    let Ucurve = [];
    Ucurve.push(UFO.position.x,UFO.position.y,UFO.position.z);
    Ucurve.push(UFO.position.x,1,UFO.position.z);
    let Ugeo = new LineGeometry();
    Ugeo.setPositions(Ucurve);
    let UFOString = new Line2(
      Ugeo,string
    )
    Center.add(UFOString)
    Center.add(UFO);

    
    Center.position.set(0,1,0)
    Center.scale.set(.8,.8,.8)

    let Ccurve = [];
    Ccurve.push(Planet.position.x,Planet.position.y,Planet.position.z);
    Ccurve.push(Planet.position.x,5,Planet.position.z);
    let Cgeo = new LineGeometry();
    Cgeo.setPositions(Ccurve);
    let CenterString = new Line2(
      Cgeo,string
    )
    Center.add(CenterString)
    // TweenLite.to(Center.rotation,600,{y:Math.PI*20,ease:Power0.easeNone})
  }

  private CursorCurve;
  private CursorPoints;
  private CursorString;
  private sphereInter;
  CreateBalloonCursor(){
    this.sphereInter = new THREE.Mesh( new THREE.SphereBufferGeometry( .1 ),new THREE.MeshBasicMaterial( { color: 0xff0000 } ))
    this.sphereInter.visible=false;
    this.scene.add(this.sphereInter)

    this.CursorPoints = [];
    this.CursorPoints.push(0,0,0);
    this.CursorPoints.push(0,0,0);

    this.CursorCurve = new LineGeometry();
    this.CursorCurve.setPositions(this.CursorPoints);
    
    let Ma = new LineMaterial({
      color:0xffffff,
      linewidth:.001,
    })
    this.CursorString = new Line2(
      this.CursorCurve,Ma
    )
    this.scene.add(this.CursorString)
  }

  RenderMouseCursor() {
    this.CursorPoints = [];

    this.CursorPoints.push(this.FirstCursor.x,this.FirstCursor.y,this.FirstCursor.z);
    this.CursorPoints.push(this.LastCursor.x,this.LastCursor.y,this.LastCursor.z);
    this.CursorCurve.setPositions(this.CursorPoints);
    
    this.CursorString.geometry=this.CursorCurve;
  }


  // private CursorMoveObject: CANNON.Body;
  // CreateCursorMoveObject() {
  //   this.CursorMoveObject = new CANNON.Body({ mass: 0 });
  //   this.CursorMoveObject.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, 1)));
  //   // this.CursorMoveObject.addShape(new CANNON.Sphere(0.2))
  //   this.world.addBody(this.CursorMoveObject);
  // }



  private debugger03;
  private LetterMaterial:CANNON.Material;
  private PlaneMaterial:CANNON.Material;
  private BalloonMaterial:CANNON.Material;


  BalloonCursor() {
    this.LastCursor.set(this.pos.x, this.pos.y, this.pos.z);
    this.mouseL.copy(this.mouse);
  }


  // CreateHAB(name:string,W,H,Z,Lx,Ly,Lz,Px,Py,Pz,Ax,Ay,Az,RotateY,RotateZ){
  //   let E = new LetterProperty;
  //   this.LetterArray.push(E)

  //   E.type=2;

  //   E.Object3D = new THREE.Object3D();
    
  //   var material01 = new THREE.MeshMatcapMaterial({
  //     color:0xBCE4FF,
  //     matcap: this.BaseMatcap
  //   })
  //   var material02 = new THREE.MeshMatcapMaterial({
  //     color:0x8B8B8B,
  //     matcap: this.BaseMatcap
  //   })
  //   var material03 = new THREE.MeshMatcapMaterial({
  //     color:0xE7CDA1,
  //     matcap: this.BaseMatcap
  //   })
  //   this.loader.load(
  //     'assets/model/'+name+'.glb',
  //     (gltf) => {
  //       gltf.scene.traverse((node)=>{
  //         if(node instanceof THREE.Mesh){
  //           node.castShadow=true;
  //         }
  //       });
  //       E.Scene = gltf.scene;
  //       E.Scene.scale.set(.7,.7,.7);
  //       for(var i=0;i<E.Scene.children.length;i++){
  //         if(E.Scene.children[i].name=="Cylinder001"){
  //           E.Scene.children[""+i+""].material=material03;
  //         } else if (E.Scene.children[i].name=="Cylinder005"){
  //           E.Scene.children[""+i+""].material=material02;
  //         } else {
  //           E.Scene.children[""+i+""].material=material01;
  //         }
  //       }
  //       var object3d = new THREE.Object3D();
  //       object3d.add(E.Scene);
  //       object3d.position.set(Lx,Ly,Lz)
  //       object3d.rotation.set(-Math.PI/2,0,0)
  //       E.Object3D.add(object3d);
  //     }
  //   );


  //   E.ObjectBody = new CANNON.Body({ mass: 0 });
  //   // E.ObjectBody.allowSleep=true;

  //   if(name=="HAB"){
  //     let quat = new CANNON.Quaternion(.5,0,0,-.5);
  //     quat.normalize();
  //     E.ObjectBody.addShape(new CANNON.Cylinder(0.26,0.17,0.5,16),new CANNON.Vec3(0,0,0),quat);
  //     E.ObjectBody.addShape(new CANNON.Sphere(0.6),new CANNON.Vec3(0,.82,0));
  //   } else {
  //     E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(W,H,Z)),new CANNON.Vec3(0,0,0));
  //   }

  //   let quat = new THREE.Mesh();
  //   quat.rotation.set(0, RotateY, RotateZ);
  //   E.ObjectBody.quaternion.set(quat.quaternion.x, quat.quaternion.y, quat.quaternion.z, quat.quaternion.w);
  //   E.ObjectBody.position.set(Px, Py, Pz)

  //   this.world02.addBody(E.ObjectBody);
  //   this.bodies.push(E.ObjectBody);

  //   E.AttachPoint = new THREE.Mesh(
  //     new THREE.BoxBufferGeometry(.03, .03, .03),
  //     new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 })
  //   )
  //   E.AttachPoint.position.set(Ax, Ay, Az);
  //   E.AttachPointV = new THREE.Vector3();
  //   E.AttachPointV.set(Px, Py, Pz);
  //   E.Object3D.add(E.AttachPoint);
  //   this.scene.add(E.Object3D);
  //   this.meshes.push(E.Object3D);


  //   E.letterArray = [];
  //   E.letterArrayA = [];
  //   E.letterArray02=null;
  //   E.LConstraint02=null;


  //   let curveA = [];
  //   curveA.push(new THREE.Vector3(0.38,0.25,0.05));
  //   curveA.push(new THREE.Vector3(0.46,0.09,0.11));

  //   let lastBody: CANNON.Body;
  //   for (var i = 0; i < 2; i++) {
  //     let SphereBody = new CANNON.Body({ mass: i == 0 ? 0 : 0 });
  //     SphereBody.addShape(new CANNON.Box(new CANNON.Vec3(.01,.01,.01)));
      
  //     SphereBody.position.set(curveA[i].x,curveA[i].y,curveA[i].z);

  //     SphereBody.angularDamping = 0.99;
  //     SphereBody.linearDamping = 0.99;
  //     this.world02.addBody(SphereBody);
  //     E.letterArray.push(SphereBody);

  //     if (i != 0) {
  //       var distance = this.distance(SphereBody.position.x,SphereBody.position.y,SphereBody.position.y,lastBody.position.x,lastBody.position.y,lastBody.position.z);
  //       E.DConstraint = new CANNON.DistanceConstraint(SphereBody, lastBody, distance);
  //       // this.world02.addConstraint(E.DConstraint)

  //       E.LConstraint = new CANNON.LockConstraint(SphereBody, E.ObjectBody);
  //       // this.world02.addConstraint(E.LConstraint)
  //     }
  //     lastBody = SphereBody;
  //   }


  //   // anchor
  //   let anchorT = new THREE.Object3D();
  //   anchorT.add(new THREE.Mesh(new THREE.CylinderBufferGeometry(.04,.04,.2,24),
  //     material03));

  //   // ring 
  //   let ring = new THREE.Mesh(new THREE.TorusBufferGeometry(.045,.005,8,16),new THREE.MeshBasicMaterial({color:0xffffff}));
  //   ring.position.set(0,0.03,0)
  //   ring.rotation.set(Math.PI/2,0,0)
  //   anchorT.add(ring);
  //   anchorT.position.set(.5,0.05,.1);
  //   anchorT.rotation.set(15*Math.PI/180,0,-15*Math.PI/180)
    
    
  //   // attach point
  //   let point = new THREE.Mesh(new THREE.BoxBufferGeometry(.01,.01,.01), new THREE.MeshBasicMaterial({transparent:true,opacity:1}));
  //   point.position.set(-.05,0.03,0);
  //   anchorT.add(point);

  //   gsap.delayedCall(1,()=>{
  //     let vec3 = new THREE.Vector3();
  //     vec3.setFromMatrixPosition(point.matrixWorld);
  //     console.log("anchor")
  //     console.log(vec3)
  //   })

  //   this.scene.add(anchorT)
  // }

  // CreateBalloon(name:string,Px,Py,Pz,Cx,Cy,Cz,RotateX,RotateY,RotateZ) {
  //   let E = new LetterProperty;
  //   this.LetterArray.push(E)

  //   E.type=3;

  //   E.Object3D = new THREE.Object3D();
  //   this.loader.load(
  //     'assets/model/'+name+'.glb',
  //     (gltf) => {
  //       E.Scene = gltf.scene;
  //       E.Scene.scale.set(1.1,1.1,1.1)
  //       E.Scene.children["0"].position.set(0,-0.12,0);
  //       E.Scene.children["0"].material=this.BalloonM;
  //       E.Object3D.add(E.Scene);
  //     }
  //   );

  //   E.ObjectBody = new CANNON.Body({ mass: 1,material:this.BalloonMaterial });
  //   // E.ObjectBody.allowSleep=true;
  //   E.ObjectBody.addShape(new CANNON.Sphere(.135),new CANNON.Vec3(0,0.1,0));
  //   E.ObjectBody.addShape(new CANNON.Sphere(.11),new CANNON.Vec3(0,0,0));
      

  //   let quat = new THREE.Mesh();
  //   quat.rotation.set(RotateX, RotateY, RotateZ);
  //   E.ObjectBody.quaternion.set(quat.quaternion.x, quat.quaternion.y, quat.quaternion.z, quat.quaternion.w);
  //   E.ObjectBody.position.set(Px, Py, Pz)
  //   E.ObjectBody.angularDamping = 0.99;
  //   E.ObjectBody.linearDamping = 0.99;

  //   this.world02.addBody(E.ObjectBody);
  //   this.bodies.push(E.ObjectBody);

  //   E.AttachPoint = new THREE.Mesh(
  //     new THREE.BoxBufferGeometry(.03, .03, .03),
  //     new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 })
  //   )
  //   E.AttachPoint.position.set(0, -0.14, 0);
  //   E.AttachPointV = new THREE.Vector3();
  //   E.AttachPointV.set(Px, Py, Pz);
  //   E.Object3D.add(E.AttachPoint);
  //   this.scene.add(E.Object3D);
  //   this.meshes.push(E.Object3D);


  //   E.letterArray = [];
  //   E.letterArrayA = [];
  //   E.letterArray02=null;
  //   E.LConstraint02=null;


  //   let lastBody: CANNON.Body;
  //   for (var i = 0; i < 2; i++) {
  //     let SphereBody = new CANNON.Body({ mass: i == 0 ? 0 : 20 });
  //     SphereBody.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
  //     if(i==0){
  //       SphereBody.position.set(Cx, Cy, Cz);
  //     } else {
  //       SphereBody.position.set(Px, Py-0.2, Pz);
  //     }
      
  //     SphereBody.angularDamping = 0.99;
  //     SphereBody.linearDamping = 0.99;
  //     this.world02.addBody(SphereBody);
  //     E.letterArray.push(SphereBody);

  //     if (i != 0) {

  //       var distance = this.distance(SphereBody.position.x,SphereBody.position.y,SphereBody.position.z,lastBody.position.x,lastBody.position.y,lastBody.position.z)
  //       // E.DConstraint = new CANNON.DistanceConstraint(SphereBody, lastBody, distance);
  //       E.DConstraint = new CANNON.LockConstraint(SphereBody, lastBody);
  //       this.world02.addConstraint(E.DConstraint)

  //       E.LConstraint = new CANNON.LockConstraint(E.ObjectBody, SphereBody);
  //       this.world02.addConstraint(E.LConstraint)
  //     }
  //     lastBody = SphereBody;
  //   }

  //   gsap.delayedCall(.5,()=>{
  //     TweenLite.to(E.letterArray[0].position,1,{x:1.8,z:0});
  //   })
  // }

  // CreateSingleLineLetter(name:string,W,H,Z,Lx,Ly,Lz,Px,Py,Pz,Ax,Ay,Az,RotateY,RotateZ) {
  //   let E = new LetterProperty;
  //   this.LetterArray.push(E)

  //   E.type=0;

  //   E.Object3D = new THREE.Object3D();
  //   this.loader.load(
  //     'assets/model/'+name+'.glb',
  //     (gltf) => {
  //       gltf.scene.traverse((node)=>{
  //         if(node instanceof THREE.Mesh){
  //           node.castShadow=true;
  //         }
  //       });
  //       E.Scene = gltf.scene;
  //       E.Scene.children["0"].position.set(Lx,Ly,Lz);
  //       E.Scene.children["0"].rotation.x=0;
  //       E.Scene.scale.set(.7,.7,.7);
  //       E.Scene.children["0"].material=this.BalloonM;
  //       E.Object3D.add(E.Scene);
  //     }
  //   );

  //   E.ObjectBody = new CANNON.Body({ mass: 1,material:this.LetterMaterial });
  //   // E.ObjectBody.allowSleep=true;

  //   if(name=="U"){
  //     E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(0.1,0.3,0.07)),new CANNON.Vec3(0,0,0));
  //   } else {
  //     E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(W,H,Z)),new CANNON.Vec3(0,0,0));
  //   }

  //   let quat = new THREE.Mesh();
  //   quat.rotation.set(0, RotateY, RotateZ);
  //   E.ObjectBody.quaternion.set(quat.quaternion.x, quat.quaternion.y, quat.quaternion.z, quat.quaternion.w);
  //   E.ObjectBody.position.set(Px, Py, Pz)

  //   // this.world.addBody(E.ObjectBody);
  //   this.bodies.push(E.ObjectBody);

  //   E.AttachPoint = new THREE.Mesh(
  //     new THREE.BoxBufferGeometry(.03, .03, .03),
  //     new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 })
  //   )
  //   E.AttachPoint.position.set(Ax, Ay, Az);
  //   E.AttachPointV = new THREE.Vector3();
  //   E.AttachPointV.set(Px, Py, Pz);
  //   E.Object3D.add(E.AttachPoint);
  //   this.scene.add(E.Object3D);
  //   this.meshes.push(E.Object3D);


  //   E.letterArray = [];
  //   E.letterArrayA = [];
  //   E.letterArray02=null;
  //   E.LConstraint02=null;


  //   let lastBody: CANNON.Body;
  //   for (var i = 0; i < 2; i++) {
  //     let SphereBody = new CANNON.Body({ mass: i == 0 ? 0 : 20 });
  //     SphereBody.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
  //     SphereBody.position.set(Px,  i == 0 ? 5 : Py+Ay, Pz);

  //     SphereBody.angularDamping = 0.99;
  //     SphereBody.linearDamping = 0.99;
  //     this.world.addBody(SphereBody);
  //     E.letterArray.push(SphereBody);

  //     if (i != 0) {
  //       E.DConstraint = new CANNON.DistanceConstraint(SphereBody, lastBody, 5-(Py+Ay));
  //       this.world.addConstraint(E.DConstraint)

  //         E.LConstraint = new CANNON.LockConstraint(E.ObjectBody, SphereBody);
  //         this.world.addConstraint(E.LConstraint)

  //     }
  //     lastBody = SphereBody;
  //   }
  // }

  // CreateDoubleLineLetter(name:string,W,H,Z,Lx,Ly,Lz,Px,Py,Pz,Ax,Ay,Az,Px01,Py01,Pz01,Ax02,Ay02,Az02,Px02,Py02,Pz02,RotateY,RotateZ) {
  //   let E = new LetterProperty;
  //   this.LetterArray.push(E)

  //   E.type=1;

  //   E.Object3D = new THREE.Object3D();
  //   this.loader.load(
  //     'assets/model/'+name+'.glb',
  //     (gltf) => {
  //       gltf.scene.traverse((node)=>{
  //         if(node instanceof THREE.Mesh){
  //           node.castShadow=true;
  //         }
  //       });
  //       E.Scene = gltf.scene;
  //       E.Scene.children["0"].position.set(Lx,Ly,Lz);
  //       E.Scene.children["0"].rotation.x=0;
  //       E.Scene.scale.set(.7,.7,.7);
  //       E.Scene.children["0"].material=this.BalloonM;
  //       E.Object3D.add(E.Scene);
  //     }
  //   );

  //   E.ObjectBody = new CANNON.Body({ mass: 1,material:this.LetterMaterial });
  //   E.ObjectBody.allowSleep=true;

  //   let quatT = new THREE.Mesh();
  //   let quat = new CANNON.Quaternion();
  //   if(name=="Z"){
  //     E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(0.1,0.24,0.07)),new CANNON.Vec3(0.24,0.125,0));
  //     E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(0.1,0.24,0.07)),new CANNON.Vec3(-0.24,0.125,0));
  //     E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(0.1,0.09,0.07)),new CANNON.Vec3(0,-0.28,0));

  //     quatT.rotation.set(0, 0, -60*Math.PI/180);
  //     quat.set(quatT.quaternion.x, quatT.quaternion.y, quatT.quaternion.z, quatT.quaternion.w);
  //     E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(0.075,0.1,0.07)),new CANNON.Vec3(-0.21,-0.16,0),quat);

  //     quatT.rotation.set(0, 0, -25*Math.PI/180);
  //     quat.set(quatT.quaternion.x, quatT.quaternion.y, quatT.quaternion.z, quatT.quaternion.w);
  //     E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(0.075,0.1,0.07)),new CANNON.Vec3(-0.12,-0.25,0),quat);

  //     quatT.rotation.set(0, 0, 60*Math.PI/180);
  //     quat.set(quatT.quaternion.x, quatT.quaternion.y, quatT.quaternion.z, quatT.quaternion.w);
  //     E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(0.075,0.1,0.07)),new CANNON.Vec3(0.21,-0.16,0),quat);

  //     quatT.rotation.set(0, 0, 25*Math.PI/180);
  //     quat.set(quatT.quaternion.x, quatT.quaternion.y, quatT.quaternion.z, quatT.quaternion.w);
  //     E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(0.075,0.1,0.07)),new CANNON.Vec3(0.12,-0.25,0),quat);
  //   } else {
  //     E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(W,H,Z)),new CANNON.Vec3(0,0,0));
  //   }
    
  //   quatT.rotation.set(0, RotateY, RotateZ);
  //   E.ObjectBody.quaternion.set(quatT.quaternion.x, quatT.quaternion.y, quatT.quaternion.z, quatT.quaternion.w);
  //   E.ObjectBody.position.set(Px, Py, Pz)

  //   this.world.addBody(E.ObjectBody);
  //   this.bodies.push(E.ObjectBody);

  //   E.AttachPoint = new THREE.Mesh(
  //     new THREE.BoxBufferGeometry(.03, .03, .03),
  //     new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 })
  //   )
  //   E.AttachPoint.position.set(Ax, Ay, Az);
  //   E.AttachPointV = new THREE.Vector3();
  //   E.AttachPointV.set(Ax, Ay, Az);
  //   E.Object3D.add(E.AttachPoint);

  //   // second line
  //   E.AttachPoint02 = new THREE.Mesh(
  //     new THREE.BoxBufferGeometry(.03, .03, .03),
  //     new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 })
  //   )
  //   E.AttachPoint02.position.set(Ax02, Ay02, Az02);
  //   E.AttachPointV02 = new THREE.Vector3();
  //   E.AttachPointV02.set(Ax02, Ay02, Az02);
  //   E.Object3D.add(E.AttachPoint02);


  //   this.scene.add(E.Object3D);
  //   this.meshes.push(E.Object3D);


  //   E.letterArray = [];
  //   E.letterArrayA = [];
    
  //   E.letterArray02 = [];
  //   E.letterArrayA02 = [];

  //   let lastBody: CANNON.Body;
  //   for (var i = 0; i < 2; i++) {
  //     let SphereBody = new CANNON.Body({ mass: i == 0 ? 0 : 100 });
  //     SphereBody.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
  //     SphereBody.position.set(Px01,  i == 0 ? 5 : Py01, Pz01);

  //     SphereBody.angularDamping = 0.5;
  //     SphereBody.linearDamping = 0.5;
  //     this.world.addBody(SphereBody);
  //     E.letterArray.push(SphereBody);

  //     if (i != 0) {
  //       E.DConstraint = new CANNON.DistanceConstraint(SphereBody, lastBody, 5-Py01);
  //       this.world.addConstraint(E.DConstraint)
  //       if (i == 1) {
  //         E.LConstraint = new CANNON.LockConstraint(E.ObjectBody, SphereBody);
  //         this.world.addConstraint(E.LConstraint)
  //       }
  //     }
  //     lastBody = SphereBody;
  //   }

  //   for (var i = 0; i < 2; i++) {
  //     let SphereBody = new CANNON.Body({ mass: i == 0 ? 0 : 100 });
  //     SphereBody.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
  //     SphereBody.position.set(Px02,  i == 0 ? 5 : Py02, Pz02);

  //     SphereBody.angularDamping = 0.5;
  //     SphereBody.linearDamping = 0.5;
  //     this.world.addBody(SphereBody);
  //     E.letterArray02.push(SphereBody);

  //     if (i != 0) {
  //       E.DConstraint02 = new CANNON.DistanceConstraint(SphereBody, lastBody, 5-Py02);
  //       this.world.addConstraint(E.DConstraint02)
  //       if (i == 1) {
  //         E.LConstraint02 = new CANNON.LockConstraint(E.ObjectBody, SphereBody);
  //         this.world.addConstraint(E.LConstraint02)
  //       }
  //     }
  //     lastBody = SphereBody;
  //   }
  // }

  // CreateBalloonStuff(){
  //   //tree 
  //   // this.CreateTree("tree01",-2,0,1,1,1,1);
  //   // this.CreateTree("tree02",2,0,0,1,1,1);
  //   // this.CreateTree("tree01",2.2,0,1,1,1,1);

  //   // bench
  //   var TreeMaterial02 = new THREE.MeshMatcapMaterial({
  //     color:0xE7D39F,
  //     matcap:this.BaseMatcap
  //   })
  //   // this.loader.load(
  //   //   'assets/model/bench.glb',
  //   //   (gltf) => {
  //   //     gltf.scene.position.set(1,0.06,1);
  //   //     gltf.scene.scale.set(.75,.75,.75);
  //   //     gltf.scene.children["0"].position.set(0,0,0);
  //   //     gltf.scene.children["0"].rotation.set(0,-20*Math.PI/180,0);
  //   //     gltf.scene.children["0"].material=TreeMaterial02;
  //   //     this.scene.add(gltf.scene);
  //   //   }
  //   // );
  // }


  // CreateTree(name:string,Px,Py,Pz,Sx,Sy,Sz){
  //   var TreeMaterial01 = new THREE.MeshMatcapMaterial({
  //     color:0x95E79B,
  //     matcap:this.BaseMatcap
  //   })
  //   var TreeMaterial02 = new THREE.MeshMatcapMaterial({
  //     color:0xE7D39F,
  //     matcap:this.BaseMatcap
  //   })
  //   this.loader.load(
  //     'assets/model/'+name+'.glb',
  //     (gltf) => {
  //       gltf.scene.position.set(Px,Py,Pz);
  //       gltf.scene.scale.set(Sx,Sy,Sz);
  //       gltf.scene.children["0"].position.set(0,0,0)
  //       gltf.scene.children["0"].children[0].material=TreeMaterial01;
  //       gltf.scene.children["0"].children[1].material=TreeMaterial02;
  //       this.scene.add(gltf.scene);
  //     }
  //   );
  // }

  RenderLetter() {
    for (var i = 0; i < this.LetterArray.length; i++) {
      if (this.LetterArray[i].LConstraint!=null) {
        if(this.LetterArray[i].type==2){
          this.LetterArray[i].AttachPointV.setFromMatrixPosition(this.LetterArray[i].AttachPoint.matrixWorld);
          // LINES
          var curve = new THREE.CatmullRomCurve3([
            this.LetterArray[i].AttachPointV,
            new THREE.Vector3(this.LetterArray[i].letterArray[0].position.x,this.LetterArray[i].letterArray[0].position.y,this.LetterArray[i].letterArray[0].position.z),
            new THREE.Vector3(this.LetterArray[i].letterArray[1].position.x,this.LetterArray[i].letterArray[1].position.y,this.LetterArray[i].letterArray[1].position.z),
          ])
          var point = curve.getPoints(20);
          var geo = new THREE.Geometry().setFromPoints(point);


          this.LetterArray[i].Points = [];
          for(var j=0;j<point.length;j++){
            this.LetterArray[i].Points.push(point[j].x,point[j].y,point[j].z);
          }
        } else {
          this.LetterArray[i].AttachPointV.setFromMatrixPosition(this.LetterArray[i].AttachPoint.matrixWorld);

          this.LetterArray[i].Points = [];
          this.LetterArray[i].Points.push(this.LetterArray[i].letterArray[0].position.x,this.LetterArray[i].letterArray[0].position.y,this.LetterArray[i].letterArray[0].position.z);
          this.LetterArray[i].Points.push(this.LetterArray[i].AttachPointV.x,this.LetterArray[i].AttachPointV.y,this.LetterArray[i].AttachPointV.z);
  
          // LINES
          var geo = new THREE.Geometry();
          geo.vertices.push(
            new THREE.Vector3(this.LetterArray[i].letterArray[0].position.x,this.LetterArray[i].letterArray[0].position.y,this.LetterArray[i].letterArray[0].position.z),
            this.LetterArray[i].AttachPointV
          )
        }
        if(!this.LetterArray[i].StringT){
          this.LetterArray[i].StringC = new LineGeometry();
          this.LetterArray[i].StringC.setPositions(this.LetterArray[i].Points);

          this.LetterArray[i].StringT = new Line2(
            this.LetterArray[i].StringC,this.StringM
          )
          this.scene.add(this.LetterArray[i].StringT)

          // LINES
          this.LetterArray[i].Line = new THREE.Line(geo);
          // this.scene.add(this.LetterArray[i].Line);
          this.Lines.push(this.LetterArray[i].Line);
        } else {
          this.LetterArray[i].StringC.setPositions(this.LetterArray[i].Points);
          this.LetterArray[i].StringT.geometry = this.LetterArray[i].StringC;

          // LINES
          this.LetterArray[i].Line.geometry=geo;
        }
      } else {
        // top 
        if (this.LetterArray[i].letterArray != null) {
          if(this.LetterArray[i].type==2){
            this.LetterArray[i].AttachPointV.setFromMatrixPosition(this.LetterArray[i].AttachPoint.matrixWorld);
            this.LetterArray[i].letterArray[0].position.copy(this.LetterArray[i].AttachPointV);
          } else if (this.LetterArray[i].type==3) {
            this.LetterArray[i].AttachPointV.setFromMatrixPosition(this.LetterArray[i].AttachPoint.matrixWorld);
            this.LetterArray[i].letterArray[0].position.copy(this.LetterArray[i].AttachPointV);
          }
          var line = new THREE.CubicBezierCurve3(
            new THREE.Vector3(this.LetterArray[i].letterArray[0].position.x, this.LetterArray[i].letterArray[0].position.y, this.LetterArray[i].letterArray[0].position.z),
            new THREE.Vector3(this.LetterArray[i].letterArray[1].position.x, this.LetterArray[i].letterArray[1].position.y, this.LetterArray[i].letterArray[1].position.z),
            new THREE.Vector3(this.LetterArray[i].letterArray[2].position.x, this.LetterArray[i].letterArray[2].position.y, this.LetterArray[i].letterArray[2].position.z),
            new THREE.Vector3(this.LetterArray[i].letterArray[3].position.x, this.LetterArray[i].letterArray[3].position.y, this.LetterArray[i].letterArray[3].position.z),
          )

          var Ps = line.getPoints(24);
          this.LetterArray[i].Points = [];
          for(var j=0;j<25;j++){
            this.LetterArray[i].Points.push(Ps[j].x,Ps[j].y,Ps[j].z);
          }
          
          if(!this.LetterArray[i].StringTAB){
            this.LetterArray[i].StringCAB = new LineGeometry();
            this.LetterArray[i].StringCAB.setPositions(this.LetterArray[i].Points);

            this.LetterArray[i].StringTAB = new Line2(
              this.LetterArray[i].StringCAB,this.StringM
            )
            this.scene.add(this.LetterArray[i].StringTAB)
          } else {
            this.LetterArray[i].StringCAB.setPositions(this.LetterArray[i].Points);
            this.LetterArray[i].StringTAB.geometry=this.LetterArray[i].StringCAB;
          }
        }
        // bottom
        if (this.LetterArray[i].letterArrayA != null) {
          var line = new THREE.CubicBezierCurve3(
            new THREE.Vector3(this.LetterArray[i].letterArrayA[0].position.x, this.LetterArray[i].letterArrayA[0].position.y, this.LetterArray[i].letterArrayA[0].position.z),
            new THREE.Vector3(this.LetterArray[i].letterArrayA[1].position.x, this.LetterArray[i].letterArrayA[1].position.y, this.LetterArray[i].letterArrayA[1].position.z),
            new THREE.Vector3(this.LetterArray[i].letterArrayA[2].position.x, this.LetterArray[i].letterArrayA[2].position.y, this.LetterArray[i].letterArrayA[2].position.z),
            new THREE.Vector3(this.LetterArray[i].letterArrayA[3].position.x, this.LetterArray[i].letterArrayA[3].position.y, this.LetterArray[i].letterArrayA[3].position.z),
          )

          var Ps = line.getPoints(24);
          this.LetterArray[i].Points = [];
          for(var j=0;j<25;j++){
            this.LetterArray[i].Points.push(Ps[j].x,Ps[j].y,Ps[j].z);
          }
          
          if(!this.LetterArray[i].StringTA){
            this.LetterArray[i].StringCA = new LineGeometry();
            this.LetterArray[i].StringCA.setPositions(this.LetterArray[i].Points);

            this.LetterArray[i].StringTA = new Line2(
              this.LetterArray[i].StringCA,this.StringM
            )
            this.scene.add(this.LetterArray[i].StringTA)
          } else {
            this.LetterArray[i].StringCA.setPositions(this.LetterArray[i].Points);
            this.LetterArray[i].StringTA.geometry=this.LetterArray[i].StringCA;
          }
        }
      }
      // second line
      if(this.LetterArray[i].type==1){
        if(this.LetterArray[i].LConstraint02!=null){
          this.LetterArray[i].AttachPointV02.setFromMatrixPosition(this.LetterArray[i].AttachPoint02.matrixWorld);
  
          this.LetterArray[i].Points = [];
          this.LetterArray[i].Points.push(this.LetterArray[i].letterArray02[0].position.x,this.LetterArray[i].letterArray02[0].position.y,this.LetterArray[i].letterArray02[0].position.z);
          this.LetterArray[i].Points.push(this.LetterArray[i].AttachPointV02.x,this.LetterArray[i].AttachPointV02.y,this.LetterArray[i].AttachPointV02.z);
          
          // LINES
          var geo = new THREE.Geometry();
          geo.vertices.push(
            new THREE.Vector3(this.LetterArray[i].letterArray02[0].position.x,this.LetterArray[i].letterArray02[0].position.y,this.LetterArray[i].letterArray02[0].position.z),
            this.LetterArray[i].AttachPointV02
          )
          if(!this.LetterArray[i].StringT02){
            this.LetterArray[i].StringC02 = new LineGeometry();
            this.LetterArray[i].StringC02.setPositions(this.LetterArray[i].Points);
  
            this.LetterArray[i].StringT02 = new Line2(
              this.LetterArray[i].StringC02,this.StringM
            )
            this.scene.add(this.LetterArray[i].StringT02)

            // LINES
            this.LetterArray[i].Line2 = new THREE.Line(geo);
            // this.scene.add(this.LetterArray[i].Line2);
            this.Lines.push(this.LetterArray[i].Line2);
          } else {
            this.LetterArray[i].StringC02.setPositions(this.LetterArray[i].Points);
            this.LetterArray[i].StringT02.geometry = this.LetterArray[i].StringC02;

            // LINES
            this.LetterArray[i].Line2.geometry=geo;
          }
        } else {
          // top 
          if (this.LetterArray[i].letterArray02 != null) {
            var line = new THREE.CubicBezierCurve3(
              new THREE.Vector3(this.LetterArray[i].letterArray02[0].position.x, this.LetterArray[i].letterArray02[0].position.y, this.LetterArray[i].letterArray02[0].position.z),
              new THREE.Vector3(this.LetterArray[i].letterArray02[1].position.x, this.LetterArray[i].letterArray02[1].position.y, this.LetterArray[i].letterArray02[1].position.z),
              new THREE.Vector3(this.LetterArray[i].letterArray02[2].position.x, this.LetterArray[i].letterArray02[2].position.y, this.LetterArray[i].letterArray02[2].position.z),
              new THREE.Vector3(this.LetterArray[i].letterArray02[3].position.x, this.LetterArray[i].letterArray02[3].position.y, this.LetterArray[i].letterArray02[3].position.z),
            )
            var Ps = line.getPoints(24);
            this.LetterArray[i].Points = [];
            for(var j=0;j<25;j++){
              this.LetterArray[i].Points.push(Ps[j].x,Ps[j].y,Ps[j].z);
            }
            
            if(!this.LetterArray[i].StringTAB02){
              this.LetterArray[i].StringCAB02 = new LineGeometry();
              this.LetterArray[i].StringCAB02.setPositions(this.LetterArray[i].Points);
  
              this.LetterArray[i].StringTAB02 = new Line2(
                this.LetterArray[i].StringCAB02,this.StringM
              )
              this.scene.add(this.LetterArray[i].StringTAB02)
            } else {
              this.LetterArray[i].StringCAB02.setPositions(this.LetterArray[i].Points);
              this.LetterArray[i].StringTAB02.geometry=this.LetterArray[i].StringCAB02;
            }
          }
          // bottom
          if (this.LetterArray[i].letterArrayA02 != null) {
            var line = new THREE.CubicBezierCurve3(
              new THREE.Vector3(this.LetterArray[i].letterArrayA02[0].position.x, this.LetterArray[i].letterArrayA02[0].position.y, this.LetterArray[i].letterArrayA02[0].position.z),
              new THREE.Vector3(this.LetterArray[i].letterArrayA02[1].position.x, this.LetterArray[i].letterArrayA02[1].position.y, this.LetterArray[i].letterArrayA02[1].position.z),
              new THREE.Vector3(this.LetterArray[i].letterArrayA02[2].position.x, this.LetterArray[i].letterArrayA02[2].position.y, this.LetterArray[i].letterArrayA02[2].position.z),
              new THREE.Vector3(this.LetterArray[i].letterArrayA02[3].position.x, this.LetterArray[i].letterArrayA02[3].position.y, this.LetterArray[i].letterArrayA02[3].position.z),
            )
  
            var Ps = line.getPoints(24);
            this.LetterArray[i].Points = [];
            for(var j=0;j<25;j++){
              this.LetterArray[i].Points.push(Ps[j].x,Ps[j].y,Ps[j].z);
            }
            
            if(!this.LetterArray[i].StringTA02){
              this.LetterArray[i].StringCA02 = new LineGeometry();
              this.LetterArray[i].StringCA02.setPositions(this.LetterArray[i].Points);
  
              this.LetterArray[i].StringTA02 = new Line2(
                this.LetterArray[i].StringCA02,this.StringM
              )
              this.scene.add(this.LetterArray[i].StringTA02)
            } else {
              this.LetterArray[i].StringCA02.setPositions(this.LetterArray[i].Points);
              this.LetterArray[i].StringTA02.geometry=this.LetterArray[i].StringCA02;
            }
          }
        }
      }
    }
  }


  // Cutletter(Iid,Ipoint:THREE.Vector3){
  //   for (var i = 0; i < this.LetterArray.length; i++) {
  //     if(this.LetterArray[i].Line.id == Iid && this.LetterArray[i].LConstraint != null){
  //       this.world.removeConstraint(this.LetterArray[i].DConstraint);
  //       this.world.removeConstraint(this.LetterArray[i].LConstraint);
  //       this.world02.removeConstraint(this.LetterArray[i].DConstraint);
  //       this.world02.removeConstraint(this.LetterArray[i].LConstraint);
  //       this.LetterArray[i].LConstraint = null;

  //       // bottom
  //       let curve
  //       if(this.LetterArray[i].type==2){
  //         TweenLite.to(this.LetterArray[i].ObjectBody.position,4,{y:4,ease:Power1.easeIn})
  //         curve = new THREE.LineCurve3(Ipoint,
  //           this.LetterArray[i].letterArray[1].position);
  //       } else if (this.LetterArray[i].type==3){
  //         TweenLite.to(this.LetterArray[i].ObjectBody.velocity,4,{y:5,ease:Power0.easeNone})
  //         TweenLite.to(this.LetterArray[i].ObjectBody.quaternion,4,{z:0,ease:Power0.easeNone})
  //         curve = new THREE.LineCurve3(Ipoint,
  //           this.LetterArray[i].letterArray[0].position);
  //       } else {
  //         curve = new THREE.LineCurve3(Ipoint,
  //           this.LetterArray[i].AttachPointV);
  //       }

  //       let point = curve.getPoints(3);

  //       let distance = this.distance(point[0].x, point[0].y, point[0].z,
  //         point[1].x, point[1].y, point[1].z);

  //       let lastbody: CANNON.Body;
  //       for (var j = 0; j < 4; j++) {
  //         let body;
  //         if(this.LetterArray[i].type==2){
  //           body = new CANNON.Body({ mass: j == 3 ? 0 : .1 });
  //         } else {
  //           body = new CANNON.Body({ mass: j == 3 ? .1 : .1 });
  //         }
  //         body.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
  //         body.angularDamping = 0.5;
  //         body.linearDamping = 0.5;
  //         body.position.set(point[j].x, point[j].y, point[j].z);
  //         this.world.addBody(body);
  //         this.LetterArray[i].letterArrayA.push(body);
  //         if (j != 0) {
  //           this.world.addConstraint(new CANNON.DistanceConstraint(body, lastbody, distance))
  //         }
  //         lastbody = body;
  //       }

  //       // top 
  //       if(this.LetterArray[i].type==2){
  //         curve = new THREE.LineCurve3(this.LetterArray[i].AttachPointV,
  //         Ipoint);
  //       } else if (this.LetterArray[i].type==3){
  //         curve = new THREE.LineCurve3(this.LetterArray[i].AttachPointV,
  //           Ipoint);
  //       } else {
  //         curve = new THREE.LineCurve3(new THREE.Vector3(this.LetterArray[i].letterArray[0].position.x,this.LetterArray[i].letterArray[0].position.y,this.LetterArray[i].letterArray[0].position.z),
  //         Ipoint);
  //       }

  //       this.world.remove(this.LetterArray[i].letterArray[1])
  //       this.world.remove(this.LetterArray[i].letterArray[0])
  //       this.world02.remove(this.LetterArray[i].letterArray[1])
  //       this.world02.remove(this.LetterArray[i].letterArray[0])
  //       this.LetterArray[i].letterArray=[];
  //       this.scene.remove(this.LetterArray[i].StringT);

  //       point = curve.getPoints(3);
  //       distance = this.distance(point[0].x, point[0].y, point[0].z,
  //         point[1].x, point[1].y, point[1].z);
        
  //       for (var j = 0; j < 4; j++) {
  //         let body = new CANNON.Body({ mass: j == 0 ? 0 : 1 });
  //         body.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
  //         body.angularDamping = 0.5;
  //         body.linearDamping = 0.5;
  //         body.position.set(point[j].x, point[j].y, point[j].z);
  //         this.world.addBody(body);
  //         this.LetterArray[i].letterArray.push(body);
  //         if (j != 0) {
  //           this.world.addConstraint(new CANNON.DistanceConstraint(body, lastbody, distance));
  //         }
  //         lastbody = body;
  //       }

  //       let Ti=i;
        
  //       if(this.LetterArray[Ti].type==1){
  //         // double line
  //         if(this.LetterArray[Ti].LConstraint02==null){
  //           gsap.delayedCall(5,()=>{
  //             for(var j=0;j<4;j++){
  //               this.world.remove(this.LetterArray[Ti].letterArray[j]);
  //               this.world.remove(this.LetterArray[Ti].letterArrayA[j]);
  //               this.world.remove(this.LetterArray[Ti].letterArray02[j]);
  //               this.world.remove(this.LetterArray[Ti].letterArrayA02[j]);
  //             }
  //             this.LetterArray[Ti].letterArray=null;
  //             this.LetterArray[Ti].letterArrayA=null;
  //             this.LetterArray[Ti].letterArray02=null;
  //             this.LetterArray[Ti].letterArrayA02=null;
  //             for(var k=0;k<this.LetterArray.length;k++){
  //               if(this.LetterArray[k].letterArray==null && this.LetterArray[k].letterArray02==null){
  //                 this.LetterArray[k].ObjectBody.sleep();
  //               }
  //             }
  //           });
  //         }
  //       } else {
  //         // single line
  //         gsap.delayedCall(5,()=>{
  //           for(var j=0;j<4;j++){
  //             this.world.remove(this.LetterArray[Ti].letterArray[j]);
  //             this.world.remove(this.LetterArray[Ti].letterArrayA[j]);
  //           }
  //           this.LetterArray[Ti].letterArray=null;
  //           this.LetterArray[Ti].letterArrayA=null;
  //           for(var k=0;k<this.LetterArray.length;k++){
  //             if(this.LetterArray[k].letterArray==null && this.LetterArray[k].letterArray02==null){
  //               this.LetterArray[k].ObjectBody.sleep();
  //             }
  //           }
  //         });
  //       }
  //     }
  //     if(this.LetterArray[i].Line2){
  //       if(this.LetterArray[i].Line2.id == Iid && this.LetterArray[i].LConstraint02 != null){
  //         this.world.removeConstraint(this.LetterArray[i].DConstraint02);
  //         this.world.removeConstraint(this.LetterArray[i].LConstraint02);
  //         this.LetterArray[i].LConstraint02 = null;

  //         // bottom
  //         let curve = new THREE.LineCurve3(Ipoint, 
  //           this.LetterArray[i].AttachPointV02);

  //         let point = curve.getPoints(3);

  //         let distance = this.distance(point[0].x, point[0].y, point[0].z,
  //           point[1].x, point[1].y, point[1].z);

  //         let lastbody: CANNON.Body;
  //         for (var j = 0; j < 4; j++) {
  //           let body = new CANNON.Body({ mass: j == 3 ? .1 : .1 });
  //           body.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
  //           body.angularDamping = 0.5;
  //           body.linearDamping = 0.5;
  //           body.position.set(point[j].x, point[j].y, point[j].z);
  //           this.world.addBody(body);
  //           this.LetterArray[i].letterArrayA02.push(body);
  //           if (j != 0) {
  //             this.world.addConstraint(new CANNON.DistanceConstraint(body, lastbody, distance))
  //           }
  //           lastbody = body;
  //         }

  //         // top 
  //         curve = new THREE.LineCurve3(new THREE.Vector3(this.LetterArray[i].letterArray02[0].position.x,this.LetterArray[i].letterArray02[0].position.y,this.LetterArray[i].letterArray02[0].position.z),
  //           Ipoint);

  //         this.world.remove(this.LetterArray[i].letterArray02[1])
  //         this.world.remove(this.LetterArray[i].letterArray02[0])
  //         this.LetterArray[i].letterArray02=[];
  //         this.scene.remove(this.LetterArray[i].StringT02);

  //         point = curve.getPoints(3);

  //         distance = this.distance(point[0].x, point[0].y, point[0].z,
  //           point[1].x, point[1].y, point[1].z);
          
  //         for (var j = 0; j < 4; j++) {
  //           let body = new CANNON.Body({ mass: j == 0 ? 0 : 1 });
  //           body.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
  //           body.angularDamping = 0.5;
  //           body.linearDamping = 0.5;
  //           body.position.set(point[j].x, point[j].y, point[j].z);
  //           this.world.addBody(body);
  //           this.LetterArray[i].letterArray02.push(body);
  //           if (j != 0) {
  //             this.world.addConstraint(new CANNON.DistanceConstraint(body, lastbody, distance));
  //           }
  //           lastbody = body;
  //         }

  //         let Ti=i;
        
  //         if(this.LetterArray[Ti].LConstraint==null){
  //           gsap.delayedCall(5,()=>{
  //             for(var j=0;j<4;j++){
  //               this.world.remove(this.LetterArray[Ti].letterArray[j]);
  //               this.world.remove(this.LetterArray[Ti].letterArrayA[j]);
  //               this.world.remove(this.LetterArray[Ti].letterArray02[j]);
  //               this.world.remove(this.LetterArray[Ti].letterArrayA02[j]);
  //             }
  //             this.LetterArray[Ti].letterArray=null;
  //             this.LetterArray[Ti].letterArrayA=null;
  //             this.LetterArray[Ti].letterArray02=null;
  //             this.LetterArray[Ti].letterArrayA02=null;
  //             for(var k=0;k<this.LetterArray.length;k++){
  //               if(this.LetterArray[k].letterArray==null && this.LetterArray[k].letterArray02==null){
  //                 this.LetterArray[k].ObjectBody.sleep();
  //               }
  //             }
  //           });
  //         }
  //       }
  //     }
  //   }
  // }


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

function CannonDebugRenderer(scene, world) {
  this.scene = scene;
  this.world = world;

  this._meshes = [];

  this._material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  this._sphereGeometry = new THREE.SphereGeometry(1);
  this._boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  this._planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
  this._cylinderGeometry = new THREE.CylinderGeometry(1, 1, 10, 10);
};

CannonDebugRenderer.prototype = {
  tmpVec0: new CANNON.Vec3(),
  tmpVec1: new CANNON.Vec3(),
  tmpVec2: new CANNON.Vec3(),
  tmpQuat0: new CANNON.Vec3(),

  update: function () {
    var bodies = this.world.bodies;
    var meshes = this._meshes;
    var shapeWorldPosition = this.tmpVec0;
    var shapeWorldQuaternion = this.tmpQuat0;

    var meshIndex = 0;

    for (var i = 0; i !== bodies.length; i++) {
      var body = bodies[i];

      for (var j = 0; j !== body.shapes.length; j++) {
        var shape = body.shapes[j];

        this._updateMesh(meshIndex, body, shape);

        var mesh = meshes[meshIndex];

        if (mesh) {

          // Get world position
          body.quaternion.vmult(body.shapeOffsets[j], shapeWorldPosition);
          body.position.vadd(shapeWorldPosition, shapeWorldPosition);

          // Get world quaternion
          body.quaternion.mult(body.shapeOrientations[j], shapeWorldQuaternion);

          // Copy to meshes
          mesh.position.copy(shapeWorldPosition);
          mesh.quaternion.copy(shapeWorldQuaternion);
        }

        meshIndex++;
      }
    }

    for (var i = meshIndex; i < meshes.length; i++) {
      var mesh = meshes[i];
      if (mesh) {
        this.scene.remove(mesh);
      }
    }

    meshes.length = meshIndex;
  },

  _updateMesh: function (index, body, shape) {
    var mesh = this._meshes[index];
    if (!this._typeMatch(mesh, shape)) {
      if (mesh) {
        this.scene.remove(mesh);
      }
      mesh = this._meshes[index] = this._createMesh(shape);
    }
    this._scaleMesh(mesh, shape);
  },

  _typeMatch: function (mesh, shape) {
    if (!mesh) {
      return false;
    }
    var geo = mesh.geometry;
    return (
      (geo instanceof THREE.SphereGeometry && shape instanceof CANNON.Sphere) ||
      (geo instanceof THREE.BoxGeometry && shape instanceof CANNON.Box) ||
      (geo instanceof THREE.PlaneGeometry && shape instanceof CANNON.Plane) ||
      (geo.id === shape.geometryId && shape instanceof CANNON.ConvexPolyhedron) ||
      (geo.id === shape.geometryId && shape instanceof CANNON.Heightfield)
    );
  },

  _createMesh: function (shape) {
    var mesh;
    var material = this._material;

    switch (shape.type) {

      case CANNON.Shape.types.SPHERE:
        mesh = new THREE.Mesh(this._sphereGeometry, material);
        break;

      case CANNON.Shape.types.BOX:
        mesh = new THREE.Mesh(this._boxGeometry, material);
        break;

      case CANNON.Shape.types.PLANE:
        mesh = new THREE.Mesh(this._planeGeometry, material);
        break;

      case CANNON.Shape.types.CONVEXPOLYHEDRON:
        // Create mesh
        var geo = new THREE.Geometry();

        // Add vertices
        for (var i = 0; i < shape.vertices.length; i++) {
          var v = shape.vertices[i];
          geo.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
        }

        for (var i = 0; i < shape.faces.length; i++) {
          var face = shape.faces[i];

          // add triangles
          var a = face[0];
          for (var j = 1; j < face.length - 1; j++) {
            var b = face[j];
            var c = face[j + 1];
            geo.faces.push(new THREE.Face3(a, b, c));
          }
        }
        geo.computeBoundingSphere();
        geo.computeFaceNormals();

        mesh = new THREE.Mesh(geo, material);
        shape.geometryId = geo.id;
        break;

      case CANNON.Shape.types.HEIGHTFIELD:
        var geometry = new THREE.Geometry();

        var v0 = this.tmpVec0;
        var v1 = this.tmpVec1;
        var v2 = this.tmpVec2;
        for (var xi = 0; xi < shape.data.length - 1; xi++) {
          for (var yi = 0; yi < shape.data[xi].length - 1; yi++) {
            for (var k = 0; k < 2; k++) {
              shape.getConvexTrianglePillar(xi, yi, k === 0);
              v0.copy(shape.pillarConvex.vertices[0]);
              v1.copy(shape.pillarConvex.vertices[1]);
              v2.copy(shape.pillarConvex.vertices[2]);
              v0.vadd(shape.pillarOffset, v0);
              v1.vadd(shape.pillarOffset, v1);
              v2.vadd(shape.pillarOffset, v2);
              geometry.vertices.push(
                new THREE.Vector3(v0.x, v0.y, v0.z),
                new THREE.Vector3(v1.x, v1.y, v1.z),
                new THREE.Vector3(v2.x, v2.y, v2.z)
              );
              var i = geometry.vertices.length - 3;
              geometry.faces.push(new THREE.Face3(i, i + 1, i + 2));
            }
          }
        }
        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();
        mesh = new THREE.Mesh(geometry, material);
        shape.geometryId = geometry.id;
        break;
    }

    if (mesh) {
      this.scene.add(mesh);
    }

    return mesh;
  },

  _scaleMesh: function (mesh, shape) {
    switch (shape.type) {

      case CANNON.Shape.types.SPHERE:
        var radius = shape.radius;
        mesh.scale.set(radius, radius, radius);
        break;

      case CANNON.Shape.types.BOX:
        mesh.scale.copy(shape.halfExtents);
        mesh.scale.multiplyScalar(2);
        break;

      case CANNON.Shape.types.CONVEXPOLYHEDRON:
        mesh.scale.set(1, 1, 1);
        break;

      case CANNON.Shape.types.HEIGHTFIELD:
        mesh.scale.set(1, 1, 1);
        break;

    }
  }
};

