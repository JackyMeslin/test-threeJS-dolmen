import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    timeout,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    DiamondPlugin,
    FrameFadePlugin,
    GLTFAnimationPlugin,
    GroundPlugin,
    BloomPlugin,
    TemporalAAPlugin,
    AnisotropyPlugin,
    GammaCorrectionPlugin,

    addBasePlugins,
    ITexture, TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin,

    IViewerPlugin,

    // Color, // Import THREE.js internals
    // Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger)

async function setupViewer(){

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
        useRgbm: false,
        useGBufferDepth: true
    })

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target

    // Add a popup(in HTML) with download progress when any asset is downloading.
    ///await viewer.addPlugin(AssetManagerBasicPopupPlugin)

    // Add plugins individually.
    await viewer.addPlugin(GBufferPlugin)
    // await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
    // await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
    // await viewer.addPlugin(DiamondPlugin)
    // await viewer.addPlugin(FrameFadePlugin)
    // await viewer.addPlugin(GLTFAnimationPlugin)
    // await viewer.addPlugin(GroundPlugin)
    await viewer.addPlugin(BloomPlugin)
    // await viewer.addPlugin(TemporalAAPlugin)
    // await viewer.addPlugin(AnisotropyPlugin)

    // or use this to add all main ones at once.
    await addBasePlugins(viewer)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    await viewer.addPlugin(CanvasSnipperPlugin)

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()
    viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})

    await manager.addFromPath("./assets/scene.glb")

    // Load an environment map if not set in the glb file
    // await viewer.scene.setEnvironment(
    //     await manager.importer!.importSinglePath<ITexture>(
    //         "./assets/environment.hdr"
    //     )
    // );

    // Add some UI for tweak and testing.
    const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin)
    // Add plugins to the UI to see their settings.
    uiPlugin.setupPlugins<IViewerPlugin>(TonemapPlugin, CanvasSnipperPlugin)

    function setupScrollAnimation() {
      const tl = gsap.timeline()

      tl.to(position, {x: 0.18, y: 0.08, z:-1.97,
        scrollTrigger: {
          trigger:'.second',
          start: "top bottom",
          end: "top top",
          scrub:3,
          //markers:true,
          immediateRender: false
      }, onUpdate})

      .to(target, {x: 0, y: 0, z: 0,
        scrollTrigger: {
          trigger:'.second',
          start: "top bottom",
          end: "top top",
          scrub:3,
          //markers:true,
          immediateRender: false
      }})

      .to(position, {x: -0.01, y: -0.04, z:-0.43,
        scrollTrigger: {
          trigger:'.third',
          start: "top bottom",
          end: "top top",
          scrub:3,
          //markers:true,
          immediateRender: false
      }, onUpdate})

      .to(target, {x: 0, y: 0, z:0,
        scrollTrigger: {
          trigger:'.third',
          start: "top bottom",
          end: "top top",
          scrub:3,
          //markers:true,
          immediateRender: false
      }})
      .to(position, {x: 2.11, y: 3, z:1.6,
        scrollTrigger: {
          trigger:'.fourth',
          start: "top bottom",
          end: "top top",
          scrub:3,
          //markers:true,
          immediateRender: false
      }, onUpdate})

      .to(target, {x: 0, y: 0, z:0,
        scrollTrigger: {
          trigger:'.fourth',
          start: "top bottom",
          end: "top top",
          scrub:3,
          //markers:true,
          immediateRender: false
      }})
    }
    setupScrollAnimation()

    let needsUpdate = true

    function onUpdate() {
      needsUpdate = true
      viewer.renderer.resetShadows
    }

    const sections = document.querySelector('.container')
    let exitBtn = document.querySelector('#exit-customize')

    document.getElementById('btn-explore').addEventListener('click', (e) => {
      viewer.scene.activeCamera.setCameraOptions({controlsEnabled: true})
      sections.style.display = "none"
      document.body.cursor = "grab"
      exitBtn.style.display = "block"
      //gsap.to(position, {x: 0.05, y: 9.5, z:-4.2, onUpdate})
      //gsap.to(target, {x: 0.05, y: 9.5, z:-4.2, onUpdate})
    })

    exitBtn.addEventListener('click', (e) => {
      viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})
      sections.style.display = "block"
      document.body.cursor = "pointer"
      exitBtn.style.display = "none"
      //gsap.to(position, {x: 0.05, y: 9.5, z:-4.2, onUpdate})
      //gsap.to(target, {x: 0.05, y: 9.5, z:-4.2, onUpdate})
    })

    viewer.addEventListener('preFrame', () => {
      if(needsUpdate){
        camera.positionTargetUpdated(true)
        needsUpdate = false
      }
    })
}


setupViewer()
