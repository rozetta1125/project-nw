import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { TimelineLite,gsap } from 'gsap';
import GLTFLoader from 'three-gltf-loader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { variable } from '@angular/compiler/src/output/output_ast';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class Resources{
  constructor() {}
  public ResourcesCompleted: Subject<Boolean> = new Subject<Boolean>();
  
  loader: GLTFLoader;
  textureLoader;
  dracoLoader;
  manager;
  textureManager;

  InitResources(){
    this.manager = new THREE.LoadingManager();
    // this.manager.onStart = (url,itemsLoaded,itemsTotal)=>{
    //   console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    // }
    this.manager.onProgress =  (url, itemsLoaded, itemsTotal)=>{
      console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    this.manager.onError = (url)=>{
      console.log( 'There was an error loading ' + url );
    };
    this.manager.onLoad = ()=>{
      console.log('completed')
      this.ResourcesCompleted.next(true);
    }

    
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('assets/draco/');
    this.loader = new GLTFLoader(this.manager);
    this.loader.setDRACOLoader(this.dracoLoader);

    this.textureLoader = new THREE.TextureLoader(this.manager);

    this.FirstSceneResource();
    this.ThreeServiceResource();
    this.SecondSceneResource();
    this.ThirdSceneResource();
  }

  // Color
  blue01; 
  blue02; 
  white;
  pink;
  green01;
  wood;
  red;
  yellow;
  ThreeServiceResource(){
    // Color
    this.textureLoader.load('assets/matcaps/white.png',(texture)=>{ this.white=texture; this.white.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/blue01.png',(texture)=>{ this.blue01=texture; this.blue01.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/blue02.png',(texture)=>{ this.blue02=texture; this.blue02.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/pink.png',(texture)=>{ this.pink=texture; this.pink.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/green01.png',(texture)=>{ this.green01=texture; this.green01.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/wood.png',(texture)=>{ this.wood=texture; this.wood.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/red.png',(texture)=>{ this.red=texture; this.red.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/yellow.png',(texture)=>{ this.yellow=texture; this.yellow.encoding=THREE.sRGBEncoding; });
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
  FirstSceneResource(){
    this.textureLoader.load('assets/shadow/Train.png',(texture)=>{ this.TrainShadow=texture; });
    this.textureLoader.load('assets/shadow/Swing01.png',(texture)=>{ this.SwingShadow01=texture; });
    this.textureLoader.load('assets/shadow/Swing02.png',(texture)=>{ this.SwingShadow02=texture; });
    this.textureLoader.load('assets/shadow/Carnival01.png',(texture)=>{ this.CarnivalShadow01=texture; });
    this.textureLoader.load('assets/shadow/Carnival02.png',(texture)=>{ this.CarnivalShadow02=texture; });
    this.textureLoader.load('assets/shadow/Ferris01.png',(texture)=>{ this.FerrisShadow01=texture; });
    this.textureLoader.load('assets/shadow/Ferris02.png',(texture)=>{ this.FerrisShadow02=texture; });
    this.textureLoader.load('assets/shadow/Park01.png',(texture)=>{ this.ParkShadow=texture; });


    this.loader.load('assets/model/Carnival.glb',(gltf)=>{ this.Carnival = gltf;});
    this.loader.load('assets/model/Swing.glb',(gltf)=>{ this.Swing = gltf;});
    this.loader.load('assets/model/CarnivalPlane.glb',(gltf)=>{ this.CarnivalPlane = gltf;});
    this.loader.load('assets/model/FerrisWheel.glb',(gltf)=>{ this.FerrisWheel = gltf;});
    this.loader.load('assets/model/Ferris.glb',(gltf)=>{ this.Ferris = gltf;});
    this.loader.load('assets/model/Train.glb',(gltf)=>{ this.Train = gltf;});
  }

  // 2
  GolfShadow;
  WindmillShadow01;
  WindmillShadow02;
  WindmillShadow03;
  Windmill;
  Flag;
  SecondSceneResource(){
    this.textureLoader.load('assets/shadow/Golf.png',(texture)=>{ this.GolfShadow=texture; });
    this.textureLoader.load('assets/shadow/Windmill01.png',(texture)=>{ this.WindmillShadow01=texture; });
    this.textureLoader.load('assets/shadow/Windmill02.png',(texture)=>{ this.WindmillShadow02=texture; });
    this.textureLoader.load('assets/shadow/Windmill03.png',(texture)=>{ this.WindmillShadow03=texture; });

    this.loader.load('assets/model/Windmill04.glb',(gltf)=>{ this.Windmill = gltf; });
    this.loader.load('assets/model/Flag001.glb',(gltf)=>{ this.Flag = gltf; });
  }



  tent01;
  tent02;
  tree;
  land;
  sea;
  wood03;
  white03;

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

  TreeMailShadow;
  GiftShadow;
  CoinShadow;
  RockShadow;
  TentShadow;
  HouseShadow;

  ThirdSceneResource(){
    this.textureLoader.load('assets/matcaps/03/tent01.png',(texture)=>{ this.tent01=texture; this.tent01.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/tent02.png',(texture)=>{ this.tent02=texture; this.tent02.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/tree.png',(texture)=>{ this.tree=texture; this.tree.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/wood.png',(texture)=>{ this.wood03=texture; this.wood03.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/land.png',(texture)=>{ this.land=texture; this.land.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/sea.png',(texture)=>{ this.sea=texture; this.sea.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/white.png',(texture)=>{ this.white03=texture; this.white03.encoding=THREE.sRGBEncoding; });

    this.textureLoader.load('assets/shadow/House.png',(texture)=>{ this.HouseShadow=texture; });
    this.textureLoader.load('assets/shadow/Tent.png',(texture)=>{ this.TentShadow=texture; });
    this.textureLoader.load('assets/shadow/Rock.png',(texture)=>{ this.RockShadow=texture; });
    this.textureLoader.load('assets/shadow/Coin.png',(texture)=>{ this.CoinShadow=texture; });
    this.textureLoader.load('assets/shadow/Island.png',(texture)=>{ this.TreeMailShadow=texture; });
    this.textureLoader.load('assets/shadow/Gift.png',(texture)=>{ this.GiftShadow=texture; });

    this.textureLoader.load('assets/shadow/Smoke02.png',(texture)=>{ this.SmokeTexture=texture; });
    this.textureLoader.load('assets/shadow/Bubble.png',(texture)=>{ this.BubbleTexture=texture; });

    this.loader.load('assets/model/Island05.glb',(gltf)=>{ this.Island = gltf; });
    this.loader.load('assets/model/Coin.glb',(gltf)=>{ this.Coin = gltf; });
    this.loader.load('assets/model/Rock.glb',(gltf)=>{ this.Rock = gltf; });
    this.loader.load('assets/model/Tent.glb',(gltf)=>{ this.Tent = gltf; });
    this.loader.load('assets/model/House01.glb',(gltf)=>{ this.House = gltf; });
    this.loader.load('assets/model/Hammer02.glb',(gltf)=>{ this.Hammer = gltf; });
    this.loader.load('assets/model/Box.glb',(gltf)=>{ this.Box = gltf; });
    this.loader.load('assets/model/Lid.glb',(gltf)=>{ this.Lid = gltf; });
    this.loader.load('assets/model/balloon01.glb',(gltf)=>{ this.Balloon = gltf; });
  }
}