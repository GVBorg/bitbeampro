(function(n,r){const i=r();typeof module=="object"&&module.exports?module.exports=i:n.SelectionContour=i})(typeof window<"u"?window:globalThis,()=>{function n(r,i){const c=[];i.traverse(e=>{e.isMesh&&!e.userData.selectionContour&&!e.userData.fixtureEmitter&&!e.material?.uniforms&&c.push(e)});const a=[];for(const e of c){const o=new r.Mesh(e.geometry,new r.MeshBasicMaterial({color:16777215,side:r.BackSide,depthWrite:!1,toneMapped:!1,fog:!1})),l={value:new r.Vector2(1,1)};o.material.onBeforeCompile=t=>{t.uniforms.contourViewport=l,t.vertexShader=`uniform vec2 contourViewport;
`+t.vertexShader,t.vertexShader=t.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
vec3 contourNormal=normalize(normalMatrix*normal);
vec4 contourTip=projectionMatrix*vec4(mvPosition.xyz+contourNormal,mvPosition.w);
vec2 contourDirection=contourTip.xy/contourTip.w-gl_Position.xy/gl_Position.w;
float contourMagnitude=length(contourDirection*contourViewport);
if(contourMagnitude>0.000001)gl_Position.xy+=normalize(contourDirection*contourViewport)*6.0/contourViewport*gl_Position.w;`)},o.material.customProgramCacheKey=()=>"selection-css-3px-48",o.onBeforeRender=t=>{t.getSize(l.value)},o.userData.selectionContour=!0,o.visible=!1,o.castShadow=!1,o.raycast=()=>{},e.add(o),a.push(o)}return a}return{create:n}});
