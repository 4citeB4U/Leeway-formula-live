/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G44.SPATIAL_HIERARCHY
TAG: LEEWAY.G44.FOUR_NEIGHBOR_CHILDREN_TO_ONE_PARENT
5WH:
WHAT = Produce second locality-preserving hierarchy level from 2x2 adjacent spatial child tiles.
WHY = First-stage 32x32x8 cells must retain adjacency when a parent spans four source tiles.
WHO = Creator-authorized LeeWay engineering; no certified geodetic scene source or signed approval.
WHERE = Formula experimental-v2/spatial-parent-pooling.mjs
WHEN = 2026-10-22
HOW = Validate canonical even tile origin, common z/lane and 2x2 quadrants; average adjacent child samples into next 32x32x8 level.
LICENSE: MIT
AUTHORITY: Experimental local-grid numerical pooling only; no production policy.
*/
const fail=x=>{throw Error(x)};
const size=32*32*8;
export function poolAdjacentSpatialChildren(children){
 if(!Array.isArray(children)||children.length!==4)
  fail('G44_PARENT_REQUIRES_EXACT_FOUR_CHILDREN');
 const [a,b,c,d]=children;
 const root=a?.coord;
 if(!Array.isArray(root)||root.length!==4||
  !root.every(x=>Number.isSafeInteger(x)&&x>=0)||
  root[0]%2!==0||root[1]%2!==0)
  fail('G44_PARENT_REQUIRES_EVEN_SPATIAL_TILE_ORIGIN');
 const [x,y,z,l]=root;
 const expected=[[x,y,z,l],[x,y+1,z,l],[x+1,y,z,l],[x+1,y+1,z,l]];
 for(let i=0;i<4;i++){
  if(!Array.isArray(children[i]?.coord)||!expected[i].every((v,j)=>v===children[i].coord[j])||
   !(children[i].data instanceof Float64Array)||children[i].data.length!==size||
   !children[i].data.every(Number.isFinite))
   fail('G44_PARENT_NEEDS_CONTIGUOUS_FINITE_CHILDREN_SAME_Z_AND_LANE');
 }
 const output=new Float64Array(size);
 const val=(u,v,ch)=>{
  const row=u>>5,col=v>>5;
  const quadrant=children[row*2+col].data;
  return quadrant[((u%32)*32+(v%32))*8+ch];
 };
 for(let i=0;i<32;i++)for(let j=0;j<32;j++)for(let ch=0;ch<8;ch++){
  const u=2*i,v=2*j;
  output[(i*32+j)*8+ch]=(
   val(u,v,ch)+val(u+1,v,ch)+val(u,v+1,ch)+val(u+1,v+1,ch)
  )/4;
 }
 return {
  parentCoord:[x/2,y/2,z,l],
  parentShape:[32,32,8],
  cellsFromOriginalSource:4*4,
  parentCellStrideRelativeToOriginal:4,
  requiresCompleteFourChildNeighborhood:true,
  noSyntheticEdgePadding:true,
  data:output,
  sourceTileCount:4,
  policyAuthority:false,productionAccepted:false
 };
}
