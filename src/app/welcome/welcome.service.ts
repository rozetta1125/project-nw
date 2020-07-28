import * as THREE from 'three';
import * as CANNON from 'cannon';
import { TimelineMax,TimelineLite,TweenLite,Power0,Power1,Power2,gsap, random } from 'gsap';
import * as OrbitControls from 'three-orbitcontrols';
import GLTFLoader from 'three-gltf-loader';
// import thisWork from 'three-dragcontrols';
import { Injectable } from '@angular/core';
import * as dat from 'dat.gui';
import { ConvexBufferGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { Reflector } from 'three/examples/jsm/objects/Reflector';


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

class LetterProperty {
  Object3D: THREE.Object3D
  ObjectBody: CANNON.Body
  Scene: THREE.Scene
  setPoint: THREE.Vector3
  Points: number[]
  AttachPoint: THREE.Mesh
  AttachPointV: THREE.Vector3
  letterArray: CANNON.Body[]
  letterArrayA: CANNON.Body[]
  LConstraint: CANNON.LockConstraint
  DConstraint: CANNON.DistanceConstraint
  StringC: THREE.LineCurve3
  StringT: THREE.Mesh
  StringCA: THREE.LineCurve3
  StringTA: THREE.Mesh
  StringCAB: THREE.LineCurve3
  StringTAB: THREE.Mesh
  Line: THREE.Line
  Line2: THREE.Line

  // second line
  AttachPoint02: THREE.Mesh
  AttachPointV02: THREE.Vector3
  LConstraint02: CANNON.LockConstraint
  DConstraint02: CANNON.DistanceConstraint
  letterArray02: CANNON.Body[]
  letterArrayA02: CANNON.Body[]
  StringC02: THREE.LineCurve3
  StringT02: THREE.Mesh
  StringCA02: THREE.LineCurve3
  StringTA02: THREE.Mesh
  StringCAB02: THREE.LineCurve3
  StringTAB02: THREE.Mesh
  type: number
}

@Injectable({
  providedIn: 'root'
})

export class welcomeService {
  // THREE BASIC SETUP
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private scene: THREE.Scene;

  private loader: GLTFLoader;
  private dracoLoader;
  // CANNON BASIC SETUP
  private world03 = new CANNON.World();
  private world02 = new CANNON.World();

  private FireExtinguisher = new THREE.Object3D();
  private mixer01: THREE.AnimationMixer;
  private mixer02: THREE.AnimationMixer;
  private FlagMixer: THREE.AnimationMixer;
  private clock = new THREE.Clock();

  private hold1 = null;
  private hold2 = null;
  private hold3 = null;
  private hold5 = null;

  // FPS
  private times = [];
  private fps:number;
  private now:number;

  // 
  private windmillthree = [];
  private windmillcannon = [];
  private GolfShadows = [];
  private GolfThrees = [];
  private GolfCannons = [];

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
  BasePosition = new THREE.Vector2();
  lastpipe;
  lastthreepipe;
  dragControl;
  directionPipe;
  DragPoint;
  DragPointThree = [];
  PipeDistance = new THREE.Vector3();
  dragging: boolean = false;
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
  private Golfing: boolean = false;
  private FBvec = new THREE.Vector3();
  private LBvec = new THREE.Vector3();
  private FBpos = new THREE.Vector3();
  private LBpos = new THREE.Vector3();

  // Drag Stuffs
  private curvePipe = new THREE.Mesh();

  private plane = new THREE.Plane();
  private raycaster = new THREE.Raycaster();

  private mouse = new THREE.Vector2();
  private mouseF = new THREE.Vector2();
  private mouseL = new THREE.Vector2();
  private offset = new THREE.Vector3();
  private intersection = new THREE.Vector3();
  private Lines=[];
  private ParkObjects=[];

  private exporter = new GLTFExporter();
  private textureLoader;

  private DynamicShadows = [];
  private ScenePhase:number;

  private Goal = new THREE.Vector3();
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
    var PixelRatio = 1;
    var width = window.innerWidth * PixelRatio;
    var height = window.innerHeight * PixelRatio;
    this.renderer.setSize(width,height);
    this.canvas.style.width=width/PixelRatio+"px";
    this.canvas.style.height=height/PixelRatio+"px";
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
    // this.camera.position.copy(this.GoalAngle);
    // this.camera.lookAt(new THREE.Vector3(0,0,0));

    // this.Goal.set(0,1,0)
    // this.EasedGoal.copy(this.Goal);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.target.set(0,1,0);
    this.controls.update();
    this.controls.enableRotate = false;
    this.gui.add(this.controls,'enableRotate');

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



    // Color
    this.white = this.textureLoader.load('assets/matcaps/white.png',()=>{
      this.white.encoding=THREE.sRGBEncoding;
    });
    this.blue01 = this.textureLoader.load('assets/matcaps/blue01.png',()=>{
      this.blue01.encoding=THREE.sRGBEncoding;
    });
    this.blue02 = this.textureLoader.load('assets/matcaps/blue02.png',()=>{
      this.blue02.encoding=THREE.sRGBEncoding;
    });
    this.pink = this.textureLoader.load('assets/matcaps/pink.png',()=>{
      this.pink.encoding=THREE.sRGBEncoding;
    });
    this.green01 = this.textureLoader.load('assets/matcaps/green01.png',()=>{
      this.green01.encoding=THREE.sRGBEncoding;
    });
    this.wood = this.textureLoader.load('assets/matcaps/wood.png',()=>{
      this.wood.encoding=THREE.sRGBEncoding;
    });
    this.red = this.textureLoader.load('assets/matcaps/03/balloon.png',()=>{
      this.red.encoding=THREE.sRGBEncoding;
    });
    this.yellow = this.textureLoader.load('assets/matcaps/03/coin.png',()=>{
      this.yellow.encoding=THREE.sRGBEncoding;
    });
  }

  private blue01; 
  private blue02; 
  private white;
  private pink;
  private green01;
  private wood;
  private red;
  private yellow;
  
  private Train;
  private FerrisWheel;
  private Ferris;
  private Carnival;
  private CarnivalPlane;
  private Swing;
  private SwingS=[];
  private FerrisAnimation;
  private TrainAnimation;
  private SwingTween = new TimelineLite();
  private SmokePipe=[];
  private TrainPosition=[];
  private FerrisShadow = new THREE.Object3D();
  private FerrisShadows = [];
  CreateParkObject() {
    this.loader.load('assets/model/Swing.glb',
      (gltf)=>{
        this.Swing=gltf.scene;
        this.Swing.position.set(-.25,.04,-.87)
        this.Swing.scale.set(.9,.9,.9);
        this.Swing.rotation.set(0,25*Math.PI/180,0)

        // Shadow
        var texture = this.textureLoader.load('assets/shadow/Swing01.png');
        let uniforms00 = {
          tShadow:{value:texture},
          uShadowColor:{value:new THREE.Color("#000000")},
          uAlpha:{value:.4}
        }
        let material00 = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms:uniforms00,depthWrite:false,
          vertexShader:document.getElementById('vertexShader').textContent,
          fragmentShader:document.getElementById('fragmentShader').textContent});
        let shadow01 = new THREE.Mesh(new THREE.PlaneBufferGeometry(3.15,3.15),material00)
        shadow01.rotation.set(-Math.PI/2,0,25*Math.PI/180)
        shadow01.position.x=gltf.scene.children[0].position.x-.018
        shadow01.position.z=gltf.scene.children[0].position.z+.018
        shadow01.position.y=.064;
        this.scene.add(shadow01);


        var texture = this.textureLoader.load('assets/shadow/Swing02.png');
        let uniforms = {
          tShadow:{value:texture},
          uShadowColor:{value:new THREE.Color("#000000")},
          uAlpha:{value:.1}
        }
        let material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
          vertexShader:document.getElementById('vertexShader').textContent,
          fragmentShader:document.getElementById('fragmentShader').textContent});
        let shadow02 = new THREE.Mesh(new THREE.PlaneBufferGeometry(3.15,3.15),material)
        

        let ShadowTween = new THREE.Object3D();
        ShadowTween.add(shadow02);
        ShadowTween.position.x=gltf.scene.children[0].position.x-.018
        ShadowTween.position.z=gltf.scene.children[0].position.z+.018
        ShadowTween.position.y=.064;
        ShadowTween.rotation.set(-Math.PI/2,0,25*Math.PI/180)
        this.scene.add(ShadowTween);
        this.SwingS.push(shadow02);

        for(var i=0;i<gltf.scene.children.length;i++){
          if(gltf.scene.children[i].name=="Swing01"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.white
            })
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.blue01
            })
            let mate03 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.white
            })
            gltf.scene.children[""+i+""].children[0].material=mate01;
            gltf.scene.children[""+i+""].children[1].material=mate02;
            gltf.scene.children[""+i+""].children[2].material=mate03;
            this.SwingS.push(gltf.scene.children[""+i+""]);

            this.SwingTween.pause();
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,1.8,{ease:Power1.easeInOut,y:15*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,1.8,{ease:Power1.easeInOut,y:-15*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,2,{ease:Power1.easeInOut,y:25*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,2,{ease:Power1.easeInOut,y:-25*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,2,{ease:Power1.easeInOut,y:35*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,2,{ease:Power1.easeInOut,y:-35*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,2,{ease:Power1.easeInOut,y:45*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,2,{ease:Power1.easeInOut,y:-45*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,2.1,{ease:Power1.easeInOut,y:50*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,2.1,{ease:Power1.easeInOut,y:-50*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,2.2,{ease:Power1.easeInOut,y:45*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,2.2,{ease:Power1.easeInOut,y:-45*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,2.2,{ease:Power1.easeInOut,y:40*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,2.2,{ease:Power1.easeInOut,y:-40*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,2,{ease:Power1.easeInOut,y:30*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,2,{ease:Power1.easeInOut,y:-30*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,1.8,{ease:Power1.easeInOut,y:15*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,1.6,{ease:Power1.easeInOut,y:-12*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,1.4,{ease:Power1.easeInOut,y:12*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,1.2,{ease:Power1.easeInOut,y:-8*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,1,{ease:Power1.easeInOut,y:6*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,.9,{ease:Power1.easeInOut,y:-4*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,.8,{ease:Power1.easeInOut,y:2*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,.6,{ease:Power1.easeInOut,y:-1*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,.4,{ease:Power1.easeInOut,y:1*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,.3,{ease:Power1.easeInOut,y:-.5*Math.PI/180})
            this.SwingTween.to(gltf.scene.children[""+i+""].rotation,.2,{ease:Power1.easeInOut,y:0*Math.PI/180})
          } else if (gltf.scene.children[i].name=="Star02") {
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.blue01
            })
            gltf.scene.children[""+i+""].material=mate01;
          } else {
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.white
            })
            gltf.scene.children[""+i+""].material=mate01;
          }
        }

        this.ParkObjects.push(this.Swing);
        this.scene.add(this.Swing)
        
      }
    );

    this.loader.load(
      'assets/model/Carnival.glb',
      (gltf) => {
        this.Carnival = gltf.scene;
        this.Carnival.scale.set(.9, .9, .9);

        this.Carnival.position.set(-0.01, .02, 0.54);
        this.Carnival.rotation.set(0,0,0);
        // Carnival
        for(var i=0;i<this.Carnival.children.length;i++){
          if(this.Carnival.children[i].name=="Carnival02"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.white
            })
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.blue01
            })
            this.Carnival.children[i].children[0].material=mate02;
            this.Carnival.children[i].children[1].material=mate01;
          } else {
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.white
            })
            this.Carnival.children[i].material=mate01
          }
        }
        this.CarnivalTween.pause();
        this.CarnivalTween.to(this.Carnival.rotation,40,{ease:Power1.easeInOut,y:this.Carnival.rotation.y-Math.PI*6});
        this.CarnivalTween.to(this.CarnivalPlane.rotation,40,{ease:Power1.easeInOut,y:this.CarnivalPlane.rotation.y-Math.PI*6},'-=40');
        this.scene.add(this.Carnival);
        this.ParkObjects.push(this.Carnival)

        let shadow3d = new THREE.Object3D();
        var texture = this.textureLoader.load('assets/shadow/Carnival02.png');

        let uniforms00 = {
          tShadow:{value:texture},
          uShadowColor:{value:new THREE.Color("#000000")},
          uAlpha:{value:.3}
        }
        let material00 = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms:uniforms00,depthWrite:false,
          vertexShader:document.getElementById('vertexShader').textContent,
          fragmentShader:document.getElementById('fragmentShader').textContent});
          
        let shadow00 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1.8,1.8),material00)
        shadow00.rotation.set(-Math.PI/2,0,0)
        shadow00.position.set(0,.165,0.54)
        this.scene.add(shadow00)

        let shadow01=shadow00.clone();
        shadow01.scale.set(.5,.5,.5);
        shadow01.position.set(0.105,.201,0.54)
        shadow01.rotation.set(-Math.PI/2,0,0)
        this.scene.add(shadow01);

        var texture = this.textureLoader.load('assets/shadow/Carnival01.png');
        let uniforms = {
          tShadow:{value:texture},
          uShadowColor:{value:new THREE.Color("#000000")},
          uAlpha:{value:.3}
        }
        let material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
          vertexShader:document.getElementById('vertexShader').textContent,
          fragmentShader:document.getElementById('fragmentShader').textContent});
          
        let shadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(.63,.63),material)
        shadow.rotation.set(-Math.PI/2,0,0)
        shadow.position.set(-0.603,.164,0)
        shadow3d.add(shadow);

        let shadow02 = shadow.clone();
        shadow02.position.set(0.603,.164,0)
        shadow3d.add(shadow02);

        let shadow03 = shadow.clone();
        shadow03.position.set(0,.164,-0.603)
        shadow3d.add(shadow03);

        let shadow04 = shadow.clone();
        shadow04.position.set(0,.164,0.603)
        shadow3d.add(shadow04);


        shadow3d.position.set(-0.01,0,.54);
        this.scene.add(shadow3d)
        this.CarnivalTween.to(shadow3d.rotation,40,{ease:Power1.easeInOut,y:shadow3d.rotation.y-Math.PI*6},'-=40')
        this.CarnivalTween.to(shadow3d.children[0].rotation,40,{ease:Power1.easeInOut,z:shadow3d.rotation.z+Math.PI*6},'-=40')
        this.CarnivalTween.to(shadow3d.children[1].rotation,40,{ease:Power1.easeInOut,z:shadow3d.rotation.z+Math.PI*6},'-=40')
        this.CarnivalTween.to(shadow3d.children[2].rotation,40,{ease:Power1.easeInOut,z:shadow3d.rotation.z+Math.PI*6},'-=40')
        this.CarnivalTween.to(shadow3d.children[3].rotation,40,{ease:Power1.easeInOut,z:shadow3d.rotation.z+Math.PI*6},'-=40')


        // Plane
        this.loader.load('assets/model/CarnivalPlane.glb',
          (gltf)=>{
            
            for(var i=0;i<2;i++){
              if(gltf.scene.children[i].name=="CarnivalPlane00"){
                let mate01 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.blue01
                })
                let mate02 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.pink
                })
                PlanePart = gltf.scene.children[i].clone();
                PlanePart.children["0"].material=mate01;
                PlanePart.children["1"].material=mate02;
              } else {
                let mate02 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.blue01
                })
                gltf.scene.children[""+i+""].material=mate02;
                Fan = gltf.scene.children[i].clone();
              }
            }
            Fan.position.z = .65;
            PlanePart.position.z=.65;
            Plane01.add(Fan);
            Plane01.add(PlanePart)
            Plane01.scale.set(.9,.9,.9)
            Plane01.position.set(0,.5,0);
            Plane01.rotation.set(0,-4*Math.PI/180,0)
            Plane01.children[0].name="Plane01W";
            Plane01.children[1].children[0].name="Plane01";
            Plane01.children[1].children[1].name="Plane01";
            this.PlaneTween01.pause();
            this.PlaneTween01.to(Plane01.children[0].rotation,5,{x:Math.PI*10});
            this.CarnivalTween.to(Plane01.position,2,{ease:Power1.easeInOut,y:.65,repeat:11,yoyo:true},'-=36');
            this.CarnivalPlane.add(Plane01)
    
            Plane02 = Plane01.clone();
            Plane02.children[0].name="Plane02W";
            Plane02.children[1].children[0].name="Plane02";
            Plane02.children[1].children[1].name="Plane02";
            Plane02.rotation.set(0,(-90-4)*Math.PI/180,0)
            this.PlaneTween02.pause();
            this.PlaneTween02.to(Plane02.children[0].rotation,5,{x:Math.PI*10});
            this.CarnivalTween.to(Plane02.position,2,{ease:Power1.easeInOut,y:.65,repeat:11,yoyo:true},'-=33');
            this.CarnivalPlane.add(Plane02)
    
            Plane03 = Plane01.clone();
            Plane03.children[0].name="Plane03W";
            Plane03.children[1].children[0].name="Plane03";
            Plane03.children[1].children[1].name="Plane03";
            Plane03.position.set(0,.5,0);
            Plane03.rotation.set(0,(-180-4)*Math.PI/180,0)
            this.PlaneTween03.pause();
            this.PlaneTween03.to(Plane03.children[0].rotation,5,{x:Math.PI*10});
            this.CarnivalTween.to(Plane03.position,2,{ease:Power1.easeInOut,y:.65,repeat:11,yoyo:true},'-=34');
            this.CarnivalPlane.add(Plane03)
    
            Plane04 = Plane01.clone();
            Plane04.children[0].name="Plane04W";
            Plane04.children[1].children[0].name="Plane04";
            Plane04.children[1].children[1].name="Plane04";
            Plane04.position.set(0,.5,0);
            Plane04.rotation.set(0,(-270-4)*Math.PI/180,0)
            this.PlaneTween04.pause();
            this.PlaneTween04.to(Plane04.children[0].rotation,5,{x:Math.PI*10});
            this.CarnivalTween.to(Plane04.position,2,{ease:Power1.easeInOut,y:.65,repeat:11,yoyo:true},'-=35');
            this.CarnivalPlane.add(Plane04)
    
            this.CarnivalPlane.position.set(-0.01,0, .54)
            this.ParkObjects.push(this.CarnivalPlane)
            this.scene.add(this.CarnivalPlane);
          }
        );
      }
    );

    this.CarnivalPlane = new THREE.Object3D();
    let Plane01 = new THREE.Object3D();
    let Plane02 = new THREE.Object3D();
    let Plane03 = new THREE.Object3D();
    let Plane04 = new THREE.Object3D();
    let Fan = new THREE.Object3D();
    let PlanePart = new THREE.Object3D();

    this.loader.load(
      'assets/model/FerrisWheel.glb',
      (gltf) => {
        this.FerrisWheel = gltf.scene;

        this.FerrisWheel.scale.set(.9, .9, .9);
        this.FerrisWheel.position.set(.4, .035, -1.02);
        this.FerrisWheel.rotation.set(0,-30*Math.PI/180,0);

        var texture = this.textureLoader.load('assets/shadow/Ferris01.png');
        let uniforms00 = {
          tShadow:{value:texture},
          uShadowColor:{value:new THREE.Color("#000000")},
          uAlpha:{value:.3}
        }
        let material00 = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms:uniforms00,depthWrite:false,
          vertexShader:document.getElementById('vertexShader').textContent,
          fragmentShader:document.getElementById('fragmentShader').textContent});
        let shadow01 = new THREE.Mesh(new THREE.PlaneBufferGeometry(3.15,3.15),material00)
        shadow01.rotation.set(-Math.PI/2,0,-30*Math.PI/180)

        shadow01.position.y=.064;
        this.scene.add(shadow01);


        var texture = this.textureLoader.load('assets/shadow/Ferris02.png');
        let uniforms = {
          tShadow:{value:texture},
          uShadowColor:{value:new THREE.Color("#000000")},
          uAlpha:{value:.3}
        }
        let material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
          vertexShader:document.getElementById('vertexShader').textContent,
          fragmentShader:document.getElementById('fragmentShader').textContent});
        let shadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(1.8,1.8),material)
        shadow.rotation.set(-Math.PI/2,0,0)
        shadow.position.y=.064;
        
        this.FerrisShadow.add(shadow);
        this.FerrisShadows.push(shadow);
        this.scene.add(this.FerrisShadow);
        
        this.FerrisShadow.rotation.set(0,-30*Math.PI/180,0);
        
        for(var i=0;i<this.FerrisWheel.children.length;i++){
          if(this.FerrisWheel.children[i].name=="Star"){
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.blue01
            })
            this.FerrisWheel.children[i].material=mate02
          } else if(this.FerrisWheel.children[i].name=="FerrisWheel00") {
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.white
            })
            this.FerrisWheel.children[i].material=mate01
            shadow01.position.x=gltf.scene.children[i].position.x-.003
            shadow01.position.z=gltf.scene.children[i].position.z+.08
          } else {
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.white
            })
            this.FerrisWheel.children[i].material=mate01
          }
        }
        
        this.ParkObjects.push(this.FerrisWheel)
        this.scene.add(this.FerrisWheel);


        // 8 Ferris
        this.loader.load(
          'assets/model/Ferris.glb',
          (gltf) => {
            this.Ferris = gltf;
            this.mixer01 = new THREE.AnimationMixer(this.Ferris.scene);
            this.mixer01.timeScale = .04;
    
    
            this.Ferris.scene.scale.set(.9, .9, .9);
            this.Ferris.scene.position.set(.4, .035, -1.02);
            this.Ferris.scene.rotation.set(0,-30*Math.PI/180,0);
    
    
            // Ferris
            for(var i=0;i<this.Ferris.scene.children.length;i++){
              if(this.Ferris.scene.children[i].name=="F01"){
                this.TweenF01.pause();
                this.TweenF01.to(this.Ferris.scene.children[i].rotation,1,{z:.7})
                this.TweenF01.to(this.Ferris.scene.children[i].rotation,2,{z:-.7});
                this.TweenF01.to(this.Ferris.scene.children[i].rotation,1,{z:0});
                let mate01 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.white
                })
                let mate03 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.pink
                })
                this.Ferris.scene.children[i].children[1].material=mate03
                this.Ferris.scene.children[i].children[0].material=mate01
              } else if (this.Ferris.scene.children[i].name=="F02") {
                this.TweenF02.pause();
                this.TweenF02.to(this.Ferris.scene.children[i].rotation,1,{z:.7})
                this.TweenF02.to(this.Ferris.scene.children[i].rotation,2,{z:-.7});
                this.TweenF02.to(this.Ferris.scene.children[i].rotation,1,{z:0});
                let mate01 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.white
                })
                let mate02 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.blue01
                })
                this.Ferris.scene.children[i].children[1].material=mate02
                this.Ferris.scene.children[i].children[0].material=mate01
              } else if (this.Ferris.scene.children[i].name=="F03") {
                this.TweenF03.pause();
                this.TweenF03.to(this.Ferris.scene.children[i].rotation,1,{z:.7})
                this.TweenF03.to(this.Ferris.scene.children[i].rotation,2,{z:-.7});
                this.TweenF03.to(this.Ferris.scene.children[i].rotation,1,{z:0});
                let mate01 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.white
                })
                let mate03 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.pink
                })
                this.Ferris.scene.children[i].children[1].material=mate03
                this.Ferris.scene.children[i].children[0].material=mate01
              } else if (this.Ferris.scene.children[i].name=="F04") {
                this.TweenF04.pause();
                this.TweenF04.to(this.Ferris.scene.children[i].rotation,1,{z:.7})
                this.TweenF04.to(this.Ferris.scene.children[i].rotation,2,{z:-.7});
                this.TweenF04.to(this.Ferris.scene.children[i].rotation,1,{z:0});
                let mate01 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.white
                })
                let mate02 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.blue01
                })
                this.Ferris.scene.children[i].children[1].material=mate02
                this.Ferris.scene.children[i].children[0].material=mate01
              } else if (this.Ferris.scene.children[i].name=="F05") {
                this.TweenF05.pause();
                this.TweenF05.to(this.Ferris.scene.children[i].rotation,1,{z:.7})
                this.TweenF05.to(this.Ferris.scene.children[i].rotation,2,{z:-.7});
                this.TweenF05.to(this.Ferris.scene.children[i].rotation,1,{z:0});
                let mate01 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.white
                })
                let mate03 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.pink
                })
                this.Ferris.scene.children[i].children[1].material=mate03
                this.Ferris.scene.children[i].children[0].material=mate01
              } else if (this.Ferris.scene.children[i].name=="F06") {
                this.TweenF06.pause();
                this.TweenF06.to(this.Ferris.scene.children[i].rotation,1,{z:.7})
                this.TweenF06.to(this.Ferris.scene.children[i].rotation,2,{z:-.7});
                this.TweenF06.to(this.Ferris.scene.children[i].rotation,1,{z:0});
                let mate01 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.white
                })
                let mate02 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.blue01
                })
                this.Ferris.scene.children[i].children[1].material=mate02
                this.Ferris.scene.children[i].children[0].material=mate01
              } else if (this.Ferris.scene.children[i].name=="F07") {
                this.TweenF07.pause();
                this.TweenF07.to(this.Ferris.scene.children[i].rotation,1,{z:.7})
                this.TweenF07.to(this.Ferris.scene.children[i].rotation,2,{z:-.7});
                this.TweenF07.to(this.Ferris.scene.children[i].rotation,1,{z:0});
                let mate01 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.white
                })
                let mate03 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.pink
                })
                this.Ferris.scene.children[i].children[1].material=mate03
                this.Ferris.scene.children[i].children[0].material=mate01
              } else if (this.Ferris.scene.children[i].name=="F08") {
                this.TweenF08.pause();
                this.TweenF08.to(this.Ferris.scene.children[i].rotation,1,{z:.7})
                this.TweenF08.to(this.Ferris.scene.children[i].rotation,2,{z:-.7});
                this.TweenF08.to(this.Ferris.scene.children[i].rotation,1,{z:0});
                let mate01 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.white
                })
                let mate02 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.blue01
                })
                this.Ferris.scene.children[i].children[1].material=mate02
                this.Ferris.scene.children[i].children[0].material=mate01
              } else {
                let mate01 = new THREE.MeshMatcapMaterial({
                  color:0xffffff,
                  side:2,
                  matcap:this.white
                })
                this.Ferris.scene.children[i].material=mate01
              }
              if(this.Ferris.scene.children[i].position.y<.65){
                this.FerrisShadows[0].position.x=this.Ferris.scene.children[i].position.x-.4
                this.FerrisShadows[0].position.z=this.Ferris.scene.children[i].position.z-.9
                this.FerrisShadows[0].material.uniforms.uAlpha.value=
                  (.65-this.Ferris.scene.children[i].position.y)*4;
              }
            }
    
            this.ParkObjects.push(this.Ferris.scene);
            this.scene.add(this.Ferris.scene);
          }
        );
      }
    );

    this.loader.load(
      'assets/model/Train.glb',
      (gltf) => {
        this.Train = gltf;
        this.mixer02 = new THREE.AnimationMixer(this.Train.scene);


        this.mixer02.timeScale=.25;
        this.Train.scene.position.set(0, .045, 0);

        var texture = this.textureLoader.load('assets/shadow/Park02.png');

        let uniforms = {
          tShadow:{value:texture},
          uShadowColor:{value:new THREE.Color("#c0a68e")},
          uAlpha:{value:1}
        }
        let material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
          vertexShader:document.getElementById('vertexShader').textContent,
          fragmentShader:document.getElementById('fragmentShader').textContent});
    
        let trainShadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(1.2,1.2),material);
        trainShadow.rotation.set(-Math.PI/2,0.01,-Math.PI/2)
        trainShadow.position.set(.3,0.01,-.45);
        let TrainShadow3d01 = new THREE.Object3D();
        TrainShadow3d01.add(trainShadow);

        this.scene.add(TrainShadow3d01);

        let TrainShadow3d02=TrainShadow3d01.clone();
        this.scene.add(TrainShadow3d02);
        this.TrainPosition.push(TrainShadow3d01);


        this.TrainPosition.push(TrainShadow3d02);

        var u=0;
        // Train
        for(var i=0;i<this.Train.scene.children.length;i++){
          if(this.Train.scene.children[i].name=="Rail"){
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.blue01
            })
            this.Train.scene.children[i].material=mate02
          } else if (this.Train.scene.children[i].name=="SmokePipe"){
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.blue01
            })
            this.Train.scene.children[i].material=mate02
            this.SmokePipe.push(this.Train.scene.children[i]);
          } else {
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.white
            })
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.blue01
            })
            this.Train.scene.children[i].children[0].material=mate02;
            this.Train.scene.children[i].children[1].material=mate01;
            this.TrainPosition[u].position.x=this.Train.scene.children[i].position.x;
            this.TrainPosition[u].position.z=this.Train.scene.children[i].position.z;
            this.ParkObjects.push(this.Train.scene.children[i]);
            this.TrainPosition.push(this.Train.scene.children[i]);
            u++;
          }
        }
        this.scene.add(this.Train.scene);
      }
    );
  }

  CreateSmokes(){
    this.Smoke = new THREE.Mesh(new THREE.SphereBufferGeometry(.04,10,10));
    for(var i=0;i<80;i++){
      let smokeClone = this.Smoke.clone();
      let mate = new THREE.MeshMatcapMaterial({transparent:true,matcap:this.white,opacity:0,depthWrite:false});
      smokeClone.material = mate;
      this.Smokes.push(smokeClone);
      this.scene.add(smokeClone);
    }
  }

  SwingShadow(){
    if(!this.SwingTween.isActive()){

    } else {
      this.SwingS[0].position.x=this.SwingS[1].rotation.y/1.5;
      setTimeout(() => {
        this.SwingShadow();
      }, 16);
    }

  }

  FerrisWheelShadow(){
    for(var i=0;i<this.Ferris.scene.children.length;i++){
      if(this.Ferris.scene.children[i].position.y<.65){
        this.FerrisShadows[0].position.x=this.Ferris.scene.children[i].position.x-.4
        this.FerrisShadows[0].material.uniforms.uAlpha.value=
          (.65-this.Ferris.scene.children[i].position.y)*4;
        break;
      } else {
        this.FerrisShadows[0].material.uniforms.uAlpha.value=0;
      }
    }

    if(this.FerrisAnimation==null){

    } else {
      setTimeout(() => {
        this.FerrisWheelShadow();
      }, 16);
    }
  }

  private TweenF01 = new TimelineLite();
  private TweenF02 = new TimelineLite();
  private TweenF03 = new TimelineLite();
  private TweenF04 = new TimelineLite();
  private TweenF05 = new TimelineLite();
  private TweenF06 = new TimelineLite();
  private TweenF07 = new TimelineLite();
  private TweenF08 = new TimelineLite();
  private CarnivalTween = new TimelineLite();
  private PlaneTween01 = new TimelineLite();
  private PlaneTween02 = new TimelineLite();
  private PlaneTween03 = new TimelineLite();
  private PlaneTween04 = new TimelineLite();
  FirstSceneClickEvent(){
    this.raycaster.setFromCamera(this.mouse,this.camera);
    var intersect = this.raycaster.intersectObjects(this.ParkObjects,true)
    if(intersect.length>0){
      switch (intersect[0].object.name) {
        case "FerrisWheel00":
        case "FerrisWheel01":
        case "FerrisWheel02":
          if(this.FerrisAnimation!=null){
          } else {
            for(var i=0;i<this.Ferris.animations.length;i++){
              this.FerrisAnimation = this.mixer01.clipAction(this.Ferris.animations[i]);
              this.FerrisAnimation.setLoop(THREE.LoopOnce);
              this.FerrisAnimation.play().reset();
            }
            this.FerrisWheelShadow();
            gsap.delayedCall(25,() => {
              this.FerrisAnimation=null;
            });
          }
        break;
        case "Swing01_0":
        case "Swing01_1":
        case "Swing01_2":
        case "Swing02":
        case "Swing03":
          if(!this.SwingTween.isActive()){
            this.SwingTween.restart();
            this.SwingShadow();
          }
          break;
        case "Plane01":
        case "Plane01W":
          if(!this.PlaneTween01.isActive()){
            this.PlaneTween01.restart();
          }
          break;
        case "Plane02":
        case "Plane02W":
          if(!this.PlaneTween02.isActive()){
            this.PlaneTween02.restart();
          }
          break;
        case "Plane03":
        case "Plane03W":
          if(!this.PlaneTween03.isActive()){
            this.PlaneTween03.restart();
          }
          break;
        case "Plane04":
        case "Plane04W":
          if(!this.PlaneTween04.isActive()){
            this.PlaneTween04.restart();
          }
          break;
        case "Carnival01":
        case "Carnival02_0":
        case "Carnival02_1":
          if(!this.CarnivalTween.isActive()){
            this.CarnivalTween.restart();
          }
          break;
        case "F01_1":
          if(!this.TweenF01.isActive()){
            this.TweenF01.restart();
          }
        break;
        case "F02_1":
          if(!this.TweenF02.isActive()){
            this.TweenF02.restart();
          }
        break;
        case "F03_1":
          if(!this.TweenF03.isActive()){
            this.TweenF03.restart();
          }
        break;
        case "F04_1":
          if(!this.TweenF04.isActive()){
            this.TweenF04.restart();
          }
        break;
        case "F05_1":
          if(!this.TweenF05.isActive()){
            this.TweenF05.restart();
          }
        break;
        case "F06_1":
          if(!this.TweenF06.isActive()){
            this.TweenF06.restart();
          }
        break;
        case "F07_1":
          if(!this.TweenF07.isActive()){
            this.TweenF07.restart();
          }
        break;
        case "F08_1":
          if(!this.TweenF08.isActive()){
            this.TweenF08.restart();
          }
        break;
        case "Train01_0":
        case "Train01_1":
        case "Train02_0":
        case "Train02_1":
          if(this.TrainAnimation!=null){
          } else {
            for(var i=0;i<this.Train.animations.length;i++){
              this.TrainAnimation = this.mixer02.clipAction(this.Train.animations[i]);
              this.TrainAnimation.setLoop(THREE.LoopOnce);
              this.TrainAnimation.play().reset();
            }
            this.TrainSmoke();
            gsap.delayedCall(20,() => {
              this.TrainAnimation=null;
            });
          }
        break;
      }
    }
  }

  private Smoke;
  private Smokes=[];
  private SmokeI=0;
  TrainSmoke(){
    if(this.SmokeI==this.Smokes.length){
      this.SmokeI=0;
    }
    // Shadow
    gsap.to(this.TrainPosition[0].position,.1,{x:this.TrainPosition[2].position.x,z:this.TrainPosition[2].position.z,delay:.1})
    gsap.to(this.TrainPosition[1].position,.1,{x:this.TrainPosition[3].position.x,z:this.TrainPosition[3].position.z,delay:.1})

    this.TrainPosition[0].rotation.y=this.TrainPosition[2].rotation.y;
    this.TrainPosition[1].rotation.y=this.TrainPosition[3].rotation.y;
    // Position
    gsap.fromTo(this.Smokes[this.SmokeI].position,1.6,
      {x:this.SmokePipe[0].position.x,z:this.SmokePipe[0].position.z,y:this.SmokePipe[0].position.y},
      {x:this.SmokePipe[0].position.x+(.3-Math.random()*.3),z:this.SmokePipe[0].position.z+(.3-Math.random()*.3),y:this.SmokePipe[0].position.y+Math.random()*.4+.4});
    // Scale
    gsap.fromTo(this.Smokes[this.SmokeI].scale,1.6,
      {x:1,z:1,y:1},
      {x:.1,z:.1,y:.1,ease:"none"});
    // // Opacity
    gsap.fromTo(this.Smokes[this.SmokeI].material,1.6,
      {opacity:1},
      {opacity:0,ease:"none"});
    this.SmokeI++;
    if(this.TrainAnimation==null){
    } else {
      setTimeout(() => {
        this.TrainSmoke();
      }, 16);
    }
  }


  private BaseMatcap;
  FirstInit(): void {
    this.ScenePhase=1;

    this.StringM = new LineMaterial({
      color:0xeeeeee,
      linewidth:.0012,
    })

    this.AddEvent();
    this.CreateSmokes();
    // this.nextStageFunction();
    // this.CreateParkObject();
    // this.ParkStaticShadow();

    // this.SecondInit();
    this.ThirdInit();
    this.CreateBalloonCursor();

    let cursor = document.querySelector('.cursor');

    document.addEventListener('mousemove',e=>{
      cursor.setAttribute("style","top:"+e.pageY+"px;left:"+e.pageX+"px;");
    });
    document.addEventListener('mousedown',this.CursorDown,false);
    document.addEventListener('mouseup',this.CursorUp,false);
    
    // this.canvas.addEventListener("click", () => {
    //   this.FirstSceneClickEvent();
    // });

    this.canvas.addEventListener("mousemove", (e) => {
      this.renderThreePosition(e.x, e.y);
    });


    this.canvas.addEventListener("touchmove", (e) => {
      this.renderThreePosition(e.touches[0].clientX, e.touches[0].clientY);
    });
    this.canvas.addEventListener("mousedown", (e) => {
      if (e.which == 1) {
        this.CursorBegin();
        // this.canvas.onmousemove = () => {
        //   this.BalloonCursor();
        // };
        this.canvas.addEventListener("mousemove",this.ThirdSceneMouseMove,false);
      }
    });
    // this.canvas.addEventListener("touchstart", (e) => {
    //   this.renderThreePosition(e.touches[0].clientX, e.touches[0].clientY);
    //     this.CursorBegin();
    //     this.canvas.ontouchmove = () => {
    //       this.BalloonCursor();
    //       this.FirstSceneClickEvent();
    //     };
    // });
    this.canvas.addEventListener("mouseup", (e) => {
      if (e.which == 1) {
        // this.canvas.onmousemove = null;
        this.canvas.removeEventListener("mousemove",this.ThirdSceneMouseMove,false);
        TweenLite.to(this.FirstCursor, .5, {
          x: this.LastCursor.x,
          y: this.LastCursor.y, z: this.LastCursor.z
        })
        this.CheckIntersect();
        // if (this.collided) {
        //   this.FirstCursor.copy(this.LastCursor);
        // } else {
        //   TweenLite.to(this.FirstCursor, .5, {
        //     x: this.LastCursor.x,
        //     y: this.LastCursor.y, z: this.LastCursor.z
        //   })
        //   this.CheckIntersect()
        // }
      }
    });
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

  ParkStaticShadow(){
    var texture = this.textureLoader.load('assets/shadow/Park01.png');

    let uniforms = {
      tShadow:{value:texture},
      uShadowColor:{value:new THREE.Color("#c0a68e")},
      uAlpha:{value:1}
    }
    let material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})

      
    let railshadow = new THREE.Mesh(new THREE.PlaneGeometry(12,12),material);
    railshadow.rotation.set(-Math.PI/2,0,-Math.PI/2)
    railshadow.position.set(0,0,0);

    this.scene.add(railshadow);
  }

  private firstClientX:number=0;
  private onNextLeft:boolean=false;
  nextStageFunction(){
    document.querySelector('#nextStage .nextLeft').addEventListener("mousedown", this.nextLeftDown, false);

    document.addEventListener("mouseup", ()=>{
      if(this.onNextLeft){
        document.removeEventListener("mousemove", this.nextLeftMove, false);
        console.log("cancelled")
        this.firstClientX=0;
        this.onNextLeft=false;
        if(!this.cameraFrameBoolean){
          this.nextCancel();
        }
      }
    })
  }

  nextLeftDown = (e) => {
    document.addEventListener("mousemove", this.nextLeftMove);
    this.firstClientX=e.clientX;
    this.onNextLeft = true;
  }

  nextLeftMove = (e) => {
    var num = e.clientX-this.firstClientX > 0 ? e.clientX-this.firstClientX : 0;
    if(num>0){
      if(num>=250){
        if(!this.cameraFrameBoolean){
          this.nextLeftOnceOnly();
        }
        this.cameraFrameBoolean=true;
      } else {
        TweenLite.to(this.Goal,.01,{x:num*.01})
        TweenLite.set('#nextStage .nextLeft',{css:{left:num+"px"}});
        TweenLite.set('#nextStage .mid .svg',{css:{width:(200-num)+"px"}});
      }
    }
  }

  nextLeftOnceOnly(){
    if(this.cameraFrameBoolean=true){
      console.log('succeed')

      TweenLite.to(this.Goal,1.2,{ease:Power1.easeIn,x:10});

      TweenLite.to('#nextStage',.5,{ease:Power1.easeIn,css:{opacity:0}});
      TweenLite.set('#nextStage',{css:{visibility:"hidden"},delay:.4});
      
      var offsetl = document.querySelector('#nextStage .nextRight') as HTMLElement;

      // TweenLite.to('#nextStage .nextLeft',.2,{css:{left:offsetl.offsetLeft+"px"}});
      // TweenLite.to('#nextStage .mid .svg',.2,{css:{width:0+"px"}});

      document.removeEventListener("mousemove", this.nextLeftMove, false);
      console.log("cancelled")
      this.firstClientX=0;
      this.onNextLeft=false;
    }
  }

  private cameraFrameBoolean:boolean=false;
  nextCancel(){
    TweenLite.to('#nextStage .nextLeft',.3,{ease:Power1.easeOut,css:{left:0+"px"}});
    TweenLite.to('#nextStage .mid .svg',.3,{ease:Power1.easeOut,css:{width:200+"px"}});
    TweenLite.to(this.Goal,.3,{ease:Power1.easeOut,x:0})
  }

  AddEvent(): void {
    window.addEventListener('DOMContentLoaded', () => {
      this.render();
    });

    window.addEventListener('resize', () => {
      this.resize();
    });

    document.addEventListener('visibilitychange', ()=>{
      if(document.hidden){
        this.elapsedTime=(typeof performance === 'undefined' ? Date : performance).now();
      } else {
        this.elapsedTime=(typeof performance === 'undefined' ? Date : performance).now()-this.elapsedTime;
      }
    })
  }


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

  FirstSceneRender() {
    this.raycaster.setFromCamera(this.mouse,this.camera);
    var intersect = this.raycaster.intersectObjects(this.ParkObjects,true)
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

  private oldTime=0;
  private elapsedTime=0;
  private diff

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

  private GoalEasing = .2;
  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    this.Runanimation();

    this.now = performance.now();

    // Camera 
    // this.EasedGoal.x+=(this.Goal.x - this.EasedGoal.x) * this.GoalEasing;
    // this.EasedGoal.y+=(this.Goal.y - this.EasedGoal.y) * this.GoalEasing;
    // this.EasedGoal.z+=(this.Goal.z - this.EasedGoal.z) * this.GoalEasing;

    // this.camera.position.copy(this.EasedGoal).add(this.GoalAngle.clone().normalize().multiplyScalar(this.GoalAngle.z))


    if (this.times.length > 0 && this.times[0] <= this.now - 1000) {
      this.times.shift();
    }

    this.times.push(this.now);
    this.fps = this.times.length;

    // this.FirstSceneRender();
    // this.MiniGolfRender();
    this.ThirdSceneRender();


    this.renderer.render(this.scene, this.camera);
  }


  private CircleGolf;
  SecondInit(){
    this.InitGolfCannon();



    var shape = new CANNON.Plane();
    var PlaneBody = new CANNON.Body({ mass: 0,material:this.PlaneMaterial });
    PlaneBody.addShape(shape);
    PlaneBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    PlaneBody.position.set(0, -.2, 0);
    this.world02.addBody(PlaneBody)

    this.GolfStageCannon();
    // this.GolfStage();


    this.GolfString = new THREE.Object3D();
    let material = new THREE.MeshBasicMaterial({color:0xffffff});
    let arrow = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(.075,.075,.01,3),material
    )
    arrow.position.set(0,0,0.45);
    let box = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.05,.01,.1),material
    )
    box.position.set(0,0,0.3);
    let box02 = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.05,.01,.1),material
    )
    box02.position.set(0,0,0.15);
    this.GolfString.add(arrow);
    this.GolfString.add(box);
    this.GolfString.add(box02);

    this.canvas.addEventListener("mousedown", (e) => {
      if (e.which == 1) {
        if(this.GolfState.value==1){
          this.canvas.addEventListener("mousemove", this.isGolfing, false);
          this.GolfBegin();
        }
      }
    });
    this.canvas.addEventListener("mouseup", (e) => {
      if (e.which == 1) {
        this.canvas.removeEventListener("mousemove", this.isGolfing, false);
        this.Golfing=false;
        gsap.set('.circle',{css:{strokeDashoffset: 270}});
        gsap.set('.circle .innerCircle',{css:{strokeDashoffset: 270}});
        gsap.set('.svg-line',{css:{opacity:0}});

        this.scene.remove(this.GolfString);

        if(!this.controls.enableRotate&&this.GolfState.value==2){
          if(this.BasePosition.x==this.FBasePosition.x&&this.BasePosition.y==this.FBasePosition.y){
          } else {
            this.GolfMove();
            this.GolfState.value=0;
            gsap.delayedCall(.6,()=>{
              this.MiniGolf(); 
            });
          }
        }
      }
    });
  }

  isGolfing = () => {
    this.Golfing=true;
    this.GolfState.value=2;
    this.scene.add(this.GolfString);
    gsap.set('.circle .innerCircle',{css:{strokeDashoffset: 0}});
    gsap.set('.svg-line',{css:{opacity:1}});
  }

  private GolfCMaterial:CANNON.Material;
  private GolfStageMaterial:CANNON.Material;
  private GoalMaterial:CANNON.Material;
  InitGolfCannon(){
    this.world02 = new CANNON.World();
    this.world02.gravity.set(0, 0, 0);


    this.GolfCMaterial = new CANNON.Material("GolfCMaterial");
    this.GoalMaterial = new CANNON.Material("GoalMaterial");
    this.GolfStageMaterial = new CANNON.Material("GolfStageMaterial");
    this.PlaneMaterial = new CANNON.Material("PlaneMaterial");

    // let Contact = new CANNON.ContactMaterial(this.GolfCMaterial,this.PlaneMaterial,{
    //   // friction:0.01,
    //   restitution:0.3,
    // });
    // this.world02.addContactMaterial(Contact);

    // // Golf stage
    
    // Contact = new CANNON.ContactMaterial(this.GolfCMaterial,this.GolfStageMaterial,{
    //   // friction: 0.5,
    //   restitution: 0.3,
    // });
    // this.world02.addContactMaterial(Contact);
    this.debugger = new CannonDebugRenderer(this.scene, this.world02);

    // First time
    if(this.GolfClone==null){

      // Create material once time
      let white = this.textureLoader.load('assets/matcaps/white.png',()=>{
        white.encoding=THREE.sRGBEncoding;
      });
      // white
      let mate = new THREE.MeshMatcapMaterial({
        color:0xffffff,
        matcap:white,
      })

      // THREE
      this.GolfClone = new THREE.Mesh(
        new THREE.SphereBufferGeometry(.09,16,16),
        mate
      )
      this.GolfClone.position.set(0,6,0)
    }


    gsap.delayedCall(2,() => {

      this.MiniGolf()

      this.world02.gravity.set(0, -10, 0);
    });

  }



  
  private FBasePosition=new THREE.Vector2();
  GolfBegin(){
    this.FBvec.copy(this.LBvec);
    this.FBasePosition.copy(this.BasePosition);
  }

  
  private GolfString:THREE.Object3D;
  private GolfDistance:number;
  private GolfPercent:number;
  RenderGolfCursor(){
    if(this.GolfCannons[this.GolfN] && this.Golfing){
      this.FBpos=this.GolfCannons[this.GolfN].position;
      var Multiplier = 1.2;
      this.LBpos.set(this.FBpos.x+((this.FBvec.x-this.LBvec.x)*Multiplier),this.FBpos.y,this.FBpos.z-((this.FBvec.y-this.LBvec.y)*Multiplier));

      this.GolfString.position.copy(this.FBpos);
      this.GolfString.lookAt(this.LBpos);


      this.GolfDistance = this.distanceVec2(this.FBpos.x,this.FBpos.z,this.LBpos.x,this.LBpos.z);

      var maxDistance = 4;
      
      this.GolfPercent = 270 - (this.GolfDistance/maxDistance * 100)*2.7;
      

      gsap.set('.circle',{css:{strokeDashoffset: this.GolfPercent > 0 ? this.GolfPercent : 0}});


      var angleRadians = 180 + (Math.atan2(this.BasePosition.y-this.FBasePosition.y,this.BasePosition.x-this.FBasePosition.x) * 180/Math.PI);
      gsap.set('#lgrad',{attr:{gradientTransform:"rotate("+angleRadians+" 0.5 0.5)"}});
      gsap.set('.svg-line .line',{attr:{x1:this.FBasePosition.x,y1:this.FBasePosition.y,x2:this.BasePosition.x,y2:this.BasePosition.y}});
    }
  }

  GolfMove(){
    let startPosition = new CANNON.Vec3(this.FBpos.x, 0, this.FBpos.z);
    let endPosition = new CANNON.Vec3(this.LBpos.x, 0, this.LBpos.z);

    // endPosition limit
    var maxDistance = 4;
    if(this.GolfDistance>maxDistance){
      var Line = new THREE.LineCurve3(new THREE.Vector3(startPosition.x,startPosition.y,startPosition.z),
        new THREE.Vector3(endPosition.x,endPosition.y,endPosition.z));
      var len = Line.getLengths();
      var numberI:number;
      var Vec3:THREE.Vector3;

      for(var i=0;i<len.length;i++){
        if(len[i]>maxDistance){
          numberI=i;
          break;
        }
      }

      Vec3 = Line.getPointAt(numberI/201);
      endPosition.set(Vec3.x,Vec3.y,Vec3.z);
    }


    let direction = new CANNON.Vec3();
    endPosition.vsub(startPosition, direction);

    let totalLength = this.distance(direction.x, direction.y, direction.z, 0, 0, 0);
    direction.normalize();

    let speed = totalLength / 0.225;
    if(speed<1){
      speed = 1;
    }

    direction.scale(speed, this.GolfCannons[this.GolfN].velocity);
    // this.GolfStateFunction();
  }
  private GolfState={value:0}; // 0 preparing 1 standby 2 damping

  // GolfStateFunction(){
  //   if(this.GolfState.value==0)
  //   gsap.delayedCall(.1,() => {
  //     if(Math.abs(this.GolfCannons[this.GolfN].angularVelocity.x)+Math.abs(this.GolfCannons[this.GolfN].angularVelocity.z) < 2 ){
  //       console.log('dingding')
  //       TweenLite.set(this.GolfState,{value:2});
  //       TweenLite.to(this.GolfCannons[this.GolfN],1,{linearDamping:.8,angularDamping:.8});
  //       TweenLite.set(this.GolfCannons[this.GolfN],{delay:1,linearDamping:.5,angularDamping:.5});
  //       TweenLite.set(this.GolfState,{delay:1,value:1});
  //     }
  //     this.GolfStateFunction();
  //   });
  //   console.log(Math.abs(this.GolfCannons[this.GolfN].angularVelocity.x)+Math.abs(this.GolfCannons[this.GolfN].angularVelocity.z))
  // }


  private GolfClone=null;
  private GolfN: number = 0;
  private MaxGolf: number = 2;
  MiniGolf(){
    // P
    var Position = new THREE.Vector3();
    Position.setFromMatrixPosition(this.StageThreeArray[0].matrixWorld);
    this.GolfN++;

    gsap.fromTo(this.GolfFlip[0].rotation,1,{x:0},{x:-Math.PI});

    if(this.GolfThrees.length<1){
      this.GolfN=0;
    }

    if(this.GolfThrees.length == this.MaxGolf){
      // if max
      if(this.GolfN==this.MaxGolf){
        this.GolfN=0;
      }
      this.ScoreFunction(this.GolfCannons[this.GolfN].position)
      this.GolfCannons[this.GolfN].collisionFilterMask=2;
      this.GolfCannons[this.GolfN].position.set(Position.x,Position.y - .6,Position.z);
      this.GolfCannons[this.GolfN].velocity.set(.09,6,-.18);
      this.GolfCannons[this.GolfN].angularVelocity.set(0,0,0);
      this.GolfState.value=0;
      gsap.delayedCall(.5,()=>{
        this.GolfCannons[this.GolfN].collisionFilterMask=1;
      })
      gsap.delayedCall(1,()=>{
        this.GolfState.value=1;
      })

    } else {
      // Create more Golf ball if length less than MaxGolf
      // CANNON
      let body = new CANNON.Body({mass:1,material:this.GolfCMaterial})
      body.linearDamping = .5;
      body.angularDamping = .5;
      body.addShape(new CANNON.Sphere(.09));
      this.world02.addBody(body)
      this.GolfCannons[this.GolfN] = body;


      body.collisionFilterMask=2;
      body.position.set(Position.x,Position.y - .6,Position.z);
      body.velocity.set(.09,6,-.18);
      this.GolfState.value=0;
      gsap.delayedCall(.5,()=>{
        body.collisionFilterMask=1;
      })
      gsap.delayedCall(1,()=>{
        this.GolfState.value=1;
      })


      // Collision
      body.addEventListener('collide',(e)=>{
        if(e.body.material.name=="GoalMaterial"){
          this.ScoreFunction(body.position)
        }
      });

      // THREE
      let Golf = this.GolfClone.clone();
      this.scene.add(Golf);
      this.GolfThrees[this.GolfN] = Golf;
      

      // SHADOW
      var texture = this.textureLoader.load('assets/shadow/Golf.png');

      let uniforms = {
        tShadow:{value:texture},
        uShadowColor:{value:new THREE.Color("#c0a68e")},
        uAlpha:{value:1}
      }
      let material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
        vertexShader:document.getElementById('vertexShader').textContent,
        fragmentShader:document.getElementById('fragmentShader').textContent})
        
      let shadow = new THREE.Mesh(new THREE.PlaneGeometry(1,1),material);
      shadow.rotation.set(-Math.PI/2,0,0)
      shadow.position.set(0,0,0);

      this.scene.add(shadow);
      this.GolfShadows[this.GolfN] = shadow;
    }
  }

  // 24 for each function call,3 material, 4 usage at the same time.
  private ScoreMax = 6*3*4;
  private ScoreCurrent = 0;
  private ScoreLast = 0;
  private CoinArray=[];
  private CoinCurrent = 0;
  CreateScoreMaterial(){
    // Score
    let Score01 = new THREE.Mesh(new THREE.BoxBufferGeometry(.05,.08,.005),
      new THREE.MeshMatcapMaterial({color:0xffffff,matcap:this.blue02,transparent:true}));
    let Score02 = new THREE.Mesh(new THREE.BoxBufferGeometry(.08,.05,.005),
      new THREE.MeshMatcapMaterial({color:0xffffff,matcap:this.red,transparent:true}));
    let Score03 = new THREE.Mesh(new THREE.BoxBufferGeometry(.05,.08,.005),
      new THREE.MeshMatcapMaterial({color:0xffffff,matcap:this.yellow,transparent:true}));
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
    //   new THREE.MeshMatcapMaterial({color:0xffffff,matcap:this.blue02,transparent:true}));
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
            matcap:this.yellow
          })
          let mate02 = new THREE.MeshMatcapMaterial({
            color:0xeeeeee,
            side:2,
            transparent:true,
            opacity:1,
            matcap:this.yellow
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

  private StageThreeArray=[];
  private StageCannnonArray=[];
  private GolfFlip=[];
  private GolfScore=[];
  GolfStageCannon(){

    let FlagMate = new THREE.MeshMatcapMaterial({
      color:0xec1c24,
      side:2,
      matcap:this.white,
      morphTargets:true,
    })

    let Stage = new THREE.Object3D();
    this.scene.add(Stage)
    Stage.position.set(10,0,-1.5);
    // Stage.scale.set(1.1,1.1,1.1);
    Stage.rotation.set(0*Math.PI/180,-25*Math.PI/180,0*Math.PI/180);

    let StageMaterial = new THREE.MeshBasicMaterial({transparent:true,opacity:0,color:0x2395dc})

    var texture = this.textureLoader.load('assets/shadow/Windmill01.png');

    let uniforms = {
      tShadow:{value:texture},
      uShadowColor:{value:new THREE.Color("#c0a68e")},
      uAlpha:{value:1}
    }
    let material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})

      
    let StageShadow = new THREE.Mesh(new THREE.PlaneGeometry(10,10),material);
    StageShadow.rotation.set(-Math.PI/2,0,0)
    StageShadow.position.set(0,0,0);

    Stage.add(StageShadow);

    var texture02 = this.textureLoader.load('assets/shadow/Windmill02.png');
    let uniforms02 = {
      tShadow:{value:texture02},
      uShadowColor:{value:new THREE.Color("#c0a68e")},
      uAlpha:{value:1}
    }
    let material02 = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms:uniforms02,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})

      
    let StageShadow02 = new THREE.Mesh(new THREE.PlaneGeometry(10,10),material02);
    StageShadow02.rotation.set(-Math.PI/2,0,0)
    StageShadow02.position.set(0,-.2,0);

    Stage.add(StageShadow02);


    
    var texture03 = this.textureLoader.load('assets/shadow/Windmill03.png');
    let uniforms03 = {
      tShadow:{value:texture03},
      uShadowColor:{value:new THREE.Color("#000000")},
      uAlpha:{value:.08}
    }
    let material03 = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms:uniforms03,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})

      
    let StageShadow03 = new THREE.Mesh(new THREE.PlaneGeometry(3,3),material03);
    StageShadow03.rotation.set(0*Math.PI/180,0,0)
    StageShadow03.scale.set(.5,.5,1)
    StageShadow03.position.set(0,1.2,.48);

    Stage.add(StageShadow03);

    let StageShadow0302 = StageShadow03.clone();
    Stage.add(StageShadow0302);

    let StageShadow0303 = StageShadow03.clone();
    Stage.add(StageShadow0303);

    let StageShadow0304 = StageShadow03.clone();
    Stage.add(StageShadow0304);


    this.loader.load(
      'assets/model/Windmill04.glb',
      (gltf) => {
        let stage = gltf.scene;
        stage.position.set(10,0,-1.5);
        // stage.scale.set(1.1,1.1,1.1);
        stage.rotation.set(0*Math.PI/180,-25*Math.PI/180,0)
        for(var i=0;i<stage.children.length;i++){
          if(stage.children[""+i+""].name == "Windmill"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.white
            })
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.blue02
            })
            stage.children[""+i+""].children[0].material=mate01;
            stage.children[""+i+""].children[1].material=mate02;
          } else if (stage.children[""+i+""].name == "Goal"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.green01
            })
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.wood
            })
            stage.children[""+i+""].children[0].material=mate01;
            stage.children[""+i+""].children[1].material=mate02;
          } else if (stage.children[""+i+""].name == "Fan"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.blue02
            })
            stage.children[""+i+""].material=mate01;
            let wmthree = new THREE.Mesh();
            wmthree.rotation.set(0,-23*Math.PI/180,-31.5*Math.PI/180)
            this.windmillthree.push(wmthree);

            gsap.fromTo(stage.children[""+i+""].rotation,10,{y:0},{y:-Math.PI*2,ease:"none",repeat:-1})
            gsap.fromTo(wmthree.rotation,10,{z:-31.5*Math.PI/180},{z:-31.5*Math.PI/180-Math.PI*2,ease:"none",repeat:-1})

            gsap.fromTo(StageShadow03.rotation,10,{z:0*Math.PI/180},{z:-360*Math.PI/180,ease:"none",delay:.3,repeat:-1})
            var ShadowTween = gsap.timeline({repeat:-1,delay:.3,repeatDelay:2.5});
            ShadowTween.to(StageShadow03.scale,.75,{x:1,y:1,ease:"none",})
            ShadowTween.to(StageShadow03.scale,.75,{x:.3,y:.3,ease:"none",delay:.75})
            ShadowTween.to(StageShadow03.scale,1.75,{x:.45,y:.45,ease:"none",delay:3})
            ShadowTween.to(StageShadow03.scale,.5,{x:.5,y:.5,ease:"none",})


            gsap.fromTo(StageShadow0302.rotation,10,{z:0*Math.PI/180},{z:-360*Math.PI/180,ease:"none",delay:2.8,repeat:-1})
            var ShadowTween02 = gsap.timeline({repeat:-1,delay:2.8,repeatDelay:2.5});
            ShadowTween02.to(StageShadow0302.scale,.75,{x:1,y:1,ease:"none",})
            ShadowTween02.to(StageShadow0302.scale,.75,{x:.3,y:.3,ease:"none",delay:.75})
            ShadowTween02.to(StageShadow0302.scale,1.75,{x:.45,y:.45,ease:"none",delay:3})
            ShadowTween02.to(StageShadow0302.scale,.5,{x:.5,y:.5,ease:"none"})

            gsap.fromTo(StageShadow0303.rotation,10,{z:0*Math.PI/180},{z:-360*Math.PI/180,ease:"none",delay:5.3,repeat:-1})
            var ShadowTween03 = gsap.timeline({repeat:-1,delay:5.3,repeatDelay:2.5});
            ShadowTween03.to(StageShadow0303.scale,.75,{x:1,y:1,ease:"none",})
            ShadowTween03.to(StageShadow0303.scale,.75,{x:.3,y:.3,ease:"none",delay:.75})
            ShadowTween03.to(StageShadow0303.scale,1.75,{x:.45,y:.45,ease:"none",delay:3})
            ShadowTween03.to(StageShadow0303.scale,.5,{x:.5,y:.5,ease:"none"})

            gsap.fromTo(StageShadow0304.rotation,10,{z:0*Math.PI/180},{z:-360*Math.PI/180,ease:"none",delay:7.8,repeat:-1})
            var ShadowTween04 = gsap.timeline({repeat:-1,delay:7.8,repeatDelay:2.5});
            ShadowTween04.to(StageShadow0304.scale,.75,{x:1,y:1,ease:"none",})
            ShadowTween04.to(StageShadow0304.scale,.75,{x:.3,y:.3,ease:"none",delay:.75})
            ShadowTween04.to(StageShadow0304.scale,1.75,{x:.45,y:.45,ease:"none",delay:3})
            ShadowTween04.to(StageShadow0304.scale,.5,{x:.5,y:.5,ease:"none"})
          } else if (stage.children[""+i+""].name == "Bench"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.wood
            })
            stage.children[""+i+""].material=mate01;
          } else if (stage.children[""+i+""].name == "Wall"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.blue02
            })
            stage.children[""+i+""].material=mate01;
          } else if (stage.children[""+i+""].name == "Bush"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.green01
            })
            stage.children[""+i+""].material=mate01;
          } else if (stage.children[""+i+""].name == "Tree"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.green01
            })
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.wood
            })
            stage.children[""+i+""].children[0].material=mate01;
            stage.children[""+i+""].children[1].material=mate02;
          }  else if (stage.children[""+i+""].name == "Flip"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.green01
            })
            stage.children[""+i+""].material=mate01;
            this.GolfFlip.push(stage.children[""+i+""]);
          } else if (stage.children[""+i+""].name == "Start"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.green01
            })
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.wood
            })
            stage.children[""+i+""].children[0].material=mate02;
            stage.children[""+i+""].children[1].material=mate01;
          } else if (stage.children[""+i+""].name == "Rock"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.white
            })
            stage.children[""+i+""].material=mate01;
          } else if (stage.children[""+i+""].name == "Window"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.white
            })
            stage.children[""+i+""].material=mate01;
          } else if (stage.children[""+i+""].name == "Pole"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,
              matcap:this.white
            })
            stage.children[""+i+""].material=mate01;
          } else {
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,
              side:2,  
              matcap:this.white
            })
            stage.children[""+i+""].material=mate01;
          }
        }
        this.scene.add(stage);
      }
    );

    this.loader.load(
      'assets/model/Flag001.glb',
      (gltf) => {
        let flag = gltf;

        this.FlagMixer = new THREE.AnimationMixer(flag.scene);
        this.FlagMixer.timeScale = 1;

        let animation = this.FlagMixer.clipAction(flag.animations[0]);
        animation.play();

        flag.scene.children[0].scale.set(1,1,1);
        flag.scene.children[0].position.set(0,0,0);

        // flag.scene.children["0"].material.emissive.color=
        // console.log(flag.scene.children["0"].material)
        flag.scene.children["0"].material=FlagMate;
        flag.scene.position.set(.38,.75,-2);

        Stage.add(flag.scene);
      }
    );

    var sizeX = .8;
    var sizeY = .01;
    var sizeZ = .6;

    let CG01 = {
      x:0,
      y:-.011,
      z:2.875+.2,
      Rx:0,
      Ry:0,
      Rz:0,
    }

    // THREE 01 
    let Cube01 = new THREE.Mesh(new THREE.BoxBufferGeometry(sizeX*2,sizeY*2,sizeZ*2),StageMaterial);
    Cube01.position.set(CG01.x,CG01.y,CG01.z);
    Cube01.rotation.set(CG01.Rx*Math.PI/180,CG01.Ry*Math.PI/180,CG01.Rz*Math.PI/180)
    Stage.add(Cube01);
    this.StageThreeArray.push(Cube01);
    
    // CANNON 01
    let Cube001 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    Cube001.addShape(new CANNON.Box(new CANNON.Vec3(sizeX,sizeY,sizeZ)),new CANNON.Vec3(0,0,-.2));
    Cube001.addShape(new CANNON.Box(new CANNON.Vec3(sizeX*.08,.07,sizeZ*.5)),new CANNON.Vec3(-sizeX,.04,-.3-.2));
    Cube001.addShape(new CANNON.Box(new CANNON.Vec3(sizeX*.08,.07,sizeZ*.5)),new CANNON.Vec3(sizeX,.04,-.3-.2));
    var shape = this.CreateCANNONCirclePlane(0,.12,.73,0*Math.PI/180,180*Math.PI/180,20);
    Cube001.addShape(shape,new CANNON.Vec3(0,0,-.13-.2))

    this.world02.addBody(Cube001)
    this.StageCannnonArray.push(Cube001)


    sizeX = .8;
    sizeY = .01;
    sizeZ = 1.4;

    let CG02 = {
      x:0,
      y:-.011,
      z:.875,
      Rx:0,
      Ry:0,
      Rz:0,
    }

    // THREE 02 
    let Cube02 = new THREE.Mesh(new THREE.BoxBufferGeometry(sizeX*2,sizeY*2,sizeZ*2),StageMaterial);
    Cube02.position.set(CG02.x,CG02.y,CG02.z);
    Cube02.rotation.set(CG02.Rx*Math.PI/180,CG02.Ry*Math.PI/180,CG02.Rz*Math.PI/180)
    Stage.add(Cube02);
    this.StageThreeArray.push(Cube02);
    
    // CANNON 02
    let Cube002 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    Cube002.addShape(new CANNON.Box(new CANNON.Vec3(sizeX,sizeY,sizeZ)),new CANNON.Vec3(0,0,0));
    Cube002.addShape(new CANNON.Box(new CANNON.Vec3(sizeX*.08,.07,sizeZ)),new CANNON.Vec3(-sizeX,.04,0));
    Cube002.addShape(new CANNON.Box(new CANNON.Vec3(sizeX*.08,.07,sizeZ)),new CANNON.Vec3(sizeX,.04,0));
    this.world02.addBody(Cube002)
    this.StageCannnonArray.push(Cube002)
    

    sizeX = .14;
    sizeY = .1;
    sizeZ = .035;

    let CG03 = {
      x:0,
      y:.1,
      z:0,
      Rx:0,
      Ry:0,
      Rz:0,
    }

    // THREE 03 
    let Cube03 = new THREE.Mesh(new THREE.BoxBufferGeometry(sizeX*2,sizeY*2,sizeZ*2),StageMaterial);
    Cube03.position.set(CG03.x,CG03.y,CG03.z);
    Cube03.rotation.set(CG03.Rx*Math.PI/180,CG03.Ry*Math.PI/180,CG03.Rz*Math.PI/180)
    Stage.add(Cube03);
    this.StageThreeArray.push(Cube03);
    
    // CANNON 03
    let Cube003 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    Cube003.addShape(new CANNON.Box(new CANNON.Vec3(sizeX,sizeY,sizeZ)),new CANNON.Vec3(-.6,0,0));
    Cube003.addShape(new CANNON.Box(new CANNON.Vec3(sizeX,sizeY,sizeZ)),new CANNON.Vec3(.6,0,0));
    this.world02.addBody(Cube003)
    this.StageCannnonArray.push(Cube003)


    sizeX = .16;
    sizeY = .1;
    sizeZ = .025;

    let CG04 = {
      x:0,
      y:0,
      z:0,
      Rx:0,
      Ry:0,
      Rz:0,
    }
    // THREE 04 
    let Cube04 = new THREE.Mesh(new THREE.BoxBufferGeometry(sizeX*2,sizeY*2,sizeZ*2),StageMaterial);
    Cube04.position.set(CG04.x,CG04.y,CG04.z);
    Cube04.rotation.set(CG04.Rx*Math.PI/180,CG04.Ry*Math.PI/180,CG04.Rz*Math.PI/180)
    Stage.add(Cube04);
    this.StageThreeArray.push(Cube04);
    

    // CANNON 04
    var quat = new CANNON.Quaternion();

    let quatThree = new THREE.Mesh;
    quatThree.rotation.set(-Math.PI/2,0,108*Math.PI/180);
    quat.set(quatThree.quaternion.x,quatThree.quaternion.y,quatThree.quaternion.z,quatThree.quaternion.w)
    quat.normalize();

    let Cube004 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    
    var shape = this.CannonHalfCylinder(.44,.47,.3,6,.96);
    Cube004.addShape(shape,new CANNON.Vec3(0,.15,0),quat);


    quatThree.rotation.set(-Math.PI/2,0,(108+180)*Math.PI/180);
    quat.set(quatThree.quaternion.x,quatThree.quaternion.y,quatThree.quaternion.z,quatThree.quaternion.w)
    quat.normalize();

    var shape = this.CannonHalfCylinder(.44,.47,.3,6,.96);
    Cube004.addShape(shape,new CANNON.Vec3(0,.15,0),quat);


    // Cube004.addShape(new CANNON.Box(new CANNON.Vec3(.02,.4,.13)),new CANNON.Vec3(.15,.15,0));
    // Cube004.addShape(new CANNON.Box(new CANNON.Vec3(.02,.4,.13)),new CANNON.Vec3(-.15,.15,0));

    var quat = new CANNON.Quaternion(.5,0,0,-.5);
    quat.normalize();

    Cube004.addShape(new CANNON.Cylinder(.3,.4,1,8),new CANNON.Vec3(0,.8,0),quat);
    Cube004.addShape(new CANNON.Cylinder(.38,.38,.12,8),new CANNON.Vec3(0,1.2,0),quat);
    Cube004.addShape(new CANNON.Cylinder(.1,.42,.4,8),new CANNON.Vec3(0,1.5,0),quat);

    this.world02.addBody(Cube004)
    this.StageCannnonArray.push(Cube004)




    sizeX = .142;
    sizeY = .42;
    sizeZ = .03;

    let CG05 = {
      x:0,
      y:1.2,
      z:.48,
      Rx:0,
      Ry:0,
      Rz:0,
    }
    // THREE 05
    let Cube05 = new THREE.Mesh(new THREE.BoxBufferGeometry(sizeX*2,sizeY*2,sizeZ*2),StageMaterial);
    Cube05.position.set(CG05.x,CG05.y,CG05.z);
    Cube05.rotation.set(CG05.Rx*Math.PI/180,CG05.Ry*Math.PI/180,CG05.Rz*Math.PI/180);
    Stage.add(Cube05);
    this.StageThreeArray.push(Cube05);

    // CANNON 05
    let Cube005 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    Cube005.addShape(new CANNON.Box(new CANNON.Vec3(sizeX,sizeY,sizeZ)),new CANNON.Vec3(-.128,-.68,0));
    Cube005.addShape(new CANNON.Box(new CANNON.Vec3(sizeX,sizeY,sizeZ)),new CANNON.Vec3(.128,.68,0));
    Cube005.addShape(new CANNON.Box(new CANNON.Vec3(sizeY,sizeX,sizeZ)),new CANNON.Vec3(.68,-.128,0));
    Cube005.addShape(new CANNON.Box(new CANNON.Vec3(sizeY,sizeX,sizeZ)),new CANNON.Vec3(-.68,.128,0));
    this.windmillcannon.push(Cube005);
    this.world02.addBody(Cube005);
    this.StageCannnonArray.push(Cube005);


    sizeX = .15;
    sizeY = .2;
    sizeZ = .15;

    let CG06 = {
      x:0,
      y:0,
      z:-1.97,
      Rx:0,
      Ry:0,
      Rz:0,
    }
    // THREE 06
    let Cube06 = new THREE.Mesh(new THREE.BoxBufferGeometry(sizeX*2,sizeY*2,sizeZ*2),StageMaterial);
    Cube06.position.set(CG06.x,CG06.y,CG06.z);
    Cube06.rotation.set(CG06.Rx*Math.PI/180,CG06.Ry*Math.PI/180,CG06.Rz*Math.PI/180);
    Stage.add(Cube06);
    this.StageThreeArray.push(Cube06);

    // CANNON 06
    let Cube006 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    var shape = this.CreateCANNONCirclePlane(0,.12,1.6,118*Math.PI/180,425*Math.PI/180,20);
    Cube006.addShape(shape,new CANNON.Vec3(0,0,-.01));
    var shape = this.CreateCANNONPlane(0,1.8,.25,0,0*Math.PI/180,380*Math.PI/180,20);
    Cube006.addShape(shape,new CANNON.Vec3(0,0,0));
    var shape = this.CreateCANNONCirclePlane(0,.2,.25,0*Math.PI/180,380*Math.PI/180,10);
    Cube006.addShape(shape,new CANNON.Vec3(0,-.2,0));

    var quat = new CANNON.Quaternion(.5,0,0,.5);
    quat.normalize();
    Cube006.addShape(new CANNON.Cylinder(.025,.025,1,6),new CANNON.Vec3(0,0.25,0),quat);
    this.world02.addBody(Cube006);
    this.StageCannnonArray.push(Cube006);
    

    sizeX = .15;
    sizeY = .2;
    sizeZ = .15;

    let CG07 = {
      x:0,
      y:0,
      z:-1.97,
      Rx:0,
      Ry:0,
      Rz:0,
    }
    // THREE 07
    let Cube07 = new THREE.Mesh(new THREE.BoxBufferGeometry(sizeX*2,sizeY*2,sizeZ*2),StageMaterial);
    Cube07.position.set(CG07.x,CG07.y,CG07.z);
    Cube07.rotation.set(CG07.Rx*Math.PI/180,CG07.Ry*Math.PI/180,CG07.Rz*Math.PI/180);
    Stage.add(Cube07);
    this.StageThreeArray.push(Cube07);

    // CANNON 07
    let Cube007 = new CANNON.Body({mass:0,material:this.GoalMaterial});

    var quat = new CANNON.Quaternion(.5,0,0,.5);
    quat.normalize();
    Cube007.addShape(new CANNON.Box(new CANNON.Vec3(.25,.25,.1)),new CANNON.Vec3(0,-0.25,0),quat);
    this.world02.addBody(Cube007);
    this.StageCannnonArray.push(Cube007);
    
    gsap.delayedCall(1,()=>{
      this.SetStageCannonPosition();
    })
  }

  SetStageCannonPosition(){
    var Position = new THREE.Vector3();
    var Quaternion = new THREE.Quaternion();
    for(var i=0;i<this.StageThreeArray.length;i++){
      // P
      Position.setFromMatrixPosition(this.StageThreeArray[i].matrixWorld);
      this.StageCannnonArray[i].position.set(Position.x,Position.y,Position.z);

      // Q
      Quaternion.setFromRotationMatrix(this.StageThreeArray[i].matrixWorld)
      this.StageCannnonArray[i].quaternion.set(Quaternion.x,Quaternion.y,Quaternion.z,Quaternion.w);
    }
  }

  CannonHalfCylinder( radiusTop, radiusBottom, height , numSegments, pie ) {
    var N = numSegments,
        verts = [],
        axes = [],
        faces = [],
        bottomface = [],
        topface = [],
        
        cos = Math.cos,
        sin = Math.sin;

    // First bottom point
    verts.push(new CANNON.Vec3(radiusBottom*cos(0),
                               radiusBottom*sin(0),
                               -height*0.5));
    bottomface.push(0);

    // First top point
    verts.push(new CANNON.Vec3(radiusTop*cos(0),
                               radiusTop*sin(0),
                               height*0.5));
    topface.push(1);

    for(var i=0; i<N; i++){
        var theta = Math.PI*pie/N * (i+1);
        var thetaN = Math.PI*pie/N * (i+0.5);
        if(i<N-1){
            // Bottom
            verts.push(new CANNON.Vec3(radiusBottom*cos(theta),
                                       radiusBottom*sin(theta),
                                       -height*0.5));
            bottomface.push(2*i+2);
            // Top
            verts.push(new CANNON.Vec3(radiusTop*cos(theta),
                                       radiusTop*sin(theta),
                                       height*0.5));
            topface.push(2*i+3);

            // Face
            faces.push([2*i+2, 2*i+3, 2*i+1,2*i]);
        } else {
            faces.push([0,1, 2*i+1, 2*i]); // Connect
        }

        // Axis: we can cut off half of them if we have even number of segments
        if(N % 2 === 1 || i < N / 2){
            axes.push(new CANNON.Vec3(cos(thetaN), sin(thetaN), 0));
        }
    }
    faces.push(topface);
    axes.push(new CANNON.Vec3(0,0,1));

    // Reorder bottom face
    var temp = [];
    for(var i=0; i<bottomface.length; i++){
        temp.push(bottomface[bottomface.length - i - 1]);
    }
    faces.push(temp);

    var shape = new CANNON.ConvexPolyhedron( verts, faces);
    return shape;
  }

  CreateCANNONCirclePlane(H1:number,H2:number,radius:number,N0:number,N:number,Ni:number){
    var vertTest=[];
    var number=0;
    for(var i=N0;i<N;i+=Math.PI/Ni){
      if(number%2==0){
        vertTest.push(new CANNON.Vec3(Math.cos(i)*radius,H1,Math.sin(i)*radius));
      } else {
        vertTest.push(new CANNON.Vec3(Math.cos(i)*radius,H2,Math.sin(i)*radius));
      }
      number++;
    }
    var faceTest=[];
    faceTest.push([0,2,1]);
    faceTest.push([1,2,3]);// 2
    faceTest.push([3,2,4]);
    var zero=3,one=4,two=5;
    for(var i=0;i<vertTest.length-2-3;i++){
      if(i%2==0){
        faceTest.push([zero,one,two]);
      } else {
        faceTest.push([one,zero,two]);
      }
      zero++;
      one++;
      two++;
    }

    var cannonShape = new CANNON.ConvexPolyhedron(vertTest,faceTest);
    return cannonShape;
  }

  CreateCANNONPlane(H:number,Oradius:number,Iradius:number,Hminus:number,N0:number,N:number,Ni:number){
    var vertTest=[];
    var number=0;
  
    for(var i=N0;i<N;i+=Math.PI/Ni){
      if(number%2==0){
        H-=Hminus;
        vertTest.push(new CANNON.Vec3(Math.cos(-i)*Oradius,H,Math.sin(-i)*Oradius));
      } else {
        vertTest.push(new CANNON.Vec3(Math.cos(-i)*Iradius,H,Math.sin(-i)*Iradius));
      }
      number++;
    }
    var faceTest=[];
    faceTest.push([0,2,1]);
    faceTest.push([1,2,3]);// 2
    faceTest.push([3,2,4]);
    var zero=3,one=4,two=5;
    for(var i=0;i<vertTest.length-2-3;i++){
      if(i%2==0){
        faceTest.push([zero,one,two]);
      } else {
        faceTest.push([one,zero,two]);
      }
      zero++;
      one++;
      two++;
    }

    var cannonShape = new CANNON.ConvexPolyhedron(vertTest,faceTest);
    return cannonShape;
  }


  MiniGolfRender(){
    this.world02.step(1 / this.fps);
    // this.debugger.update();
    for (var i = 0; i < this.GolfThrees.length; i++) {
      this.GolfThrees[i].position.copy(this.GolfCannons[i].position);
      this.GolfThrees[i].quaternion.copy(this.GolfCannons[i].quaternion);
      this.GolfShadows[i].position.set(this.GolfCannons[i].position.x,this.GolfCannons[i].position.y-0.08,this.GolfCannons[i].position.z);
      if(Math.abs(this.GolfCannons[i].position.y)>0.3){
        this.GolfShadows[i].material.uniforms.uAlpha.value = 0;
      } else {
        this.GolfShadows[i].material.uniforms.uAlpha.value = (.3 - this.GolfCannons[i].position.y)*5;
      }
    }
    // windmill
    if(this.windmillthree.length>0){
      this.windmillcannon[0].quaternion.copy(this.windmillthree[0].quaternion);
    }

    if(this.GolfState.value==2){
      this.RenderGolfCursor();
    }

    // this.CameraVec.setFromMatrixPosition(this.CameraPos.matrixWorld);
    // this.camera.position.lerp(this.CameraVec, 1);
    // this.camera.lookAt(this.GolfC.position.x,this.GolfC.position.y,this.GolfC.position.z)
  }



  // THIRD SCENE SETUP
  ThirdInit(){
    this.InitThirdWorld();
    this.CreateScoreMaterial();
    this.BOOPMaterial();
    this.CreateGiftBalloon(-5,3,-1);
    this.CreateGiftBalloon(-2,2.7,0);
    this.CreateGiftBalloon(2,2.5,.5);

    this.CreateIsland(0,-0.075,-.5);
    this.canvas.addEventListener("click", throttle(
      () => {
      this.ThirdClickEvent();
      },600));

    this.canvas.addEventListener("touchmove", throttle(
      () => {
      this.ThirdClickEvent();
      },600));
  }


  private IslandRock:THREE.Object3D;
  private Island:THREE.Object3D;
  private Tent:THREE.Object3D;
  private House:THREE.Object3D;
  private Hammer:THREE.Object3D;
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
        this.House.scale.set(ScaleMultiplier,ScaleMultiplier,ScaleMultiplier);
        this.House.position.set(Ix-.1,Iy,Iz);
        // this.scene.add(this.House);
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
          } else if(this.House.children[""+i+""].name=="Door"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:wood,transparent:true,opacity:mateOpacity,
            });
            this.House.children[""+i+""].children[0].material=mate01;
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xeeeeee,side:2,matcap:wood,transparent:true,opacity:mateOpacity,
            });
            this.House.children[""+i+""].children[1].material=mate02;
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
          } else if(this.House.children[""+i+""].name=="Lamp"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:white,transparent:true,opacity:mateOpacity,
            });
            this.House.children[""+i+""].children[0].material=mate01;
            let mate02 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:wood,transparent:true,opacity:mateOpacity,
            });
            this.House.children[""+i+""].children[1].material=mate02;
          } else if(this.House.children[""+i+""].name=="SmokePipe"){
            let mate01 = new THREE.MeshMatcapMaterial({
              color:0xffffff,side:2,matcap:wood,transparent:true,opacity:mateOpacity,
            });
            this.House.children[""+i+""].material=mate01;
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



  private SmokeTexture = [];
  private SmokeTexture02 = [];
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

    var texture = this.textureLoader.load('assets/shadow/Smoke02.png');
  
    var uniforms = {
      tShadow:{value:texture},
      uShadowColor:{value:new THREE.Color("#eeeeee")},
      uAlpha:{value:.4}
    }
    var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})
      
    var Shadow = new THREE.Mesh(new THREE.PlaneGeometry(2,2),material);
    Shadow.rotation.set(0,0,0)
    Shadow.position.set(Ix,Iy+.85,Iz+.75);
    Shadow.renderOrder=2;

    let ExplosionTextureNum=0;
    // center
    for(var i=0;i<3;i++){
      let shadow = Shadow.clone();
      this.scene.add(shadow);
      this.SmokeTexture.push(shadow);

      // Scale
      gsap.fromTo(this.SmokeTexture[i].scale,1,{x:.4,y:.4,z:.4},{x:1.2,y:1.2,z:1.2,ease:"none"});

      // Rotation
      gsap.fromTo(this.SmokeTexture[i].rotation,4,{z:Math.random()*3.15},{z:"+="+(Math.random()*40-20),ease:"none"})
      
      // Explosion
      gsap.to(this.SmokeTexture[i].material.uniforms.uAlpha,.1,{value:1.5,delay:1.4,onComplete:()=>{
        // var max = ExplosionTextureNum+3;
        // for(var j=ExplosionTextureNum;j<max;j++){
        //   ExplosionTextureNum++
        //   this.scene.add(this.SmokeTexture02[j])

        //   gsap.fromTo(this.SmokeTexture02[j].scale,.3,{x:1,y:1,z:1},{x:.01,y:.01,z:.01,ease:"none"});

        //   // Position
        //   gsap.fromTo(this.SmokeTexture02[j].position,.3,{x:Math.random()*1-.5,y:.5,z:-.1},
        //     {x:"+="+(Math.random()*2.5-1.25),y:"+="+(Math.random()*1.5+.75),z:.3});
    
        //   // Rotation
        //   gsap.fromTo(this.SmokeTexture02[j].rotation,.5,{z:Math.random()*3.15},{z:"+="+(Math.random()*10-5),ease:"none"})
    
        //   let k = j;
        //   gsap.delayedCall(.6,()=>{
        //     this.scene.remove(this.SmokeTexture02[k]);
        //   })
        // }
      }});
      
      gsap.to(this.SmokeTexture[i].scale,.2,{x:1.8,y:1.8,z:1.8,delay:1.5});
      
      gsap.to(this.SmokeTexture[i].material.uniforms.uAlpha,.3,{value:0,delay:1.7,onComplete:()=>{
        this.SmokeTexture=[];
      }});
    }

    var uniforms = {
      tShadow:{value:texture},
      uShadowColor:{value:new THREE.Color("#f2f2f2")},
      uAlpha:{value:.7}
    }
    var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})
      
    var Shadow = new THREE.Mesh(new THREE.PlaneGeometry(2,2),material);
    Shadow.rotation.set(0,0,0)
    Shadow.position.set(Ix,Iy+.85,Iz+.75);

    // outer
    for(var i=0;i<15;i++){
      let shadow = Shadow.clone();
      this.scene.add(shadow);
      this.SmokeTexture02.push(shadow);

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
            matcap:this.red
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
            matcap:this.red
          })
          let mate03 = new THREE.MeshMatcapMaterial({
            color:0xfefefe,
            side:2,
            transparent:true,
            opacity:1,
            matcap:this.white
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
            matcap:this.red
          })
          let mate03 = new THREE.MeshMatcapMaterial({
            color:0xfefefe,
            side:2,
            transparent:true,
            opacity:1,
            matcap:this.white
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

      console.log(E.Box3d)
  
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


  private debugger;
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


  // SecondScene(): void {
  //   this.CreateSmoke();
  //   this.CreateFireExtinguisher();
  //   this.popIt();
  // }


  // private smoke = new THREE.MeshLambertMaterial({ color: 0x7f8eb8, emissive: 0xe0e0e0 });
  // CreateSmoke() {
  //   this.smokeThree = new THREE.Mesh(
  //     new THREE.SphereBufferGeometry(.068),
  //     this.smoke);
  //   this.smokeThree.castShadow = true;

  //   let stuff02 = {
  //     color: "#ff6262"
  //   }

  //   var f6 = this.gui.addFolder("boop");
  //   f6.addColor(stuff02, "color")
  //     .onChange(() => {
  //       boopMat.color.set(stuff02.color);
  //     })

  //   let stuff = {
  //     shininess: 0.7,
  //     specular: "#ffffff",
  //     color: "#7f8eb8",
  //     emissive: "#e0e0e0",
  //   }
  //   var f4 = this.gui.addFolder("SMOKE");
  //   f4.addColor(stuff, 'color')
  //     .onChange(() => {
  //       this.smoke.color.set(stuff.color);
  //     });
  //   f4.addColor(stuff, 'emissive')
  //     .onChange(() => {
  //       this.smoke.emissive.set(stuff.emissive);
  //     });
  // }

  // private pipem = new THREE.MeshLambertMaterial({ color: 0x4d67b1, emissive: 0xe1e1e1 });
  // CreateFireExtinguisher() {
  //   let stuff = {
  //     roughness: 0.7,
  //     metalness: 0.25,
  //     color: "#7f8eb8",
  //     emissive: "#d2d2d2",
  //   }
  //   var f3 = this.gui.addFolder("PIPE");
  //   f3.addColor(stuff, 'color')
  //     .onChange(() => {
  //       this.pipem.color.set(stuff.color);
  //     });
  //   f3.addColor(stuff, 'emissive')
  //     .onChange(() => {
  //       this.pipem.emissive.set(stuff.emissive);
  //     });


  //   let FEMaterial = new THREE.MeshStandardMaterial({ color: 0xcd7f7f, emissive: 0xcd5151, metalness: 0.25, roughness: 0.7, });
  //   let FEMaterial02 = new THREE.MeshStandardMaterial({ color: 0x4d67b1, emissive: 0xdcdcdc, metalness: 0.25, roughness: 0.7, });
  //   let N = 27;
  //   let lastBody = null;
  //   let distaince = .04;
  //   let x = 0;
  //   let height = .595;
  //   let pipeshape = new CANNON.Cylinder(.025, .025, .04, 8);
  //   let quat = new CANNON.Quaternion(0.5, 0, 0, -0.5);
  //   quat.normalize();
  //   for (var i = 0; i < N; i++) {
  //     var pipebody = new CANNON.Body({ mass: i == 0 ? 0 : 1 });
  //     pipebody.addShape(pipeshape, new CANNON.Vec3, quat);
  //     pipebody.position.set(i * distaince + x, height, 0);
  //     pipebody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);
  //     pipebody.angularDamping = 0.99;
  //     pipebody.linearDamping = 0.99;
  //     this.world02.addBody(pipebody);
  //     this.PipeCannon.push(pipebody);

  //     // let pipe3 = this.Pipe.clone();
  //     // this.PipeThree.push(pipe3);
  //     // this.scene.add(pipe3);

  //     if (lastBody !== null) {
  //       let c = new CANNON.LockConstraint(pipebody, lastBody);
  //       this.world02.addConstraint(c);
  //     }

  //     // Keep track of the lastly added body
  //     lastBody = pipebody;
  //   }

  //   // LAST PIPE
  //   this.lastpipe = new CANNON.Body({ mass: 1 });
  //   let cylinderShape = new CANNON.Cylinder(.06, .08, .16, 16);
  //   this.lastpipe.addShape(cylinderShape, new CANNON.Vec3, quat);


  //   this.lastpipe.position.set(N * distaince + x + 0.06, height, 0);
  //   this.lastpipe.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);
  //   this.lastpipe.angularDamping = 0.99;
  //   this.lastpipe.linearDamping = 0.99;

  //   this.world02.addBody(this.lastpipe);
  //   // this.PipeCannon.push(this.lastpipe);
  //   this.bodies02.push(this.lastpipe);

  //   let c = new CANNON.LockConstraint(this.lastpipe, lastBody);
  //   this.world02.addConstraint(c);

  //   // pipe part
  //   let lastpipegeometry = new THREE.CylinderBufferGeometry(.06, .08, .16, 16);
  //   let lastpipematerial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
  //   let lasspipethree = new THREE.Mesh(lastpipegeometry, lastpipematerial);
  //   lasspipethree.castShadow = true;
  //   let lastthreemesh = new THREE.Object3D();

  //   this.lastthreepipe = new THREE.Object3D();
  //   this.loader = new GLTFLoader();
  //   this.loader.load(
  //     'assets/model/pipe.glb',
  //     (gltf) => {
  //       lastthreemesh = gltf.scene;
  //       lastthreemesh.children["0"].material.copy(
  //         FEMaterial);
  //       this.lastthreepipe.add(lastthreemesh)
  //     }
  //   );


  //   let boxGeo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
  //   var invisible = new THREE.MeshBasicMaterial({ color: 0xf0f0f0, transparent: true, opacity: 0 });
  //   // smoke start
  //   this.FETap = new THREE.Mesh(boxGeo, invisible);
  //   this.FETap.position.set(0, 0, 0);
  //   // smoke end
  //   this.SmokePoint = new THREE.Mesh(boxGeo, invisible);
  //   this.SmokePoint.position.set(0, -1.5, 0);
  //   // reset point
  //   this.ResetPoint = new THREE.Mesh(boxGeo, invisible);
  //   this.ResetPoint.position.set(0, 0, 0);


  //   this.lastthreepipe.add(this.SmokePoint);
  //   this.lastthreepipe.add(this.ResetPoint);
  //   this.lastthreepipe.add(this.FETap);
  //   this.lastthreepipe.add(lasspipethree);

  //   this.scene.add(this.lastthreepipe);
  //   // this.PipeThree.push(this.lastthreepipe)
  //   this.meshes02.push(this.lastthreepipe)

  //   let febox = new THREE.CylinderBufferGeometry(0.06, 0.08, 0.16, 16);
  //   let Dragmaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
  //   // DRAG POINT THREE
  //   let DragPointThree = new THREE.Mesh(febox, Dragmaterial);
  //   DragPointThree.position.set(this.lastpipe.position.x, height, 0);
  //   DragPointThree.rotation.set(0, 0, Math.PI / 2);
  //   this.scene.add(DragPointThree);
  //   this.DragPointThree.push(DragPointThree);


  //   this.loader.load(
  //     // 'assets/model/extinguisher.glb',
  //     'assets/model/shitty.glb',
  //     (gltf) => {
  //       gltf.scene.traverse((node) => {
  //         if (node instanceof THREE.Mesh) {
  //           node.castShadow = true;
  //         }
  //       });
  //       this.FireExtinguisher = gltf.scene;
  //       this.FireExtinguisher.children["0"].children["0"].material.copy(
  //         FEMaterial);
  //       this.FireExtinguisher.children["0"].children["2"].material.copy(
  //         FEMaterial02);

  //       this.FETHREE.add(this.FireExtinguisher);
  //     }
  //   );
  //   this.FETHREE.position.set(-0.1, -0.3, 0);
  //   this.FETHREE.rotation.set(0 * Math.PI / 180, -15 * Math.PI / 180, 0 * Math.PI / 180);
  //   this.FETHREE.castShadow = true;
  //   this.scene.add(this.FETHREE);


  //   // CANNON FE
  //   var body = new CANNON.Body({ mass: 0 });
  //   var CylinderShape = new CANNON.Cylinder(0.3, 0.3, 1.24, 16);
  //   quat = new CANNON.Quaternion(0.5, 0, 0, -0.5);
  //   quat.normalize();

  //   let y = 0.2;
  //   let sphere = new CANNON.Sphere(0.3);
  //   let sphere2 = new CANNON.Sphere(0.063);

  //   let cylinder = new CANNON.Cylinder(0.063, 0.063, 0.165, 8);
  //   let cylinder02 = new CANNON.Cylinder(0.04, 0.04, 0.05, 8);
  //   let cylinder03 = new CANNON.Cylinder(0.063, 0.063, 0.025, 16);
  //   let top = 0.95;

  //   let box = new CANNON.Box(new CANNON.Vec3(0.18, 0.02, 0.05));
  //   let box02 = new CANNON.Box(new CANNON.Vec3(0.18, 0.02, 0.06));
  //   let box03 = new CANNON.Box(new CANNON.Vec3(0.05, 0.05, 0.01));
  //   let box04 = new CANNON.Box(new CANNON.Vec3(0.05, 0.025, 0.01));

  //   let box05 = new CANNON.Box(new CANNON.Vec3(0.08, 0.02, 0.06));

  //   let box06 = new CANNON.Box(new CANNON.Vec3(0.1, 0.01, 0.06));



  //   body.addShape(cylinder, new CANNON.Vec3(0, 0.7 + y, 0), quat);

  //   quat = new CANNON.Quaternion(0.5, 0.5, 0.5, 0.5);
  //   quat.normalize();
  //   body.addShape(cylinder02, new CANNON.Vec3(0.09, 0.694 + y, 0), quat);
  //   body.addShape(cylinder03, new CANNON.Vec3(-0.015, 0.7 + y, 0.075));
  //   quat = new CANNON.Quaternion(-0.07, 0.5, 0, 0);
  //   quat.normalize();

  //   body.addShape(box, new CANNON.Vec3(-0.28, 0.76 + y, 0), quat);

  //   quat = new CANNON.Quaternion(0.11, 0.5, 0, 0);
  //   quat.normalize();
  //   body.addShape(box02, new CANNON.Vec3(-0.07, 0.9 + y, 0), quat);

  //   body.addShape(box03, new CANNON.Vec3(-0.05, 0.84 + y, 0.05));
  //   body.addShape(box04, new CANNON.Vec3(0.05, 0.815 + y, 0.05));

  //   body.addShape(box03, new CANNON.Vec3(-0.05, 0.84 + y, -0.05));
  //   body.addShape(box04, new CANNON.Vec3(0.05, 0.815 + y, -0.05));

  //   body.addShape(box05, new CANNON.Vec3(-0.31, 0.98 + y, 0));

  //   body.addShape(box06, new CANNON.Vec3(0, 0.79 + y, 0));

  //   for (let i = 0; i < 4; i++) {
  //     body.addShape(sphere2, new CANNON.Vec3(0, top, 0));
  //     top -= 0.03;
  //   }

  //   let boxCy01 = new CANNON.Box(new CANNON.Vec3(0.025, 0.0275, 0.0275));
  //   quat = new CANNON.Quaternion(0.5, 0, 0, 0.25);
  //   quat.normalize();
  //   body.addShape(boxCy01, new CANNON.Vec3(0.09, 0.694 + y, 0), quat);
  //   body.addShape(boxCy01, new CANNON.Vec3(0.09, 0.694 + y, 0));

  //   let boxCy02 = new CANNON.Box(new CANNON.Vec3(0.045, 0.045, 0.015));
  //   body.addShape(boxCy02, new CANNON.Vec3(-0.015, 0.7 + y, 0.075));
  //   quat = new CANNON.Quaternion(0.5, 0.25, 0, 0);
  //   quat.normalize();
  //   body.addShape(boxCy02, new CANNON.Vec3(-0.015, 0.7 + y, 0.075), quat);


  //   quat = new CANNON.Quaternion(0.5, 0, 0, 0.5);
  //   quat.normalize();
  //   let cylinder04 = new CANNON.Cylinder(0.3, 0.26, 0.15, 16);
  //   let cylinder05 = new CANNON.Cylinder(0.26, 0.1, 0.15, 16);
  //   body.addShape(cylinder04, new CANNON.Vec3(0, 0.4 + y, 0), quat);
  //   body.addShape(cylinder05, new CANNON.Vec3(0, 0.54 + y, 0), quat);


  //   body.addShape(CylinderShape, new CANNON.Vec3(0, -.28 + y, 0), quat)

  //   top = 0.525;
  //   for (let i = 0; i < 25; i++) {
  //     body.addShape(sphere, new CANNON.Vec3(0, top, 0));
  //     top -= 0.05;
  //   }

  //   body.position.set(-0.1, -0.3, 0);
  //   this.world02.addBody(body);
  //   this.world.addBody(body);

  //   body.position.copy(new CANNON.Vec3(this.FETHREE.position.x, this.FETHREE.position.y, this.FETHREE.position.z));
  //   body.quaternion.copy(new CANNON.Quaternion(this.FETHREE.quaternion.x, this.FETHREE.quaternion.y, this.FETHREE.quaternion.z, this.FETHREE.quaternion.w));

  //   this.PipeCannon[0].position.set(0, 0.59, 0.02);
  //   this.CreateFirstDirectionPipe();

  //   var params = {
  //     roughness: 0.7,
  //     metalness: 0.25,
  //     color: "#ffffff",
  //     emissive: "#e65a5a",
  //   }

  //   var f1 = this.gui.addFolder("Fire Extinguisher");
  //   f1.add(params, 'metalness', 0, 1)
  //     .onChange(() => {
  //       FEMaterial.metalness = params.metalness;
  //       this.FireExtinguisher.children["0"].children["0"].material.copy(
  //         FEMaterial);
  //       lastthreemesh.children["0"].material.copy(
  //         FEMaterial);
  //     });
  //   f1.add(params, 'roughness', 0, 1)
  //     .onChange(() => {
  //       FEMaterial.roughness = params.roughness;
  //       this.FireExtinguisher.children["0"].children["0"].material.copy(
  //         FEMaterial);
  //       lastthreemesh.children["0"].material.copy(
  //         FEMaterial);
  //     });
  //   f1.addColor(params, 'color')
  //     .onChange(() => {
  //       FEMaterial.color.set(params.color);
  //       this.FireExtinguisher.children["0"].children["0"].material.copy(
  //         FEMaterial);
  //       lastthreemesh.children["0"].material.copy(
  //         FEMaterial);
  //     });
  //   f1.addColor(params, 'emissive')
  //     .onChange(() => {
  //       FEMaterial.emissive.set(params.emissive);
  //       this.FireExtinguisher.children["0"].children["0"].material.copy(
  //         FEMaterial);
  //       lastthreemesh.children["0"].material.copy(
  //         FEMaterial);
  //     });

  //   var f2 = this.gui.addFolder("Fire Extinguisher 02");
  //   f2.add(params, 'metalness', 0, 1)
  //     .onChange(() => {
  //       FEMaterial02.metalness = params.metalness;
  //       this.FireExtinguisher.children["0"].children["2"].material.copy(
  //         FEMaterial02);
  //     });
  //   f2.add(params, 'roughness', 0, 1)
  //     .onChange(() => {
  //       FEMaterial02.roughness = params.roughness;
  //       this.FireExtinguisher.children["0"].children["2"].material.copy(
  //         FEMaterial02);
  //     });
  //   f2.addColor(params, 'color')
  //     .onChange(() => {
  //       FEMaterial02.color.set(params.color);
  //       this.FireExtinguisher.children["0"].children["2"].material.copy(
  //         FEMaterial02);
  //     });
  //   f2.addColor(params, 'emissive')
  //     .onChange(() => {
  //       FEMaterial02.emissive.set(params.emissive);
  //       this.FireExtinguisher.children["0"].children["2"].material.copy(
  //         FEMaterial02);
  //     });
  // }

  // popIt() {
  //   // Fan
  //   let quat = new CANNON.Quaternion();
  //   quat = new CANNON.Quaternion(0.5, 0, 0, -0.5);
  //   quat.normalize();


  //   let stuffMaterial = new THREE.MeshLambertMaterial({ color: 0x7f8eb8, emissive: 0x506493 });
  //   let params = {
  //     roughness: 0.7,
  //     metalness: 0.25,
  //     color: "#7f8eb8",
  //     emissive: "#ffffff",
  //   }
  //   var f5 = this.gui.addFolder("Stuffs");
  //   f5.addColor(params, 'color')
  //     .onChange(() => {
  //       stuffMaterial.color.set(params.color);
  //     });
  //   f5.addColor(params, 'emissive')
  //     .onChange(() => {
  //       stuffMaterial.emissive.set(params.emissive);
  //     });


  //   quat = new CANNON.Quaternion(0.5, -0.5, 0.5, 0.5);
  //   let tempCannon = new CANNON.Body({ mass: 0 });
  //   let tempThree = new THREE.Mesh(new THREE.BoxBufferGeometry(.2, .1, .2));

  //   let collided = [];
  //   let unique = [];

  //   let boxX = .12;
  //   let boxY = .12;
  //   let boxZ = .04;


  //   setInterval(() => {
  //     if (document.hidden == true) {
  //     } else {
  //       if (this.meshes03.length > 11) {
  //         if (collided.length > 0) {
  //           unique = collided.filter(function (elem, index, self) {
  //             return index === self.indexOf(elem);
  //           })

  //           collided = unique;

  //           let segment = Math.floor(Math.random() * 4) + 3;
  //           if (segment == 6) {
  //             segment += 2;
  //           }

  //           let stuff = new CANNON.Body({ mass: 10 });
  //           let stuffShape = new CANNON.Box(new CANNON.Vec3(boxX, boxZ, boxY));
  //           stuff.addShape(stuffShape);
  //           stuff.position.set((Math.random() * 3) - 1.5, 2, (Math.random() * 0.4) + 0.8);
  //           this.world.addBody(stuff);

  //           let stuff3;
  //           if (segment == 8) {
  //             stuff3 = new THREE.Mesh(
  //               new THREE.CylinderBufferGeometry(boxX, boxY, boxZ * 2, 24),
  //               stuffMaterial);
  //           } else {
  //             stuff3 = new THREE.Mesh(
  //               new THREE.CylinderBufferGeometry(boxX, boxY, boxZ * 2, segment),
  //               stuffMaterial);
  //           }
  //           stuff3.castShadow = true;
  //           stuff3.scale.set(.1, .1, .1);
  //           TweenLite.to(stuff3.scale, 1.5, { x: 1, y: 1, z: 1, ease: Power0.easeNone })
  //           this.scene.add(stuff3);

  //           this.bodies03.splice(collided[0], 1, stuff);
  //           this.meshes03.splice(collided[0], 1, stuff3);
  //           var test02 = collided[0];

  //           stuff.addEventListener("collide", throttle((e) => {
  //             if (e.contact.bi.collisionFilterGroup == 2) {
  //               setTimeout(() => {
  //                 if (stuff3.scale.x > 0.2) {

  //                   stuff3.scale.x *= 0.85;
  //                   stuff3.scale.y *= 0.85;
  //                   stuff3.scale.z *= 0.85;

  //                   stuffShape.halfExtents.set(stuff3.scale.x * boxX, stuff3.scale.y * boxZ, stuff3.scale.z * boxY);
  //                   stuffShape.updateConvexPolyhedronRepresentation();
  //                 } else {
  //                   if (stuff) {
  //                     this.BOOP(stuff3.position.x, stuff3.position.y, stuff3.position.z);
  //                     this.world.remove(stuff);
  //                     this.scene.remove(stuff3);
  //                     this.meshes03.splice(test02, 1, tempCannon);
  //                     this.bodies03.splice(test02, 1, tempThree);
  //                     collided.push(test02);
  //                   }
  //                 }
  //               }, 50);
  //             }
  //           }, 50));
  //           collided.shift();
  //         }
  //       } else {
  //         let segment = Math.floor(Math.random() * 4) + 3;
  //         if (segment == 6) {
  //           segment += 2;
  //         }

  //         let stuff = new CANNON.Body({ mass: 10 });
  //         let stuffShape = new CANNON.Box(new CANNON.Vec3(boxX, boxZ, boxY));
  //         stuff.addShape(stuffShape);
  //         stuff.position.set((Math.random() * 3) - 1.5, 2, (Math.random() * 0.4) + 0.8);

  //         this.world.addBody(stuff);
  //         let stuff3;
  //         if (segment == 8) {
  //           stuff3 = new THREE.Mesh(
  //             new THREE.CylinderBufferGeometry(boxX, boxY, boxZ * 2, 24),
  //             stuffMaterial);
  //         } else {
  //           stuff3 = new THREE.Mesh(
  //             new THREE.CylinderBufferGeometry(boxX, boxY, boxZ * 2, segment),
  //             stuffMaterial);
  //         }
  //         stuff3.scale.set(.1, .1, .1);
  //         stuff3.castShadow = true;
  //         TweenLite.to(stuff3.scale, 1.5, { x: 1, y: 1, z: 1, ease: Power0.easeNone })
  //         this.scene.add(stuff3);

  //         this.bodies03.push(stuff);
  //         this.meshes03.push(stuff3);

  //         var test = this.bodies03.length - 1;
  //         stuff.addEventListener("collide", throttle((e) => {
  //           if (e.contact.bi.collisionFilterGroup == 2) {
  //             setTimeout(() => {
  //               if (stuff3.scale.x > 0.2) {

  //                 stuff3.scale.x *= 0.85;
  //                 stuff3.scale.y *= 0.85;
  //                 stuff3.scale.z *= 0.85;

  //                 stuffShape.halfExtents.set(stuff3.scale.x * boxX, stuff3.scale.y * boxZ, stuff3.scale.z * boxY);
  //                 stuffShape.updateConvexPolyhedronRepresentation();
  //               } else {
  //                 this.BOOP(stuff3.position.x, stuff3.position.y, stuff3.position.z);
  //                 this.world.remove(stuff);
  //                 this.scene.remove(stuff3);
  //                 this.meshes03.splice(test, 1, tempCannon);
  //                 this.bodies03.splice(test, 1, tempThree);
  //                 collided.push(test);
  //               }
  //             }, 50);
  //           }
  //         }, 50));
  //       }
  //     }
  //   }, 500)
  // }

  // CreateFirstDirectionPipe() {
  //   // DIRECTION PIPE
  //   this.directionPipe = new CANNON.Body({ mass: 5 });
  //   // let sphereshape = new CANNON.Box(new CANNON.Vec3(.05,.05,.05));
  //   let sphereshape = new CANNON.Sphere(.02);
  //   this.directionPipe.collisionFilterMask = 4;

  //   this.directionPipe.angularDamping = 0.1;
  //   this.directionPipe.linearDamping = 0.1;
  //   this.directionPipe.addShape(sphereshape);
  //   this.directionPipe.position.set(this.lastpipe.position.x, this.lastpipe.position.y, this.lastpipe.position.z);
  //   this.world02.addBody(this.directionPipe);
  //   this.FEcannon.push(this.directionPipe);

  //   this.lockConstraint = new CANNON.LockConstraint(this.directionPipe, this.lastpipe);
  //   this.world02.addConstraint(this.lockConstraint);

  //   let directionThree = new THREE.SphereBufferGeometry(0.01);

  //   let Dragmaterial02 = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })

  //   this.DragPoint = new THREE.Mesh(directionThree, Dragmaterial02);
  //   this.DragPoint.rotation.set(0, 0, Math.PI / 2);
  //   this.DragPoint.position.set(this.lastpipe.position.x, this.lastpipe.position.y, this.lastpipe.position.z);
  //   this.scene.add(this.DragPoint);
  //   this.FEthree.push(this.DragPoint);

  // }

  // Easing = [
  //   'Power0.easeOut',
  //   'Power1.easeOut',
  //   'Power2.easeOut',
  //   'Power3.easeOut',
  // ];

  // shootSmoke() {
  //   var vectorF = new THREE.Vector3();
  //   var vectorD = new THREE.Vector3();
  //   vectorF.setFromMatrixPosition(this.ResetPoint.matrixWorld);
  //   vectorD.setFromMatrixPosition(this.SmokePoint.matrixWorld);

  //   let smoke = this.smokeThree.clone();
  //   this.scene.add(smoke);
  //   this.meshes.push(smoke);

  //   let body = new CANNON.Body({ mass: .1 });
  //   body.addShape(this.sphereShape);
  //   body.position.set(vectorF.x, vectorF.y, vectorF.z);

  //   body.collisionFilterGroup = 2;
  //   body.collisionFilterMask = 1;

  //   this.world.addBody(body);
  //   this.bodies.push(body);

  //   TweenLite.to(smoke.scale, 0.7, { x: .05, y: .05, z: .05, delay: 0.5, ease: Power2.easeIn });

  //   let startPosition = new CANNON.Vec3(vectorF.x, vectorF.y, vectorF.z);
  //   let endPosition = new CANNON.Vec3(
  //     vectorD.x + (Math.random() * 0.2 * (Math.random() < 0.5 ? -1 : 1)),
  //     vectorD.y + (Math.random() * 0.2 * (Math.random() < 0.5 ? -1 : 1)),
  //     vectorD.z + (Math.random() * 0.2 * (Math.random() < 0.5 ? -1 : 1))
  //   );

  //   let direction = new CANNON.Vec3();
  //   endPosition.vsub(startPosition, direction);

  //   let totalLength = this.distance(direction.x, direction.y, direction.z, 0, 0, 0);
  //   direction.normalize();


  //   let speed = totalLength / this.tweenTime;

  //   direction.scale(speed, body.velocity);

  //   TweenLite.to(body.velocity, 2.5, { x: 0, y: 0, z: 0, ease: Power0.easeIn });

  //   setTimeout(() => {
  //     this.scene.remove(smoke);
  //     this.world.remove(body);
  //     this.bodies.shift();
  //     this.meshes.shift();
  //   }, 1200);
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

    let width = window.innerWidth * PixelRatio;
    let height = window.innerHeight * PixelRatio;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.canvas.style.width=width/PixelRatio+"px";
    this.canvas.style.height=height/PixelRatio+"px";
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

