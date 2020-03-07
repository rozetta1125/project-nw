import * as THREE from 'three';
import * as CANNON from 'cannon';
import { TimelineMax,TimelineLite,TweenLite,Power0,Power1,Power2,gsap,TweenMax } from 'gsap';
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
  private world = new CANNON.World();
  private world02 = new CANNON.World();

  private FireExtinguisher = new THREE.Object3D();
  private mixer01: THREE.AnimationMixer;
  private mixer02: THREE.AnimationMixer;
  private clock = new THREE.Clock();

  private hold1 = null;
  private hold2 = null;
  private hold3 = null;
  private hold5 = null;

  // FPS
  private times = [];
  private fps:number;
  private now:number;

  // Fire Extinguisher
  private meshes = [];
  private bodies = [];
  private meshes02 = [];
  private bodies02 = [];
  private meshes03 = [];
  private bodies03 = [];
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
  boop;

  // GUI
  private gui = new dat.GUI();
  

  // Balloon Cursor
  private StringM;
  private BalloonM = new THREE.MeshMatcapMaterial();
  private FirstCursor = new THREE.Vector3();
  private LastCursor = new THREE.Vector3();
  private LetterArray = [];
  private collided: boolean = false;
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
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.textureLoader = new THREE.TextureLoader();
    this.clock = new THREE.Clock();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor("#a8b3d3", 0);
    this.renderer.shadowMap.enabled=true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // create the scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000);
    // this.camera.position.set(3,2,6);
    // this.camera.position.set(0,1,6);

    // this.camera.position.set(0, 2, 8);
    // this.camera.position.set(0, 3.5, 7);

    // this.camera.lookAt(0,1,-.5);

    this.scene.add(this.camera);

    this.raycaster.linePrecision=.01;

    // loader 
    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('assets/draco/');
    this.loader.setDRACOLoader(this.dracoLoader);

    this.controls = new OrbitControls(this.camera, this.canvas);
    

    // this.GoalAngle.set(0,1,7.5);
    this.GoalAngle.set(0,5,6);
    this.camera.position.copy(this.GoalAngle);
    // this.camera.lookAt(new THREE.Vector3(0,0,0));

    // this.Goal.set(0,1,0)
    // this.EasedGoal.copy(this.Goal);

    // this.controls.update();
    this.controls.enableRotate = false;
    this.gui.add(this.controls,'enableRotate');
    this.controls.target.set(0,.5,0);
    this.controls.update();


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
        canvas.setAttribute("style","background:linear-gradient(to bottom, "+ bgparams.background+" 0%,"+bgparams.background02+" 100%);");
      });
    bg.addColor(bgparams, "background02")
      .onChange(() => {
        canvas.setAttribute("style","background:linear-gradient(to bottom, "+ bgparams.background+" 0%,"+bgparams.background02+" 100%);");
      });
  }

  
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
    let white = this.textureLoader.load('assets/matcaps/FFFFFF03.png',()=>{
      white.encoding=THREE.sRGBEncoding;
    });
    let blue = this.textureLoader.load('assets/matcaps/A4BCEC03.png',()=>{
      blue.encoding=THREE.sRGBEncoding;
    });
    let pink = this.textureLoader.load('assets/matcaps/E7B9BE03.png',()=>{
      pink.encoding=THREE.sRGBEncoding;
    });
    // white
    let mate01 = new THREE.MeshMatcapMaterial({
      color:0xffffff,
      side:2,
      matcap:white
    })
    // blue
    let mate02 = new THREE.MeshMatcapMaterial({
      color:0xffffff,
      side:2,
      matcap:blue
    })
    // pink
    let mate03 = new THREE.MeshMatcapMaterial({
      color:0xffffff,
      side:2,
      matcap:pink
    })


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
            gltf.scene.children[""+i+""].children[0].material=mate01;
            gltf.scene.children[""+i+""].children[1].material=mate02;
            gltf.scene.children[""+i+""].children[2].material=mate01;
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
            gltf.scene.children[""+i+""].material=mate02;
          } else {
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
            this.Carnival.children[i].children[0].material=mate02;
            this.Carnival.children[i].children[1].material=mate01;
          } else {
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
          uAlpha:{value:.2}
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
          uAlpha:{value:.4}
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
                PlanePart = gltf.scene.children[i].clone();
                PlanePart.children["0"].material=mate02;
                PlanePart.children["1"].material=mate03;
              } else {
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
          uAlpha:{value:.2}
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
            this.FerrisWheel.children[i].material=mate02
          } else if(this.FerrisWheel.children[i].name=="FerrisWheel00") {
            this.FerrisWheel.children[i].material=mate01
            shadow01.position.x=gltf.scene.children[i].position.x-.003
            shadow01.position.z=gltf.scene.children[i].position.z+.08
          } else {
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
                this.Ferris.scene.children[i].children[1].material=mate03
                this.Ferris.scene.children[i].children[0].material=mate01
              } else if (this.Ferris.scene.children[i].name=="F02") {
                this.TweenF02.pause();
                this.TweenF02.to(this.Ferris.scene.children[i].rotation,1,{z:.7})
                this.TweenF02.to(this.Ferris.scene.children[i].rotation,2,{z:-.7});
                this.TweenF02.to(this.Ferris.scene.children[i].rotation,1,{z:0});
                this.Ferris.scene.children[i].children[1].material=mate02
                this.Ferris.scene.children[i].children[0].material=mate01
              } else if (this.Ferris.scene.children[i].name=="F03") {
                this.TweenF03.pause();
                this.TweenF03.to(this.Ferris.scene.children[i].rotation,1,{z:.7})
                this.TweenF03.to(this.Ferris.scene.children[i].rotation,2,{z:-.7});
                this.TweenF03.to(this.Ferris.scene.children[i].rotation,1,{z:0});
                this.Ferris.scene.children[i].children[1].material=mate03
                this.Ferris.scene.children[i].children[0].material=mate01
              } else if (this.Ferris.scene.children[i].name=="F04") {
                this.TweenF04.pause();
                this.TweenF04.to(this.Ferris.scene.children[i].rotation,1,{z:.7})
                this.TweenF04.to(this.Ferris.scene.children[i].rotation,2,{z:-.7});
                this.TweenF04.to(this.Ferris.scene.children[i].rotation,1,{z:0});
                this.Ferris.scene.children[i].children[1].material=mate02
                this.Ferris.scene.children[i].children[0].material=mate01
              } else if (this.Ferris.scene.children[i].name=="F05") {
                this.TweenF05.pause();
                this.TweenF05.to(this.Ferris.scene.children[i].rotation,1,{z:.7})
                this.TweenF05.to(this.Ferris.scene.children[i].rotation,2,{z:-.7});
                this.TweenF05.to(this.Ferris.scene.children[i].rotation,1,{z:0});
                this.Ferris.scene.children[i].children[1].material=mate03
                this.Ferris.scene.children[i].children[0].material=mate01
              } else if (this.Ferris.scene.children[i].name=="F06") {
                this.TweenF06.pause();
                this.TweenF06.to(this.Ferris.scene.children[i].rotation,1,{z:.7})
                this.TweenF06.to(this.Ferris.scene.children[i].rotation,2,{z:-.7});
                this.TweenF06.to(this.Ferris.scene.children[i].rotation,1,{z:0});
                this.Ferris.scene.children[i].children[1].material=mate02
                this.Ferris.scene.children[i].children[0].material=mate01
              } else if (this.Ferris.scene.children[i].name=="F07") {
                this.TweenF07.pause();
                this.TweenF07.to(this.Ferris.scene.children[i].rotation,1,{z:.7})
                this.TweenF07.to(this.Ferris.scene.children[i].rotation,2,{z:-.7});
                this.TweenF07.to(this.Ferris.scene.children[i].rotation,1,{z:0});
                this.Ferris.scene.children[i].children[1].material=mate03
                this.Ferris.scene.children[i].children[0].material=mate01
              } else if (this.Ferris.scene.children[i].name=="F08") {
                this.TweenF08.pause();
                this.TweenF08.to(this.Ferris.scene.children[i].rotation,1,{z:.7})
                this.TweenF08.to(this.Ferris.scene.children[i].rotation,2,{z:-.7});
                this.TweenF08.to(this.Ferris.scene.children[i].rotation,1,{z:0});
                this.Ferris.scene.children[i].children[1].material=mate02
                this.Ferris.scene.children[i].children[0].material=mate01
              } else {
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
          uShadowColor:{value:new THREE.Color("#000000")},
          uAlpha:{value:.2}
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
            this.Train.scene.children[i].material=mate02
          } else if (this.Train.scene.children[i].name=="SmokePipe"){
            this.Train.scene.children[i].material=mate02
            this.SmokePipe.push(this.Train.scene.children[i]);
          } else {
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

    this.Smoke = new THREE.Mesh(new THREE.SphereBufferGeometry(.04,6,4),new THREE.MeshMatcapMaterial({transparent:true,matcap:white,opacity:0}));
    for(var i=0;i<160;i++){
      let smokeClone = this.Smoke.clone();
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
      console.log(intersect[0].object.name)
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
    TweenLite.to(this.TrainPosition[0].position,.1,{x:this.TrainPosition[2].position.x,z:this.TrainPosition[2].position.z,delay:.1})
    TweenLite.to(this.TrainPosition[1].position,.1,{x:this.TrainPosition[3].position.x,z:this.TrainPosition[3].position.z,delay:.1})


    this.TrainPosition[0].rotation.y=this.TrainPosition[2].rotation.y;
    this.TrainPosition[1].rotation.y=this.TrainPosition[3].rotation.y;
    // Position
    TweenLite.fromTo(this.Smokes[this.SmokeI].position,1.6,
      {x:this.SmokePipe[0].position.x,z:this.SmokePipe[0].position.z,y:this.SmokePipe[0].position.y},
      {x:this.SmokePipe[0].position.x+(.3-Math.random()*.3),z:this.SmokePipe[0].position.z+(.3-Math.random()*.3),y:this.SmokePipe[0].position.y+Math.random()*.4+.4});
    // Scale
    TweenLite.fromTo(this.Smokes[this.SmokeI].scale,1.6,
      {x:1,z:1,y:1},
      {x:.1,z:.1,y:.1,ease:Power1.easeIn});
    // // Opacity
    TweenLite.fromTo(this.Smokes[this.SmokeI].material,1.6,
      {opacity:1},
      {opacity:0});
    this.SmokeI++;
    if(this.TrainAnimation==null){
      console.log("STOPED");
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
      color:0xffffff,
      linewidth:.0007,
    })

    this.AddEvent();

    // this.nextStageFunction();
    // this.CreateParkObject();
    // this.ParkStaticShadow();

    this.SecondInit();

    const cursor = document.querySelector('.cursor');
    const outer = document.querySelector('.cursor .outer');
    const dot = document.querySelector('.cursor .dot');
    document.addEventListener('mousemove',e=>{
      cursor.setAttribute("style","top:"+e.pageY+"px;left:"+e.pageX+"px;");
    });
    document.addEventListener('mousedown',()=>{
      TweenLite.to(outer,.3,{css:{scale:.75}});
      TweenLite.to(dot,.3,{css:{scale:1}});
    });
    document.addEventListener('mouseup',()=>{
      TweenLite.to(outer,.3,{css:{scale:1}});
      TweenLite.to(dot,.3,{css:{scale:.75}});
    });


    this.canvas.addEventListener("mousemove", (e) => {
      this.renderThreePosition(e.x, e.y);
    });
    // this.canvas.addEventListener("click", () => {
    //   this.FirstSceneClickEvent();
    // });
    // this.canvas.addEventListener("touchmove", (e) => {
    //   this.renderThreePosition(e.touches[0].clientX, e.touches[0].clientY);
    // });
    // this.canvas.addEventListener("mousedown", (e) => {
    //   if (e.which == 1) {
    //     this.CursorBegin();
    //     this.canvas.onmousemove = () => {
    //       this.BalloonCursor();
    //     };
    //   }
    // });
    // this.canvas.addEventListener("touchstart", (e) => {
    //   this.renderThreePosition(e.touches[0].clientX, e.touches[0].clientY);
    //     this.CursorBegin();
    //     this.canvas.ontouchmove = () => {
    //       this.BalloonCursor();
    //       this.FirstSceneClickEvent();
    //     };
    // });
    // this.canvas.addEventListener("mouseup", (e) => {
    //   if (e.which == 1) {
    //     this.canvas.onmousemove = null;
    //     if (this.collided) {
    //       this.FirstCursor.copy(this.LastCursor);
    //     } else {
    //       TweenLite.to(this.FirstCursor, .5, {
    //         x: this.LastCursor.x,
    //         y: this.LastCursor.y, z: this.LastCursor.z
    //       })
    //       this.CheckLetterIntersect()
    //     }
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

  ParkStaticShadow(){
    var texture = this.textureLoader.load('assets/shadow/Park01.png');

    let uniforms = {
      tShadow:{value:texture},
      uShadowColor:{value:new THREE.Color("#000000")},
      uAlpha:{value:.2}
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

    this.mouse.set(this.vec.x,this.vec.y);

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
    if(intersect.length>0){
      document.body.style.cursor="pointer";
    } else {
      document.body.style.cursor="auto";
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

    this.world02.step(1 / this.fps);

    this.FirstSceneRender();
    this.MiniGolfRender();

    this.renderer.render(this.scene, this.camera);
  }


  private CircleGolf;
  SecondInit(){
    this.InitGolfCannon();
    
    this.GolfStage();


    this.CircleGolf = document.querySelector('.circle');
    this.GolfString = new THREE.Object3D();
    let material = new THREE.MeshBasicMaterial({color:0xffffff});
    let arrow = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(.075,.075,.01,3),material
    )
    arrow.position.set(0,0,0.45);
    // arrow.castShadow=true;
    let box = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.05,.01,.1),material
    )
    box.position.set(0,0,0.3);
    // box.castShadow=true;
    let box02 = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.05,.01,.1),material
    )
    box02.position.set(0,0,0.15);
    // box02.castShadow=true;
    this.GolfString.add(arrow);
    this.GolfString.add(box);
    this.GolfString.add(box02);
    this.GolfString.castShadow=true;

    this.canvas.addEventListener("mousemove", (e) => {
      this.renderGolfPosition(e.x, e.y);
    });
    this.canvas.addEventListener("mousedown", (e) => {
      if (e.which == 1) {
        this.GolfBegin();
        // this.canvas.onmousemove = () => {
        //   this.GolfCursor();
        // };
      }
    });

  }

  private GolfCMaterial:CANNON.Material;
  private GolfStageMaterial:CANNON.Material;
  InitGolfCannon(){
    this.world02 = new CANNON.World();
    this.world02.gravity.set(0, 0, 0);

    this.GolfStageCannon();

    setTimeout(() => {
      this.MiniGolf()

      this.canvas.addEventListener("mouseup", (e) => {
        if (e.which == 1) {
          this.Golfing=false;
          TweenLite.to(this.CircleGolf,.3,{delay:0,strokeDashoffset: 270});
  
          this.scene.remove(this.GolfString);
  
          if(!this.controls.enableRotate){
            this.GolfMove();
          }

        }
      });

      this.world02.gravity.set(0, -10, 0);
    }, 2000);

    this.GolfCMaterial = new CANNON.Material("GolfCMaterial");
    this.GolfStageMaterial = new CANNON.Material("GolfStageMaterial");
    let Contact = new CANNON.ContactMaterial(this.GolfCMaterial,this.GolfStageMaterial,{
      friction: 0.3,
      restitution: 0.3,
      contactEquationStiffness: 1000
    });
    // this.world02.addContactMaterial(Contact);
    this.debugger = new CannonDebugRenderer(this.scene, this.world02);
  }

  renderGolfPosition(x, y) {
    this.vec.set(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1,
      0.5);
    this.LBvec=this.vec;
  }
  
  GolfBegin(){
    this.FBvec.copy(this.LBvec);
    this.Golfing=true;
    this.scene.add(this.GolfString);
  }

  GolfMove(){
    let startPosition = new CANNON.Vec3(this.FBpos.x, 0, this.FBpos.z);
    let endPosition = new CANNON.Vec3(this.LBpos.x, 0, this.LBpos.z);

    // if(this.GolfPercent<0){
    //   var Line = new THREE.LineCurve3(new THREE.Vector3(startPosition.x,startPosition.y,startPosition.z),
    //     new THREE.Vector3(endPosition.x,endPosition.y,endPosition.z));
    //   var len = Line.getLengths();
    //   var numberI:number;
    //   var Vec3:THREE.Vector3;

    //   for(var i=0;i<len.length;i++){
    //     if(len[i]>1.5){
    //       numberI=i;
    //       break;
    //     }
    //   }

    //   Vec3 = Line.getPointAt(numberI/201);
    //   endPosition.set(Vec3.x,Vec3.y,Vec3.z);

    // }

    let direction = new CANNON.Vec3();
    endPosition.vsub(startPosition, direction);

    let totalLength = this.distance(direction.x, direction.y, direction.z, 0, 0, 0);
    direction.normalize();

    let speed = totalLength / 0.225;

    direction.scale(speed, this.GolfC.velocity);

  }

  private GolfString:THREE.Object3D;
  private GolfCurve;
  private GolfDistance:number;
  private GolfPercent:number;
  RenderGolfCursor(){
    if(this.GolfT && this.Golfing){
      this.FBpos=this.GolfT.position;
      this.LBpos.set(this.FBpos.x-((this.FBvec.x-this.LBvec.x)*.5),this.FBpos.y,this.FBpos.z+((this.FBvec.y-this.LBvec.y)*.5));


      this.GolfString.position.copy(this.FBpos);
      this.GolfString.lookAt(this.LBpos);


      this.GolfDistance = this.distanceVec2(this.FBvec.x,this.FBvec.y,this.LBvec.x,this.LBvec.y);
      
      this.GolfPercent = 270 - (this.GolfDistance*100)*2.7;

      if(this.GolfPercent>0){
        TweenLite.to(this.CircleGolf,.03,{strokeDashoffset: this.GolfPercent});
      }
    }
  }

  private GolfC: CANNON.Body
  private GolfT: THREE.Object3D

  private CameraPos: THREE.Mesh
  private CameraVec :THREE.Vector3
  MiniGolf(){
    // P
    var Position = new THREE.Vector3();
    Position.setFromMatrixPosition(this.StageThreeArray[0].matrixWorld);

    if(this.GolfC!=null){
      this.GolfC.velocity.set(0,0,0);
      this.GolfC.position.set(Position.x,Position.y + 2,Position.z);
      this.GolfC.angularVelocity.set(0,0,0);
    } else {
      let add={
        more:false
      }
      this.gui.add(add,'more')
        .onChange(()=>{
          this.MiniGolf();
        })

      this.GolfC = new CANNON.Body({mass:1,material:this.GolfCMaterial})
      this.GolfC.addShape(new CANNON.Sphere(.1));
      let quat = new CANNON.Quaternion(0.5,0,0,0.5);
      quat.normalize();
      this.GolfC.addShape(new CANNON.Sphere(.1),new CANNON.Vec3,quat);
      this.GolfC.position.set(Position.x,Position.y + 2,Position.z);

      this.GolfC.position.set(0,2,0);
      this.world02.addBody(this.GolfC)
      this.bodies.push(this.GolfC);
  
      this.GolfT = new THREE.Object3D();
      let Golf = new THREE.Mesh(
        new THREE.SphereBufferGeometry(.1,16,16),
        new THREE.MeshLambertMaterial({color:0xffffff,emissiveIntensity:0,emissive:0xffffff})
      )
      Golf.castShadow=true;
      
      this.GolfT.add(Golf);
      
      this.CameraPos = new THREE.Mesh();
      this.CameraPos.position.set(0,3.8,5);
      this.GolfT.add(this.CameraPos);
      this.meshes.push(this.GolfT);

      this.scene.add(this.GolfT);
  
      this.CameraVec=new THREE.Vector3();

      this.GolfTrail();
    }
  }

  private StageM
  private positionarray = [];
  GolfStage(){
    let ThreeStage;

    let white = this.textureLoader.load('assets/matcaps/FFFFFF03.png',()=>{
      white.encoding=THREE.sRGBEncoding;
    });
    let blue = this.textureLoader.load('assets/matcaps/A4BCEC03.png',()=>{
      blue.encoding=THREE.sRGBEncoding;
    });
    let pink = this.textureLoader.load('assets/matcaps/E7B9BE03.png',()=>{
      pink.encoding=THREE.sRGBEncoding;
    });
    // white
    let mate01 = new THREE.MeshMatcapMaterial({
      color:0xffffff,
      side:2,
      matcap:white
    })
    // blue
    let mate02 = new THREE.MeshMatcapMaterial({
      color:0xffffff,
      side:2,
      matcap:blue
    })
    // pink
    let mate03 = new THREE.MeshMatcapMaterial({
      color:0xffffff,
      side:2,
      matcap:pink
    })

    this.loader.load(
      'assets/model/GolfStage02.glb',
      (gltf) => {
        gltf.scene.traverse((node)=>{
          if(node instanceof THREE.Mesh){
            node.castShadow=true;
            node.receiveShadow=true;
          }
        });
        ThreeStage = gltf.scene;
        this.positionarray.push(ThreeStage);
        ThreeStage.position.set(-1.405+10,0,-1.925);
        ThreeStage.rotation.set(0,Math.PI/6,0);
        for(var i=0;i<ThreeStage.children.length;i++){
          if(ThreeStage.children[i].children.length>1){
            ThreeStage.children[i].children[0].material=mate01
            ThreeStage.children[i].children[1].material=mate02;
          }
        }
        // this.CannonStage();
        this.scene.add(ThreeStage);


        let add={
          hide:false
        }
        this.gui.add(add,'hide')
          .onChange(()=>{
            this.scene.remove(ThreeStage);
          })
        let add02={
          add:false
        }
        this.gui.add(add02,'add')
          .onChange(()=>{
            this.scene.add(ThreeStage);
          })
      }
    );
  }

  private StageThreeArray=[];
  private StageCannnonArray=[];
  GolfStageCannon(){
    let Stage = new THREE.Object3D();
    this.scene.add(Stage)
    Stage.rotation.set(0,-45*Math.PI/180,0*Math.PI/180);
    Stage.position.set(-1.5,0,-2);

    let StageMaterial = new THREE.MeshBasicMaterial({transparent:true,opacity:0,color:0xffffff})

    // THREE 01 
    let Cube01 = new THREE.Mesh(new THREE.BoxBufferGeometry(1,.5,1),StageMaterial);
    Cube01.position.set(0,0,0);
    Cube01.rotation.set(0*Math.PI/180,0*Math.PI/180,0*Math.PI/180)
    Stage.add(Cube01);
    this.StageThreeArray.push(Cube01);
    
    // CANNON 01
    let Cube001 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    Cube001.addShape(new CANNON.Box(new CANNON.Vec3(.5,.25,.5)),new CANNON.Vec3());

    this.world02.addBody(Cube001)
    this.StageCannnonArray.push(Cube001)


    // THREE 02
    let Cube02 = new THREE.Mesh(new THREE.BoxBufferGeometry(1,.5,2),StageMaterial);
    Cube02.position.set(0,0,-1.5);
    Cube02.rotation.set(0*Math.PI/180,0*Math.PI/180,0*Math.PI/180)
    Stage.add(Cube02);
    this.StageThreeArray.push(Cube02);
    
    // CANNON 02
    let Cube002 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    Cube002.addShape(new CANNON.Box(new CANNON.Vec3(.5,.25,1)),new CANNON.Vec3());

    this.world02.addBody(Cube002)
    this.StageCannnonArray.push(Cube002)

    // THREE 03 
    let Cube03 = new THREE.Mesh(new THREE.CylinderBufferGeometry(1.4,1.4,.5,24,8,false,Math.PI/2,Math.PI),StageMaterial);
    Cube03.position.set(.9,0,-2.5);
    Cube03.rotation.set(0*Math.PI/180,0*Math.PI/180,0*Math.PI/180)
    Stage.add(Cube03);
    this.StageThreeArray.push(Cube03);

    // CANNON 03
    let quat = new CANNON.Quaternion(0.5,0,0,-.5);
    quat.normalize();

    let Cube003 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    Cube003.addShape(new CANNON.Cylinder(.4,.4,.5,16),new CANNON.Vec3(0,0,0),quat)

    // Plane Outer Radius
    var shape = this.CreateCANNONCirclePlane(.25,.75,-1.4,-10*Math.PI/180,175*Math.PI/180,20);
    Cube003.addShape(shape)
    var shape = this.CreateCANNONCirclePlane(.25,.75,-1.41,-10*Math.PI/180,175*Math.PI/180,20);
    Cube003.addShape(shape)

    // Plane
    shape = this.CreateCANNONPlane(.25,.4,1.4,0,170*Math.PI/180,345*Math.PI/180,20);
    Cube003.addShape(shape)

    this.world02.addBody(Cube003);
    this.StageCannnonArray.push(Cube003);


    // THREE 04
    let Cube04 = new THREE.Mesh(new THREE.BoxBufferGeometry(1,.5,2),StageMaterial);
    Cube04.position.set(2.15,.4,-1.28);
    Cube04.rotation.set(0*Math.PI/180,15*Math.PI/180,0*Math.PI/180)
    Stage.add(Cube04);
    this.StageThreeArray.push(Cube04);
  

    // CANNON 04
    var vertTest=[];
    var number=0;
    var radius = .15;
    var numberY = 0;
    var numberZ = -1.75;

    for(var i=(Math.PI/15)*-8;i<Math.PI*2-1.3;i+=Math.PI/15){
      if(number%2==0){
        numberY=Math.sin(i)*radius;
        numberZ+=.15;
        vertTest.push(new CANNON.Vec3(-.5,numberY,numberZ));
      } else {  
        vertTest.push(new CANNON.Vec3(.5,numberY,numberZ));
      }
      number++;
    }

    var faceTest=[];
    faceTest.push([0,2,1]);
    faceTest.push([1,2,3]);
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

    var shape = new CANNON.ConvexPolyhedron(vertTest,faceTest);
    let zFunction = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    zFunction.addShape(shape)
    zFunction.addShape(shape, new CANNON.Vec3(0,-.01,0))

    this.world02.addBody(zFunction);
    this.StageCannnonArray.push(zFunction);


    // // zFunction.addShape(new CANNON.Box(new CANNON.Vec3(.01,.3,1.2)),new CANNON.Vec3(.743,.025,1.1))
    // // zFunction.addShape(new CANNON.Box(new CANNON.Vec3(.01,.3,1.2)),new CANNON.Vec3(.005,.025,1.15))


    // THREE 05
    let Cube05 = new THREE.Mesh(new THREE.CylinderBufferGeometry(1.4,1.4,.5,24,8,false,Math.PI/2,Math.PI),StageMaterial);
    Cube05.position.set(3.15,0,-1);
    Cube05.rotation.set(0*Math.PI/180,180*Math.PI/180,0*Math.PI/180)
    Stage.add(Cube05);
    this.StageThreeArray.push(Cube05);

    // CANNON 05
    let Cube005 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    Cube005.addShape(new CANNON.Cylinder(.4,.4,.5,16),new CANNON.Vec3(0,0,0),quat)

    // Plane Outer Radius
    var shape = this.CreateCANNONCirclePlane(0,.5,-1.4,-10*Math.PI/180,175*Math.PI/180,20);
    Cube005.addShape(shape)
    var shape = this.CreateCANNONCirclePlane(0,.5,-1.41,-10*Math.PI/180,175*Math.PI/180,20);
    Cube005.addShape(shape)

    // Plane
    shape = this.CreateCANNONPlane(.25,.4,1.4,0,170*Math.PI/180,345*Math.PI/180,20);
    Cube005.addShape(shape)

    this.world02.addBody(Cube005);
    this.StageCannnonArray.push(Cube005);


    // // THREE 06
    let Cube06 = new THREE.Mesh(new THREE.BoxBufferGeometry(1,.5,2),StageMaterial);
    Cube06.position.set(4.05,0,-2);
    Cube06.rotation.set(0*Math.PI/180,0*Math.PI/180,0*Math.PI/180)
    Stage.add(Cube06);
    this.StageThreeArray.push(Cube06);
    
    // CANNON 06
    let Cube006 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    Cube006.addShape(new CANNON.Box(new CANNON.Vec3(.5,.25,1)),new CANNON.Vec3());

    this.world02.addBody(Cube006)
    this.StageCannnonArray.push(Cube006)


    // // THREE 07
    // let Cube07 = new THREE.Mesh(new THREE.BoxBufferGeometry(1,.5,2),StageMaterial);
    // Cube07.position.set(3.6,0,-.5);
    // Cube07.rotation.set(0*Math.PI/180,0*Math.PI/180,0*Math.PI/180)
    // Stage.add(Cube07);
    // this.StageThreeArray.push(Cube07);
    
    // // CANNON 07
    // let Cube007 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    // Cube007.addShape(new CANNON.Box(new CANNON.Vec3(.5,.25,1)),new CANNON.Vec3());
    // Cube007.addShape(new CANNON.Box(new CANNON.Vec3(.01,.25,1)),new CANNON.Vec3(-.5,.25,0));
    // Cube007.addShape(new CANNON.Box(new CANNON.Vec3(.01,.25,1)),new CANNON.Vec3(.5,.25,0));

    // this.world02.addBody(Cube007)
    // this.StageCannnonArray.push(Cube007)


    // THREE 08
    let Cube08 = new THREE.Mesh(new THREE.BoxBufferGeometry(1,.5,1),StageMaterial);
    Cube08.position.set(4.05,0,-3.5);
    Cube08.rotation.set(0*Math.PI/180,0*Math.PI/180,0*Math.PI/180)
    Stage.add(Cube08);
    this.StageThreeArray.push(Cube08);
    
    // CANNON 08
    let Cube008 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});

    // Plane
    shape = this.CreateCANNONPlane(.25,.14,.75,0,0*Math.PI/180,370*Math.PI/180,20);
    Cube008.addShape(shape)

    Cube008.addShape(new CANNON.Box(new CANNON.Vec3(.01,.25,.5)),new CANNON.Vec3(-.5,.25,0));
    Cube008.addShape(new CANNON.Box(new CANNON.Vec3(.01,.25,.5)),new CANNON.Vec3(.5,.25,0));
    Cube008.addShape(new CANNON.Box(new CANNON.Vec3(.5,.25,.01)),new CANNON.Vec3(0,.25,-.5));

    // this.world02.addBody(Cube005);
    // this.StageCannnonArray.push(Cube005);

    this.world02.addBody(Cube008)
    this.StageCannnonArray.push(Cube008)


    var Position = new THREE.Vector3();
    var Quaternion = new THREE.Quaternion();
    gsap.delayedCall(2,()=>{
      for(var i=0;i<this.StageThreeArray.length;i++){
        // P
        Position.setFromMatrixPosition(this.StageThreeArray[i].matrixWorld);
        this.StageCannnonArray[i].position.set(Position.x,Position.y,Position.z);

        // Q
        Quaternion.setFromRotationMatrix(this.StageThreeArray[i].matrixWorld)
        this.StageCannnonArray[i].quaternion.set(Quaternion.x,Quaternion.y,Quaternion.z,Quaternion.w);
      }
    })
  }

  CannonStage(){
    // setTimeout(() => {
    //   for(var i=0;i<this.positionarray[0].children.length;i++){
    //     console.log(this.positionarray[0].children[i])
    //     // let vec3 = new THREE.Vector3();
    //     // vec3.setFromMatrixPosition(this.positionarray[0].children[i].matrixWorld);
    //     // console.log(vec3);
    //   }
    // }, 2000);

    // Quaternion Stuffs
    let something=new THREE.Mesh();
    something.rotation.set(0,37.7 * Math.PI / 180,0);
    let quat = new CANNON.Quaternion(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    quat.normalize();


    // Cube001
    let CCube001 = new CANNON.Box(new CANNON.Vec3(.7,.284,.7));
    let Cube001 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    Cube001.addShape(CCube001);
    Cube001.addShape(new CANNON.Box(new CANNON.Vec3(.7,.25,.01)), new CANNON.Vec3(0,.25,.7));
    Cube001.addShape(new CANNON.Box(new CANNON.Vec3(.7,.25,.01)), new CANNON.Vec3(0,.25,-.7));
    Cube001.addShape(new CANNON.Box(new CANNON.Vec3(.01,.25,.16)), new CANNON.Vec3(.7,.25,.52));
    Cube001.addShape(new CANNON.Box(new CANNON.Vec3(.01,.25,.16)), new CANNON.Vec3(.7,.25,-.52));
    Cube001.addShape(new CANNON.Box(new CANNON.Vec3(.01,.25,.7)), new CANNON.Vec3(-.7,.25,0));
    Cube001.position.set(-2.211,0.285,-0.867);
    Cube001.quaternion.copy(quat);
    this.world02.addBody(Cube001)

    // let Cube001B = new CANNON.Body({mass:0});
    
    // Cube001B.addShape(CCube001);
    // Cube001B.position.copy(Cube001.position);
    // Cube001B.quaternion.copy(Cube001.quaternion);
    // this.world02.addBody(Cube001B);


    // Cube 
    let Cube = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    let CCube = new CANNON.Box(new CANNON.Vec3(.77,.284,.37));
    Cube.addShape(CCube);
    Cube.addShape(new CANNON.Box(new CANNON.Vec3(.74,.25,.01)),new CANNON.Vec3(0,.28,.37))
    Cube.addShape(new CANNON.Box(new CANNON.Vec3(.74,.25,.01)),new CANNON.Vec3(0,.28,-.37))
    Cube.position.set(-1.044,0.285,-1.77)
    Cube.quaternion.copy(quat)
    this.world02.addBody(Cube)

    
    // let CubeB = new CANNON.Body({mass:0});
    // CubeB.addShape(CCube);
    // CubeB.position.copy(Cube.position);
    // CubeB.quaternion.copy(Cube.quaternion);
    // this.world02.addBody(CubeB);
    

    // Plane Cylinder
    quat = new CANNON.Quaternion(0.5,0,0,-.5);
    quat.normalize();
    let cylinder01 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    cylinder01.addShape(new CANNON.Cylinder(.255,.255,.5,16),new CANNON.Vec3(0,0.05,0),quat);
    

    // Plane Outer Radius
    // var shape = this.CreateCANNONCirclePlane(0,.5,-.99,Math.PI,30);

    something.rotation.set(0,-45 * Math.PI / 180,0);
    quat = new CANNON.Quaternion(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    quat.normalize();
    // cylinder01.addShape(shape,new CANNON.Vec3(-0.006,-0.1,0.014),quat);
    let outerShape = new CANNON.Body({mass:0,});
    outerShape.addShape(shape,new CANNON.Vec3(-0.01,-0.1,0),quat)
    outerShape.position.set(-0.0788,0.5,-1.727);
    this.world02.addBody(outerShape);

    // Plane Plane 
    something.rotation.set(0,134 * Math.PI / 180,0);
    quat = new CANNON.Quaternion(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    quat.normalize();
    // var shape = this.CreateCANNONPlane(.2,.25,1,0.007,190*Math.PI/180,20);

    cylinder01.addShape(shape,new CANNON.Vec3(-0.012,-0.125,0.014),quat)

    cylinder01.position.set(-0.0788,0.5,-1.727);
    this.world02.addBody(cylinder01);

    

    // Plane 02 Cylinder
    quat = new CANNON.Quaternion(0.5,0,0,-.5);
    quat.normalize();
    let cylinder02 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    cylinder02.addShape(new CANNON.Cylinder(.41,.41,.5,20),new CANNON.Vec3(),quat);

    // Plane 02 plane
    something.rotation.set(0,-45 * Math.PI / 180,0);
    quat = new CANNON.Quaternion(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    quat.normalize();
    // var shape = this.CreateCANNONPlane(.15,.41,1.15,-0.0049,175*Math.PI/180,35);
    cylinder02.addShape(shape,new CANNON.Vec3(-.012,-0.12,0.01),quat)

    // Plane 02 Outer Radius
    // var shape = this.CreateCANNONCirclePlane(0,.5,1.11,Math.PI,30);
    something.rotation.set(0,-45 * Math.PI / 180,0);
    quat = new CANNON.Quaternion(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    quat.normalize();
    // cylinder02.addShape(shape,new CANNON.Vec3(-0.022,-.012,0.011),quat);
    let outerShape02 = new CANNON.Body({mass:0,});
    outerShape02.addShape(shape,new CANNON.Vec3(-0.022,-.012,0.011),quat)
    outerShape02.position.set(-0.173,0.188,1.023);
    this.world02.addBody(outerShape02);

    cylinder02.position.set(-0.173,0.188,1.023)
    this.world02.addBody(cylinder02);


    // Cube003
    something.rotation.set(0,0,-1.35 * Math.PI / 180);
    quat = new CANNON.Quaternion(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    quat.normalize();
    let CCube003 = new CANNON.Box(new CANNON.Vec3(.84,.11,.37));
    let Cube003 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    Cube003.addShape(CCube003,new CANNON.Vec3(0,0.094,0),quat);
    Cube003.addShape(new CANNON.Box(new CANNON.Vec3(.8,.25,.01)),new CANNON.Vec3(0,0.4,-.375))
    Cube003.addShape(new CANNON.Box(new CANNON.Vec3(.8,.25,.01)),new CANNON.Vec3(0,0.4,.35))
    something.rotation.set(0,37.5 * Math.PI / 180,0);
    quat = new CANNON.Quaternion(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    quat.normalize();
    Cube003.quaternion.copy(quat)
    Cube003.position.set(0.933,0,1.136)
    this.world02.addBody(Cube003)


    // Z Function
    var vertTest=[];
    var Tvert=[];
    var number=0;
    var radius = .2;
    var numberY = 0;
    var numberZ = 0;

    for(var i=-1;i<Math.PI*1.5+.4+Math.PI*2;i+=Math.PI/15){
      if(number%2==0){
        vertTest.push(new CANNON.Vec3(0,numberY,numberZ));
      } else {  
        vertTest.push(new CANNON.Vec3(.73,numberY,numberZ));
        numberY=Math.sin(i)*radius;
        numberZ=number*.106;
      }
      number++;
    }
    
    // for(var i=0;i<Math.PI*1.5+.15;i+=Math.PI/45){
    //   if(number%2==0){
    //     vertTest.push(new CANNON.Vec3(0,numberY,numberZ));
    //   } else {  
    //     vertTest.push(new CANNON.Vec3(.73,numberY,numberZ));
    //     numberY=Math.sin(i)*radius;
    //     numberZ=number*.034;
    //   }
    //   number++;
    // }


    var faceTest=[];
    faceTest.push([0,2,1]);
    faceTest.push([1,2,3]);
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

    something.rotation.set(0,-32*Math.PI/180,0);
    quat = new CANNON.Quaternion(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    quat.normalize();
    var shape = new CANNON.ConvexPolyhedron(vertTest,faceTest);

    let zFunction = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    zFunction.addShape(shape)
    zFunction.position.set(0.09,0.5 + 2,-1.532)
    zFunction.quaternion.copy(quat);
    this.world02.addBody(zFunction);

    // let zFunction02 = new CANNON.Body({mass:0});
    // zFunction02.addShape(shape);
    // zFunction02.position.set(0.12,0.49,-1.509);
    // zFunction02.quaternion.copy(quat);
    // this.world02.addBody(zFunction02);

    zFunction.addShape(new CANNON.Box(new CANNON.Vec3(.01,.3,1.2)),new CANNON.Vec3(.743,.025,1.1))
    zFunction.addShape(new CANNON.Box(new CANNON.Vec3(.01,.3,1.2)),new CANNON.Vec3(.005,.025,1.15))

    // ZFT
    // for(var i=0;i<vertTest.length-20;i++){
    //   Tvert.push(new THREE.Vector3(vertTest[i].x,vertTest[i].y,vertTest[i].z))
    //   if(i%2==0){
    //     Tvert.push(new THREE.Vector3(0,-.5,vertTest[i].z))
    //   } else {
    //     Tvert.push(new THREE.Vector3(0.73,-.5,vertTest[i].z))
    //   }
    // }
    // var Convex = new ConvexBufferGeometry(Tvert);
    
    // let ZFT = new THREE.Mesh(Convex,new THREE.MeshStandardMaterial);
    // ZFT.castShadow=true;
    // ZFT.position.set(.09,.5,-1.532);
    // ZFT.rotation.set(0,-32*Math.PI/180,0);
    // this.scene.add(ZFT)

    // Tvert=[];
    // // ZFT 02
    // for(var i=vertTest.length-22;i<vertTest.length-18;i++){
    //   Tvert.push(new THREE.Vector3(vertTest[i].x,vertTest[i].y,vertTest[i].z))
    //   if(i%2==0){
    //     Tvert.push(new THREE.Vector3(0,-.5,vertTest[i].z))
    //   } else {
    //     Tvert.push(new THREE.Vector3(0.73,-.5,vertTest[i].z))
    //   }
    // }
    // Convex = new ConvexBufferGeometry(Tvert);
    // let ZFT04 = new THREE.Mesh(Convex,new THREE.MeshLambertMaterial);
    // ZFT04.castShadow=true;
    // this.scene.add(ZFT04)
    // ZFT04.position.set(.09,.5,-1.532);
    // ZFT04.rotation.set(0,-32*Math.PI/180,0);

    // Tvert=[];
    // // ZFT 03
    // for(var i=vertTest.length-4;i<vertTest.length;i++){
    //   Tvert.push(new THREE.Vector3(vertTest[i].x,vertTest[i].y,vertTest[i].z))
    //   if(i%2==0){
    //     Tvert.push(new THREE.Vector3(0,-.5,vertTest[i].z))
    //   } else {
    //     Tvert.push(new THREE.Vector3(0.73,-.5,vertTest[i].z))
    //   }
    // }
    // Convex = new ConvexBufferGeometry(Tvert);
    // let ZFT05 = new THREE.Mesh(Convex,new THREE.MeshBasicMaterial);
    // ZFT05.castShadow=true;
    // this.scene.add(ZFT05)
    // ZFT05.position.set(.09,.5,-1.532);
    // ZFT05.rotation.set(0,-32*Math.PI/180,0);


    // var options = {
    //   onlyVisible: true,
    //   truncateDrawRange: true,
    //   binary: true,
    // };

    // ZFT05.name = "ZFT11";
    
    // let link = document.createElement('a');
    // link.style.display='none';
    // document.body.appendChild(link);

    // var results=[];

    // this.exporter.parse(ZFT05,(result)=>{
    //   results.push(result);
    //   var blob = new Blob(results,{ type: 'text/plain' })
    //   link.href=URL.createObjectURL(blob);
    //   link.download='ZFT11.glb';
    //   link.click();
    // },options)



    // GOAL
    // var shape = this.CreateCANNONPlane(.15,.17,.8,0,380*Math.PI/180,15);
    let plane003 = new CANNON.Body({mass:0,material:this.GolfStageMaterial});
    plane003.addShape(shape)

    // outer shape
    // var shape = this.CreateCANNONCirclePlane(0,.5,.78,Math.PI*1.75,20);
    something.rotation.set(0,193 * Math.PI / 180,0);
    quat = new CANNON.Quaternion(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    quat.normalize();
    plane003.addShape(shape,new CANNON.Vec3(0,-.05,0),quat);

    // goal
    // var shape = this.CreateCANNONCirclePlane(0,.15,.17,6.7,8);

    plane003.addShape(shape,new CANNON.Vec3(0,0,0))

    quat = new CANNON.Quaternion(0.5,0,0,-.5);
    quat.normalize();

    plane003.addShape(new CANNON.Cylinder(.01,.01,.6,8),new CANNON.Vec3(0,0.3,0),quat)

    plane003.position.set(2.1255,0.035,0.2165);
    this.world02.addBody(plane003);
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
        vertTest.push(new CANNON.Vec3(Math.cos(i)*Oradius,H,Math.sin(i)*Oradius));
      } else {
        vertTest.push(new CANNON.Vec3(Math.cos(i)*Iradius,H,Math.sin(i)*Iradius));
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

  private trail;
  GolfTrail(){
    let circlePoints = [];
    var twoPI = Math.PI * 2;
    var index = 0;
    var scale = .05;
    var inc = twoPI / 32.0;

    for ( var i = 0; i <= twoPI + inc; i+= inc )  {
      var vector = new THREE.Vector3();
      vector.set( Math.cos( i ) * scale, Math.sin( i ) * scale, 0 );
      circlePoints[ index ] = vector;
      index ++;
    }

    this.trail = new TrailRenderer(this.scene,false);
    let trailM = TrailRenderer.createBaseMaterial(null);
    
    var trailLength = 20;
    this.trail.initialize(trailM,trailLength,false,0,circlePoints,this.GolfT);
    trailM.uniforms.headColor.value.set( 0, 0, 0, 0.2 );
    trailM.uniforms.tailColor.value.set( 1, 1, 1, 0.25);
    this.trail.activate();
  }

  MiniGolfRender(){
    if(this.GolfT){
      this.trail.advance();
    }
    this.debugger.update();
    for (var i = 0; i < this.meshes.length; i++) {
      this.meshes[i].position.copy(this.bodies[i].position);
      this.meshes[i].quaternion.copy(this.bodies[i].quaternion);
    }
    this.RenderGolfCursor();
    // this.CameraVec.setFromMatrixPosition(this.CameraPos.matrixWorld);
    // this.camera.position.lerp(this.CameraVec, 1);
    // this.camera.lookAt(this.GolfC.position.x,this.GolfC.position.y,this.GolfC.position.z)
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


  private CursorMoveObject: CANNON.Body;
  CreateCursorMoveObject() {
    this.CursorMoveObject = new CANNON.Body({ mass: 0 });
    this.CursorMoveObject.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, 1)));
    // this.CursorMoveObject.addShape(new CANNON.Sphere(0.2))
    this.world.addBody(this.CursorMoveObject);
  }


  private debugger;
  private LetterMaterial:CANNON.Material;
  private PlaneMaterial:CANNON.Material;
  private BalloonMaterial:CANNON.Material;
  InitCannon(): void {
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, 0);

    // gsap.delayedCall(1,()=>{
    //   this.world.gravity.set(0, -7, 0);
    // })
    
    this.LetterMaterial = new CANNON.Material("LetterMaterial");
    this.PlaneMaterial = new CANNON.Material("PlaneMaterial");
    let Contact = new CANNON.ContactMaterial(this.LetterMaterial,this.PlaneMaterial,{
      friction:0.5,
      restitution:0.5,
      // contactEquationStiffness: 100000,
      // frictionEquationRelaxation: 5
    });
    this.world.addContactMaterial(Contact);

    // this.BalloonMaterial = new CANNON.Material("BalloonMaterial");
    // let Contact02 = new CANNON.ContactMaterial(this.BalloonMaterial,this.BalloonMaterial,{
    //   restitution:0.5,
    // })
    // this.world02.addContactMaterial(Contact02);




    
  }


  BalloonCursor() {
    this.LastCursor.set(this.pos.x, this.pos.y, this.pos.z);
    this.mouseL.copy(this.mouse);
  }


  CreateHAB(name:string,W,H,Z,Lx,Ly,Lz,Px,Py,Pz,Ax,Ay,Az,RotateY,RotateZ){
    let E = new LetterProperty;
    this.LetterArray.push(E)

    E.type=2;

    E.Object3D = new THREE.Object3D();
    
    var material01 = new THREE.MeshMatcapMaterial({
      color:0xBCE4FF,
      matcap: this.BaseMatcap
    })
    var material02 = new THREE.MeshMatcapMaterial({
      color:0x8B8B8B,
      matcap: this.BaseMatcap
    })
    var material03 = new THREE.MeshMatcapMaterial({
      color:0xE7CDA1,
      matcap: this.BaseMatcap
    })
    this.loader.load(
      'assets/model/'+name+'.glb',
      (gltf) => {
        gltf.scene.traverse((node)=>{
          if(node instanceof THREE.Mesh){
            node.castShadow=true;
          }
        });
        E.Scene = gltf.scene;
        E.Scene.scale.set(.7,.7,.7);
        for(var i=0;i<E.Scene.children.length;i++){
          if(E.Scene.children[i].name=="Cylinder001"){
            E.Scene.children[""+i+""].material=material03;
          } else if (E.Scene.children[i].name=="Cylinder005"){
            E.Scene.children[""+i+""].material=material02;
          } else {
            E.Scene.children[""+i+""].material=material01;
          }
        }
        var object3d = new THREE.Object3D();
        object3d.add(E.Scene);
        object3d.position.set(Lx,Ly,Lz)
        object3d.rotation.set(-Math.PI/2,0,0)
        E.Object3D.add(object3d);
      }
    );


    E.ObjectBody = new CANNON.Body({ mass: 0 });
    // E.ObjectBody.allowSleep=true;

    if(name=="HAB"){
      let quat = new CANNON.Quaternion(.5,0,0,-.5);
      quat.normalize();
      E.ObjectBody.addShape(new CANNON.Cylinder(0.26,0.17,0.5,16),new CANNON.Vec3(0,0,0),quat);
      E.ObjectBody.addShape(new CANNON.Sphere(0.6),new CANNON.Vec3(0,.82,0));
    } else {
      E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(W,H,Z)),new CANNON.Vec3(0,0,0));
    }

    let quat = new THREE.Mesh();
    quat.rotation.set(0, RotateY, RotateZ);
    E.ObjectBody.quaternion.set(quat.quaternion.x, quat.quaternion.y, quat.quaternion.z, quat.quaternion.w);
    E.ObjectBody.position.set(Px, Py, Pz)

    this.world02.addBody(E.ObjectBody);
    this.bodies.push(E.ObjectBody);

    E.AttachPoint = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.03, .03, .03),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 })
    )
    E.AttachPoint.position.set(Ax, Ay, Az);
    E.AttachPointV = new THREE.Vector3();
    E.AttachPointV.set(Px, Py, Pz);
    E.Object3D.add(E.AttachPoint);
    this.scene.add(E.Object3D);
    this.meshes.push(E.Object3D);


    E.letterArray = [];
    E.letterArrayA = [];
    E.letterArray02=null;
    E.LConstraint02=null;


    let curveA = [];
    curveA.push(new THREE.Vector3(0.38,0.25,0.05));
    curveA.push(new THREE.Vector3(0.46,0.09,0.11));

    let lastBody: CANNON.Body;
    for (var i = 0; i < 2; i++) {
      let SphereBody = new CANNON.Body({ mass: i == 0 ? 0 : 0 });
      SphereBody.addShape(new CANNON.Box(new CANNON.Vec3(.01,.01,.01)));
      
      SphereBody.position.set(curveA[i].x,curveA[i].y,curveA[i].z);

      SphereBody.angularDamping = 0.99;
      SphereBody.linearDamping = 0.99;
      this.world02.addBody(SphereBody);
      E.letterArray.push(SphereBody);

      if (i != 0) {
        var distance = this.distance(SphereBody.position.x,SphereBody.position.y,SphereBody.position.y,lastBody.position.x,lastBody.position.y,lastBody.position.z);
        E.DConstraint = new CANNON.DistanceConstraint(SphereBody, lastBody, distance);
        // this.world02.addConstraint(E.DConstraint)

        E.LConstraint = new CANNON.LockConstraint(SphereBody, E.ObjectBody);
        // this.world02.addConstraint(E.LConstraint)
      }
      lastBody = SphereBody;
    }


    // anchor
    let anchorT = new THREE.Object3D();
    anchorT.add(new THREE.Mesh(new THREE.CylinderBufferGeometry(.04,.04,.2,24),
      material03));

    // ring 
    let ring = new THREE.Mesh(new THREE.TorusBufferGeometry(.045,.005,8,16),new THREE.MeshBasicMaterial({color:0xffffff}));
    ring.position.set(0,0.03,0)
    ring.rotation.set(Math.PI/2,0,0)
    anchorT.add(ring);
    anchorT.position.set(.5,0.05,.1);
    anchorT.rotation.set(15*Math.PI/180,0,-15*Math.PI/180)
    
    
    // attach point
    let point = new THREE.Mesh(new THREE.BoxBufferGeometry(.01,.01,.01), new THREE.MeshBasicMaterial({transparent:true,opacity:1}));
    point.position.set(-.05,0.03,0);
    anchorT.add(point);

    gsap.delayedCall(1,()=>{
      let vec3 = new THREE.Vector3();
      vec3.setFromMatrixPosition(point.matrixWorld);
      console.log("anchor")
      console.log(vec3)
    })

    this.scene.add(anchorT)
  }

  CreateBalloon(name:string,Px,Py,Pz,Cx,Cy,Cz,RotateX,RotateY,RotateZ) {
    let E = new LetterProperty;
    this.LetterArray.push(E)

    E.type=3;

    E.Object3D = new THREE.Object3D();
    this.loader.load(
      'assets/model/'+name+'.glb',
      (gltf) => {
        E.Scene = gltf.scene;
        E.Scene.scale.set(1.1,1.1,1.1)
        E.Scene.children["0"].position.set(0,-0.12,0);
        E.Scene.children["0"].material=this.BalloonM;
        E.Object3D.add(E.Scene);
      }
    );

    E.ObjectBody = new CANNON.Body({ mass: 1,material:this.BalloonMaterial });
    // E.ObjectBody.allowSleep=true;
    E.ObjectBody.addShape(new CANNON.Sphere(.135),new CANNON.Vec3(0,0.1,0));
    E.ObjectBody.addShape(new CANNON.Sphere(.11),new CANNON.Vec3(0,0,0));
      

    let quat = new THREE.Mesh();
    quat.rotation.set(RotateX, RotateY, RotateZ);
    E.ObjectBody.quaternion.set(quat.quaternion.x, quat.quaternion.y, quat.quaternion.z, quat.quaternion.w);
    E.ObjectBody.position.set(Px, Py, Pz)
    E.ObjectBody.angularDamping = 0.99;
    E.ObjectBody.linearDamping = 0.99;

    this.world02.addBody(E.ObjectBody);
    this.bodies.push(E.ObjectBody);

    E.AttachPoint = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.03, .03, .03),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 })
    )
    E.AttachPoint.position.set(0, -0.14, 0);
    E.AttachPointV = new THREE.Vector3();
    E.AttachPointV.set(Px, Py, Pz);
    E.Object3D.add(E.AttachPoint);
    this.scene.add(E.Object3D);
    this.meshes.push(E.Object3D);


    E.letterArray = [];
    E.letterArrayA = [];
    E.letterArray02=null;
    E.LConstraint02=null;


    let lastBody: CANNON.Body;
    for (var i = 0; i < 2; i++) {
      let SphereBody = new CANNON.Body({ mass: i == 0 ? 0 : 20 });
      SphereBody.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
      if(i==0){
        SphereBody.position.set(Cx, Cy, Cz);
      } else {
        SphereBody.position.set(Px, Py-0.2, Pz);
      }
      
      SphereBody.angularDamping = 0.99;
      SphereBody.linearDamping = 0.99;
      this.world02.addBody(SphereBody);
      E.letterArray.push(SphereBody);

      if (i != 0) {

        var distance = this.distance(SphereBody.position.x,SphereBody.position.y,SphereBody.position.z,lastBody.position.x,lastBody.position.y,lastBody.position.z)
        // E.DConstraint = new CANNON.DistanceConstraint(SphereBody, lastBody, distance);
        E.DConstraint = new CANNON.LockConstraint(SphereBody, lastBody);
        this.world02.addConstraint(E.DConstraint)

        E.LConstraint = new CANNON.LockConstraint(E.ObjectBody, SphereBody);
        this.world02.addConstraint(E.LConstraint)
      }
      lastBody = SphereBody;
    }

    gsap.delayedCall(.5,()=>{
      TweenLite.to(E.letterArray[0].position,1,{x:1.8,z:0});
    })
  }

  CreateSingleLineLetter(name:string,W,H,Z,Lx,Ly,Lz,Px,Py,Pz,Ax,Ay,Az,RotateY,RotateZ) {
    let E = new LetterProperty;
    this.LetterArray.push(E)

    E.type=0;

    E.Object3D = new THREE.Object3D();
    this.loader.load(
      'assets/model/'+name+'.glb',
      (gltf) => {
        gltf.scene.traverse((node)=>{
          if(node instanceof THREE.Mesh){
            node.castShadow=true;
          }
        });
        E.Scene = gltf.scene;
        E.Scene.children["0"].position.set(Lx,Ly,Lz);
        E.Scene.children["0"].rotation.x=0;
        E.Scene.scale.set(.7,.7,.7);
        E.Scene.children["0"].material=this.BalloonM;
        E.Object3D.add(E.Scene);
      }
    );

    E.ObjectBody = new CANNON.Body({ mass: 1,material:this.LetterMaterial });
    // E.ObjectBody.allowSleep=true;

    if(name=="U"){
      E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(0.1,0.3,0.07)),new CANNON.Vec3(0,0,0));
    } else {
      E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(W,H,Z)),new CANNON.Vec3(0,0,0));
    }

    let quat = new THREE.Mesh();
    quat.rotation.set(0, RotateY, RotateZ);
    E.ObjectBody.quaternion.set(quat.quaternion.x, quat.quaternion.y, quat.quaternion.z, quat.quaternion.w);
    E.ObjectBody.position.set(Px, Py, Pz)

    this.world.addBody(E.ObjectBody);
    this.bodies.push(E.ObjectBody);

    E.AttachPoint = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.03, .03, .03),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 })
    )
    E.AttachPoint.position.set(Ax, Ay, Az);
    E.AttachPointV = new THREE.Vector3();
    E.AttachPointV.set(Px, Py, Pz);
    E.Object3D.add(E.AttachPoint);
    this.scene.add(E.Object3D);
    this.meshes.push(E.Object3D);


    E.letterArray = [];
    E.letterArrayA = [];
    E.letterArray02=null;
    E.LConstraint02=null;


    let lastBody: CANNON.Body;
    for (var i = 0; i < 2; i++) {
      let SphereBody = new CANNON.Body({ mass: i == 0 ? 0 : 20 });
      SphereBody.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
      SphereBody.position.set(Px,  i == 0 ? 5 : Py+Ay, Pz);

      SphereBody.angularDamping = 0.99;
      SphereBody.linearDamping = 0.99;
      this.world.addBody(SphereBody);
      E.letterArray.push(SphereBody);

      if (i != 0) {
        E.DConstraint = new CANNON.DistanceConstraint(SphereBody, lastBody, 5-(Py+Ay));
        this.world.addConstraint(E.DConstraint)

          E.LConstraint = new CANNON.LockConstraint(E.ObjectBody, SphereBody);
          this.world.addConstraint(E.LConstraint)

      }
      lastBody = SphereBody;
    }
  }

  CreateDoubleLineLetter(name:string,W,H,Z,Lx,Ly,Lz,Px,Py,Pz,Ax,Ay,Az,Px01,Py01,Pz01,Ax02,Ay02,Az02,Px02,Py02,Pz02,RotateY,RotateZ) {
    let E = new LetterProperty;
    this.LetterArray.push(E)

    E.type=1;

    E.Object3D = new THREE.Object3D();
    this.loader.load(
      'assets/model/'+name+'.glb',
      (gltf) => {
        gltf.scene.traverse((node)=>{
          if(node instanceof THREE.Mesh){
            node.castShadow=true;
          }
        });
        E.Scene = gltf.scene;
        E.Scene.children["0"].position.set(Lx,Ly,Lz);
        E.Scene.children["0"].rotation.x=0;
        E.Scene.scale.set(.7,.7,.7);
        E.Scene.children["0"].material=this.BalloonM;
        E.Object3D.add(E.Scene);
      }
    );

    E.ObjectBody = new CANNON.Body({ mass: 1,material:this.LetterMaterial });
    E.ObjectBody.allowSleep=true;

    let quatT = new THREE.Mesh();
    let quat = new CANNON.Quaternion();
    if(name=="Z"){
      E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(0.1,0.24,0.07)),new CANNON.Vec3(0.24,0.125,0));
      E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(0.1,0.24,0.07)),new CANNON.Vec3(-0.24,0.125,0));
      E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(0.1,0.09,0.07)),new CANNON.Vec3(0,-0.28,0));

      quatT.rotation.set(0, 0, -60*Math.PI/180);
      quat.set(quatT.quaternion.x, quatT.quaternion.y, quatT.quaternion.z, quatT.quaternion.w);
      E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(0.075,0.1,0.07)),new CANNON.Vec3(-0.21,-0.16,0),quat);

      quatT.rotation.set(0, 0, -25*Math.PI/180);
      quat.set(quatT.quaternion.x, quatT.quaternion.y, quatT.quaternion.z, quatT.quaternion.w);
      E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(0.075,0.1,0.07)),new CANNON.Vec3(-0.12,-0.25,0),quat);

      quatT.rotation.set(0, 0, 60*Math.PI/180);
      quat.set(quatT.quaternion.x, quatT.quaternion.y, quatT.quaternion.z, quatT.quaternion.w);
      E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(0.075,0.1,0.07)),new CANNON.Vec3(0.21,-0.16,0),quat);

      quatT.rotation.set(0, 0, 25*Math.PI/180);
      quat.set(quatT.quaternion.x, quatT.quaternion.y, quatT.quaternion.z, quatT.quaternion.w);
      E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(0.075,0.1,0.07)),new CANNON.Vec3(0.12,-0.25,0),quat);
    } else {
      E.ObjectBody.addShape(new CANNON.Box(new CANNON.Vec3(W,H,Z)),new CANNON.Vec3(0,0,0));
    }
    
    quatT.rotation.set(0, RotateY, RotateZ);
    E.ObjectBody.quaternion.set(quatT.quaternion.x, quatT.quaternion.y, quatT.quaternion.z, quatT.quaternion.w);
    E.ObjectBody.position.set(Px, Py, Pz)

    this.world.addBody(E.ObjectBody);
    this.bodies.push(E.ObjectBody);

    E.AttachPoint = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.03, .03, .03),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 })
    )
    E.AttachPoint.position.set(Ax, Ay, Az);
    E.AttachPointV = new THREE.Vector3();
    E.AttachPointV.set(Ax, Ay, Az);
    E.Object3D.add(E.AttachPoint);

    // second line
    E.AttachPoint02 = new THREE.Mesh(
      new THREE.BoxBufferGeometry(.03, .03, .03),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 })
    )
    E.AttachPoint02.position.set(Ax02, Ay02, Az02);
    E.AttachPointV02 = new THREE.Vector3();
    E.AttachPointV02.set(Ax02, Ay02, Az02);
    E.Object3D.add(E.AttachPoint02);


    this.scene.add(E.Object3D);
    this.meshes.push(E.Object3D);


    E.letterArray = [];
    E.letterArrayA = [];
    
    E.letterArray02 = [];
    E.letterArrayA02 = [];

    let lastBody: CANNON.Body;
    for (var i = 0; i < 2; i++) {
      let SphereBody = new CANNON.Body({ mass: i == 0 ? 0 : 100 });
      SphereBody.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
      SphereBody.position.set(Px01,  i == 0 ? 5 : Py01, Pz01);

      SphereBody.angularDamping = 0.5;
      SphereBody.linearDamping = 0.5;
      this.world.addBody(SphereBody);
      E.letterArray.push(SphereBody);

      if (i != 0) {
        E.DConstraint = new CANNON.DistanceConstraint(SphereBody, lastBody, 5-Py01);
        this.world.addConstraint(E.DConstraint)
        if (i == 1) {
          E.LConstraint = new CANNON.LockConstraint(E.ObjectBody, SphereBody);
          this.world.addConstraint(E.LConstraint)
        }
      }
      lastBody = SphereBody;
    }

    for (var i = 0; i < 2; i++) {
      let SphereBody = new CANNON.Body({ mass: i == 0 ? 0 : 100 });
      SphereBody.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
      SphereBody.position.set(Px02,  i == 0 ? 5 : Py02, Pz02);

      SphereBody.angularDamping = 0.5;
      SphereBody.linearDamping = 0.5;
      this.world.addBody(SphereBody);
      E.letterArray02.push(SphereBody);

      if (i != 0) {
        E.DConstraint02 = new CANNON.DistanceConstraint(SphereBody, lastBody, 5-Py02);
        this.world.addConstraint(E.DConstraint02)
        if (i == 1) {
          E.LConstraint02 = new CANNON.LockConstraint(E.ObjectBody, SphereBody);
          this.world.addConstraint(E.LConstraint02)
        }
      }
      lastBody = SphereBody;
    }
  }

  CreateBalloonStuff(){
    //tree 
    // this.CreateTree("tree01",-2,0,1,1,1,1);
    // this.CreateTree("tree02",2,0,0,1,1,1);
    // this.CreateTree("tree01",2.2,0,1,1,1,1);

    // bench
    var TreeMaterial02 = new THREE.MeshMatcapMaterial({
      color:0xE7D39F,
      matcap:this.BaseMatcap
    })
    // this.loader.load(
    //   'assets/model/bench.glb',
    //   (gltf) => {
    //     gltf.scene.position.set(1,0.06,1);
    //     gltf.scene.scale.set(.75,.75,.75);
    //     gltf.scene.children["0"].position.set(0,0,0);
    //     gltf.scene.children["0"].rotation.set(0,-20*Math.PI/180,0);
    //     gltf.scene.children["0"].material=TreeMaterial02;
    //     this.scene.add(gltf.scene);
    //   }
    // );
  }


  CreateTree(name:string,Px,Py,Pz,Sx,Sy,Sz){
    var TreeMaterial01 = new THREE.MeshMatcapMaterial({
      color:0x95E79B,
      matcap:this.BaseMatcap
    })
    var TreeMaterial02 = new THREE.MeshMatcapMaterial({
      color:0xE7D39F,
      matcap:this.BaseMatcap
    })
    this.loader.load(
      'assets/model/'+name+'.glb',
      (gltf) => {
        gltf.scene.position.set(Px,Py,Pz);
        gltf.scene.scale.set(Sx,Sy,Sz);
        gltf.scene.children["0"].position.set(0,0,0)
        gltf.scene.children["0"].children[0].material=TreeMaterial01;
        gltf.scene.children["0"].children[1].material=TreeMaterial02;
        this.scene.add(gltf.scene);
      }
    );
  }

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

  CursorBegin() {
    this.FirstCursor.set(this.pos.x, this.pos.y, this.pos.z);
    this.LastCursor.set(this.pos.x, this.pos.y, this.pos.z);
    this.mouseF.copy(this.mouse);
    this.mouseL.copy(this.mouse);
  }

  CheckLetterIntersect() {
    var LineCurve2 = new THREE.LineCurve(this.mouseF,this.mouseL);;
    var dis = this.distanceVec2(this.mouseF.x,this.mouseF.y,this.mouseL.x,this.mouseL.y);
    var Points = LineCurve2.getPoints(Math.floor(dis/0.004));
    var Ma = new THREE.MeshBasicMaterial({color:0x000000})
    var intersect;
    for(var i=0;i<Points.length;i++){
      this.raycaster.setFromCamera(Points[i],this.camera);
      intersect = this.raycaster.intersectObjects(this.Lines,false)
      for(var j=0;j<intersect.length;j++){
        intersect[""+j+""].object.material=Ma;
        this.Cutletter(intersect[""+j+""].object.id,intersect[""+j+""].point);
      }
    }
  }

  Cutletter(Iid,Ipoint:THREE.Vector3){
    for (var i = 0; i < this.LetterArray.length; i++) {
      if(this.LetterArray[i].Line.id == Iid && this.LetterArray[i].LConstraint != null){
        this.world.removeConstraint(this.LetterArray[i].DConstraint);
        this.world.removeConstraint(this.LetterArray[i].LConstraint);
        this.world02.removeConstraint(this.LetterArray[i].DConstraint);
        this.world02.removeConstraint(this.LetterArray[i].LConstraint);
        this.LetterArray[i].LConstraint = null;

        // bottom
        let curve
        if(this.LetterArray[i].type==2){
          TweenLite.to(this.LetterArray[i].ObjectBody.position,4,{y:4,ease:Power1.easeIn})
          curve = new THREE.LineCurve3(Ipoint,
            this.LetterArray[i].letterArray[1].position);
        } else if (this.LetterArray[i].type==3){
          TweenLite.to(this.LetterArray[i].ObjectBody.velocity,4,{y:5,ease:Power0.easeNone})
          TweenLite.to(this.LetterArray[i].ObjectBody.quaternion,4,{z:0,ease:Power0.easeNone})
          curve = new THREE.LineCurve3(Ipoint,
            this.LetterArray[i].letterArray[0].position);
        } else {
          curve = new THREE.LineCurve3(Ipoint,
            this.LetterArray[i].AttachPointV);
        }

        let point = curve.getPoints(3);

        let distance = this.distance(point[0].x, point[0].y, point[0].z,
          point[1].x, point[1].y, point[1].z);

        let lastbody: CANNON.Body;
        for (var j = 0; j < 4; j++) {
          let body;
          if(this.LetterArray[i].type==2){
            body = new CANNON.Body({ mass: j == 3 ? 0 : .1 });
          } else {
            body = new CANNON.Body({ mass: j == 3 ? .1 : .1 });
          }
          body.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
          body.angularDamping = 0.5;
          body.linearDamping = 0.5;
          body.position.set(point[j].x, point[j].y, point[j].z);
          this.world.addBody(body);
          this.LetterArray[i].letterArrayA.push(body);
          if (j != 0) {
            this.world.addConstraint(new CANNON.DistanceConstraint(body, lastbody, distance))
          }
          lastbody = body;
        }

        // top 
        if(this.LetterArray[i].type==2){
          curve = new THREE.LineCurve3(this.LetterArray[i].AttachPointV,
          Ipoint);
        } else if (this.LetterArray[i].type==3){
          curve = new THREE.LineCurve3(this.LetterArray[i].AttachPointV,
            Ipoint);
        } else {
          curve = new THREE.LineCurve3(new THREE.Vector3(this.LetterArray[i].letterArray[0].position.x,this.LetterArray[i].letterArray[0].position.y,this.LetterArray[i].letterArray[0].position.z),
          Ipoint);
        }

        this.world.remove(this.LetterArray[i].letterArray[1])
        this.world.remove(this.LetterArray[i].letterArray[0])
        this.world02.remove(this.LetterArray[i].letterArray[1])
        this.world02.remove(this.LetterArray[i].letterArray[0])
        this.LetterArray[i].letterArray=[];
        this.scene.remove(this.LetterArray[i].StringT);

        point = curve.getPoints(3);
        distance = this.distance(point[0].x, point[0].y, point[0].z,
          point[1].x, point[1].y, point[1].z);
        
        for (var j = 0; j < 4; j++) {
          let body = new CANNON.Body({ mass: j == 0 ? 0 : 1 });
          body.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
          body.angularDamping = 0.5;
          body.linearDamping = 0.5;
          body.position.set(point[j].x, point[j].y, point[j].z);
          this.world.addBody(body);
          this.LetterArray[i].letterArray.push(body);
          if (j != 0) {
            this.world.addConstraint(new CANNON.DistanceConstraint(body, lastbody, distance));
          }
          lastbody = body;
        }

        let Ti=i;
        
        if(this.LetterArray[Ti].type==1){
          // double line
          if(this.LetterArray[Ti].LConstraint02==null){
            gsap.delayedCall(5,()=>{
              for(var j=0;j<4;j++){
                this.world.remove(this.LetterArray[Ti].letterArray[j]);
                this.world.remove(this.LetterArray[Ti].letterArrayA[j]);
                this.world.remove(this.LetterArray[Ti].letterArray02[j]);
                this.world.remove(this.LetterArray[Ti].letterArrayA02[j]);
              }
              this.LetterArray[Ti].letterArray=null;
              this.LetterArray[Ti].letterArrayA=null;
              this.LetterArray[Ti].letterArray02=null;
              this.LetterArray[Ti].letterArrayA02=null;
              for(var k=0;k<this.LetterArray.length;k++){
                if(this.LetterArray[k].letterArray==null && this.LetterArray[k].letterArray02==null){
                  this.LetterArray[k].ObjectBody.sleep();
                }
              }
            });
          }
        } else {
          // single line
          gsap.delayedCall(5,()=>{
            for(var j=0;j<4;j++){
              this.world.remove(this.LetterArray[Ti].letterArray[j]);
              this.world.remove(this.LetterArray[Ti].letterArrayA[j]);
            }
            this.LetterArray[Ti].letterArray=null;
            this.LetterArray[Ti].letterArrayA=null;
            for(var k=0;k<this.LetterArray.length;k++){
              if(this.LetterArray[k].letterArray==null && this.LetterArray[k].letterArray02==null){
                this.LetterArray[k].ObjectBody.sleep();
              }
            }
          });
        }
      }
      if(this.LetterArray[i].Line2){
        if(this.LetterArray[i].Line2.id == Iid && this.LetterArray[i].LConstraint02 != null){
          this.world.removeConstraint(this.LetterArray[i].DConstraint02);
          this.world.removeConstraint(this.LetterArray[i].LConstraint02);
          this.LetterArray[i].LConstraint02 = null;

          // bottom
          let curve = new THREE.LineCurve3(Ipoint, 
            this.LetterArray[i].AttachPointV02);

          let point = curve.getPoints(3);

          let distance = this.distance(point[0].x, point[0].y, point[0].z,
            point[1].x, point[1].y, point[1].z);

          let lastbody: CANNON.Body;
          for (var j = 0; j < 4; j++) {
            let body = new CANNON.Body({ mass: j == 3 ? .1 : .1 });
            body.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
            body.angularDamping = 0.5;
            body.linearDamping = 0.5;
            body.position.set(point[j].x, point[j].y, point[j].z);
            this.world.addBody(body);
            this.LetterArray[i].letterArrayA02.push(body);
            if (j != 0) {
              this.world.addConstraint(new CANNON.DistanceConstraint(body, lastbody, distance))
            }
            lastbody = body;
          }

          // top 
          curve = new THREE.LineCurve3(new THREE.Vector3(this.LetterArray[i].letterArray02[0].position.x,this.LetterArray[i].letterArray02[0].position.y,this.LetterArray[i].letterArray02[0].position.z),
            Ipoint);

          this.world.remove(this.LetterArray[i].letterArray02[1])
          this.world.remove(this.LetterArray[i].letterArray02[0])
          this.LetterArray[i].letterArray02=[];
          this.scene.remove(this.LetterArray[i].StringT02);

          point = curve.getPoints(3);

          distance = this.distance(point[0].x, point[0].y, point[0].z,
            point[1].x, point[1].y, point[1].z);
          
          for (var j = 0; j < 4; j++) {
            let body = new CANNON.Body({ mass: j == 0 ? 0 : 1 });
            body.addShape(new CANNON.Box(new CANNON.Vec3(.01, .01, .01)));
            body.angularDamping = 0.5;
            body.linearDamping = 0.5;
            body.position.set(point[j].x, point[j].y, point[j].z);
            this.world.addBody(body);
            this.LetterArray[i].letterArray02.push(body);
            if (j != 0) {
              this.world.addConstraint(new CANNON.DistanceConstraint(body, lastbody, distance));
            }
            lastbody = body;
          }

          let Ti=i;
        
          if(this.LetterArray[Ti].LConstraint==null){
            gsap.delayedCall(5,()=>{
              for(var j=0;j<4;j++){
                this.world.remove(this.LetterArray[Ti].letterArray[j]);
                this.world.remove(this.LetterArray[Ti].letterArrayA[j]);
                this.world.remove(this.LetterArray[Ti].letterArray02[j]);
                this.world.remove(this.LetterArray[Ti].letterArrayA02[j]);
              }
              this.LetterArray[Ti].letterArray=null;
              this.LetterArray[Ti].letterArrayA=null;
              this.LetterArray[Ti].letterArray02=null;
              this.LetterArray[Ti].letterArrayA02=null;
              for(var k=0;k<this.LetterArray.length;k++){
                if(this.LetterArray[k].letterArray==null && this.LetterArray[k].letterArray02==null){
                  this.LetterArray[k].ObjectBody.sleep();
                }
              }
            });
          }
        }
      }
    }
  }

  LastScene(): void {
    
  }

  SecondScene(): void {
    this.InitSecondCannon();
    this.CannonPlane();
    this.CreateSmoke();
    this.CreateFireExtinguisher();
    this.popIt();
  }

  InitSecondCannon(): void {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -2, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world02 = new CANNON.World();
  }

  CannonPlane() {
    var shape = new CANNON.Plane();
    var body = new CANNON.Body({ mass: 0,material:this.PlaneMaterial });
    body.addShape(shape);
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    body.position.set(0, 0, 0);
    this.world.addBody(body);
    this.world02.addBody(body)
  }

  private smoke = new THREE.MeshLambertMaterial({ color: 0x7f8eb8, emissive: 0xe0e0e0 });
  CreateSmoke() {
    this.smokeThree = new THREE.Mesh(
      new THREE.SphereBufferGeometry(.068),
      this.smoke);
    this.smokeThree.castShadow = true;

    let boopMat = new THREE.MeshBasicMaterial({ color: 0xff6262 });

    this.boop = new THREE.Mesh(new THREE.BoxBufferGeometry(.1, .025, .025),
      boopMat)

    let stuff02 = {
      color: "#ff6262"
    }

    var f6 = this.gui.addFolder("boop");
    f6.addColor(stuff02, "color")
      .onChange(() => {
        boopMat.color.set(stuff02.color);
      })

    let stuff = {
      shininess: 0.7,
      specular: "#ffffff",
      color: "#7f8eb8",
      emissive: "#e0e0e0",
    }
    var f4 = this.gui.addFolder("SMOKE");
    f4.addColor(stuff, 'color')
      .onChange(() => {
        this.smoke.color.set(stuff.color);
      });
    f4.addColor(stuff, 'emissive')
      .onChange(() => {
        this.smoke.emissive.set(stuff.emissive);
      });
  }

  private pipem = new THREE.MeshLambertMaterial({ color: 0x4d67b1, emissive: 0xe1e1e1 });
  CreateFireExtinguisher() {

    let stuff = {
      roughness: 0.7,
      metalness: 0.25,
      color: "#7f8eb8",
      emissive: "#d2d2d2",
    }
    var f3 = this.gui.addFolder("PIPE");
    f3.addColor(stuff, 'color')
      .onChange(() => {
        this.pipem.color.set(stuff.color);
      });
    f3.addColor(stuff, 'emissive')
      .onChange(() => {
        this.pipem.emissive.set(stuff.emissive);
      });


    let FEMaterial = new THREE.MeshStandardMaterial({ color: 0xcd7f7f, emissive: 0xcd5151, metalness: 0.25, roughness: 0.7, });
    let FEMaterial02 = new THREE.MeshStandardMaterial({ color: 0x4d67b1, emissive: 0xdcdcdc, metalness: 0.25, roughness: 0.7, });
    let N = 27;
    let lastBody = null;
    let distaince = .04;
    let x = 0;
    let height = .595;
    let pipeshape = new CANNON.Cylinder(.025, .025, .04, 8);
    let quat = new CANNON.Quaternion(0.5, 0, 0, -0.5);
    quat.normalize();
    for (var i = 0; i < N; i++) {
      var pipebody = new CANNON.Body({ mass: i == 0 ? 0 : 1 });
      pipebody.addShape(pipeshape, new CANNON.Vec3, quat);
      pipebody.position.set(i * distaince + x, height, 0);
      pipebody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);
      pipebody.angularDamping = 0.99;
      pipebody.linearDamping = 0.99;
      this.world02.addBody(pipebody);
      this.PipeCannon.push(pipebody);

      // let pipe3 = this.Pipe.clone();
      // this.PipeThree.push(pipe3);
      // this.scene.add(pipe3);

      if (lastBody !== null) {
        let c = new CANNON.LockConstraint(pipebody, lastBody);
        this.world02.addConstraint(c);
      }

      // Keep track of the lastly added body
      lastBody = pipebody;
    }

    // LAST PIPE
    this.lastpipe = new CANNON.Body({ mass: 1 });
    let cylinderShape = new CANNON.Cylinder(.06, .08, .16, 16);
    this.lastpipe.addShape(cylinderShape, new CANNON.Vec3, quat);


    this.lastpipe.position.set(N * distaince + x + 0.06, height, 0);
    this.lastpipe.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);
    this.lastpipe.angularDamping = 0.99;
    this.lastpipe.linearDamping = 0.99;

    this.world02.addBody(this.lastpipe);
    // this.PipeCannon.push(this.lastpipe);
    this.bodies02.push(this.lastpipe);

    let c = new CANNON.LockConstraint(this.lastpipe, lastBody);
    this.world02.addConstraint(c);

    // pipe part
    let lastpipegeometry = new THREE.CylinderBufferGeometry(.06, .08, .16, 16);
    let lastpipematerial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    let lasspipethree = new THREE.Mesh(lastpipegeometry, lastpipematerial);
    lasspipethree.castShadow = true;
    let lastthreemesh = new THREE.Object3D();

    this.lastthreepipe = new THREE.Object3D();
    this.loader = new GLTFLoader();
    this.loader.load(
      'assets/model/pipe.glb',
      (gltf) => {
        lastthreemesh = gltf.scene;
        lastthreemesh.children["0"].material.copy(
          FEMaterial);
        this.lastthreepipe.add(lastthreemesh)
      }
    );


    let boxGeo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    var invisible = new THREE.MeshBasicMaterial({ color: 0xf0f0f0, transparent: true, opacity: 0 });
    // smoke start
    this.FETap = new THREE.Mesh(boxGeo, invisible);
    this.FETap.position.set(0, 0, 0);
    // smoke end
    this.SmokePoint = new THREE.Mesh(boxGeo, invisible);
    this.SmokePoint.position.set(0, -1.5, 0);
    // reset point
    this.ResetPoint = new THREE.Mesh(boxGeo, invisible);
    this.ResetPoint.position.set(0, 0, 0);


    this.lastthreepipe.add(this.SmokePoint);
    this.lastthreepipe.add(this.ResetPoint);
    this.lastthreepipe.add(this.FETap);
    this.lastthreepipe.add(lasspipethree);

    this.scene.add(this.lastthreepipe);
    // this.PipeThree.push(this.lastthreepipe)
    this.meshes02.push(this.lastthreepipe)

    let febox = new THREE.CylinderBufferGeometry(0.06, 0.08, 0.16, 16);
    let Dragmaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
    // DRAG POINT THREE
    let DragPointThree = new THREE.Mesh(febox, Dragmaterial);
    DragPointThree.position.set(this.lastpipe.position.x, height, 0);
    DragPointThree.rotation.set(0, 0, Math.PI / 2);
    this.scene.add(DragPointThree);
    this.DragPointThree.push(DragPointThree);


    this.loader.load(
      // 'assets/model/extinguisher.glb',
      'assets/model/shitty.glb',
      (gltf) => {
        gltf.scene.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
          }
        });
        this.FireExtinguisher = gltf.scene;
        this.FireExtinguisher.children["0"].children["0"].material.copy(
          FEMaterial);
        this.FireExtinguisher.children["0"].children["2"].material.copy(
          FEMaterial02);

        this.FETHREE.add(this.FireExtinguisher);
      }
    );
    this.FETHREE.position.set(-0.1, -0.3, 0);
    this.FETHREE.rotation.set(0 * Math.PI / 180, -15 * Math.PI / 180, 0 * Math.PI / 180);
    this.FETHREE.castShadow = true;
    this.scene.add(this.FETHREE);


    // CANNON FE
    var body = new CANNON.Body({ mass: 0 });
    var CylinderShape = new CANNON.Cylinder(0.3, 0.3, 1.24, 16);
    quat = new CANNON.Quaternion(0.5, 0, 0, -0.5);
    quat.normalize();

    let y = 0.2;
    let sphere = new CANNON.Sphere(0.3);
    let sphere2 = new CANNON.Sphere(0.063);

    let cylinder = new CANNON.Cylinder(0.063, 0.063, 0.165, 8);
    let cylinder02 = new CANNON.Cylinder(0.04, 0.04, 0.05, 8);
    let cylinder03 = new CANNON.Cylinder(0.063, 0.063, 0.025, 16);
    let top = 0.95;

    let box = new CANNON.Box(new CANNON.Vec3(0.18, 0.02, 0.05));
    let box02 = new CANNON.Box(new CANNON.Vec3(0.18, 0.02, 0.06));
    let box03 = new CANNON.Box(new CANNON.Vec3(0.05, 0.05, 0.01));
    let box04 = new CANNON.Box(new CANNON.Vec3(0.05, 0.025, 0.01));

    let box05 = new CANNON.Box(new CANNON.Vec3(0.08, 0.02, 0.06));

    let box06 = new CANNON.Box(new CANNON.Vec3(0.1, 0.01, 0.06));



    body.addShape(cylinder, new CANNON.Vec3(0, 0.7 + y, 0), quat);

    quat = new CANNON.Quaternion(0.5, 0.5, 0.5, 0.5);
    quat.normalize();
    body.addShape(cylinder02, new CANNON.Vec3(0.09, 0.694 + y, 0), quat);
    body.addShape(cylinder03, new CANNON.Vec3(-0.015, 0.7 + y, 0.075));
    quat = new CANNON.Quaternion(-0.07, 0.5, 0, 0);
    quat.normalize();

    body.addShape(box, new CANNON.Vec3(-0.28, 0.76 + y, 0), quat);

    quat = new CANNON.Quaternion(0.11, 0.5, 0, 0);
    quat.normalize();
    body.addShape(box02, new CANNON.Vec3(-0.07, 0.9 + y, 0), quat);

    body.addShape(box03, new CANNON.Vec3(-0.05, 0.84 + y, 0.05));
    body.addShape(box04, new CANNON.Vec3(0.05, 0.815 + y, 0.05));

    body.addShape(box03, new CANNON.Vec3(-0.05, 0.84 + y, -0.05));
    body.addShape(box04, new CANNON.Vec3(0.05, 0.815 + y, -0.05));

    body.addShape(box05, new CANNON.Vec3(-0.31, 0.98 + y, 0));

    body.addShape(box06, new CANNON.Vec3(0, 0.79 + y, 0));

    for (let i = 0; i < 4; i++) {
      body.addShape(sphere2, new CANNON.Vec3(0, top, 0));
      top -= 0.03;
    }

    let boxCy01 = new CANNON.Box(new CANNON.Vec3(0.025, 0.0275, 0.0275));
    quat = new CANNON.Quaternion(0.5, 0, 0, 0.25);
    quat.normalize();
    body.addShape(boxCy01, new CANNON.Vec3(0.09, 0.694 + y, 0), quat);
    body.addShape(boxCy01, new CANNON.Vec3(0.09, 0.694 + y, 0));

    let boxCy02 = new CANNON.Box(new CANNON.Vec3(0.045, 0.045, 0.015));
    body.addShape(boxCy02, new CANNON.Vec3(-0.015, 0.7 + y, 0.075));
    quat = new CANNON.Quaternion(0.5, 0.25, 0, 0);
    quat.normalize();
    body.addShape(boxCy02, new CANNON.Vec3(-0.015, 0.7 + y, 0.075), quat);


    quat = new CANNON.Quaternion(0.5, 0, 0, 0.5);
    quat.normalize();
    let cylinder04 = new CANNON.Cylinder(0.3, 0.26, 0.15, 16);
    let cylinder05 = new CANNON.Cylinder(0.26, 0.1, 0.15, 16);
    body.addShape(cylinder04, new CANNON.Vec3(0, 0.4 + y, 0), quat);
    body.addShape(cylinder05, new CANNON.Vec3(0, 0.54 + y, 0), quat);


    body.addShape(CylinderShape, new CANNON.Vec3(0, -.28 + y, 0), quat)

    top = 0.525;
    for (let i = 0; i < 25; i++) {
      body.addShape(sphere, new CANNON.Vec3(0, top, 0));
      top -= 0.05;
    }

    body.position.set(-0.1, -0.3, 0);
    this.world02.addBody(body);
    this.world.addBody(body);

    body.position.copy(new CANNON.Vec3(this.FETHREE.position.x, this.FETHREE.position.y, this.FETHREE.position.z));
    body.quaternion.copy(new CANNON.Quaternion(this.FETHREE.quaternion.x, this.FETHREE.quaternion.y, this.FETHREE.quaternion.z, this.FETHREE.quaternion.w));

    this.PipeCannon[0].position.set(0, 0.59, 0.02);
    this.CreateFirstDirectionPipe();

    var params = {
      roughness: 0.7,
      metalness: 0.25,
      color: "#ffffff",
      emissive: "#e65a5a",
    }

    var f1 = this.gui.addFolder("Fire Extinguisher");
    f1.add(params, 'metalness', 0, 1)
      .onChange(() => {
        FEMaterial.metalness = params.metalness;
        this.FireExtinguisher.children["0"].children["0"].material.copy(
          FEMaterial);
        lastthreemesh.children["0"].material.copy(
          FEMaterial);
      });
    f1.add(params, 'roughness', 0, 1)
      .onChange(() => {
        FEMaterial.roughness = params.roughness;
        this.FireExtinguisher.children["0"].children["0"].material.copy(
          FEMaterial);
        lastthreemesh.children["0"].material.copy(
          FEMaterial);
      });
    f1.addColor(params, 'color')
      .onChange(() => {
        FEMaterial.color.set(params.color);
        this.FireExtinguisher.children["0"].children["0"].material.copy(
          FEMaterial);
        lastthreemesh.children["0"].material.copy(
          FEMaterial);
      });
    f1.addColor(params, 'emissive')
      .onChange(() => {
        FEMaterial.emissive.set(params.emissive);
        this.FireExtinguisher.children["0"].children["0"].material.copy(
          FEMaterial);
        lastthreemesh.children["0"].material.copy(
          FEMaterial);
      });

    var f2 = this.gui.addFolder("Fire Extinguisher 02");
    f2.add(params, 'metalness', 0, 1)
      .onChange(() => {
        FEMaterial02.metalness = params.metalness;
        this.FireExtinguisher.children["0"].children["2"].material.copy(
          FEMaterial02);
      });
    f2.add(params, 'roughness', 0, 1)
      .onChange(() => {
        FEMaterial02.roughness = params.roughness;
        this.FireExtinguisher.children["0"].children["2"].material.copy(
          FEMaterial02);
      });
    f2.addColor(params, 'color')
      .onChange(() => {
        FEMaterial02.color.set(params.color);
        this.FireExtinguisher.children["0"].children["2"].material.copy(
          FEMaterial02);
      });
    f2.addColor(params, 'emissive')
      .onChange(() => {
        FEMaterial02.emissive.set(params.emissive);
        this.FireExtinguisher.children["0"].children["2"].material.copy(
          FEMaterial02);
      });
  }

  popIt() {
    // Fan
    let quat = new CANNON.Quaternion();
    quat = new CANNON.Quaternion(0.5, 0, 0, -0.5);
    quat.normalize();


    let stuffMaterial = new THREE.MeshLambertMaterial({ color: 0x7f8eb8, emissive: 0x506493 });
    let params = {
      roughness: 0.7,
      metalness: 0.25,
      color: "#7f8eb8",
      emissive: "#ffffff",
    }
    var f5 = this.gui.addFolder("Stuffs");
    f5.addColor(params, 'color')
      .onChange(() => {
        stuffMaterial.color.set(params.color);
      });
    f5.addColor(params, 'emissive')
      .onChange(() => {
        stuffMaterial.emissive.set(params.emissive);
      });


    quat = new CANNON.Quaternion(0.5, -0.5, 0.5, 0.5);
    let tempCannon = new CANNON.Body({ mass: 0 });
    let tempThree = new THREE.Mesh(new THREE.BoxBufferGeometry(.2, .1, .2));

    let collided = [];
    let unique = [];

    let boxX = .12;
    let boxY = .12;
    let boxZ = .04;


    setInterval(() => {
      if (document.hidden == true) {
      } else {
        if (this.meshes03.length > 11) {
          if (collided.length > 0) {
            unique = collided.filter(function (elem, index, self) {
              return index === self.indexOf(elem);
            })

            collided = unique;

            let segment = Math.floor(Math.random() * 4) + 3;
            if (segment == 6) {
              segment += 2;
            }

            let stuff = new CANNON.Body({ mass: 10 });
            let stuffShape = new CANNON.Box(new CANNON.Vec3(boxX, boxZ, boxY));
            stuff.addShape(stuffShape);
            stuff.position.set((Math.random() * 3) - 1.5, 2, (Math.random() * 0.4) + 0.8);
            this.world.addBody(stuff);

            let stuff3;
            if (segment == 8) {
              stuff3 = new THREE.Mesh(
                new THREE.CylinderBufferGeometry(boxX, boxY, boxZ * 2, 24),
                stuffMaterial);
            } else {
              stuff3 = new THREE.Mesh(
                new THREE.CylinderBufferGeometry(boxX, boxY, boxZ * 2, segment),
                stuffMaterial);
            }
            stuff3.castShadow = true;
            stuff3.scale.set(.1, .1, .1);
            TweenLite.to(stuff3.scale, 1.5, { x: 1, y: 1, z: 1, ease: Power0.easeNone })
            this.scene.add(stuff3);

            this.bodies03.splice(collided[0], 1, stuff);
            this.meshes03.splice(collided[0], 1, stuff3);
            var test02 = collided[0];

            stuff.addEventListener("collide", throttle((e) => {
              if (e.contact.bi.collisionFilterGroup == 2) {
                setTimeout(() => {
                  if (stuff3.scale.x > 0.2) {

                    stuff3.scale.x *= 0.85;
                    stuff3.scale.y *= 0.85;
                    stuff3.scale.z *= 0.85;

                    stuffShape.halfExtents.set(stuff3.scale.x * boxX, stuff3.scale.y * boxZ, stuff3.scale.z * boxY);
                    stuffShape.updateConvexPolyhedronRepresentation();
                  } else {
                    if (stuff) {
                      this.BOOP(stuff3.position.x, stuff3.position.y, stuff3.position.z);
                      this.world.remove(stuff);
                      this.scene.remove(stuff3);
                      this.meshes03.splice(test02, 1, tempCannon);
                      this.bodies03.splice(test02, 1, tempThree);
                      collided.push(test02);
                    }
                  }
                }, 50);
              }
            }, 50));
            collided.shift();
          }
        } else {
          let segment = Math.floor(Math.random() * 4) + 3;
          if (segment == 6) {
            segment += 2;
          }

          let stuff = new CANNON.Body({ mass: 10 });
          let stuffShape = new CANNON.Box(new CANNON.Vec3(boxX, boxZ, boxY));
          stuff.addShape(stuffShape);
          stuff.position.set((Math.random() * 3) - 1.5, 2, (Math.random() * 0.4) + 0.8);

          this.world.addBody(stuff);
          let stuff3;
          if (segment == 8) {
            stuff3 = new THREE.Mesh(
              new THREE.CylinderBufferGeometry(boxX, boxY, boxZ * 2, 24),
              stuffMaterial);
          } else {
            stuff3 = new THREE.Mesh(
              new THREE.CylinderBufferGeometry(boxX, boxY, boxZ * 2, segment),
              stuffMaterial);
          }
          stuff3.scale.set(.1, .1, .1);
          stuff3.castShadow = true;
          TweenLite.to(stuff3.scale, 1.5, { x: 1, y: 1, z: 1, ease: Power0.easeNone })
          this.scene.add(stuff3);

          this.bodies03.push(stuff);
          this.meshes03.push(stuff3);

          var test = this.bodies03.length - 1;
          stuff.addEventListener("collide", throttle((e) => {
            if (e.contact.bi.collisionFilterGroup == 2) {
              setTimeout(() => {
                if (stuff3.scale.x > 0.2) {

                  stuff3.scale.x *= 0.85;
                  stuff3.scale.y *= 0.85;
                  stuff3.scale.z *= 0.85;

                  stuffShape.halfExtents.set(stuff3.scale.x * boxX, stuff3.scale.y * boxZ, stuff3.scale.z * boxY);
                  stuffShape.updateConvexPolyhedronRepresentation();
                } else {
                  this.BOOP(stuff3.position.x, stuff3.position.y, stuff3.position.z);
                  this.world.remove(stuff);
                  this.scene.remove(stuff3);
                  this.meshes03.splice(test, 1, tempCannon);
                  this.bodies03.splice(test, 1, tempThree);
                  collided.push(test);
                }
              }, 50);
            }
          }, 50));
        }
      }
    }, 500)
  }


  BOOP(Ox: number, Oy: number, Oz: number) {
    Oy += .1;
    // 1 
    let box = this.boop.clone();
    box.position.set(Ox, Oy, Oz);
    box.rotation.set(0, Math.PI / 2, 0);
    this.scene.add(box);
    TweenLite.to(box.position, 0.5, { z: box.position.z - .1 });
    TweenLite.to(box.scale, 1, { x: .1, y: .1, z: .1 });

    // 2
    let box02 = this.boop.clone();
    box02.position.set(Ox, Oy, Oz);
    box02.rotation.set(0, 15 * Math.PI / 180, 0);
    this.scene.add(box02);
    TweenLite.to(box02.position, 0.5, { x: box02.position.x + .095, z: box02.position.z - .03 });
    TweenLite.to(box02.scale, 1, { x: .1, y: .1, z: .1 });

    // 3
    let box03 = this.boop.clone();
    box03.position.set(Ox, Oy, Oz);
    box03.rotation.set(0, 125 * Math.PI / 180, 0);
    this.scene.add(box03);
    TweenLite.to(box03.position, 0.5, { x: box03.position.x + .058, z: box03.position.z + .08 });
    TweenLite.to(box03.scale, 1, { x: .1, y: .1, z: .1 });

    // 4
    let box04 = this.boop.clone();
    box04.position.set(Ox, Oy, Oz);
    box04.rotation.set(0, 55 * Math.PI / 180, 0);
    this.scene.add(box04);
    TweenLite.to(box04.position, 0.5, { x: box04.position.x - .058, z: box04.position.z + .08 });
    TweenLite.to(box04.scale, 1, { x: .1, y: .1, z: .1 });


    // 5
    let box05 = this.boop.clone();
    box05.position.set(Ox, Oy, Oz);
    box05.rotation.set(0, 160 * Math.PI / 180, 0);
    this.scene.add(box05);
    TweenLite.to(box05.position, 0.5, { x: box05.position.x - .095, z: box05.position.z - .03 });
    TweenLite.to(box05.scale, 1, { x: .1, y: .1, z: .1 });

    setTimeout(() => {
      this.scene.remove(box);
      this.scene.remove(box02);
      this.scene.remove(box03);
      this.scene.remove(box04);
      this.scene.remove(box05);
    }, 1000);
  }

  CreateFirstDirectionPipe() {
    // DIRECTION PIPE
    this.directionPipe = new CANNON.Body({ mass: 5 });
    // let sphereshape = new CANNON.Box(new CANNON.Vec3(.05,.05,.05));
    let sphereshape = new CANNON.Sphere(.02);
    this.directionPipe.collisionFilterMask = 4;

    this.directionPipe.angularDamping = 0.1;
    this.directionPipe.linearDamping = 0.1;
    this.directionPipe.addShape(sphereshape);
    this.directionPipe.position.set(this.lastpipe.position.x, this.lastpipe.position.y, this.lastpipe.position.z);
    this.world02.addBody(this.directionPipe);
    this.FEcannon.push(this.directionPipe);

    this.lockConstraint = new CANNON.LockConstraint(this.directionPipe, this.lastpipe);
    this.world02.addConstraint(this.lockConstraint);

    let directionThree = new THREE.SphereBufferGeometry(0.01);

    let Dragmaterial02 = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })

    this.DragPoint = new THREE.Mesh(directionThree, Dragmaterial02);
    this.DragPoint.rotation.set(0, 0, Math.PI / 2);
    this.DragPoint.position.set(this.lastpipe.position.x, this.lastpipe.position.y, this.lastpipe.position.z);
    this.scene.add(this.DragPoint);
    this.FEthree.push(this.DragPoint);

  }

  Easing = [
    'Power0.easeOut',
    'Power1.easeOut',
    'Power2.easeOut',
    'Power3.easeOut',
  ];

  shootSmoke() {
    var vectorF = new THREE.Vector3();
    var vectorD = new THREE.Vector3();
    vectorF.setFromMatrixPosition(this.ResetPoint.matrixWorld);
    vectorD.setFromMatrixPosition(this.SmokePoint.matrixWorld);

    let smoke = this.smokeThree.clone();
    this.scene.add(smoke);
    this.meshes.push(smoke);

    let body = new CANNON.Body({ mass: .1 });
    body.addShape(this.sphereShape);
    body.position.set(vectorF.x, vectorF.y, vectorF.z);

    body.collisionFilterGroup = 2;
    body.collisionFilterMask = 1;

    this.world.addBody(body);
    this.bodies.push(body);

    TweenLite.to(smoke.scale, 0.7, { x: .05, y: .05, z: .05, delay: 0.5, ease: Power2.easeIn });

    let startPosition = new CANNON.Vec3(vectorF.x, vectorF.y, vectorF.z);
    let endPosition = new CANNON.Vec3(
      vectorD.x + (Math.random() * 0.2 * (Math.random() < 0.5 ? -1 : 1)),
      vectorD.y + (Math.random() * 0.2 * (Math.random() < 0.5 ? -1 : 1)),
      vectorD.z + (Math.random() * 0.2 * (Math.random() < 0.5 ? -1 : 1))
    );

    let direction = new CANNON.Vec3();
    endPosition.vsub(startPosition, direction);

    let totalLength = this.distance(direction.x, direction.y, direction.z, 0, 0, 0);
    direction.normalize();


    let speed = totalLength / this.tweenTime;

    direction.scale(speed, body.velocity);

    TweenLite.to(body.velocity, 2.5, { x: 0, y: 0, z: 0, ease: Power0.easeIn });

    setTimeout(() => {
      this.scene.remove(smoke);
      this.world.remove(body);
      this.bodies.shift();
      this.meshes.shift();
    }, 1200);
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

  clearSmokeInterval() {
    clearInterval(this.hold1);
    clearInterval(this.hold3);
    clearInterval(this.hold2);
    clearInterval(this.hold5);
  }

  SecondSceneEvent(): void {
    this.canvas.addEventListener('mouseup', (e) => {
      this.clearSmokeInterval();
    }, false);

    this.canvas.addEventListener('mousemove', (e) => {

      e.preventDefault();

      this.raycaster.setFromCamera(this.mouse, this.camera);

      this.plane.setFromNormalAndCoplanarPoint(this.camera.getWorldDirection(this.plane.normal), this.DragPointThree[0].position);

      var rect = this.canvas.getBoundingClientRect();

      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
        this.DragPointThree[0].position.copy(this.intersection.sub(this.offset));
      }

    }, false);

    this.canvas.addEventListener('touchmove', (e) => {

      e.preventDefault();


      this.raycaster.setFromCamera(this.mouse, this.camera);

      this.plane.setFromNormalAndCoplanarPoint(this.camera.getWorldDirection(this.plane.normal), this.DragPointThree[0].position);

      var rect = this.canvas.getBoundingClientRect();

      this.mouse.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
        this.DragPointThree[0].position.copy(this.intersection.sub(this.offset));
      }

    }, false);


    this.canvas.addEventListener('mouseleave', () => {
      this.clearSmokeInterval();
    }, false);

    this.canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();

      if (e.which == 3) {
        // right
        this.hold3 = setInterval(() => {
          this.shootSmoke();
        }, 8);
      } else if (e.which == 2) {
        // middle
        this.hold2 = setInterval(() => {
          this.shootSmoke();
        }, 8);
      } else if (e.which == 5) {
        // next
        this.hold5 = setInterval(() => {
          this.shootSmoke();
        }, 8);
      }
      else {
        this.hold1 = setInterval(() => {
          this.shootSmoke();
        }, 8);
      }
    }, false);

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();


      this.raycaster.setFromCamera(this.mouse, this.camera);

      this.plane.setFromNormalAndCoplanarPoint(this.camera.getWorldDirection(this.plane.normal), this.DragPointThree[0].position);

      var rect = this.canvas.getBoundingClientRect();

      this.mouse.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
        this.DragPointThree[0].position.copy(this.intersection.sub(this.offset));
      }

      this.hold1 = setInterval(() => {
        this.shootSmoke();
      }, 8);
    }, false);

    this.canvas.addEventListener('touchend', () => {
      this.clearSmokeInterval();
    }, false);
  }


  SecondSceneRender() {
    this.world02.step(1 / this.fps);

    this.CreatePipe();
    this.updateMeshPositions();
  }

  private PipeCurve;
  CreatePipe() {
    this.scene.remove(this.curvePipe);
    this.curvePipe.geometry.dispose();

    this.PipeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(this.PipeCannon[0].position.x, this.PipeCannon[0].position.y, this.PipeCannon[0].position.z),
      new THREE.Vector3(this.PipeCannon[1].position.x, this.PipeCannon[1].position.y, this.PipeCannon[1].position.z),
      new THREE.Vector3(this.PipeCannon[2].position.x, this.PipeCannon[2].position.y, this.PipeCannon[2].position.z),
      new THREE.Vector3(this.PipeCannon[3].position.x, this.PipeCannon[3].position.y, this.PipeCannon[3].position.z),
      new THREE.Vector3(this.PipeCannon[4].position.x, this.PipeCannon[4].position.y, this.PipeCannon[4].position.z),
      new THREE.Vector3(this.PipeCannon[5].position.x, this.PipeCannon[5].position.y, this.PipeCannon[5].position.z),
      new THREE.Vector3(this.PipeCannon[6].position.x, this.PipeCannon[6].position.y, this.PipeCannon[6].position.z),
      new THREE.Vector3(this.PipeCannon[7].position.x, this.PipeCannon[7].position.y, this.PipeCannon[7].position.z),
      new THREE.Vector3(this.PipeCannon[8].position.x, this.PipeCannon[8].position.y, this.PipeCannon[8].position.z),
      new THREE.Vector3(this.PipeCannon[9].position.x, this.PipeCannon[9].position.y, this.PipeCannon[9].position.z),
      new THREE.Vector3(this.PipeCannon[10].position.x, this.PipeCannon[10].position.y, this.PipeCannon[10].position.z),
      new THREE.Vector3(this.PipeCannon[11].position.x, this.PipeCannon[11].position.y, this.PipeCannon[11].position.z),
      new THREE.Vector3(this.PipeCannon[12].position.x, this.PipeCannon[12].position.y, this.PipeCannon[12].position.z),
      new THREE.Vector3(this.PipeCannon[13].position.x, this.PipeCannon[13].position.y, this.PipeCannon[13].position.z),
      new THREE.Vector3(this.PipeCannon[14].position.x, this.PipeCannon[14].position.y, this.PipeCannon[14].position.z),
      new THREE.Vector3(this.PipeCannon[15].position.x, this.PipeCannon[15].position.y, this.PipeCannon[15].position.z),
      new THREE.Vector3(this.PipeCannon[16].position.x, this.PipeCannon[16].position.y, this.PipeCannon[16].position.z),
      new THREE.Vector3(this.PipeCannon[17].position.x, this.PipeCannon[17].position.y, this.PipeCannon[17].position.z),
      new THREE.Vector3(this.PipeCannon[18].position.x, this.PipeCannon[18].position.y, this.PipeCannon[18].position.z),
      new THREE.Vector3(this.PipeCannon[19].position.x, this.PipeCannon[19].position.y, this.PipeCannon[19].position.z),
      new THREE.Vector3(this.PipeCannon[20].position.x, this.PipeCannon[20].position.y, this.PipeCannon[20].position.z),
      new THREE.Vector3(this.PipeCannon[21].position.x, this.PipeCannon[21].position.y, this.PipeCannon[21].position.z),
      new THREE.Vector3(this.PipeCannon[22].position.x, this.PipeCannon[22].position.y, this.PipeCannon[22].position.z),
      new THREE.Vector3(this.PipeCannon[23].position.x, this.PipeCannon[23].position.y, this.PipeCannon[23].position.z),
      new THREE.Vector3(this.PipeCannon[24].position.x, this.PipeCannon[24].position.y, this.PipeCannon[24].position.z),
      new THREE.Vector3(this.PipeCannon[25].position.x, this.PipeCannon[25].position.y, this.PipeCannon[25].position.z),
      new THREE.Vector3(this.PipeCannon[26].position.x, this.PipeCannon[26].position.y, this.PipeCannon[26].position.z),
      this.lastthreepipe.position,
    ]);

    this.curvePipe = new THREE.Mesh(
      new THREE.TubeBufferGeometry(this.PipeCurve, 32, 0.025, 8, false),
      this.pipem);
    this.curvePipe.castShadow = true;
    this.scene.add(this.curvePipe);
  }
  updateMeshPositions() {
    // smoke
    for (var i = 0; i !== this.meshes.length; i++) {
      this.meshes[i].position.copy(this.bodies[i].position);
      this.meshes[i].quaternion.copy(this.bodies[i].quaternion);
    }
    for (var i = 0; i !== this.meshes02.length; i++) {
      this.meshes02[i].position.copy(this.bodies02[i].position);
      this.meshes02[i].quaternion.copy(this.bodies02[i].quaternion);
    }
    // pop stuff
    for (var i = 0; i !== this.meshes03.length; i++) {
      this.meshes03[i].position.copy(this.bodies03[i].position);
      this.meshes03[i].quaternion.copy(this.bodies03[i].quaternion);
    }
    for (var i = 0; i !== this.FEcannon.length; i++) {
      this.FEcannon[i].position.copy(this.FEthree[i].position);
      this.FEcannon[i].quaternion.copy(this.FEthree[i].quaternion);
    }
    this.DragPoint.position.set(this.DragPointThree[0].position.x * 0.7, this.DragPointThree[0].position.y * 1.2, this.DragPointThree[0].position.z * 1.5);
  }

  resize() {
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


function TrailRenderer( scene, orientToMovement ) {

	THREE.Object3D.call( this );

	this.active = false;

	this.orientToMovement = false;
	if ( orientToMovement ) this.orientToMovement = true;

	this.scene = scene;

	this.geometry = null;
	this.mesh = null;
	this.nodeCenters = null;

	this.lastNodeCenter = null;
	this.currentNodeCenter = null;
	this.lastOrientationDir = null;
	this.nodeIDs = null;
	this.currentLength = 0;
	this.currentEnd = 0;
	this.currentNodeID = 0;

}

TrailRenderer.prototype = Object.create( THREE.Object3D.prototype );
TrailRenderer.prototype.constructor = TrailRenderer;

TrailRenderer.MaxHeadVertices = 128;
TrailRenderer.LocalOrientationTangent = new THREE.Vector3( 1, 0, 0 );
TrailRenderer.LocalOrientationDirection = new THREE.Vector3( 0, 0, -1 );
TrailRenderer.LocalHeadOrigin = new THREE.Vector3( 0, 0, 0 );
TrailRenderer.PositionComponentCount = 3;
TrailRenderer.UVComponentCount = 2;
TrailRenderer.IndicesPerFace = 3;
TrailRenderer.FacesPerQuad = 2;


TrailRenderer.Shader = <any>{};

TrailRenderer.Shader.BaseVertexVars = [

	"attribute float nodeID;",
	"attribute float nodeVertexID;",
	"attribute vec3 nodeCenter;",

	"uniform float minID;",
	"uniform float maxID;",
	"uniform float trailLength;",
	"uniform float maxTrailLength;",
	"uniform float verticesPerNode;",
	"uniform vec2 textureTileFactor;",

	"uniform vec4 headColor;",
	"uniform vec4 tailColor;",

	"varying vec4 vColor;",

].join( "\n" );

TrailRenderer.Shader.TexturedVertexVars = [

	TrailRenderer.Shader.BaseVertexVars, 
	"varying vec2 vUV;",
	"uniform float dragTexture;",

].join( "\n" );

TrailRenderer.Shader.BaseFragmentVars = [

	"varying vec4 vColor;",
	"uniform sampler2D texture;",

].join( "\n" );

TrailRenderer.Shader.TexturedFragmentVars = [

	TrailRenderer.Shader.BaseFragmentVars,
	"varying vec2 vUV;"

].join( "\n" );


TrailRenderer.Shader.VertexShaderCore = [

	"float fraction = ( maxID - nodeID ) / ( maxID - minID );",
	"vColor = ( 1.0 - fraction ) * headColor + fraction * tailColor;",
	"vec4 realPosition = vec4( ( 1.0 - fraction ) * position.xyz + fraction * nodeCenter.xyz, 1.0 ); ", 

].join( "\n" );

TrailRenderer.Shader.BaseVertexShader = [

	TrailRenderer.Shader.BaseVertexVars,

	"void main() { ",

		TrailRenderer.Shader.VertexShaderCore,
		"gl_Position = projectionMatrix * viewMatrix * realPosition;",

	"}"

].join( "\n" );

TrailRenderer.Shader.BaseFragmentShader = [

	TrailRenderer.Shader.BaseFragmentVars,

	"void main() { ",

		"gl_FragColor = vColor;",

	"}"

].join( "\n" );

TrailRenderer.Shader.TexturedVertexShader = [

	TrailRenderer.Shader.TexturedVertexVars,

	"void main() { ",

		TrailRenderer.Shader.VertexShaderCore,
		"float s = 0.0;",
		"float t = 0.0;",
		"if ( dragTexture == 1.0 ) { ",
		"   s = fraction *  textureTileFactor.s; ",
		" 	t = ( nodeVertexID / verticesPerNode ) * textureTileFactor.t;",
		"} else { ",
		"	s = nodeID / maxTrailLength * textureTileFactor.s;",
		" 	t = ( nodeVertexID / verticesPerNode ) * textureTileFactor.t;",
		"}",
		"vUV = vec2( s, t ); ",
		"gl_Position = projectionMatrix * viewMatrix * realPosition;",

	"}"

].join( "\n" );

TrailRenderer.Shader.TexturedFragmentShader = [

	TrailRenderer.Shader.TexturedFragmentVars,

	"void main() { ",

	    "vec4 textureColor = texture2D( texture, vUV );",
		"gl_FragColor = vColor * textureColor;",

	"}"

].join( "\n" );

TrailRenderer.createMaterial = function( vertexShader, fragmentShader, customUniforms ) {

	customUniforms = customUniforms || {};

	customUniforms.trailLength = { type: "f", value: null };
	customUniforms.verticesPerNode = { type: "f", value: null };
	customUniforms.minID = { type: "f", value: null };
	customUniforms.maxID = { type: "f", value: null };
	customUniforms.dragTexture = { type: "f", value: null };
	customUniforms.maxTrailLength = { type: "f", value: null };
	customUniforms.textureTileFactor = { type: "v2", value: null };

	customUniforms.headColor = { type: "v4", value: new THREE.Vector4() };
	customUniforms.tailColor = { type: "v4", value: new THREE.Vector4() };

	vertexShader = vertexShader || TrailRenderer.Shader.BaseVertexShader;
	fragmentShader = fragmentShader || TrailRenderer.Shader.BaseFragmentShader;

	return new THREE.ShaderMaterial(
	{
		uniforms: customUniforms,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,

		transparent: true,
		alphaTest: 0.5,

		blending : THREE.CustomBlending,
		blendSrc : THREE.SrcAlphaFactor,
		blendDst : THREE.OneMinusSrcAlphaFactor,
		blendEquation : THREE.AddEquation,

		depthTest: true,
		depthWrite: false,

		side: THREE.DoubleSide
	} );

}

TrailRenderer.createBaseMaterial = function( customUniforms ) {

	return this.createMaterial( TrailRenderer.Shader.BaseVertexShader, TrailRenderer.Shader.BaseFragmentShader, customUniforms );

}

TrailRenderer.createTexturedMaterial = function( customUniforms ) {

	customUniforms = {};
	customUniforms.texture = { type: "t", value: null };

	return this.createMaterial( TrailRenderer.Shader.TexturedVertexShader, TrailRenderer.Shader.TexturedFragmentShader, customUniforms );

}

TrailRenderer.prototype.initialize = function( material, length, dragTexture, localHeadWidth, localHeadGeometry, targetObject ) {

		this.deactivate();
		this.destroyMesh();

		this.length = ( length > 0 ) ? length + 1 : 0;
		this.dragTexture = ( ! dragTexture ) ? 0 : 1;
		this.targetObject = targetObject;

		this.initializeLocalHeadGeometry( localHeadWidth, localHeadGeometry );

		this.nodeIDs = [];
		this.nodeCenters = [];

		for (var i = 0; i < this.length; i ++ ) {

			this.nodeIDs[ i ] = -1;
			this.nodeCenters[ i ] = new THREE.Vector3();

		}

		this.material = material;

		this.initializeGeometry();
		this.initializeMesh();

		this.material.uniforms.trailLength.value = 0;
		this.material.uniforms.minID.value = 0;
		this.material.uniforms.maxID.value = 0;
		this.material.uniforms.dragTexture.value = this.dragTexture;
		this.material.uniforms.maxTrailLength.value = this.length;
		this.material.uniforms.verticesPerNode.value = this.VerticesPerNode;
		this.material.uniforms.textureTileFactor.value = new THREE.Vector2( 1.0, 1.0 );

		this.reset();

}

TrailRenderer.prototype.initializeLocalHeadGeometry = function( localHeadWidth, localHeadGeometry ) {

	this.localHeadGeometry = [];

	if ( ! localHeadGeometry ) {

		var halfWidth = localHeadWidth || 1.0;
		halfWidth = halfWidth / 2.0;

		this.localHeadGeometry.push( new THREE.Vector3( -halfWidth, 0, 0 ) );
		this.localHeadGeometry.push( new THREE.Vector3( halfWidth, 0, 0 ) );

		this.VerticesPerNode = 2;

	} else {

		this.VerticesPerNode = 0;
		for ( var i = 0; i < localHeadGeometry.length && i < TrailRenderer.MaxHeadVertices; i ++ ) {

			var vertex = localHeadGeometry[ i ];

			if ( vertex && vertex instanceof THREE.Vector3 ) {

				var vertexCopy = new THREE.Vector3();

				vertexCopy.copy( vertex );

				this.localHeadGeometry.push( vertexCopy );
				this.VerticesPerNode ++;

			}

		}

	}

	this.FacesPerNode = ( this.VerticesPerNode - 1 ) * 2;
	this.FaceIndicesPerNode = this.FacesPerNode * 3;

}

TrailRenderer.prototype.initializeGeometry = function() {

	this.vertexCount = this.length * this.VerticesPerNode;
	this.faceCount = this.length * this.FacesPerNode;

	var geometry = new THREE.BufferGeometry();

	var nodeIDs = new Float32Array( this.vertexCount );
	var nodeVertexIDs = new Float32Array( this.vertexCount * this.VerticesPerNode );
	var positions = new Float32Array( this.vertexCount * TrailRenderer.PositionComponentCount );
	var nodeCenters = new Float32Array( this.vertexCount * TrailRenderer.PositionComponentCount );
	var uvs = new Float32Array( this.vertexCount * TrailRenderer.UVComponentCount );
	var indices = new Uint32Array( this.faceCount * TrailRenderer.IndicesPerFace );

	var nodeIDAttribute = new THREE.BufferAttribute( nodeIDs, 1 );
	nodeIDAttribute.setDynamic( true );
	geometry.addAttribute( 'nodeID', nodeIDAttribute );

	var nodeVertexIDAttribute = new THREE.BufferAttribute( nodeVertexIDs, 1 );
	nodeVertexIDAttribute.setDynamic( true );
	geometry.addAttribute( 'nodeVertexID', nodeVertexIDAttribute );

	var nodeCenterAttribute = new THREE.BufferAttribute( nodeCenters, TrailRenderer.PositionComponentCount );
	nodeCenterAttribute.setDynamic( true );
	geometry.addAttribute( 'nodeCenter', nodeCenterAttribute );

	var positionAttribute = new THREE.BufferAttribute( positions, TrailRenderer.PositionComponentCount );
	positionAttribute.setDynamic( true );
	geometry.addAttribute( 'position', positionAttribute );

	var uvAttribute = new THREE.BufferAttribute( uvs, TrailRenderer.UVComponentCount );
	uvAttribute.setDynamic( true );
	geometry.addAttribute( 'uv', uvAttribute );

	var indexAttribute = new THREE.BufferAttribute( indices, 1 );
	indexAttribute.setDynamic( true );
	geometry.setIndex( indexAttribute );

	this.geometry = geometry;

}

TrailRenderer.prototype.zeroVertices = function( ) {

	var positions = this.geometry.getAttribute( 'position' );

	for ( var i = 0; i < this.vertexCount; i ++ ) {

		var index = i * 3;

		positions.array[ index ] = 0;
		positions.array[ index + 1 ] = 0;
		positions.array[ index + 2 ] = 0;

	}

	positions.needsUpdate = true;
	positions.updateRange.count = - 1;

}

TrailRenderer.prototype.zeroIndices = function( ) {

	var indices = this.geometry.getIndex();

	for ( var i = 0; i < this.faceCount; i ++ ) {

		var index = i * 3;

		indices.array[ index ] = 0;
		indices.array[ index + 1 ] = 0;
		indices.array[ index + 2 ] = 0;

	}

	indices.needsUpdate = true;
	indices.updateRange.count = - 1;

}

TrailRenderer.prototype.formInitialFaces = function() {

	this.zeroIndices();

	var indices = this.geometry.getIndex();

	for ( var i = 0; i < this.length - 1; i ++ ) {

		this.connectNodes( i, i + 1 );

	}

	indices.needsUpdate = true;
	indices.updateRange.count = - 1;

}

TrailRenderer.prototype.initializeMesh = function() {

	this.mesh = new THREE.Mesh( this.geometry, this.material );
	this.mesh.dynamic = true;
	this.mesh.matrixAutoUpdate = false;

}

TrailRenderer.prototype.destroyMesh = function() {

	if ( this.mesh ) {

		this.scene.remove( this.mesh );
		this.mesh = null;

	}

}

TrailRenderer.prototype.reset = function() {

	this.currentLength = 0;
	this.currentEnd = -1;

	this.lastNodeCenter = null;
	this.currentNodeCenter = null;
	this.lastOrientationDir = null;

	this.currentNodeID = 0;

	this.formInitialFaces();
	this.zeroVertices();

	this.geometry.setDrawRange( 0, 0 );

}

TrailRenderer.prototype.updateUniforms = function() {

	if ( this.currentLength < this.length ) {
		
		this.material.uniforms.minID.value = 0;

	} else {

		this.material.uniforms.minID.value = this.currentNodeID - this.length;

	}
	this.material.uniforms.maxID.value = this.currentNodeID;
	this.material.uniforms.trailLength.value = this.currentLength;
	this.material.uniforms.maxTrailLength.value = this.length;
	this.material.uniforms.verticesPerNode.value = this.VerticesPerNode;

}

TrailRenderer.prototype.advance = function() {

	var orientationTangent = new THREE.Vector3();
	var position = new THREE.Vector3();
	var offset = new THREE.Vector3();
	var tempMatrix4 = new THREE.Matrix4();

	return function advance() {

		this.targetObject.updateMatrixWorld();
		tempMatrix4.copy( this.targetObject.matrixWorld );

		this.advanceWithTransform( tempMatrix4 );
		
		this.updateUniforms();
	}

}();

TrailRenderer.prototype.advanceWithPositionAndOrientation = function( nextPosition, orientationTangent ) {

	this.advanceGeometry( { position : nextPosition, tangent : orientationTangent }, null );

}

TrailRenderer.prototype.advanceWithTransform = function( transformMatrix ) {

	this.advanceGeometry( null, transformMatrix );

}

TrailRenderer.prototype.advanceGeometry = function() { 

	var direction = new THREE.Vector3();
	var tempPosition = new THREE.Vector3();

	return function advanceGeometry( positionAndOrientation, transformMatrix ) {

		var nextIndex = this.currentEnd + 1 >= this.length ? 0 : this.currentEnd + 1; 

		if( transformMatrix ) {

			this.updateNodePositionsFromTransformMatrix( nextIndex, transformMatrix );

		} else {

			this.updateNodePositionsFromOrientationTangent( nextIndex, positionAndOrientation.position, positionAndOrientation.tangent );
		}

		if ( this.currentLength >= 1 ) {

			var connectRange = this.connectNodes( this.currentEnd , nextIndex );
			var disconnectRange = null;

			if( this.currentLength >= this.length ) {

				var disconnectIndex  = this.currentEnd + 1  >= this.length ? 0 : this.currentEnd + 1;
				disconnectRange = this.disconnectNodes( disconnectIndex );

			}

		}

		if( this.currentLength < this.length ) {

			this.currentLength ++;

		}

		this.currentEnd ++;
		if ( this.currentEnd >= this.length ) {

			this.currentEnd = 0;

		}

		if ( this.currentLength >= 1 ) {

			if( this.currentLength < this.length ) {

				this.geometry.setDrawRange( 0, ( this.currentLength - 1 ) * this.FaceIndicesPerNode);

			} else {

				this.geometry.setDrawRange( 0, this.currentLength * this.FaceIndicesPerNode);

			}

		}
		
		this.updateNodeID( this.currentEnd,  this.currentNodeID );
		this.currentNodeID ++;
	}

}();

TrailRenderer.prototype.updateHead = function() {

	var tempMatrix4 = new THREE.Matrix4();

	return function advance() {

		if( this.currentEnd < 0 ) return;

		this.targetObject.updateMatrixWorld();
		tempMatrix4.copy( this.targetObject.matrixWorld );

		this.updateNodePositionsFromTransformMatrix( this.currentEnd, tempMatrix4 );
	}

}();

TrailRenderer.prototype.updateNodeID = function( nodeIndex, id ) { 

	this.nodeIDs[ nodeIndex ] = id;

	var nodeIDs = this.geometry.getAttribute( 'nodeID' );
	var nodeVertexIDs = this.geometry.getAttribute( 'nodeVertexID' );

	for ( var i = 0; i < this.VerticesPerNode; i ++ ) {

		var baseIndex = nodeIndex * this.VerticesPerNode + i ;
		nodeIDs.array[ baseIndex ] = id;
		nodeVertexIDs.array[ baseIndex ] = i;

	}	

	nodeIDs.needsUpdate = true;
	nodeVertexIDs.needsUpdate = true;

	nodeIDs.updateRange.offset = nodeIndex * this.VerticesPerNode; 
	nodeIDs.updateRange.count = this.VerticesPerNode;

	nodeVertexIDs.updateRange.offset = nodeIndex * this.VerticesPerNode;
	nodeVertexIDs.updateRange.count = this.VerticesPerNode;

}

TrailRenderer.prototype.updateNodeCenter = function( nodeIndex, nodeCenter ) { 

	this.lastNodeCenter = this.currentNodeCenter;

	this.currentNodeCenter = this.nodeCenters[ nodeIndex ];
	this.currentNodeCenter.copy( nodeCenter );

	var nodeCenters = this.geometry.getAttribute( 'nodeCenter' );

	for ( var i = 0; i < this.VerticesPerNode; i ++ ) {

		var baseIndex = ( nodeIndex * this.VerticesPerNode + i ) * 3;
		nodeCenters.array[ baseIndex ] = nodeCenter.x;
		nodeCenters.array[ baseIndex + 1 ] = nodeCenter.y;
		nodeCenters.array[ baseIndex + 2 ] = nodeCenter.z;

	}	

	nodeCenters.needsUpdate = true;

	nodeCenters.updateRange.offset = nodeIndex * this.VerticesPerNode * TrailRenderer.PositionComponentCount; 
	nodeCenters.updateRange.count = this.VerticesPerNode * TrailRenderer.PositionComponentCount; 

}

TrailRenderer.prototype.updateNodePositionsFromOrientationTangent = function() { 

	var tempMatrix4 = new THREE.Matrix4();
	var tempQuaternion = new THREE.Quaternion();
	var tempOffset = new THREE.Vector3();
	var tempLocalHeadGeometry = [];

	for ( var i = 0; i < TrailRenderer.MaxHeadVertices; i ++ ) {

		var vertex = new THREE.Vector3();
		tempLocalHeadGeometry.push( vertex );

	}

	return function updateNodePositionsFromOrientationTangent( nodeIndex, nodeCenter, orientationTangent  ) {

		var positions = this.geometry.getAttribute( 'position' );

		this.updateNodeCenter( nodeIndex, nodeCenter );

		tempOffset.copy( nodeCenter );
		tempOffset.sub( TrailRenderer.LocalHeadOrigin );
		tempQuaternion.setFromUnitVectors( TrailRenderer.LocalOrientationTangent, orientationTangent );
		
		for ( var i = 0; i < this.localHeadGeometry.length; i ++ ) {

			var vertex = tempLocalHeadGeometry[ i ];
			vertex.copy( this.localHeadGeometry[ i ] );
			vertex.applyQuaternion( tempQuaternion );
			vertex.add( tempOffset );
		}

		for ( var i = 0; i <  this.localHeadGeometry.length; i ++ ) {

			var positionIndex = ( ( this.VerticesPerNode * nodeIndex ) + i ) * TrailRenderer.PositionComponentCount;
			var transformedHeadVertex = tempLocalHeadGeometry[ i ];

			positions.array[ positionIndex ] = transformedHeadVertex.x;
			positions.array[ positionIndex + 1 ] = transformedHeadVertex.y;
			positions.array[ positionIndex + 2 ] = transformedHeadVertex.z;

		}

		positions.needsUpdate = true;

	}

}();

TrailRenderer.prototype.updateNodePositionsFromTransformMatrix = function() { 

	var tempMatrix4 = new THREE.Matrix4();
	var tempMatrix3 = new THREE.Matrix3();
	var tempQuaternion = new THREE.Quaternion();
	var tempPosition = new THREE.Vector3();
	var tempOffset = new THREE.Vector3();
	var worldOrientation = new THREE.Vector3();
	var tempDirection = new THREE.Vector3();

	var tempLocalHeadGeometry = [];
	for ( var i = 0; i < TrailRenderer.MaxHeadVertices; i ++ ) {

		var vertex = new THREE.Vector3();
		tempLocalHeadGeometry.push( vertex );

	}

	function getMatrix3FromMatrix4( matrix3, matrix4) {

		var e = matrix4.elements;
		matrix3.set( e[0], e[1], e[2],
					 e[4], e[5], e[6],
					 e[8], e[9], e[10] );

	}

	return function updateNodePositionsFromTransformMatrix( nodeIndex, transformMatrix ) {

		var positions = this.geometry.getAttribute( 'position' );

		tempPosition.set( 0, 0, 0 );
		tempPosition.applyMatrix4( transformMatrix );
		this.updateNodeCenter( nodeIndex, tempPosition );

		for ( var i = 0; i < this.localHeadGeometry.length; i ++ ) {

			var vertex = tempLocalHeadGeometry[ i ];
			vertex.copy( this.localHeadGeometry[ i ] );

		}

		for ( var i = 0; i < this.localHeadGeometry.length; i ++ ) {

			var vertex = tempLocalHeadGeometry[ i ];
			vertex.applyMatrix4( transformMatrix );

		}
		
		if( this.lastNodeCenter && this.orientToMovement ) {

			getMatrix3FromMatrix4( tempMatrix3, transformMatrix );
			worldOrientation.set( 0, 0, -1 );
			worldOrientation.applyMatrix3( tempMatrix3 );

			tempDirection.copy( this.currentNodeCenter );
			tempDirection.sub( this.lastNodeCenter );
			tempDirection.normalize();

			if( tempDirection.lengthSq() <= .0001 && this.lastOrientationDir ) {
				
				tempDirection.copy( this.lastOrientationDir );
			}

			if( tempDirection.lengthSq() > .0001 ) {

				if( ! this.lastOrientationDir ) this.lastOrientationDir = new THREE.Vector3();

				tempQuaternion.setFromUnitVectors( worldOrientation, tempDirection );

				tempOffset.copy( this.currentNodeCenter );

				for ( var i = 0; i < this.localHeadGeometry.length; i ++ ) {

					var vertex = tempLocalHeadGeometry[ i ];
					vertex.sub( tempOffset );
					vertex.applyQuaternion( tempQuaternion );
					vertex.add( tempOffset );

				}
			}

		}
	
		for ( var i = 0; i < this.localHeadGeometry.length; i ++ ) {

			var positionIndex = ( ( this.VerticesPerNode * nodeIndex ) + i ) * TrailRenderer.PositionComponentCount;
			var transformedHeadVertex = tempLocalHeadGeometry[ i ];

			positions.array[ positionIndex ] = transformedHeadVertex.x;
			positions.array[ positionIndex + 1 ] = transformedHeadVertex.y;
			positions.array[ positionIndex + 2 ] = transformedHeadVertex.z;

		}
		
		positions.needsUpdate = true;

		positions.updateRange.offset = nodeIndex * this.VerticesPerNode * TrailRenderer.PositionComponentCount; 
		positions.updateRange.count = this.VerticesPerNode * TrailRenderer.PositionComponentCount; 
	}

}();

TrailRenderer.prototype.connectNodes = function() {

	var returnObj = {

			"attribute" : null,
			"offset" : 0,
			"count" : - 1

		};

	return function connectNodes( srcNodeIndex, destNodeIndex ) {

		var indices = this.geometry.getIndex();

		for ( var i = 0; i < this.localHeadGeometry.length - 1; i ++ ) {

			var srcVertexIndex = ( this.VerticesPerNode * srcNodeIndex ) + i;
			var destVertexIndex = ( this.VerticesPerNode * destNodeIndex ) + i;

			var faceIndex = ( ( srcNodeIndex * this.FacesPerNode ) + ( i * TrailRenderer.FacesPerQuad  ) ) * TrailRenderer.IndicesPerFace;

			indices.array[ faceIndex ] = srcVertexIndex;
			indices.array[ faceIndex + 1 ] = destVertexIndex;
			indices.array[ faceIndex + 2 ] = srcVertexIndex + 1;

			indices.array[ faceIndex + 3 ] = destVertexIndex;
			indices.array[ faceIndex + 4 ] = destVertexIndex + 1;
			indices.array[ faceIndex + 5 ] = srcVertexIndex + 1;

		}

		indices.needsUpdate = true;
		indices.updateRange.count = - 1;

		returnObj.attribute = indices;
		returnObj.offset =  srcNodeIndex * this.FacesPerNode * TrailRenderer.IndicesPerFace;
		returnObj.count = this.FacesPerNode * TrailRenderer.IndicesPerFace;

		return returnObj;

	}
}();

TrailRenderer.prototype.disconnectNodes = function( srcNodeIndex ) {

	var returnObj = {

			"attribute" : null,
			"offset" : 0,
			"count" : - 1

		};

	return function disconnectNodes( srcNodeIndex ) {

		var indices = this.geometry.getIndex();

		for ( var i = 0; i < this.localHeadGeometry.length - 1; i ++ ) {

			var srcVertexIndex = ( this.VerticesPerNode * srcNodeIndex ) + i;

			var faceIndex = ( ( srcNodeIndex * this.FacesPerNode ) + ( i * TrailRenderer.FacesPerQuad ) ) * TrailRenderer.IndicesPerFace;

			indices.array[ faceIndex ] = 0;
			indices.array[ faceIndex + 1 ] = 0;
			indices.array[ faceIndex + 2 ] = 0;

			indices.array[ faceIndex + 3 ] = 0;
			indices.array[ faceIndex + 4 ] = 0;
			indices.array[ faceIndex + 5 ] = 0;

		}

		indices.needsUpdate = true;
		indices.updateRange.count = - 1;

		returnObj.attribute = indices;
		returnObj.offset = srcNodeIndex * this.FacesPerNode * TrailRenderer.IndicesPerFace;
		returnObj.count = this.FacesPerNode * TrailRenderer.IndicesPerFace;

		return returnObj;

	}

}();

TrailRenderer.prototype.deactivate = function() {

	if ( this.isActive ) {

		this.scene.remove( this.mesh );
		this.isActive = false;

	}

}

TrailRenderer.prototype.activate = function() {

	if ( ! this.isActive ) {

		this.scene.add( this.mesh );
		this.isActive = true;

	}

}
