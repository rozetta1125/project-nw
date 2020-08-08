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
    this.textureLoader.load('assets/matcaps/03/balloon.png',(texture)=>{ this.red=texture; this.red.encoding=THREE.sRGBEncoding; });
    this.textureLoader.load('assets/matcaps/03/coin.png',(texture)=>{ this.yellow=texture; this.yellow.encoding=THREE.sRGBEncoding; });
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
}