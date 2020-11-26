import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { Power0, TweenMax } from 'gsap';
import GLTFLoader from 'three-gltf-loader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class Resources{
  constructor() {}
  public ResourcesCompleted: Subject<Boolean> = new Subject<Boolean>();
  public LoadedCompleted: Subject<Boolean> = new Subject<Boolean>();
  
  loader: GLTFLoader;
  textureLoader;
  dracoLoader;
  manager;
  textureManager;

  InitResources(){
    this.manager = new THREE.LoadingManager();

    this.manager.onProgress =  (url, itemsLoaded, itemsTotal)=>{
      console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    this.manager.onError = (url)=>{
      console.log( 'There was an error loading ' + url );
    };


    this.manager.onLoad = ()=>{
      console.log('Resources load completed');
      this.ResourcesCompleted.next(true);
      this.CheckOrientation();
    }

    
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('assets/draco/');
    this.loader = new GLTFLoader(this.manager);
    this.loader.setDRACOLoader(this.dracoLoader);

    this.textureLoader = new THREE.TextureLoader(this.manager);

    // Check screen rotation
    document.getElementById('portrait').classList.add('ready');
    if(window.innerHeight<window.innerWidth){
    } else {
      // wait for resize
      window.addEventListener('resize',this.CheckResized);
    }

    this.FirstSceneResource();
    this.ColorResource();
    this.SecondSceneResource();
    this.ThirdSceneResource();
  }

  // First Scene Color
  FSblue;
  FSpink;
  FSwhite;

  // Second Scene Color
  SSblue;
  SSwhite;
  SStree;
  SSwood;
  SSred;
  SSyellow;
  SSStage;
  SSStage02;

  // Third Scene Color
  TStent01;
  TStent02; 
  TSwhite;
  TSland;
  TSsea;
  TStree;
  TSwood;
  TSred;
  TSyellow;
  TSRoof;
  TSHouse01;
  TSHouse02;
  TSHouse03;
  Smoke;

  // Last
  LSblue;
  ColorResource(){

    this.textureLoader.load('assets/matcaps/Smoke.jpg',(texture)=>{ this.Smoke=texture; this.Smoke.encoding=THREE.sRGBEncoding; });
    // 1
    this.textureLoader.load('assets/matcaps/01/F0F0F0.jpg',(texture)=>{ this.FSwhite=texture; this.FSwhite.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/01/97ADD902.jpg',(texture)=>{ this.FSblue=texture; this.FSblue.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/01/E7ABB1.jpg',(texture)=>{ this.FSpink=texture; this.FSpink.encoding=THREE.sRGBEncoding; });


    // 2
    this.textureLoader.load('assets/matcaps/02/F5F5F5.jpg',(texture)=>{ this.SSwhite=texture; this.SSwhite.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/02/wood.jpg',(texture)=>{ this.SSwood=texture; this.SSwood.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/02/tree.jpg',(texture)=>{ this.SStree=texture; this.SStree.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/02/aebfda.jpg',(texture)=>{ this.SSblue=texture; this.SSblue.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/02/red.jpg',(texture)=>{ this.SSred=texture; this.SSred.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/02/yellow.jpg',(texture)=>{ this.SSyellow=texture; this.SSyellow.encoding=THREE.sRGBEncoding; });

    this.textureLoader.load('assets/matcaps/02/tree.jpg',(texture)=>{ this.SSStage=texture; this.SSStage.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/02/wood.jpg',(texture)=>{ this.SSStage02=texture; this.SSStage02.encoding=THREE.sRGBEncoding; });

    // 3
    this.textureLoader.load('assets/matcaps/03/white.jpg',(texture)=>{ this.TSwhite=texture; this.TSwhite.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/tent01.jpg',(texture)=>{ this.TStent01=texture; this.TStent01.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/tent02.jpg',(texture)=>{ this.TStent02=texture; this.TStent02.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/land.jpg',(texture)=>{ this.TSland=texture; this.TSland.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/sea.jpg',(texture)=>{ this.TSsea=texture; this.TSsea.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/tree.jpg',(texture)=>{ this.TStree=texture; this.TStree.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/wood.jpg',(texture)=>{ this.TSwood=texture; this.TSwood.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/red.jpg',(texture)=>{ this.TSred=texture; this.TSred.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/yellow.jpg',(texture)=>{ this.TSyellow=texture; this.TSyellow.encoding=THREE.sRGBEncoding; });

    this.textureLoader.load('assets/matcaps/03/E5CBA102.jpg',(texture)=>{ this.TSRoof=texture; this.TSRoof.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/F3E9E0.jpg',(texture)=>{ this.TSHouse01=texture; this.TSHouse01.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/E5CBA1.jpg',(texture)=>{ this.TSHouse02=texture; this.TSHouse02.encoding=THREE.sRGBEncoding; });
    
  }

  // FirstScene Resources
  Train;
  TrainShadow;
  FerrisWheel;
  Ferris;
  FerrisShadow01;
  FerrisShadow02;
  Carnival;
  CarnivalShadow01;
  CarnivalShadow02;
  CarnivalPlane;
  Swing;
  SwingShadow01;
  SwingShadow02;
  ParkShadow;
  Flag01;
  FirstSceneResource(){
    this.textureLoader.load('assets/shadow/Train.jpg',(texture)=>{ this.TrainShadow=texture; });
    this.textureLoader.load('assets/shadow/Swing01.jpg',(texture)=>{ this.SwingShadow01=texture; });
    this.textureLoader.load('assets/shadow/Swing02.jpg',(texture)=>{ this.SwingShadow02=texture; });
    this.textureLoader.load('assets/shadow/Carnival01.jpg',(texture)=>{ this.CarnivalShadow01=texture; });
    this.textureLoader.load('assets/shadow/Carnival02.jpg',(texture)=>{ this.CarnivalShadow02=texture; });
    this.textureLoader.load('assets/shadow/Ferris01.jpg',(texture)=>{ this.FerrisShadow01=texture; });
    this.textureLoader.load('assets/shadow/Ferris02.jpg',(texture)=>{ this.FerrisShadow02=texture; });
    this.textureLoader.load('assets/shadow/Park01.jpg',(texture)=>{ this.ParkShadow=texture; });


    this.loader.load('assets/model/Carnival03.glb',(gltf)=>{ this.Carnival = gltf;});
    this.loader.load('assets/model/Swing.glb',(gltf)=>{ this.Swing = gltf;});
    this.loader.load('assets/model/CarnivalPlane.glb',(gltf)=>{ this.CarnivalPlane = gltf;});
    this.loader.load('assets/model/FerrisWheel.glb',(gltf)=>{ this.FerrisWheel = gltf;});
    this.loader.load('assets/model/Ferris02.glb',(gltf)=>{ this.Ferris = gltf;});
    this.loader.load('assets/model/Train.glb',(gltf)=>{ this.Train = gltf;});
  }

  // 2
  GolfShadow;
  WindmillShadow01;
  WindmillShadow02;
  WindmillShadow03;
  Windmill;
  Flag;
  GolfBallMap;
  GolfBall;
  
  SecondSceneResource(){
    this.textureLoader.load('assets/shadow/Golf.jpg',(texture)=>{ this.GolfShadow=texture; });
    this.textureLoader.load('assets/shadow/Windmill01.jpg',(texture)=>{ this.WindmillShadow01=texture; });
    this.textureLoader.load('assets/shadow/Windmill02.jpg',(texture)=>{ this.WindmillShadow02=texture; });
    this.textureLoader.load('assets/shadow/Windmill03.jpg',(texture)=>{ this.WindmillShadow03=texture; });

    this.loader.load('assets/model/Windmill07.glb',(gltf)=>{ this.Windmill = gltf; });
    this.loader.load('assets/model/Flag001.glb',(gltf)=>{ this.Flag = gltf; });
    this.loader.load('assets/model/Golf.glb',(gltf)=>{ this.GolfBall = gltf; });
  }

  Island;
  House;
  Rock;
  Hammer;
  Tent;
  Box;
  Lid;
  Balloon;
  Coin;

  SmokeTexture;
  BubbleTexture;
  HouseBubble;

  TreeMailShadow;
  GiftShadow;
  CoinShadow;
  RockShadow;
  TentShadow;
  HouseShadow;

  HouseAC;
  HouseACmap;

  Text;
  TextDecoration;

  TextShadow;
  TextDecorationShadow;
  ThirdSceneResource(){
    this.textureLoader.load('assets/shadow/House02.jpg',(texture)=>{ this.HouseShadow=texture; });
    this.textureLoader.load('assets/shadow/Tent.jpg',(texture)=>{ this.TentShadow=texture; });
    this.textureLoader.load('assets/shadow/Rock.jpg',(texture)=>{ this.RockShadow=texture; });
    this.textureLoader.load('assets/shadow/Coin.jpg',(texture)=>{ this.CoinShadow=texture; });
    this.textureLoader.load('assets/shadow/Island.jpg',(texture)=>{ this.TreeMailShadow=texture; });
    this.textureLoader.load('assets/shadow/Gift.jpg',(texture)=>{ this.GiftShadow=texture; });
    
    this.textureLoader.load('assets/shadow/Smoke02.jpg',(texture)=>{ this.SmokeTexture=texture; });
    this.textureLoader.load('assets/shadow/Bubble.jpg',(texture)=>{ this.BubbleTexture=texture; });
    this.textureLoader.load('assets/shadow/BubbleHouse.jpg',(texture)=>{ this.HouseBubble=texture; });

    this.loader.load('assets/model/Island05.glb',(gltf)=>{ this.Island = gltf; });
    this.loader.load('assets/model/Coin.glb',(gltf)=>{ this.Coin = gltf; });
    this.loader.load('assets/model/Rock.glb',(gltf)=>{ this.Rock = gltf; });
    this.loader.load('assets/model/Tent.glb',(gltf)=>{ this.Tent = gltf; });
    this.loader.load('assets/model/House09.glb',(gltf)=>{ this.House = gltf; });
    this.loader.load('assets/model/Hammer03.glb',(gltf)=>{ this.Hammer = gltf; });
    this.loader.load('assets/model/Box.glb',(gltf)=>{ this.Box = gltf; });
    this.loader.load('assets/model/Lid.glb',(gltf)=>{ this.Lid = gltf; });
    this.loader.load('assets/model/balloon01.glb',(gltf)=>{ this.Balloon = gltf; });

    // Special case, Fourth scene
    this.loader.load('assets/model/Text.glb',(gltf)=>{ this.Text = gltf; });
  }


  CheckOrientation(){
    // first time
    if(window.innerHeight<window.innerWidth){
      this.LoadedCompleted.next(true);
    }
  }

  CheckResized = ()=>{
    if(window.innerHeight<window.innerWidth){
      TweenMax.delayedCall(2,()=>{
        window.location.reload();
        // this.LoadedCompleted.next(true);
      })
      window.removeEventListener('resize',this.CheckResized);
    }
  }
}