import * as THREE from 'three';
import * as CANNON from 'cannon';
import { gsap } from 'gsap';
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
    this.CreateBalloonCursor();
    this.CreateIsland(15,-0.075,-.5);

    
    this.StringM = new LineMaterial({
      color:0xeeeeee,
      linewidth:.0012,
    })
    this.CreateGiftBalloon(10,3,0);

    
    // this.RS.Lid.scene.position.set(15,2,0)
    // var something = this.RS.Lid.scene;
    // this.ThreeService.scene.add(something)



    this.AddEvent();
    this.ThirdSceneRender();
  }


  AddEvent(){
    this.ThreeService.canvas.addEventListener("click", throttle(this.ClickEvent,600));
    
    this.ThreeService.canvas.addEventListener("mousedown", this.MouseUp);

    this.ThreeService.canvas.addEventListener("mouseup", this.MouseDown);
  }

  ClickEvent = ()=>{  
    this.ThirdClickEvent();
  }

  MoveEvent = ()=>{
    this.BalloonCursor();
  }
  
  MouseUp = (e)=>{
    if (e.which == 1) {
      this.CursorBegin();
      this.ThreeService.canvas.addEventListener("mousemove", this.MoveEvent,false);
    }
  }

  MouseDown = (e)=>{
    if (e.which == 1) {
      this.ThreeService.canvas.removeEventListener("mousemove", this.MoveEvent,false);
      gsap.to(this.FirstCursor, .5, {
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
  }

  private SmokeTexture:THREE.Mesh;
  private SmokeTexture02:THREE.Mesh;
  private Bubble;
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
          color:0xffffff,side:2,matcap:this.RS.land,transparent:true,opacity:mateOpacity,
        });
        this.RS.Island.scene.children[""+i+""].children[0].material=mate01;
        let mate02 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.tree,transparent:true,opacity:mateOpacity,
        });
        this.RS.Island.scene.children[""+i+""].children[1].material=mate02;
      } else if(this.RS.Island.scene.children[""+i+""].name=="Tree01"||this.RS.Island.scene.children[""+i+""].name=="Tree02"){
          let mate01 = new THREE.MeshMatcapMaterial({
            color:0xffffff,side:2,matcap:this.RS.wood03,transparent:true,opacity:mateOpacity,
          });
          this.RS.Island.scene.children[""+i+""].children[0].material=mate01;
          let mate02 = new THREE.MeshMatcapMaterial({
            color:0xffffff,side:2,matcap:this.RS.tree,transparent:true,opacity:mateOpacity,
          });
        this.RS.Island.scene.children[""+i+""].children[1].material=mate02;
        this.ThirdSceneObject.push(this.RS.Island.scene.children[""+i+""]);
      } else if(this.RS.Island.scene.children[""+i+""].name=="Mail"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.wood03,transparent:true,opacity:mateOpacity,
        });
        this.RS.Island.scene.children[""+i+""].children[0].material=mate01;
        let mate02 = new THREE.MeshMatcapMaterial({
          color:0xcccccc,side:2,matcap:this.RS.wood03,transparent:true,opacity:mateOpacity,
        });
        this.RS.Island.scene.children[""+i+""].children[1].material=mate02;
      } else if(this.RS.Island.scene.children[""+i+""].name=="Sea"){
        var seaMate = new THREE.MeshBasicMaterial({color:0x81d2e8});
        let bgparams = {
          sea: "#81d2e8",
        }
      
        var bg = this.ThreeService.gui.addFolder("Sea Inner");
        bg.addColor(bgparams, "sea")
          .onChange(() => {
            seaMate.color.set(new THREE.Color(bgparams.sea));
          });
        this.RS.Island.scene.children[""+i+""].material=seaMate;
        this.RS.Island.scene.children[""+i+""].scale.set(1.1,1.1,1.1);
        // this.RS.Island.scene.children[""+i+""].position.y=.2

        // gsap.fromTo(this.RS.Island.scene.children[""+i+""].rotation,1.5,{z:.02},{z:-.02,repeat:-1,yoyo:true,ease:"power1.inOut"});
        gsap.fromTo(this.RS.Island.scene.children[""+i+""].position,1.5,{y:"+=.07"},{y:"-=.07",repeat:-1,yoyo:true,ease:"power1.inOut"});
      } else if(this.RS.Island.scene.children[""+i+""].name=="OuterSea"){
        
        var seaMate = new THREE.MeshBasicMaterial({color:0x81d2e8});
        let bgparams = {
          sea: "#81d2e8",
        }
      
        var bg = this.ThreeService.gui.addFolder("Sea Outer");

        bg.addColor(bgparams, "sea")
          .onChange(() => {
            seaMate.color.set(new THREE.Color(bgparams.sea));
          });
        this.RS.Island.scene.children[""+i+""].material=seaMate;
        // this.RS.Island.scene.children[""+i+""].scale.set(1.1,1.1,1.1);
        gsap.fromTo(this.RS.Island.scene.children[""+i+""].scale,1.5,{x:1.1,z:1.1},{x:1.18,z:1.18,repeat:-1,yoyo:true,ease:"power1.inOut"});
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
          color:0xffffff,side:2,matcap:this.RS.white03,transparent:true,opacity:mateOpacity,
        });
        let mate02 = new THREE.MeshMatcapMaterial({
          color:0xfefefe,side:2,matcap:this.RS.wood03,transparent:true,opacity:mateOpacity,
        });
        this.RS.Hammer.scene.children[""+i+""].children[0].material=mate02;
        this.RS.Hammer.scene.children[""+i+""].children[1].material=mate02;
      }
    }
    this.RS.Hammer.scene.scale.set(2,2,2);

    // Smoke Texture Center
    var uniforms = {
      tShadow:{value:this.RS.SmokeTexture},
      uShadowColor:{value:new THREE.Color("#ffffff")},
      uAlpha:{value:.4}
    }
    var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})
      
    this.SmokeTexture = new THREE.Mesh(new THREE.PlaneGeometry(3,3),material);
    this.SmokeTexture.rotation.set(0,0,0)
    this.SmokeTexture.position.set(Ix,Iy+.85,Iz+.75);
    this.SmokeTexture.renderOrder=2;

    // Smoke Texture 02
    var uniforms = {
      tShadow:{value:this.RS.SmokeTexture},
      uShadowColor:{value:new THREE.Color("#f2f2f2")},
      uAlpha:{value:.7}
    }
    var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})
      
    this.SmokeTexture02 = new THREE.Mesh(new THREE.PlaneGeometry(3,3),material);
    this.SmokeTexture02.rotation.set(0,0,0)
    this.SmokeTexture02.position.set(Ix,Iy+.85,Iz+.75);

    // Bubble Texture
    var uniforms = {
      tShadow:{value:this.RS.BubbleTexture},
      uShadowColor:{value:new THREE.Color("#FFF2DD")},
      uAlpha:{value:1}
    }
    var material = new THREE.ShaderMaterial({wireframe:false,transparent:true,uniforms,depthWrite:false,
      vertexShader:document.getElementById('vertexShader').textContent,
      fragmentShader:document.getElementById('fragmentShader').textContent})
    let tempBubble = new THREE.Mesh(new THREE.PlaneGeometry(3,3),material)
    tempBubble.scale.set(.5,.5,.5);
    tempBubble.rotation.set(0,0,0)
    tempBubble.position.set(Ix-.05,Iy,Iz);
    this.Bubble = [];
    for(var i=0;i<5;i++){
      let clone = tempBubble.clone();
      this.Bubble.push(clone);
    }

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
          color:0xffffff,side:2,matcap:this.RS.tent01,transparent:true,opacity:mateOpacity,
        });
        this.RS.Tent.scene.children[""+i+""].children[0].material=mate01;
        let mate02 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.tent02,transparent:true,opacity:mateOpacity,
        });
        this.RS.Tent.scene.children[""+i+""].children[1].material=mate02;
      } else if(this.RS.Tent.scene.children[""+i+""].name=="Pillar"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.wood03,transparent:true,opacity:mateOpacity,
        });
        this.RS.Tent.scene.children[""+i+""].material=mate01;
      } else if(this.RS.Tent.scene.children[""+i+""].name=="Rope"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.wood03,transparent:true,opacity:mateOpacity,
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
    this.ThreeService.scene.add(this.RS.Tent.scene);

  }
  
  CreateHouse(Ix,Iy,Iz,ScaleMultiplier){
    let mateOpacity = 1;
    // House
    this.RS.House.scene.scale.set(1.7,1.7,1.7);
    this.RS.House.scene.position.set(Ix-.1,Iy+.01,Iz);
    this.RS.House.scene.rotation.set(0,0*Math.PI/180,0);
    // this.ThreeService.scene.add(this.RS.House.scene);

    // blue
    var ma01 = new THREE.MeshMatcapMaterial({
      color:0xE79D7C,side:2,matcap:this.RS.white03,transparent:true,opacity:mateOpacity,
    });
    // let ma01params = {
    //   ma01: "#E79D7C",
    // }
    // // white
    var ma02 = new THREE.MeshMatcapMaterial({
      color:0xfff3d8,side:2,matcap:this.RS.white03,transparent:true,opacity:mateOpacity,
    });
    // let ma02params = {
    //   ma02: "#fff3d8",
    // }
    // // wood
    var ma03 = new THREE.MeshMatcapMaterial({
      color:0xE7CE9B,side:2,matcap:this.RS.white03,transparent:true,opacity:mateOpacity,
    });
    // let ma03params = {
    //   ma03: "#E7CE9B",
    // }
    // // sea
    var ma04 = new THREE.MeshMatcapMaterial({
      color:0xd3f5ff,side:2,matcap:this.RS.white03,transparent:true,opacity:mateOpacity,
    });
    // let ma04params = {
    //   ma04: "#d3f5ff",
    // }
    // var House = this.ThreeService.gui.addFolder("House");
    // House.addColor(ma01params, "ma01")
    //   .onChange(() => {
    //     ma01.color.set(new THREE.Color(ma01params.ma01));
    //   });
    // House.addColor(ma02params, "ma02")
    // .onChange(() => {
    //   ma02.color.set(new THREE.Color(ma02params.ma02));
    // });
    // House.addColor(ma03params, "ma03")
    // .onChange(() => {
    //   ma03.color.set(new THREE.Color(ma03params.ma03));
    // });
    // House.addColor(ma04params, "ma04")
    // .onChange(() => {
    //   ma04.color.set(new THREE.Color(ma04params.ma04));
    // });
    for(var i=0;i<this.RS.House.scene.children.length;i++){
      if(this.RS.House.scene.children[""+i+""].name=="House"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.wood03,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[0].material=mate01;
        let mate02 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.wood03,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[1].material=mate02;
        let mate03 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.wood03,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[2].material=mate03;
        
        // Testing
        this.RS.House.scene.children[""+i+""].children[0].material=ma02;
        this.RS.House.scene.children[""+i+""].children[1].material=ma03;
        this.RS.House.scene.children[""+i+""].children[2].material=ma01;
      } else if(this.RS.House.scene.children[""+i+""].name=="Door"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.wood03,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[0].material=mate01;
        let mate02 = new THREE.MeshMatcapMaterial({
          color:0xeeeeee,side:2,matcap:this.RS.wood03,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[1].material=mate02;

        // testing
        this.RS.House.scene.children[""+i+""].children[0].material=ma03;
      } else if(this.RS.House.scene.children[""+i+""].name=="Window"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.wood03,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[0].material=mate01;
        let mate02 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.white03,transparent:true,opacity:mateOpacity,
        });
        var seaMate = new THREE.MeshBasicMaterial({color:0xaee3f2});
        this.RS.House.scene.children[""+i+""].children[1].material=mate02;

        // testing
        this.RS.House.scene.children[""+i+""].children[0].material=ma03;
        this.RS.House.scene.children[""+i+""].children[1].material=ma04;
      } else if(this.RS.House.scene.children[""+i+""].name=="Lamp"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.white03,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[0].material=mate01;
        let mate02 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.wood03,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].children[1].material=mate02;

        // testing
        this.RS.House.scene.children[""+i+""].children[0].material=ma02;
        this.RS.House.scene.children[""+i+""].children[1].material=ma03;
      } else if(this.RS.House.scene.children[""+i+""].name=="SmokePipe"){
        let mate01 = new THREE.MeshMatcapMaterial({
          color:0xffffff,side:2,matcap:this.RS.wood03,transparent:true,opacity:mateOpacity,
        });
        this.RS.House.scene.children[""+i+""].material=mate01;
        // testing
        this.RS.House.scene.children[""+i+""].material=ma01;
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
      color:0xe6e6e6,side:2,matcap:this.RS.white03,transparent:true,
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
    this.ThreeService.scene.add(this.Bubble[0]);
    gsap.fromTo(this.Bubble[0].scale,1.6,{x:.08,y:.08,z:.08},{ease:"none",x:.42,y:.42,z:.42});
    gsap.fromTo(this.Bubble[0].rotation,4,{z:0},{ease:"none",z:"+="+Math.PI,repeat:-1});
    gsap.fromTo(this.Bubble[0].position,1.6,{y:1.4},{ease:"none",y:1.9});
    gsap.to(this.Bubble[0].position,.8,{ease:"none",x:"-=.05"});
    gsap.to(this.Bubble[0].position,.8,{ease:"none",x:"+=.1",delay:.8});

    // this.ThreeService.scene.add(this.Bubble[1]);
    // gsap.fromTo(this.Bubble[1].scale,1.6,{x:.2,y:.2,z:.2},{ease:"none",x:.3,y:.3,z:.3,delay:1.6});
    // gsap.to(this.Bubble[1].position,1,{ease:"none",y:"+=.2",delay:1.6});
    for(var i=1;i<3;i++){
      let delay = i*.8;
      this.ThreeService.scene.add(this.Bubble[i]);
      gsap.fromTo(this.Bubble[i].scale,1.6,{x:.06,y:.06,z:.06},{ease:"none",x:.18,y:.18,z:.18,delay:delay,repeat:-1,repeatDelay:0});
      gsap.fromTo(this.Bubble[i].rotation,6,{z:0},{ease:"none",z:"+="+Math.PI,repeat:-1,delay:delay});
      

      gsap.fromTo(this.Bubble[i].position,1.6,{y:1.38},{ease:"none",y:1.8,delay:delay,repeat:-1,repeatDelay:0});
      gsap.to(this.Bubble[i].position,.8,{ease:"none",x:"-=.075",delay:delay,repeat:-1,repeatDelay:.8});
      gsap.to(this.Bubble[i].position,.8,{ease:"none",x:"+=.075",delay:.8+delay,repeat:-1,repeatDelay:.8});
      
    }
  }

  private SmokeTextureArray = [];
  private SmokeTexture02Array = [];
  UpgradeFunction(Ix,Iy,Iz){
    // Hammer
    this.RS.Hammer.scene.position.set(Ix+.85,Iy+.9,Iz);
    this.ThreeService.scene.add(this.RS.Hammer.scene);
    gsap.fromTo(this.RS.Hammer.scene.rotation,.14,{z:0},{z:1.2,yoyo:true,repeat:3,ease:"none",onComplete:()=>{
      this.RS.Hammer.scene.position.set(Ix-.8,Iy+1.1,Iz);
      gsap.fromTo(this.RS.Hammer.scene.rotation,.14,{z:0},{z:-1.2,yoyo:true,repeat:3,ease:"none",onComplete:()=>{
        this.RS.Hammer.scene.position.set(Ix+.65,Iy+1.25,Iz);
        gsap.fromTo(this.RS.Hammer.scene.rotation,.14,{z:0},{z:1.2,yoyo:true,repeat:3,ease:"none",onComplete:()=>{
          this.ThreeService.scene.remove(this.RS.Hammer.scene);
        }});
      }});
    }});

    // center
    for(var i=0;i<3;i++){
      if(this.SmokeTextureArray.length<3){
        let shadow = this.SmokeTexture.clone();
        this.ThreeService.scene.add(shadow);
        this.SmokeTextureArray.push(shadow);
      }

      this.ThreeService.scene.add(this.SmokeTextureArray[i])
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
        this.ThreeService.scene.remove(this.SmokeTextureArray[k])
      }});
    }
    gsap.delayedCall(1.6,()=>{
      this.ThreeService.scene.remove(this.RS.Tent.scene);
      
      gsap.fromTo(this.RS.House.scene.scale,.4,{x:"-=.8",y:"-=1.6",z:"-=1.6"},{x:"+=.8",y:"+=1.6",z:"+=1.6",delay:.1,ease:"in"});
      gsap.to(this.RS.House.scene.scale,.15,{x:"-=.2",y:"-=.2",z:"-=.2",delay:.5,ease:"out"});
      gsap.to(this.RS.House.scene.scale,.15,{x:"+=.2",y:"+=.2",z:"+=.2",delay:.65,ease:"in"});
      this.ThreeService.scene.add(this.RS.House.scene);
      this.world03.addBody(this.BodyHouse)
    })

    // outer
    gsap.delayedCall(.2,()=>{
      for(var i=0;i<24;i++){
        let shadow = this.SmokeTexture02.clone();
        this.ThreeService.scene.add(shadow);

        var delayI = i*.06;
        // Scale
        gsap.fromTo(shadow.scale,.5,{x:.6,y:.6,z:.6},{x:.01,y:.01,z:.01,delay:delayI,ease:"none"});
  
        // Position
        gsap.fromTo(shadow.position,.5,{x:Ix+Math.random()*.5-.25,y:Iy+.5,z:Iz-.1},
          {x:"+="+(Math.random()*2-1),y:"+="+(Math.random()*1+.6),z:.3,delay:delayI});
  
        // Rotation
        gsap.fromTo(shadow.rotation,1,{z:Math.random()*3.15},{z:"+="+(Math.random()*10-5),ease:"none",delay:delayI})
  
        gsap.delayedCall(1+delayI,()=>{
          this.ThreeService.scene.remove(shadow);
        })
      }
    })

    // last 
    var randomArray=[];
    randomArray = this.GenerateRandomPosition(10,-1.5,1.5,.7,2,1,1,1.5);
    gsap.delayedCall(1.5,()=>{
    for(var i=0;i<10;i++){
        let shadow = this.SmokeTexture02.clone();
        this.ThreeService.scene.add(shadow);

        // Scale
        gsap.fromTo(shadow.scale,.3,{x:1,y:1,z:1},{x:.01,y:.01,z:.01,ease:"none"});
        
        // Position
        gsap.fromTo(shadow.position,.3,{x:Math.random()*.5-.25,y:.5,z:-.1},
          {x:randomArray[i].x,y:randomArray[i].y,z:randomArray[i].z});

        // Rotation
        gsap.fromTo(shadow.rotation,1,{z:Math.random()*3.15},{z:"+="+(Math.random()*10-5),ease:"none"})

        gsap.delayedCall(1,()=>{
          this.ThreeService.scene.remove(shadow);
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
        if(this.ThreeService.distance(Vec3.x,Vec3.y,Vec3.z,Array[j].x,Array[j].y,Array[j].z)<distance){
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
  private debugger03;
  private PlaneMaterial:CANNON.Material;

  InitThirdWorld(): void {
    this.world03 = new CANNON.World();
    this.world03.gravity.set(0, 0, 0);

    gsap.delayedCall(1,()=>{
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

  
      // Balloon Attach
      E.BalloonAttach = new THREE.Mesh(new THREE.BoxBufferGeometry(.02,.02,.02),mateOpacity)
      E.BalloonAttach.position.set(0,-.16,0);
      E.Balloon3d.add(E.BalloonAttach);
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
  
      E.BalloonBody.position.set( Px, Py-.3, Pz);
      
      // Balloon Constraint
      var c = new CANNON.PointToPointConstraint(E.BalloonBody,new CANNON.Vec3(0,.15,0),E.GBBody,new CANNON.Vec3(0,-.15,0));
      this.world03.addConstraint(c);
  
  
      // Box 
      E.Box3d = new THREE.Object3D();
      E.BoxThree = this.RS.Box.scene;
      E.BoxThree.scale.set(1.25,1.25,1.25)
      E.BoxThree.position.set(0,0,0);
      let mate02 = new THREE.MeshMatcapMaterial({
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
        matcap:this.RS.red
      })
      let mate05 = new THREE.MeshMatcapMaterial({
        color:0xfefefe,
        side:2,
        transparent:true,
        opacity:1,
        matcap:this.RS.white
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
  
      E.BoxBody.addEventListener('collide',(e)=>{
        if(e.body.material){
          if(e.body.material.name=="PlaneMaterial"&&!E.Boop){
            E.Boop=true;
            gsap.to(E.Box3d.scale,.3,{x:.1,y:.1,z:.1})
            gsap.to(E.Shadow.scale,.3,{x:.1,y:.1,z:.1})
            this.ThreeService.scene.remove(E.StringLine02)
            gsap.delayedCall(.2,()=>{
              this.ThreeService.BOOP(E.BoxBody.position.x,E.BoxBody.position.y,E.BoxBody.position.z);
              this.ThreeService.scene.remove(E.Box3d);
              this.ThreeService.scene.remove(E.Shadow);
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
            this.ThreeService.scene.remove(E.StringLine02)
            gsap.delayedCall(.2,()=>{
              this.ThreeService.BOOP(E.BoxBody.position.x,E.BoxBody.position.y,E.BoxBody.position.z);
              this.ThreeService.scene.remove(E.Box3d);
              this.ThreeService.scene.remove(E.Shadow);
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
      this.ThreeService.scene.add(E.StringLine01)
  
      // Normal Line (to cut)
      E.NormalGeo = new THREE.Geometry();
      E.NormalGeo.vertices.push(
        E.BalloonAttach.position,
        E.BoxAttach.position
      )
      E.NormalLine = new THREE.Line(E.NormalGeo,new THREE.LineBasicMaterial({color:0x0000ff}));
  
      this.Lines.push(E.NormalLine);
      // this.ThreeService.scene.add(E.NormalLine);
  
  
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
    this.ThreeService.raycaster.setFromCamera(this.ThreeService.mouse,this.ThreeService.camera);
    var intersect = this.ThreeService.raycaster.intersectObjects(this.ThirdSceneObject,true)
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
    //   new THREE.MeshMatcapMaterial({color:0xffffff,matcap:this.RS.blue02,transparent:true}));
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
          Vector.project(this.ThreeService.camera);
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

          // this.RS.Hammer.scene.position.set(15,2,0);
          // this.ThreeService.scene.add(this.RS.Hammer.scene);
          this.BubbleUpgrade();

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
          // this.UpgradeFunction(15,-0.075,0);
          var Vector = new THREE.Vector3();

          // Vibrate
          gsap.to(intersect[0].object.parent.rotation,.075,{z:-.03,ease:"none"});
          gsap.to(intersect[0].object.parent.rotation,.15,{z:.03,ease:"none",delay:.075});
          gsap.to(intersect[0].object.parent.rotation,.15,{z:-.03,ease:"none",delay:.225});
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
              Vector.project(this.ThreeService.camera);
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

          Vector.project(this.ThreeService.camera);
          
          var Px = (Vector.x+1)*window.innerWidth/2;
          var Py = - (Vector.y-1)*window.innerHeight/2;
          Vector.y+=.2;
          var Py2 = - (Vector.y-1)*window.innerHeight/2;
          gsap.set(plus1,{css:{left:Px}})
          gsap.fromTo(plus1,.8,{css:{top:Py}},{css:{top:Py2},ease:"power1.out"})
          gsap.to(plus1,.4,{css:{opacity:1},delay:.1})
          gsap.to(plus1,.8,{css:{opacity:0},delay:.6})

          // Check If Enough to Upgrade
          this.CoinPickedUp++;
          if(this.CoinPickedUp==5){
            this.UpgradeFunction(15,-0.075,0);
          }
          
          gsap.delayedCall(1,()=>{
            document.getElementById('welcome').removeChild(plus1);
            this.ThreeService.scene.remove(intersect[0].object.parent.parent.parent);
          })
          break;
      }
    }
  }


  TreeDropCoin(Object){
    // scale
    gsap.fromTo(this.CoinArray[this.CoinCurrent].scale,.6,{x:.2,y:.2,z:.2},{x:1,y:1,z:1})
    // Opacity
    gsap.to(this.CoinArray[this.CoinCurrent].children[1].material.uniforms.uAlpha,
      .3,{value:.6,delay:.6})

    let Vector = new THREE.Vector3();

    Vector.setFromMatrixPosition(Object.matrixWorld);
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
    this.RenderMouseCursor();
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

  CheckIntersect() {
    var LineCurve2 = new THREE.LineCurve(this.mouseF,this.mouseL);
    var dis = this.ThreeService.distanceVec2(this.mouseF.x,this.mouseF.y,this.mouseL.x,this.mouseL.y);
    var Points = LineCurve2.getPoints(Math.floor(dis/0.004));
    var Ma = new THREE.MeshBasicMaterial({color:0x000000})
    var intersect;
    for(var i=0;i<Points.length;i++){
      this.ThreeService.raycaster.setFromCamera(Points[i],this.ThreeService.camera);
      intersect = this.ThreeService.raycaster.intersectObjects(this.Lines,true)
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
              this.ThreeService.scene.remove(this.GiftBalloonArray[k].Box3d);
              this.ThreeService.scene.remove(this.GiftBalloonArray[k].Shadow);
            })

            // remove stuff
            this.ThreeService.scene.remove(this.GiftBalloonArray[k].StringLine02)
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


  private CursorCurve;
  private CursorPoints;
  private CursorString;
  private sphereInter;
  CreateBalloonCursor(){
    this.sphereInter = new THREE.Mesh( new THREE.SphereBufferGeometry( .1 ),new THREE.MeshBasicMaterial( { color: 0xff0000 } ))
    this.sphereInter.visible=false;
    this.ThreeService.scene.add(this.sphereInter)

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
    this.ThreeService.scene.add(this.CursorString)
  }

  RenderMouseCursor() {
    this.CursorPoints = [];

    this.CursorPoints.push(this.FirstCursor.x,this.FirstCursor.y,this.FirstCursor.z);
    this.CursorPoints.push(this.LastCursor.x,this.LastCursor.y,this.LastCursor.z);
    this.CursorCurve.setPositions(this.CursorPoints);
    
    this.CursorString.geometry=this.CursorCurve;
  }

}

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
