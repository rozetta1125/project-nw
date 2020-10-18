import * as THREE from 'three';
import * as CANNON from 'cannon';
import { TweenMax,Power1,Power0 } from 'gsap';
import { Injectable } from '@angular/core';
import { ThreeService } from './three.service';
import { Resources } from './Resources.service';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';


@Injectable({
  providedIn: 'root'
})


export class ThirdScene{
  constructor(
    private RS:Resources,
    private ThreeService:ThreeService,
  ){}

  //
  private render;
  private StringM;
  private BalloonM = new THREE.MeshMatcapMaterial();
  private FirstCursor = new THREE.Vector3();
  private LastCursor = new THREE.Vector3();
  private GiftBalloonArray = [];
  private world03 = new CANNON.World();
  // THIRD SCENE SETUP
  InitThirdScene(){
    this.InitThirdWorld();
    this.CreateScoreMaterial();
    this.CreateIsland(30,-0.075,-.5);
    this.POPMaterial();
    
    this.StringM = new LineMaterial({
      color:0xeeeeee,
      linewidth:.0012,
    })
    TweenMax.delayedCall(1,()=>{
      this.CreateGiftBalloon(25,3,0);
    })


    // this.RS.Lid.scene.position.set(15,2,0)
    // var something = this.RS.Lid.scene;
    // this.ThreeService.scene.add(something)


  }

  StartThirdScene(){
    this.AddEvent();
    this.ThirdSceneRender();
  }

  AddEvent(){
    this.ThreeService.canvas.addEventListener("click", throttle(this.ClickEvent,600));
  }

  ClickEvent = ()=>{  
    this.ThirdClickEvent();
  }

  MoveEvent = ()=>{
    this.BalloonCursor();
  }
  

  private SmokeTexture:THREE.Mesh;
  private SmokeTexture02:THREE.Mesh;
  private Bubble;
  private BubbleObject;
  private BubbleArray;
  private HouseBubble;
  private OuterSmoke;
  CreateIsland(Ix,Iy,Iz){
    // Material
    var ScaleMultiplier = 1.75;
    var mateOpacity = 1;


    // Island 
    this.RS.Island.scene.scale.set(ScaleMultiplier,ScaleMultiplier,ScaleMultiplier);
    this.RS.Island.scene.rotation.set(0,0*Math.PI/180,0)
    this.RS.Island.scene.position.set(Ix,Iy,Iz);

    for(var i=0;i<this.RS.Island.scene.children.length;i++){
      if(this.RS.Island.scene.children[""+i+""].name=="Land"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.TSland,transparent:true,opacity:mateOpacity,
        });
        this.RS.Island.scene.children[""+i+""].children[0].material=mate01;
        let mate02 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.TStree,transparent:true,opacity:mateOpacity,
        });
        this.RS.Island.scene.children[""+i+""].children[1].material=mate02;
      } else if(this.RS.Island.scene.children[""+i+""].name=="Tree01"||this.RS.Island.scene.children[""+i+""].name=="Tree02"){
          let mate01 = new THREE.MeshMatcapMaterial({
            color:0xffffff,side:2,matcap:this.RS.TSwood,transparent:true,opacity:mateOpacity,
          });
          this.RS.Island.scene.children[""+i+""].children[0].material=mate01;
          let mate02 = new THREE.MeshMatcapMaterial({
            color:0xffffff,side:2,matcap:this.RS.TStree,transparent:true,opacity:mateOpacity,
          });
        this.RS.Island.scene.children[""+i+""].children[1].material=mate02;
        this.ThirdSceneObject.push(this.RS.Island.scene.children[""+i+""]);
      } else if(this.RS.Island.scene.children[""+i+""].name=="Mail"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.TSwood,transparent:true,opacity:mateOpacity,
        });
        this.RS.Island.scene.children[""+i+""].children[0].material=mate01;
        let mate02 = new THREE.MeshMatcapMaterial({
          color:0xcccccc,side:2,matcap:this.RS.TSwood,transparent:true,opacity:mateOpacity,
        });
        this.RS.Island.scene.children[""+i+""].children[1].material=mate02;
      } else if(this.RS.Island.scene.children[""+i+""].name=="Sea"){
        var seaMate = new THREE.MeshBasicMaterial({color:0x8bd3e7});
        let bgparams = {
          sea: "#8bd3e7",
        }
      
        var bg = this.ThreeService.gui.addFolder("Sea Inner");
        bg.addColor(bgparams, "sea")
          .onChange(() => {
            seaMate.color.set(new THREE.Color(bgparams.sea));
          });
        this.RS.Island.scene.children[""+i+""].material=seaMate;
        this.RS.Island.scene.children[""+i+""].scale.set(1.1,1.1,1.1);
        // this.RS.Island.scene.children[""+i+""].position.y=.2

        // TweenMax.fromTo(this.RS.Island.scene.children[""+i+""].rotation,1.5,{z:.02},{z:-.02,repeat:-1,yoyo:true,ease:Power1.easeInOut});
        TweenMax.fromTo(this.RS.Island.scene.children[""+i+""].position,1.5,{y:"+=.07"},{y:"-=.07",repeat:-1,yoyo:true,ease:Power1.easeInOut});
      } else if(this.RS.Island.scene.children[""+i+""].name=="OuterSea"){
        
        var seaMate = new THREE.MeshBasicMaterial({color:0x8bd3e7});
        let bgparams = {
          sea: "#8bd3e7",
        }
      
        var bg = this.ThreeService.gui.addFolder("Sea Outer");

        bg.addColor(bgparams, "sea")
          .onChange(() => {
            seaMate.color.set(new THREE.Color(bgparams.sea));
          });
        this.RS.Island.scene.children[""+i+""].material=seaMate;
        // this.RS.Island.scene.children[""+i+""].scale.set(1.1,1.1,1.1);
        TweenMax.fromTo(this.RS.Island.scene.children[""+i+""].scale,1.5,{x:1.12,z:1.12},{x:1.2,z:1.2,repeat:-1,yoyo:true,ease:Power1.easeInOut});
      }
    }

    // Island Shadow 
    var uniforms = {
      tShadow:{value:this.RS.TreeMailShadow},
      uShadowColor:{value:new THREE.Color("#78b75e")},
      uAlpha:{value:.7}
    }
    var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})

    var shadow = new THREE.Mesh(new THREE.PlaneGeometry(6,6),material);
    shadow.rotation.set(-Math.PI/2,0,0)
    shadow.position.set(0,.151,0);

    this.RS.Island.scene.add(shadow);
    this.ThreeService.scene.add(this.RS.Island.scene);


    // Hammer
    for(var i=0;i<this.RS.Hammer.scene.children.length;i++){
      if(this.RS.Hammer.scene.children[""+i+""].name=="Hammer"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:0,matcap:this.RS.TSwood,transparent:true,opacity:mateOpacity,
        });
        let mate02 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:0,matcap:this.RS.TSwood,transparent:true,opacity:mateOpacity,
        });
        // handle
        this.RS.Hammer.scene.children[""+i+""].children[1].material=mate01;
        // hammer
        this.RS.Hammer.scene.children[""+i+""].children[0].material=mate02;
      }
    }
    this.RS.Hammer.scene.scale.set(2,2,2);

    // Smoke Texture Center
    var uniforms = {
      tShadow:{value:this.RS.SmokeTexture},
      uShadowColor:{value:new THREE.Color("#f5f5f5")},
      uAlpha:{value:.4}
    }
    var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})
      
    this.SmokeTexture = new THREE.Mesh(new THREE.PlaneGeometry(3,3),material);
    this.SmokeTexture.rotation.set(0,0,0)
    this.SmokeTexture.position.set(Ix,Iy+.85,Iz+.7);
    this.SmokeTexture.renderOrder=2;


    // Outer Smoke
    this.OuterSmoke=[];
    for(var i=0;i<25;i++){
      let OuterSmokeMesh = new THREE.Mesh(new THREE.CircleBufferGeometry(.1,12),new THREE.MeshBasicMaterial({color:0xf5f5f5,transparent:true,opacity:1,depthWrite:false}));
      this.OuterSmoke.push(OuterSmokeMesh);
    }

    // // Smoke Texture 02
    // var uniforms = {
    //   tShadow:{value:this.RS.SmokeTexture},
    //   uShadowColor:{value:new THREE.Color("#eeeeee")},
    //   uAlpha:{value:.7}
    // }
    // var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
    //   vertexShader:document.getElementById('vertexShader').textContent,
    //   fragmentShader:document.getElementById('fragmentShader').textContent})
      
    // this.SmokeTexture02 = new THREE.Mesh(new THREE.PlaneGeometry(3,3),material);
    // this.SmokeTexture02.rotation.set(0,0,0)
    // this.SmokeTexture02.position.set(Ix,Iy+.85,Iz+.75);

    // Bubble Texture
    var uniforms = {
      tShadow:{value:this.RS.BubbleTexture},
      uShadowColor:{value:new THREE.Color("#FFF2DD")},
      uAlpha:{value:1}
    }
    var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})

    this.Bubble = new THREE.Mesh(new THREE.PlaneGeometry(3,3),material)
    this.Bubble.scale.set(.5,.5,.5);
    this.Bubble.rotation.set(0,0,0)
    this.Bubble.position.set(Ix-.045,Iy,Iz);

    // Bubble Object
    this.BubbleObject = new THREE.Mesh(new THREE.CircleBufferGeometry(.25,16),new THREE.MeshBasicMaterial({depthWrite:false,opacity:0,transparent:true}));
    this.BubbleObject.name="BubbleObject";
    this.BubbleObject.position.set(Ix,Iy,Iz);

    // Bubble Array 
    let ba = new THREE.Mesh(new THREE.CircleBufferGeometry(.55,16),new THREE.MeshBasicMaterial({color:0xfceace,depthWrite:false}));
    ba.position.set(Ix-.05,Iy,Iz);
    this.BubbleArray = [];
    for(var i=0;i<3;i++){
      let clone = ba.clone();
      this.BubbleArray.push(clone);
    }

    // HouseBubble Texture
    var uniforms = {
      tShadow:{value:this.RS.HouseBubble},
      uShadowColor:{value:new THREE.Color("#ffd25e")},
      uAlpha:{value:1}
    }
    var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})
    this.HouseBubble = new THREE.Mesh(new THREE.PlaneGeometry(3,3),material)
    this.HouseBubble.position.set(Ix-.05,Iy,Iz+.005);

    this.CreateTent(Ix,Iy,Iz,ScaleMultiplier);
    this.CreateHouse(Ix,Iy,Iz,ScaleMultiplier);
    this.CreateRock(Ix,Iy,Iz,ScaleMultiplier)
    
    // CANNON 
    var something = new THREE.Mesh();
    something.rotation.set(0,0,0);
    var quat = new CANNON.Quaternion();
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    // Tree
    let BodyTree = new CANNON.Body({mass:0});
    BodyTree.addShape(new CANNON.Sphere(.42),new CANNON.Vec3(0,1.1,0));
    BodyTree.addShape(new CANNON.Sphere(.42),new CANNON.Vec3(0,.9,0));
    BodyTree.addShape(new CANNON.Box(new CANNON.Vec3(.07,.15,.07)),new CANNON.Vec3(0,.35,0));
    BodyTree.position.set(Ix-1.8,Iy+.08,Iz-.57);
    this.world03.addBody(BodyTree);

    let BodyTree02 = new CANNON.Body({mass:0});
    BodyTree02.addShape(new CANNON.Sphere(.46),new CANNON.Vec3(0,1.2,0));
    BodyTree02.addShape(new CANNON.Sphere(.46),new CANNON.Vec3(0,1,0));
    BodyTree02.addShape(new CANNON.Box(new CANNON.Vec3(.07,.15,.07)),new CANNON.Vec3(0,.35,0));
    BodyTree02.position.set(Ix+1.58,Iy+.08,Iz-1.8);
    this.world03.addBody(BodyTree02);

    let BodyMailRock = new CANNON.Body({mass:0});
    BodyMailRock.position.set(Ix,Iy,Iz);
    this.world03.addBody(BodyMailRock);
    // MailBox
    BodyMailRock.addShape(new CANNON.Box(new CANNON.Vec3(.03,.2,.03)),new CANNON.Vec3(-.69,0.47,.88))
    BodyMailRock.addShape(new CANNON.Box(new CANNON.Vec3(.13,.06,.07)),new CANNON.Vec3(-.69,0.6,.97))

    // Rock
    BodyMailRock.addShape(new CANNON.Sphere(.25),new CANNON.Vec3(1.83,0.45,0.2))
    BodyMailRock.addShape(new CANNON.Sphere(.13),new CANNON.Vec3(1.54,0.37,0))

    // Tent 
    this.BodyTent = new CANNON.Body({mass:0});
    var quat = new CANNON.Quaternion();

    something.rotation.set(0,0,42.5*Math.PI/180);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    this.BodyTent.addShape(new CANNON.Box(new CANNON.Vec3(.04,.7,.88)),new CANNON.Vec3(.45,1,-.35),quat);

    something.rotation.set(0,0,-42.5*Math.PI/180);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    this.BodyTent.addShape(new CANNON.Box(new CANNON.Vec3(.04,.7,.88)),new CANNON.Vec3(-.45,1,-.35),quat);

    something.rotation.set(0,0,-45*Math.PI/180);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    this.BodyTent.addShape(new CANNON.Box(new CANNON.Vec3(.65,.65,.88)),new CANNON.Vec3(0,0.47,-.35),quat);

    // Pillar
    something.rotation.set(15*Math.PI/180,0,-15*Math.PI/180);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    this.BodyTent.addShape(new CANNON.Box(new CANNON.Vec3(.06,.1,.06)),new CANNON.Vec3(1.1,0.3,0.6),quat);

    something.rotation.set(-15*Math.PI/180,0,-15*Math.PI/180);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    this.BodyTent.addShape(new CANNON.Box(new CANNON.Vec3(.06,.1,.06)),new CANNON.Vec3(1.08,0.3,-1.3),quat);

    something.rotation.set(15*Math.PI/180,0,15*Math.PI/180);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    this.BodyTent.addShape(new CANNON.Box(new CANNON.Vec3(.06,.1,.06)),new CANNON.Vec3(-1.08,0.3,0.58),quat);

    something.rotation.set(-15*Math.PI/180,0,15*Math.PI/180);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    this.BodyTent.addShape(new CANNON.Box(new CANNON.Vec3(.06,.1,.06)),new CANNON.Vec3(-1.08,0.3,-1.3),quat);

    this.world03.addBody(this.BodyTent)
    this.BodyTent.position.set(Ix,Iy,Iz)


    // House
    this.BodyHouse = new CANNON.Body({mass:0});
    this.BodyHouse.addShape(new CANNON.Box(new CANNON.Vec3(.16,.4,.16)),new CANNON.Vec3(.55,1.4,-.18));

    this.BodyHouse.addShape(new CANNON.Box(new CANNON.Vec3(1.04,.5,.66)),new CANNON.Vec3(-.1,.5,-.33));
    this.BodyHouse.addShape(new CANNON.Box(new CANNON.Vec3(.68,.5,.9)),new CANNON.Vec3(-.1,.5,-.33));
    
    something.rotation.set(0,0,-Math.PI/4);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    this.BodyHouse.addShape(new CANNON.Box(new CANNON.Vec3(.5,.5,.9)),new CANNON.Vec3(-.1,.95,-.33),quat);

    something.rotation.set(-Math.PI/4,0,0);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);
    this.BodyHouse.addShape(new CANNON.Box(new CANNON.Vec3(1.15,.5,.5)),new CANNON.Vec3(-.1,.95,-.33),quat);

    this.BodyHouse.position.set(Ix,Iy,Iz);
    // this.world03.addBody(this.BodyHouse)

    // Land
    let BodyLand = new CANNON.Body({mass:0,material: this.LandMaterial});

    something.rotation.set(-Math.PI/2,0,0);
    quat.set(something.quaternion.x,something.quaternion.y,something.quaternion.z,something.quaternion.w);

    BodyLand.addShape(new CANNON.Cylinder(2.95,2.95,.2,16),new CANNON.Vec3(0.05,.163,-.45),quat);

    BodyLand.addShape(new CANNON.Cylinder(3.05,3.05,.2,16),new CANNON.Vec3(0.05,.11,-.45),quat);

    this.world03.addBody(BodyLand);
    BodyLand.position.set(Ix,Iy,Iz);
  }


  BodyTent;
  BodyHouse;
  CreateTent(Ix,Iy,Iz,ScaleMultiplier){
    // Tent
    let mateOpacity = 1;

    this.RS.Tent.scene.scale.set(ScaleMultiplier,ScaleMultiplier,ScaleMultiplier);
    this.RS.Tent.scene.position.set(Ix,Iy,Iz);

    for(var i=0;i<this.RS.Tent.scene.children.length;i++){
      if(this.RS.Tent.scene.children[""+i+""].name=="Tent"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.TStent01,transparent:true,opacity:mateOpacity,
        });
        this.RS.Tent.scene.children[""+i+""].children[0].material=mate01;
        let mate02 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.TStent02,transparent:true,opacity:mateOpacity,
        });
        this.RS.Tent.scene.children[""+i+""].children[1].material=mate02;
      } else if(this.RS.Tent.scene.children[""+i+""].name=="Pillar"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.TSwood,transparent:true,opacity:mateOpacity,
        });
        this.RS.Tent.scene.children[""+i+""].material=mate01;
      } else if(this.RS.Tent.scene.children[""+i+""].name=="Rope"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.TSwood,transparent:true,opacity:mateOpacity,
        });
        this.RS.Tent.scene.children[""+i+""].material=mate01;
      } 
    }


    var uniforms = {
      tShadow:{value:this.RS.TentShadow},
      uShadowColor:{value:new THREE.Color("#78b75e")},
      uAlpha:{value:.75}
    }
    var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})

    var shadow = new THREE.Mesh(new THREE.PlaneGeometry(6,6),material);
    shadow.rotation.set(-Math.PI/2,0,0)
    shadow.position.set(0,0.151,0);

    this.RS.Tent.scene.add(shadow);
    // this.ThreeService.scene.add(this.RS.Tent.scene);

  }
  
  CreateHouse(Ix,Iy,Iz,ScaleMultiplier){

    // console.log(this.RS.HouseAC)
    // console.log(this.RS.House)
    // this.RS.HouseAC.scene.scale.set(.4,.4,.4);
    // this.RS.HouseAC.scene.position.set(Ix-.1,Iy+.01,Iz);

    // let mate = new THREE.MeshBasicMaterial({})
    // this.RS.HouseAC.scene.children[0].children[1].material=mate;

    // this.ThreeService.scene.add(this.RS.HouseAC.scene);

    let mateOpacity = 1;
    // House
    this.RS.House.scene.scale.set(1.7,1.7,1.7);
    this.RS.House.scene.position.set(Ix-.1,Iy+.01,Iz);
    this.RS.House.scene.rotation.set(0,0*Math.PI/180,0);
    this.ThreeService.scene.add(this.RS.House.scene);

    for(var i=0;i<this.RS.House.scene.children.length;i++){
      if(this.RS.House.scene.children[""+i+""].name=="House"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xFFFBF7,side:2,matcap:this.RS.TStent01,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[0].material=mate01;
        let mate02 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.TStent02,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[1].material=mate02;
        let mate03 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.TSRoof,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[2].material=mate03;
      } else if(this.RS.House.scene.children[""+i+""].name=="Door"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.TSHouse01,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[0].material=mate01;
        let mate02 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.TSRoof,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[1].material=mate02;
      } else if(this.RS.House.scene.children[""+i+""].name=="Window"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.TSRoof,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[0].material=mate01;
        let mate02 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.TSwhite,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[1].material=mate02;
      } else if(this.RS.House.scene.children[""+i+""].name=="Lamp"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.TSwhite,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[0].material=mate01;
        let mate02 = new THREE.MeshMatcapMaterial({
          color:0x5F5F5F,side:2,matcap:this.RS.TSwhite,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[1].material=mate02;
      } else if(this.RS.House.scene.children[""+i+""].name=="SmokePipe"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.TSRoof,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].material=mate01;
      }
    }

    var uniforms = {
      tShadow:{value:this.RS.HouseShadow},
      uShadowColor:{value:new THREE.Color("#78b75e")},
      uAlpha:{value:.5}
    }
    var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})

    var shadow = new THREE.Mesh(new THREE.PlaneGeometry(6,6),material);
    shadow.rotation.set(-Math.PI/2,0,0)
    shadow.position.set(0,0.151,0);

    this.RS.House.scene.add(shadow);
  }

  CreateRock(Ix,Iy,Iz,ScaleMultiplier){
    // Rock
    this.RS.Rock.scene.scale.set(ScaleMultiplier,ScaleMultiplier,ScaleMultiplier)
    this.RS.Rock.scene.position.set(Ix+1.8,Iy,Iz+.2);
    let mate01 = new THREE.MeshMatcapMaterial({
      color:0xe6e6e6,side:2,matcap:this.RS.TSwhite,transparent:true,
    });
    this.RS.Rock.scene.children["0"].material=mate01;

    this.ThirdSceneObject.push(this.RS.Rock.scene.children["0"]);

    this.ThreeService.scene.add(this.RS.Rock.scene);

    var uniforms = {
      tShadow:{value:this.RS.RockShadow},
      uShadowColor:{value:new THREE.Color("#78b75e")},
      uAlpha:{value:.75}
    }
    var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})

    var shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.05,2.05),material);
    shadow.renderOrder = 1

    shadow.rotation.set(-Math.PI/2,0,0)
    shadow.position.set(0,.151,0.01);
    this.RS.Rock.scene.add(shadow);

  }


  BubbleUpgrade(){
    // First Bubble
    this.ThreeService.scene.add(this.Bubble);
    TweenMax.fromTo(this.Bubble.scale,1.6,{x:.08,y:.08,z:.08},{ease:Power0.easeNone,x:.48,y:.48,z:.48});
    TweenMax.fromTo(this.Bubble.rotation,4,{z:0},{ease:Power0.easeNone,z:"+="+Math.PI,repeat:-1});
    TweenMax.fromTo(this.Bubble.position,1.6,{y:1.4},{ease:Power0.easeNone,y:2.1});
    TweenMax.fromTo(this.BubbleObject.position,1.6,{y:1.4},{ease:Power0.easeNone,y:2.1});
    TweenMax.to(this.Bubble.position,.8,{ease:Power0.easeNone,x:"-=.05"});
    TweenMax.to(this.Bubble.position,.8,{ease:Power0.easeNone,x:"+=.1",delay:.8,onComplete:()=>{
      this.ThirdSceneObject.push(this.BubbleObject);
      this.ThreeService.scene.add(this.BubbleObject);
    }});

    // HouseBubble
    this.ThreeService.scene.add(this.HouseBubble);
    TweenMax.fromTo(this.HouseBubble.scale,1.6,{x:.04,y:.04,z:.04},{ease:Power0.easeNone,x:.28,y:.28,z:.28});
    TweenMax.fromTo(this.HouseBubble.position,1.6,{y:1.4},{ease:Power0.easeNone,y:2.1});
    TweenMax.to(this.HouseBubble.position,.8,{ease:Power0.easeNone,x:"-=.05"});
    TweenMax.to(this.HouseBubble.position,.8,{ease:Power0.easeNone,x:"+=.098",delay:.8});


    for(var i=0;i<3;i++){
      let delay = (i+1)*.6;
      this.ThreeService.scene.add(this.BubbleArray[i]);
      TweenMax.fromTo(this.BubbleArray[i].scale,1.8,{x:.04,y:.04,z:.04},{ease:Power0.easeNone,x:.18,y:.18,z:.18,delay:delay,repeat:-1,repeatDelay:0});

      TweenMax.fromTo(this.BubbleArray[i].position,1.8,{y:1.5},{ease:Power0.easeNone,y:2.04,delay:delay,repeat:-1,repeatDelay:0});

      TweenMax.to(this.BubbleArray[i].position,.9,{ease:Power0.easeNone,x:"-=.05",delay:delay,repeat:-1,repeatDelay:.9});      
    }
  }

  private SmokeTextureArray = [];
  private SmokeTexture02Array = [];
  UpgradeFunction(Ix,Iy,Iz){
    // Hammer
    this.RS.Hammer.scene.position.set(Ix+.65,Iy+.9,Iz+.5);
    this.ThreeService.scene.add(this.RS.Hammer.scene);
    TweenMax.fromTo(this.RS.Hammer.scene.rotation,.15,{z:0},{z:1.2,yoyo:true,repeat:4,ease:Power0.easeNone,onComplete:()=>{
      this.RS.Hammer.scene.position.set(Ix-.65,Iy+1.1,Iz+.5);
      TweenMax.fromTo(this.RS.Hammer.scene.rotation,.15,{z:0},{z:-1.2,yoyo:true,repeat:4,ease:Power0.easeNone,onComplete:()=>{
        this.RS.Hammer.scene.position.set(Ix+.55,Iy+1.25,Iz+.5);
        TweenMax.fromTo(this.RS.Hammer.scene.rotation,.15,{z:0},{z:1.2,yoyo:true,repeat:4,ease:Power0.easeNone,onComplete:()=>{
          this.ThreeService.scene.remove(this.RS.Hammer.scene);
        }});
      }});
    }});

    // center
    // TweenMax.set(this.SmokeTexture.position,{z:"+=.35"});
    for(var i=0;i<3;i++){
      if(this.SmokeTextureArray.length<3){
        let shadow = this.SmokeTexture.clone();
        this.SmokeTextureArray.push(shadow);
      }

      this.ThreeService.scene.add(this.SmokeTextureArray[i])
      TweenMax.fromTo(this.SmokeTextureArray[i].material.uniforms.uAlpha,.3,{value:0},{value:.75});

      // Position
      switch(i){
        case 0:TweenMax.set(this.SmokeTextureArray[i].position,{x:"-=.3",y:"-=.1"}); break;
        case 1:TweenMax.set(this.SmokeTextureArray[i].position,{x:"+=0",y:"+=.17"}); break;
        case 2:TweenMax.set(this.SmokeTextureArray[i].position,{x:"+=.3",y:"-=.1"}); break;
      }

      // TweenMax.set(this.SmokeTextureArray[i].position,{x:"+="+(Math.random()*.5-.25),y:"-=.0"});

      // Scale
      TweenMax.fromTo(this.SmokeTextureArray[i].scale,.3,{x:.5,y:.5,z:.5},{x:1.5,y:1.5,z:1.5,ease:Power0.easeNone});
      var ran=(Math.random()*1)+1.2;
      TweenMax.to(this.SmokeTextureArray[i].scale,Math.random()*.5+.3,{x:ran,y:ran,z:ran,ease:Power0.easeNone,yoyo:true,repeat:4,delay:.3});

      // Rotation
      TweenMax.fromTo(this.SmokeTextureArray[i].rotation,2.5,{z:Math.random()*3},{z:"+="+(Math.random()*6+6),ease:Power0.easeNone})
      
      // Explosion
      TweenMax.to(this.SmokeTextureArray[i].material.uniforms.uAlpha,.1,{value:1,delay:2.4});
      TweenMax.delayedCall(2.4,()=>{
        for(var j=5;j<10;j++){
          this.ThreeService.scene.remove(this.OuterSmoke[j])
        }
        this.CraftingSmokes02(Ix,Iy,Iz,1.6);
      })
      TweenMax.to(this.SmokeTextureArray[i].scale,.2,{x:2.8,y:2.8,z:2.8,delay:2.5});
      TweenMax.to(this.SmokeTextureArray[i].scale,.2,{x:2,y:2,z:2,delay:2.7});

      
      let k = i;
      TweenMax.to(this.SmokeTextureArray[i].material.uniforms.uAlpha,.2,{value:0,delay:2.7,ease:Power0.easeNone,onComplete:()=>{
        this.ThreeService.scene.remove(this.SmokeTextureArray[k])
      }});
    }
    TweenMax.delayedCall(2.7,()=>{
      this.ThreeService.scene.remove(this.RS.Tent.scene);
      TweenMax.fromTo(this.RS.House.scene.scale,.4,{x:"-=.8",y:"-=1.6",z:"-=1.6"},{x:"+=.8",y:"+=1.6",z:"+=1.6",delay:.1,ease:Power1.easeIn});
      TweenMax.to(this.RS.House.scene.scale,.15,{x:"-=.2",y:"-=.2",z:"-=.2",delay:.5,ease:Power1.easeOut});
      TweenMax.to(this.RS.House.scene.scale,.15,{x:"+=.2",y:"+=.2",z:"+=.2",delay:.65,ease:Power1.easeIn,onComplete:()=>{this.SmokeTextureArray=[];}});
      this.ThreeService.scene.add(this.RS.House.scene);
      this.world03.addBody(this.BodyHouse)
      
    })


    let Something={value:0};
    for(var i=0;i<10;i++){
      this.ThreeService.scene.add(this.OuterSmoke[i]);
    }
    // Crafting Smokes
    TweenMax.delayedCall(.4,()=>{
      this.CraftingSmokes(Ix,Iy,Iz,1);
    })
    TweenMax.to(Something,.01,{value:1,yoyo:true,delay:0.4,repeat:2,repeatDelay:.8,onRepeat:()=>{
      this.CraftingSmokes(Ix,Iy,Iz,1);
    }})

  }

  CraftingSmokes(Ix,Iy,Iz,BaseScale){
    let num = this.GenerateRandomPosition(10,.4,.5,.8,1,0,0,.2);
    let rotation;
    for(let j=0;j<10;j++){
      var plusOrMinus;
      if(j%2==0){
        plusOrMinus=1;
      } else {
        plusOrMinus=-1;
      };
      if(j==0 || j==5){
        plusOrMinus = Math.random() > .5 ? 1 : -1 ;
      }

      var delay=0;
      if(j>4){
        delay = .4;
      }
      // x:"+="+(.1*plusOrMinus),
      TweenMax.fromTo(this.OuterSmoke[j].position,.38,{x:Ix,y:Iy+.8,z:Iz+.25},{x:"+="+(num[j].x*plusOrMinus),y:"+="+num[j].y,ease:Power1.easeOut,delay:delay});
      TweenMax.to(this.OuterSmoke[j].position,.1,{y:"-=.1",ease:Power0.easeNone,delay:.28+delay});
      
      // Scale 
      TweenMax.fromTo(this.OuterSmoke[j].scale,.25,{x:(Math.random()*2.4+1)*BaseScale,y:BaseScale},{x:.3,y:.3,ease:Power0.easeNone,delay:.15+delay});

      // Rotation
      rotation = this.ThreeService.PointToAngle(Ix,Iy+.7,Ix+(num[j].x*plusOrMinus),(Iy+.7)+num[j].y);
      TweenMax.set(this.OuterSmoke[j].rotation,{z:rotation*Math.PI/180});

      // Opacity
      TweenMax.set(this.OuterSmoke[j].material,{opacity:.9,delay:delay});
      TweenMax.to(this.OuterSmoke[j].material,.2,{opacity:0,ease:Power0.easeNone,delay:.35+delay});
    }
  }

  CraftingSmokes02(Ix,Iy,Iz,BaseScale){
    let num = this.GenerateRandomPosition(6,.6,.8,1.3,1.5,0,0,.6);
    let rotation;
    let numI=0;
    for(let j=10;j<16;j++){
      var plusOrMinus;
      if(j%2==0){
        plusOrMinus=1;
      } else {
        plusOrMinus=-1;
      };

      this.ThreeService.scene.add(this.OuterSmoke[j]);

      TweenMax.fromTo(this.OuterSmoke[j].position,.38,{x:Ix,y:Iy+.9,z:Iz+.25},{x:"+="+(num[numI].x*plusOrMinus),y:"+="+num[numI].y,ease:Power1.easeOut});
      TweenMax.to(this.OuterSmoke[j].position,.1,{y:"-=.1",ease:Power0.easeNone,delay:.28});
      
      // Scale 
      TweenMax.fromTo(this.OuterSmoke[j].scale,.25,{x:(Math.random()*2.4+1.2)*BaseScale,y:BaseScale},{x:.4,y:.4,ease:Power0.easeNone,delay:.15});

      // Rotation
      rotation = this.ThreeService.PointToAngle(Ix,Iy+.7,Ix+(num[numI].x*plusOrMinus),(Iy+.7)+num[numI].y);
      TweenMax.set(this.OuterSmoke[j].rotation,{z:rotation*Math.PI/180});

      // Opacity
      TweenMax.set(this.OuterSmoke[j].material,{opacity:.9});
      TweenMax.to(this.OuterSmoke[j].material,.2,{opacity:0,ease:Power0.easeNone,delay:.35});

      numI++;
    }
  }

  GenerateRandomPosition(n:number,minx,maxx,miny,maxy,minz,maxz,distance){
    let Array = [];
    let num=0;
    while(Array.length<n){
      // Generate Random number
      var Vec3 = new THREE.Vector3(
        Math.random()*(maxx-minx+1)+minx,
        Math.random()*(maxy-miny+1)+miny,
        Math.random()*(maxz-minz+1)+minz
      );
      // Check overlap with distance between points
      for(var j=0;j<Array.length;j++){
        var overlap:boolean=false;
        if(this.ThreeService.distance(Vec3.x,Vec3.y,Vec3.z,Array[j].x,Array[j].y,Array[j].z)<distance){
          overlap=true;
          num++;
          break;
        }
      }
      // if overlap not true, or already ran 10 times, push it.
      if(!overlap || num>9){
        Array.push(Vec3);
        console.log(num);
        num=0;

      }
    }
    return Array;
  }

  private LandMaterial: CANNON.Material
  private GiftMaterial:CANNON.Material
  private debugger03;
  private PlaneMaterial:CANNON.Material;

  InitThirdWorld(): void {
    this.world03 = new CANNON.World();
    this.world03.gravity.set(0, 0, 0);

    TweenMax.delayedCall(1,()=>{
      this.world03.gravity.set(0, -5.5, 0);
    })

    this.debugger03 = new CannonDebugRenderer(this.ThreeService.scene, this.world03);
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
  private Lines=[];
  CreateGiftBalloon(Px,Py,Pz){
    let E = new GiftBalloon;
    this.GiftBalloonArray.push(E);

    // false: uncut, true: cut
    E.State=false;
    // false: The gift hasn't broken
    E.Boop=false;
 
    // Material
    let mateOpacity = new THREE.MeshBasicMaterial({
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

    var s = this.RS.Balloon.scene;

    // Mid Line
    var midGeometry = new THREE.CylinderBufferGeometry(.006,.006,.3,12);
    var midMate = new THREE.MeshMatcapMaterial({color:0xffffff,
      side:2,
      transparent:true,
      opacity:1,
      matcap:this.RS.TSwhite});
    var midMesh = new THREE.Mesh(midGeometry,midMate);
    midMesh.position.set(0,-.2,0);
    s.add(midMesh);

    s.scale.set(1.15,1.15,1.15)
    s.children["0"].position.set(0,0,0);
    s.name="BalloonScene";
    let mate01 = new THREE.MeshMatcapMaterial({
      color:0xffffff,
      side:2,
      transparent:true,
      opacity:1,
      matcap:this.RS.TSred
    })
    s.children["0"].material=mate01;
    this.ThirdSceneObject.push(s)
    E.Balloon3d.add(s);


    E.Balloon3d.position.set(0,0,0);
    this.ThreeService.scene.add(E.Balloon3d);

    var linearDamping = .3;
    var angularDamping = .3;

    // Balloon body
    E.BalloonBody = new CANNON.Body({ mass: 10});
    E.BalloonBody.addShape(new CANNON.Sphere(.15),new CANNON.Vec3(0,0.06,0));
    E.BalloonBody.angularDamping = angularDamping;
    E.BalloonBody.linearDamping = linearDamping;
    this.world03.addBody(E.BalloonBody);

    E.BalloonBody.position.set( Px, Py-.47, Pz);
    
    // Balloon Constraint
    var c = new CANNON.PointToPointConstraint(E.BalloonBody,new CANNON.Vec3(0,.15,0),E.GBBody,new CANNON.Vec3(0,-.15,0));
    this.world03.addConstraint(c);

    E.Box3d = new THREE.Object3D();
    // Box 
    E.BoxThree = this.RS.Box.scene;
    E.BoxThree.scale.set(1.25,1.25,1.25)
    E.BoxThree.position.set(0,0,0);
    let mate02 = new THREE.MeshMatcapMaterial({
      color:0xffffff,
      side:2,
      transparent:true,
      opacity:1,
      matcap:this.RS.TSred
    })
    let mate03 = new THREE.MeshMatcapMaterial({
      color:0xfefefe,
      side:2,
      transparent:true,
      opacity:1,
      matcap:this.RS.TSwhite
    })
    E.BoxThree.children["0"].children[0].material=mate03;
    E.BoxThree.children["0"].children[1].material=mate02;
    E.Box3d.add(E.BoxThree);


    E.BoxLid = this.RS.Lid.scene;
    E.BoxLid.scale.set(1.25,1.25,1.25)
    E.BoxLid.position.set(0,0,0);
    let mate04 = new THREE.MeshMatcapMaterial({
      color:0xffffff,
      side:2,
      transparent:true,
      opacity:1,
      matcap:this.RS.TSred
    })
    let mate05 = new THREE.MeshMatcapMaterial({
      color:0xfefefe,
      side:2,
      transparent:true,
      opacity:1,
      matcap:this.RS.TSwhite
    })
    E.BoxLid.children["0"].children[0].material=mate05;
    E.BoxLid.children["0"].children[1].material=mate04;
    E.Box3d.add(E.BoxLid);

    
    E.BoxAttach = new THREE.Mesh(new THREE.BoxBufferGeometry(.02,.02,.02),mateOpacity)
    E.BoxAttach.position.set(0,.12,0);
    E.Box3d.add(E.BoxAttach);
    this.ThreeService.scene.add(E.Box3d);


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

    E.BoxBody.angularDamping = angularDamping;
    E.BoxBody.linearDamping = linearDamping;


    // Box Constraint
    E.BoxConstraint = new CANNON.LockConstraint(E.BoxBody, E.BalloonBody);
    this.world03.addConstraint(E.BoxConstraint);


    // SHADOW
    let uniforms = {
      tShadow:{value:this.RS.GiftShadow},
      uShadowColor:{value:new THREE.Color("#78b75e")},
      uAlpha:{value:.75}
    }
    let material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})
      
    E.Shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.2),material);
    E.Shadow.rotation.set(-Math.PI/2,0,0)
    
    E.Shadow.position.set(Px,Py,Pz);

    this.ThreeService.scene.add(E.Shadow);

    E.BoxBody.addEventListener('collide',(e)=>{
      if(e.body.material){
        if(e.body.material.name=="PlaneMaterial"&&!E.Boop){
          E.Boop=true;
          TweenMax.to(E.Box3d.scale,.3,{x:.1,y:.1,z:.1})
          E.Shadow.material.uniforms.uShadowColor.value = new THREE.Color(0x000000);
          TweenMax.to(E.Shadow.scale,.3,{x:.1,y:.1,z:.1})
          TweenMax.delayedCall(.2,()=>{
            this.ThreeService.BOOP(E.BoxBody.position.x,E.BoxBody.position.y,E.BoxBody.position.z);
            this.ThreeService.scene.remove(E.Box3d);
            this.ThreeService.scene.remove(E.Shadow);
            this.world03.remove(E.BoxBody);
            this.world03.remove(E.BoxTopBody);
          })
        };
      }
    });

    E.BoxTopBody.addEventListener('collide',(e)=>{
      if(e.body.material){
        if(e.body.material.name=="LandMaterial"&&!E.Boop){
          E.Boop=true;
          TweenMax.to(E.Box3d.scale,.3,{x:.1,y:.1,z:.1})
          TweenMax.to(E.Shadow.scale,.3,{x:.1,y:.1,z:.1})
          TweenMax.delayedCall(.2,()=>{
            this.ThreeService.BOOP(E.BoxBody.position.x,E.BoxBody.position.y,E.BoxBody.position.z);
            this.ThreeService.scene.remove(E.Box3d);
            this.ThreeService.scene.remove(E.Shadow);
            this.world03.remove(E.BoxBody);
            this.world03.remove(E.BoxTopBody);
          })
        };
      }
    });




    TweenMax.to(E.GBBody.position,3,{repeat:15,repeatDelay:0,
      onRepeat:()=>{
        if(!E.State){
          TweenMax.to(E.GBBody.position,2,{x:"+=.4",z:"+=.3",ease:Power1.easeIn});
          TweenMax.to(E.GBBody.position,2,{x:"+=.4",z:"-=.3",ease:Power1.easeOut,delay:1.5});
        }
      }});
  }

  
  ThirdRaycaster(){
    this.ThreeService.raycaster.setFromCamera(this.ThreeService.mouse,this.ThreeService.camera);
    var intersect = this.ThreeService.raycaster.intersectObjects(this.ThirdSceneObject,true)
    if(intersect.length>0){
      document.body.style.cursor="pointer";
    } else {
      document.body.style.cursor="default";
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
      new THREE.MeshMatcapMaterial({color:0xffffff,matcap:this.RS.TStent01,transparent:true}));
    let Score02 = new THREE.Mesh(new THREE.BoxBufferGeometry(.08,.05,.005),
      new THREE.MeshMatcapMaterial({color:0xffffff,matcap:this.RS.TSred,transparent:true}));
    let Score03 = new THREE.Mesh(new THREE.BoxBufferGeometry(.05,.08,.005),
      new THREE.MeshMatcapMaterial({color:0xffffff,matcap:this.RS.TSyellow,transparent:true}));
    Score01.position.set(0,5,0)
    Score02.position.set(0,5,0)
    Score03.position.set(0,5,0)
    for (var i=0;i<this.ScoreMax/3;i++){
      let mesh = Score01.clone();
      this.ThreeService.scene.add(mesh);
      this.GolfScore.push(mesh);
      
      let mesh02 = Score02.clone();
      this.ThreeService.scene.add(mesh02);
      this.GolfScore.push(mesh02);

      let mesh03 = Score03.clone();
      this.ThreeService.scene.add(mesh03);
      this.GolfScore.push(mesh03);
    }
    // let Score02 = new THREE.Mesh(new THREE.CylinderBufferGeometry(.04,.04,.02,8,1),
    //   new THREE.MeshMatcapMaterial({color:0xffffff,matcap:this.RS.TStent01,transparent:true}));
    // Score02.position.set(0,5,0)
    // for(var i=0;i<this.ScoreMax/3;i++){
    //   let mesh = Score02.clone();
    //   this.ThreeService.scene.add(mesh);
    //   this.GolfScore.push(mesh);
    // }
    // let Score03 = new THREE.Mesh(new THREE.CylinderBufferGeometry(.04,.04,.02,8,1),
    //   new THREE.MeshMatcapMaterial({color:0xffffff,matcap:this.pink,transparent:true}));
    // Score03.position.set(0,5,0)
    // for(var i=0;i<this.ScoreMax/3;i++){
    //   let mesh = Score03.clone();
    //   this.ThreeService.scene.add(mesh);
    //   this.GolfScore.push(mesh);
    // }

    // let yellow = this.textureLoader.load('assets/matcaps/03/FFEB40.png',()=>{
    //   yellow.encoding=THREE.sRGBEncoding;
    // });

    let coin = new THREE.Object3D();

    this.RS.Coin.scene.scale.set(2.75,2.75,2.75)
    this.RS.Coin.scene.position.set(0,0,0);
    this.RS.Coin.scene.rotation.set(40*Math.PI/180,0,20*Math.PI/180)

    coin.add(this.RS.Coin.scene);

    for(var i=0;i<8;i++){
      let mesh = coin.clone();
      mesh.name="Coin";
      let mate01 = new THREE.MeshMatcapMaterial({
        color:0xffffff,
        side:2,
        transparent:true,
        opacity:1,
        matcap:this.RS.TSyellow
      })
      let mate02 = new THREE.MeshMatcapMaterial({
        color:0xeeeeee,
        side:2,
        transparent:true,
        opacity:1,
        matcap:this.RS.TSyellow
      })

      mesh.children["0"].children[0].children[0].material=mate01;
      mesh.children["0"].children[0].children[1].material=mate02;

      
      // Shadow
      let uniforms = {
        tShadow:{value:this.RS.CoinShadow},
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
      this.ThreeService.scene.add(mesh);
      this.CoinArray.push(mesh);
    }
  }

  private ScoreDistance = .25;
  ScoreFunction(Po:CANNON.Vec3){
    if(this.ScoreCurrent >= this.ScoreMax){
      this.ScoreCurrent=24;
      this.ScoreLast=0;
    } else {
      this.ScoreCurrent+=24;
    }

    var j=0;
    for(var i=this.ScoreLast;i<this.ScoreCurrent;i++){

      var ranX = Po.x + Math.random()*1.2-.6;
      var ranZ = Po.z + Math.random()*1.2-.6;

      var distance = this.ThreeService.distanceVec2(ranX,ranZ,Po.x,Po.z);
      if(distance>this.ScoreDistance){
        var randomDelay = j;
        j+=.01;

        // Distance duration
        var DD = (distance - this.ScoreDistance);

        var PoDuration = .35 + DD;
        
        // Position
        TweenMax.fromTo(this.GolfScore[i].position,PoDuration,
          {x:Po.x,z:Po.z},
          {x:ranX,z:ranZ,delay:randomDelay,ease:Power1.easeOut});


        TweenMax.fromTo(this.GolfScore[i].position,PoDuration/2,{y:Po.y},{ease:Power1.easeOut,y:DD+.4,delay:randomDelay})
        TweenMax.to(this.GolfScore[i].position,PoDuration/2,{ease:Power1.easeIn,delay:(PoDuration/2)+randomDelay,y:0.28})

        // Rotation
        TweenMax.fromTo(this.GolfScore[i].rotation,PoDuration,{x:0,y:0,z:0},{x:Math.random()*24-12,y:Math.random()*24-12,z:Math.random()*24-12,delay:randomDelay,ease:Power0.easeNone});

        // Scale
        // TweenMax.set(this.GolfScore[i].scale,{x:Math.random()*.3+.7,y:Math.random()*.3+.7,z:Math.random()*.3+.7});
        TweenMax.to(this.GolfScore[i].scale,PoDuration,{delay:PoDuration+.1,x:.1,y:.1,z:.1})
      } else {
        i--;
      }
    }
    this.ScoreLast = this.ScoreCurrent;

    // Coin
    this.CoinArray[this.CoinCurrent].position.set(Po.x,Po.y,Po.z);
    TweenMax.fromTo(this.CoinArray[this.CoinCurrent].position,.35,{y:Po.y},{delay:0,ease:Power1.easeOut,y:"+=.6"})
    TweenMax.to(this.CoinArray[this.CoinCurrent].position,.35,{ease:Power1.easeIn,delay:.35,y:0.28})

    // Opacity
    TweenMax.to(this.CoinArray[this.CoinCurrent].children[1].material.uniforms.uAlpha,
      .3,{value:.6,delay:.6})
    this.CoinCurrent+=1;
  }

  private RockClickNum:number=0;
  private Tree01CoinDroped:Boolean=false;
  private Tree02CoinDroped:Boolean=false;
  private CoinPickedUp:number=0;
  ThirdClickEvent(){
    this.ThreeService.raycaster.setFromCamera(this.ThreeService.mouse,this.ThreeService.camera);
    var intersect = this.ThreeService.raycaster.intersectObjects(this.ThirdSceneObject,true)
    if(intersect.length>0){
      console.log(intersect[0])
      switch (intersect[0].object.name) {
        case "Rock":
          var Vector = new THREE.Vector3();
          Vector.setFromMatrixPosition(intersect[0].object.matrixWorld);

          // Coin && Rock
          if(this.RockClickNum<3){
            // Rock
            TweenMax.to(intersect[0].object.parent.position,.3,{x:"+=.1",z:"-=.1",ease:Power1.easeOut});
            TweenMax.to(intersect[0].object.parent.position,.3,{x:"-=.1",z:"+=.1",ease:Power1.easeIn,delay:.3});

            // scale
            TweenMax.fromTo(this.CoinArray[this.CoinCurrent].scale,.3,{x:.2,y:.2,z:.2},{x:1,y:1,z:1})
            // Opacity
            TweenMax.to(this.CoinArray[this.CoinCurrent].children[1].material.uniforms.uAlpha,
              .3,{value:.6,delay:.6})

            // X Z
            if(this.RockClickNum==0){
              TweenMax.fromTo(this.CoinArray[this.CoinCurrent].position,1,{x:Vector.x,z:Vector.z},{x:"+=.45",z:"+=.45",ease:Power1.easeOut});
            } else if (this.RockClickNum==1){
              TweenMax.fromTo(this.CoinArray[this.CoinCurrent].position,1,{x:Vector.x,z:Vector.z},{x:"+=0",z:"+=.45",ease:Power1.easeOut});
            } else  {
              TweenMax.fromTo(this.CoinArray[this.CoinCurrent].position,1,{x:Vector.x,z:Vector.z},{x:"-=.45",z:"+=.45",ease:Power1.easeOut});
            }
            this.RockClickNum++;

            // Y
            TweenMax.fromTo(this.CoinArray[this.CoinCurrent].position,.3,{y:Vector.y},{ease:Power1.easeOut,y:"+=.6"})
            TweenMax.to(this.CoinArray[this.CoinCurrent].position,.3,{ease:Power1.easeIn,delay:.3,y:0.28})

            TweenMax.to(this.CoinArray[this.CoinCurrent].position,.2,{delay:0.6,ease:Power1.easeOut,y:"+=.12"})
            TweenMax.to(this.CoinArray[this.CoinCurrent].position,.2,{ease:Power1.easeIn,delay:.8,y:0.28})

            this.CoinCurrent+=1;
          }

          // Star 
          Vector.y+=.3;
          Vector.x-=.1;
          Vector.project(this.ThreeService.camera);
          var Px = (Vector.x+1)*window.innerWidth/2;
          var Py = - (Vector.y-1)*window.innerHeight/2;

          for(var i=0;i<3;i++){
            var xmlns = "http://www.w3.org/2000/svg";
            let star = document.createElementNS(xmlns,'svg');
            star.setAttributeNS(null,"viewBox","-20 -20 40 40");
            star.setAttribute("class", "star");
  
            var path = document.createElementNS(xmlns,"path");
            path.setAttributeNS(null, "d", "M6,-4C20,0 20,0 6,4C6,19 6,19 -2,7C-16,12 -16,12 -8,0C-16,-12 -16,-12 -2,-7C6,-19 6,-19 6,-4");
  
            document.getElementById('Main').appendChild(star);
            star.appendChild(path);
  
            // Set Position, rotate
            TweenMax.set(star,{css:{left:Px,top:Py}});
            TweenMax.set(star,{css:{rotationZ:Math.random()*90}});
            //
            TweenMax.to(star,.25,{css:{opacity:0},delay:.4,ease:Power1.easeIn})
            TweenMax.to(star,.5,{rotationZ:"-=180",ease:Power1.easeOut})
            if(i==0){
              TweenMax.set(star,{css:{scale:.8}});
              var rL = 20 + Math.random()*10-5;
              var rT = 70 + Math.random()*10-5;
              TweenMax.to(star,.25,{ease:Power1.easeOut,css:{left:"-="+rL,top:"-="+rT}});
              TweenMax.to(star,.2,{ease:Power0.easeNone,delay:.25,css:{left:"-=15",top:"+=15"}});
            } else if (i==1){
              TweenMax.set(star,{css:{scale:1.1}});
              var rL = 65 + Math.random()*14-7;
              var rT = 65 + Math.random()*14-7;
              TweenMax.to(star,.25,{ease:Power1.easeOut,css:{left:"-="+rL,top:"-="+rT}});
              TweenMax.to(star,.2,{ease:Power0.easeNone,delay:.25,css:{left:"-=15",top:"+=15"}});
            } else {
              var rL = 70 + Math.random()*10-5;
              var rT = 20 + Math.random()*10-5;
              TweenMax.to(star,.25,{ease:Power1.easeOut,css:{left:"-="+rL,top:"-="+rT}});
              TweenMax.to(star,.2,{ease:Power0.easeNone,delay:.25,css:{left:"-=15",top:"+=15"}});
            }

            // Delete
            TweenMax.delayedCall(2,()=>{
              document.getElementById('Main').removeChild(star);
            })
          }
        break;
        case "BubbleObject":
          TweenMax.to(this.HouseBubble.scale,.3,{x:.1,y:.1,z:.1,onComplete:()=>{this.ThreeService.scene.remove(this.HouseBubble);this.ThreeService.scene.remove(this.BubbleObject);}});
          TweenMax.to(this.Bubble.scale,.3,{x:.1,y:.1,z:.1,onComplete:()=>{this.ThreeService.scene.remove(this.Bubble);}});
          for(let i=0;i<this.BubbleArray.length;i++){
            TweenMax.to(this.BubbleArray[i].scale,.3,{x:.01,y:.01,z:.01,onComplete:()=>{this.ThreeService.scene.remove(this.BubbleArray[i]);}});
          }
          this.UpgradeFunction(30,-0.075,0);
        break;
      }
      switch (intersect[0].object.parent.name){
        case "Tree01":
        case "Tree02":
          // this.UpgradeFunction(15,-0.075,0);

          if(intersect[0].object.parent.name == "Tree01"){
            if(!this.Tree01CoinDroped){
              var random = Math.random();
              if(random<.5){
                this.TreeDropCoin(intersect[0].object.parent);
                this.Tree01CoinDroped = true;
              }
            }
          } else {
            if(!this.Tree02CoinDroped){
              var random = Math.random();
              if(random<.5){
                this.TreeDropCoin(intersect[0].object.parent);
                this.Tree02CoinDroped = true;
              }
            }
          }

          var Vector = new THREE.Vector3();

          // Vibrate
          TweenMax.to(intersect[0].object.parent.rotation,.075,{z:-.03,ease:Power0.easeNone});
          TweenMax.to(intersect[0].object.parent.rotation,.15,{z:.03,ease:Power0.easeNone,delay:.075});
          TweenMax.to(intersect[0].object.parent.rotation,.15,{z:-.03,ease:Power0.easeNone,delay:.225});
          TweenMax.to(intersect[0].object.parent.rotation,.075,{z:0,ease:Power0.easeNone,delay:.375});

          // Leaf
          TweenMax.delayedCall(.2,()=>{
            for(var i=0;i<4;i++){
              let leaf = document.createElement('div');
              leaf.className = "leaf";
              document.getElementById('Main').appendChild(leaf);
  
              Vector.setFromMatrixPosition(intersect[0].object.parent.matrixWorld);
              
              Vector.x += Math.random()*.8-.4 - .1;
              Vector.y += Math.random()*.8-.4 + .75;
              Vector.project(this.ThreeService.camera);
              var Px = (Vector.x+1)*window.innerWidth/2;
              var Py = - (Vector.y-1)*window.innerHeight/2;
              
              
              TweenMax.set(leaf,{css:{rotate:Math.random()*360-180}});
              TweenMax.to(leaf,.3,{css:{opacity:1},delay:i*.2});

              var rX = Math.random()*40-20;
              var rY = Math.random()*40+40;
              TweenMax.fromTo(leaf,1.5,{css:{left:Px,top:Py}},{css:{top:"+="+rY,left:"+="+rX},ease:Power0.easeNone});
              
              TweenMax.fromTo(leaf,1.5,{css:{scale:Math.random()*.5+.5}},{css:{scale:.01},delay:i*.2,ease:Power0.easeNone});

              TweenMax.delayedCall(2,()=>{
                document.getElementById('Main').removeChild(leaf);
              })
            }
          })
          break;
        case "Coin":
          // Coin
          TweenMax.to(intersect[0].object.parent.parent.position,.4,{y:"+=.3",ease:Power0.easeNone});
          TweenMax.to(intersect[0].object.parent.parent.scale,.4,{delay:.2,x:.1,y:.1,z:.1,ease:Power0.easeNone});
          TweenMax.to(intersect[0].object.parent.parent.parent.children["1"].material.uniforms.uAlpha,
            .4,{value:0,delay:.1})

          // +1
          var plus1 = document.createElement('div');
          plus1.innerHTML = "+1";
          plus1.className = "plus1";
          document.getElementById('Main').appendChild(plus1);

          var Vector = new THREE.Vector3()
          Vector.setFromMatrixPosition(intersect[0].object.matrixWorld);

          Vector.project(this.ThreeService.camera);
          
          var Px = (Vector.x+1)*window.innerWidth/2;
          var Py = - (Vector.y-1)*window.innerHeight/2;
          Vector.y+=.2;
          var Py2 = - (Vector.y-1)*window.innerHeight/2;
          TweenMax.set(plus1,{css:{left:Px}})
          TweenMax.fromTo(plus1,.8,{css:{top:Py}},{css:{top:Py2},ease:Power1.easeOut})
          TweenMax.to(plus1,.4,{css:{opacity:1},delay:.1})
          TweenMax.to(plus1,.8,{css:{opacity:0},delay:.6})

          // Check If Enough to Upgrade
          this.CoinPickedUp++;
          if(this.CoinPickedUp==1){
            this.BubbleUpgrade();
          }
          
          TweenMax.delayedCall(1,()=>{
            document.getElementById('Main').removeChild(plus1);
            this.ThreeService.scene.remove(intersect[0].object.parent.parent.parent);
          })
          break;
        case "BalloonScene":
          this.POPBalloon(intersect[0].object.parent.parent.id,intersect[0].object.parent.parent.position);
        break;
      }
    }
  }


  TreeDropCoin(Object){
    // scale
    TweenMax.fromTo(this.CoinArray[this.CoinCurrent].scale,.6,{x:.2,y:.2,z:.2},{x:1,y:1,z:1})
    // Opacity
    TweenMax.to(this.CoinArray[this.CoinCurrent].children[1].material.uniforms.uAlpha,
      .3,{value:.6,delay:.6})

    let Vector = new THREE.Vector3();

    Vector.setFromMatrixPosition(Object.matrixWorld);
    Vector.x+=.21;
    Vector.z+=.21;

    // X Z
    TweenMax.set(this.CoinArray[this.CoinCurrent].position,{x:Vector.x,z:Vector.z,});
    TweenMax.to(this.CoinArray[this.CoinCurrent].position,.35,{x:"+=.15",z:"+=.15",delay:.4});

    // Y
    TweenMax.fromTo(this.CoinArray[this.CoinCurrent].position,.4,{y:.28+.6},{ease:Power1.easeIn,y:"-=.6"})

    TweenMax.to(this.CoinArray[this.CoinCurrent].position,.2,{delay:0.4,ease:Power1.easeOut,y:"+=.15"})
    TweenMax.to(this.CoinArray[this.CoinCurrent].position,.2,{ease:Power1.easeIn,delay:.6,y:0.28})

    this.CoinCurrent+=1;
  }

  ThirdSceneRender(){
    // this.RS.Island.sceneSea.verticesNeedUpdate=true;
    // this.ThreeService.raycaster.setFromCamera(this.ThreeService.mouse,this.ThreeService.camera);
    // var intersects = this.ThreeService.raycaster.intersectObjects(this.Lines,true)
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
    this.render = requestAnimationFrame(()=>{
      this.ThirdSceneRender();
    });

    this.ThirdRaycaster();
    this.world03.step(1 / this.ThreeService.fps);
    // this.debugger03.update();

    // GiftBalloon
    this.GBrender();
  }

  GBrender(){
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
    }
  }

  private mouseF = new THREE.Vector2();
  private mouseL = new THREE.Vector2();
  CursorBegin() {
    this.FirstCursor.set(this.ThreeService.pos.x, this.ThreeService.pos.y, this.ThreeService.pos.z);
    this.LastCursor.set(this.ThreeService.pos.x, this.ThreeService.pos.y, this.ThreeService.pos.z);
    this.mouseF.copy(this.ThreeService.mouse);
    this.mouseL.copy(this.ThreeService.mouse);
  }

  BalloonCursor() {
    this.LastCursor.set(this.ThreeService.pos.x, this.ThreeService.pos.y, this.ThreeService.pos.z);
    this.mouseL.copy(this.ThreeService.mouse);
  }

  POPArray=[];
  POPCurrent=0;
  POPMaterial(){
    for(var i=0;i<5;i++){
      let B1 = new THREE.Object3D();
      B1.scale.set(1,1,1);
      B1.rotation.set(90*Math.PI/180,0,0);
      this.ThreeService.scene.add(B1);
      this.POPArray.push(B1);

      let boopMat = new THREE.MeshBasicMaterial({ color: 0xB13D41,transparent:true,opacity:0 });
      let meshB = new THREE.Mesh(new THREE.BoxBufferGeometry(.15, .06, .06),boopMat);

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
  BalloonPOP(Ox: number, Oy: number, Oz: number){
    if(this.POPCurrent == 5){
      this.POPCurrent=0;
    }
    

    this.POPArray[this.POPCurrent].position.set(Ox, Oy, Oz);
    // this.POPArray[this.POPCurrent].rotation.y = (Math.random()*90*Math.PI/180);
    for(var i=0;i<this.POPArray[this.POPCurrent].children.length;i++){
      // this.POPArray[this.POPCurrent].children[i].children[0].material.color.setHex(color);
      TweenMax.fromTo(this.POPArray[this.POPCurrent].children[i].children[0].position,.2,{x:.05},{x:"+=.15"});
      TweenMax.fromTo(this.POPArray[this.POPCurrent].children[i].children[0].scale,.2,{x:1,y:1,z:1},{x:.1,y:.1,z:.1});
      TweenMax.fromTo(this.POPArray[this.POPCurrent].children[i].children[0].material,.3,{opacity:1},{opacity:0,delay:.1,ease:Power1.easeIn});
    }
    this.POPCurrent++;


    // smoke 
    var smoke = document.createElement('div');
    smoke.innerHTML = "+1";
    smoke.className = "smoke";
    document.getElementById('Main').appendChild(smoke);
    
  }

  POPBalloon(id,Ipoint:THREE.Vector3){
    for(var i=0;i<this.GiftBalloonArray.length;i++){
      if(this.GiftBalloonArray[i].Balloon3d.id==id && !this.GiftBalloonArray[i].State){
        // Remove balloon part
        this.ThreeService.scene.remove(this.GiftBalloonArray[i].Balloon3d);
        this.world03.removeConstraint(this.GiftBalloonArray[i].BoxConstraint);
        this.world03.remove(this.GiftBalloonArray[i].GBBody);
        this.world03.remove(this.GiftBalloonArray[i].BalloonBody);

        // Pop Animation
        this.BalloonPOP(Ipoint.x,Ipoint.y,Ipoint.z)

        // If Land Correctly
        var k = i;
        TweenMax.delayedCall(2,()=>{
          if(!this.GiftBalloonArray[k].Boop){
            // Success Animation
            TweenMax.to(this.GiftBalloonArray[k].Box3d.scale,.25,{x:.9,y:.9,z:.9,ease:Power1.easeOut});
            TweenMax.to(this.GiftBalloonArray[k].BoxLid.position,.25,{y:"-=.05",ease:Power1.easeOut});
            TweenMax.to(this.GiftBalloonArray[k].BoxThree.position,.25,{y:"-=.05",ease:Power1.easeOut});

            TweenMax.to(this.GiftBalloonArray[k].Box3d.scale,.25,{x:1,y:1,z:1,delay:.25,ease:Power1.easeIn});
            TweenMax.to(this.GiftBalloonArray[k].BoxLid.position,.25,{y:"+=.05",delay:.25,ease:Power1.easeIn});
            TweenMax.to(this.GiftBalloonArray[k].BoxThree.position,.25,{y:"+=.05",delay:.25,ease:Power1.easeIn});
            
            TweenMax.to(this.GiftBalloonArray[k].BoxLid.position,.2,{y:"+=.1",x:"+=.1",z:"-=.1",delay:.4,ease:Power1.easeIn})
            TweenMax.to(this.GiftBalloonArray[k].BoxLid.rotation,.2,{x:"-=.35",z:"-=.35",delay:.4,ease:Power1.easeIn})
            TweenMax.to(this.GiftBalloonArray[k].BoxLid.children[0].children[0].material,.1,{opacity:0,delay:.7,ease:Power1.easeIn})
            TweenMax.to(this.GiftBalloonArray[k].BoxLid.children[0].children[1].material,.1,{opacity:0,delay:.7,ease:Power1.easeIn})
            
            TweenMax.delayedCall(.6,()=>{
              this.ScoreFunction(this.GiftBalloonArray[k].BoxBody.position);
              TweenMax.to(this.GiftBalloonArray[k].BoxThree.children[0].children[0].material,.3,{opacity:0,delay:.4,ease:Power1.easeIn})
              TweenMax.to(this.GiftBalloonArray[k].BoxThree.children[0].children[1].material,.3,{opacity:0,delay:.4,ease:Power1.easeIn})
            })
            TweenMax.delayedCall(1,()=>{
              this.ThreeService.scene.remove(this.GiftBalloonArray[k].Box3d);
              this.ThreeService.scene.remove(this.GiftBalloonArray[k].Shadow);
            })

            // remove stuff
            this.world03.remove(this.GiftBalloonArray[k].BoxBody);
            this.world03.remove(this.GiftBalloonArray[k].BoxTopBody);
          }
        })
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

        var distance = this.ThreeService.distance(Ipoint.x, Ipoint.y, Ipoint.z,
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
        this.ThreeService.scene.remove(this.GiftBalloonArray[i].StringLine01)

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
        this.ThreeService.scene.add(this.GiftBalloonArray[i].StringLine01)
        
        this.world03.removeConstraint(this.GiftBalloonArray[i].BoxConstraint);


        // Setup bottom line
        this.GiftBalloonArray[i].Curve = new THREE.LineCurve3(Po2,Ipoint);

        this.GiftBalloonArray[i].CurvePoint = this.GiftBalloonArray[i].Curve.getPoints(3);

        var distance = this.ThreeService.distance(Ipoint.x, Ipoint.y, Ipoint.z,
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
        this.ThreeService.scene.add(this.GiftBalloonArray[i].StringLine02)
        
        this.world03.removeConstraint(this.GiftBalloonArray[i].BoxConstraint);

        TweenMax.to(this.GiftBalloonArray[i].GBBody.position,2,{y:"+=2",ease:Power1.easeIn});
        
        // this.GiftBalloonArray[i].BoxBody.velocity.y=-1;


      }
    }
  }
}

class GiftBalloon{
  GB: THREE.Object3D
  GBBody: CANNON.Body

  Balloon3d: THREE.Object3D
  BalloonBody: CANNON.Body

  Box3d: THREE.Object3D
  BoxBody: CANNON.Body
  BoxTopBody: CANNON.Body
  BoxThree: THREE.Scene
  BoxLid: THREE.Scene
  BoxAttach: THREE.Mesh
  BoxConstraint: CANNON.LockConstraint

  Shadow: any

  Boop:Boolean
  State:Boolean
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
