export const calculateHooks = (width, height, inputs, outputs) => {
    const hooks = [];
    const totalHooks = inputs + outputs;
    const hooksPerEdge = Math.ceil(totalHooks / 4);
  
    for (let i = 0; i < totalHooks; i++) {
      let hookX = 0, hookY = 0;
  
      if (i < hooksPerEdge) {  // Top edge
        hookX = (i / hooksPerEdge) * width;
        hookY = 0;  // Top edge Y is 0
      } else if (i < hooksPerEdge * 2) {  // Right edge
        hookX = width;
        hookY = ((i - hooksPerEdge) / hooksPerEdge) * height;
      } else if (i < hooksPerEdge * 3) {  // Bottom edge
        hookX = width - ((i - hooksPerEdge * 2) / hooksPerEdge) * width;
        hookY = height;
      } else {  // Left edge
        hookX = 0;
        hookY = height - ((i - hooksPerEdge * 3) / hooksPerEdge) * height;
      }
  
      hooks.push({
        id: `hook${i + 1}`,
        x: hookX,
        y: hookY,
        type: i < inputs ? 'input' : 'output',
      });
    }
  
    return hooks;
  };