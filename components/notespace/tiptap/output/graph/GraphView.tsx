// import { useContext, useEffect, useRef, useState } from "react";

 
// import dynamic from "next/dynamic";

 
// export default function GraphView() {
// //   const { nodes, setNodes } = useContext(GraphNodesContext);
//   const [data, setData] = useState([{}]);

//   async function getDatabaseNodes() {
//     try {
//       await fetch("/api/neo4j/get/25", {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       })
//         .then((z) => z.json())
//         .then((vals) => {
//           (fillData)(vals);
//         });
//     } catch (e) {
//       console.log(e);
//     }
//   }
//   let cyRef = useRef(null) as any;




// // convert nodes to flattened format representing each n-(r)->n
// function nodesToDict(nodePairs:Object) {
// // nodePairs [0] : usually not Document, has .elementId field  
// // nodePairs [1] : usually  Document, has .elementId field  
// // nodePairs [2] : relationship is array with each element has .startNodeElementId and .endNodeElementId

// let dict = new Map()
// // entity object: name, relationships: []
// let edges = [] as any
 
// for (const i in (nodePairs as any).records) { // process all entities first then loop thru edges later
//     let a = (nodePairs as any).records[i]._fields[0];
//     let b = (nodePairs as any).records[i]._fields[1];

//     let a_name = a.elementId
//     let b_name = b.elementId

//     let rels = (nodePairs as any).records[i]._fields[2];
//     edges.push(...rels)

//     if(!dict.has(a_name)) {
//         if(a.labels.includes('Document')) {
//             dict.set(a_name,{name:a.properties.title ,relationships:[]})
//         } else {
//             dict.set(a_name,{name:a.properties.id ,relationships:[]})
//         }
       
//     }

//     if(!dict.has(b_name)) {
//         if(b.labels.includes('Document')) {
//             dict.set(b_name,{name:b.properties.title ,relationships:[]})
//         } else {
//             dict.set(b_name,{name:b.properties.id ,relationships:[]})
//         }
//     }
// }
 
// edges.forEach((edge)=> {
//     let a_elementId = edge.startNodeElementId
//     let b_elementId = edge.endNodeElementId

//     let a = dict.get(a_elementId)
//     let b = dict.get(b_elementId)
//     console.log(a_elementId,b_elementId, dict)
//     console.log(a,b)
//     let relationship = a.name + ' ' + edge.type + " " + b.name

//     a.relationships.push(relationship)
//     b.relationships.push(relationship)

//     dict.set(a_elementId,  a)
//     dict.set(b_elementId , b)
// })

// return Array.from(dict.values())

// }
  
//   // convert records to cytoscape friendly format
//   function fillData(nodePairs: Object) {
//     console.log('ntd',nodesToDict(nodePairs))
//     console.log('np',nodePairs)
//     let arr = [] as any;

//     for (const first in (nodePairs as any).records) {
//       let a = (nodePairs as any).records[first]._fields[0];
     
//       let a_id = a.identity.low + "";
//       let a_type = a.labels;
//       let a_data = a.properties;

//       let b = (nodePairs as any).records[first]._fields[1];
    
//     let b_id = b.identity.low + "";

 
//     if('title' in a.properties) {
//         console.log('crashout a',a)
//         a_id = a.properties.title
//     }
//     if('title' in b.properties) {
//         console.log('crashout b',b)
//         b_id = b.properties.title
//     }

//       let b_type = b.labels;
//       let b_data = b.properties;

     
//       let nodeA = { data: { id: a_id, label: a_data.id } ,  style: { // style property overrides 
//         'background-color': 'black'
//       }};
//       let nodeB = { data: { id: b_id, label: b_data.id },  style: { // style property overrides 
//         'background-color': 'brown'
//       }  };

//       let edges = [] as any;

//       let rels =  (nodePairs as any).records[first]._fields[2]
      
//       rels.forEach((relationship)=> {
//         edges.push({
//             data: {
//               source: b_id,
//               target: a_id,
//               label: relationship.type,
//             },
//           })
//       })
     

  
//       arr.push(nodeA, nodeB, ...edges);
//     }
 
//     setData(arr);
//     // (setNodes as any)(arr)
//     console.log(arr)
//   }
 

//   useEffect(() => {
//     // if (nodes.length == 0) {
//     //   getDatabaseNodes();
//     // } else {
//     //   fillData(nodes);
//     // }
//     getDatabaseNodes();
    
//     return () => {
//         if (cyRef.current) {
//             cyRef.current.destroy();
//             cyRef.current = null;
//         }
//     };
//   }, []);

 

// //   useEffect(() => {
// //     function reset() {
    
    
// //           cyRef.current.layout({
// //             name: "cose", // or try: 'breadthfirst', 'circle', 'concentric', 'grid', 'random'
// //             fit: true,
// //             padding: 30,
// //             randomize: true,
// //             componentSpacing: 100,
// //             nodeOverlap: 20,
// //             animate: true,
// //             animationDuration: 500,
// //             refresh: 20,
// //             nodeRepulsion: 400000,
// //             idealEdgeLength: 100,
// //           }).run()
 
// //     }
// //     function click() {
// //     //   let nodes = cyRef.current
// //     //     .nodes()
// //     //     .filter((node) => node.position().x != 0);
// //       reset();
// //     }
// //     if (cyRef.current) {
// //       (cyRef.current as any).on("tapend", click);
// //     }
// //     return () => {
// //       cyRef.current.off("tapend", click);
// //     };
// //   }, []);

//   useEffect(() => {
//     if(cyRef.current && data.length > 1) {

//         const layout = cyRef.current.layout({
//             name: "cose", // or try: 'breadthfirst', 'circle', 'concentric', 'grid', 'random'
//             fit: true,
//             padding: 30,
//             randomize: false,
//             componentSpacing: 100,
//             nodeOverlap: 20,
//             animate: true,
//             animationDuration: 500,
//             refresh: 20,
//             nodeRepulsion: 400000,
//             idealEdgeLength: 100,
        
//           });
          
//           layout.run();
//     }
     
//   }, [data ]);
//   return (
//     <div>
//       <CytoscapeComponent
      
//         stylesheet={[
//           {
//             selector: "node",
//             style: {
//               "background-color": "black",
//               label: "data(label)",
//               width: 30,
//               height: 30,
//               "font-size": "12px",
//               "text-valign": "center",
//               "text-halign": "center",
//               color: "green",
//             },
//           },
//           {
//             selector: "edge",
//             style: {
//               width: 2,
//               "line-color": "#CAE9F5",
//               "target-arrow-color": "#ccc",
//               "curve-style": "bezier",
//               "target-arrow-shape": "triangle",
//               'label': "data(label)",
//               "font-size": "8px",
//               'color': "#FF0000",
//               "text-rotation": "autorotate",
//               'line-style' : 'dashed'
//             },
//           },
//         ]}
    
//         cy={(cy) => {
//           (cyRef.current as any) = cy;
         
//         }}
//         elements={data as any}
//         className="bg-white"
//         style={{ height: "82svh", width: "46svw" }}
//       />
//     </div>
//   );
// }
