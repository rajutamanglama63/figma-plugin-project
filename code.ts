// // This plugin will open a window to prompt the user to enter a number, and
// // it will then create that many rectangles on the screen.

// // This file holds the main code for plugins. Code in this file has access to
// // the *figma document* via the figma global object.
// // You can access browser APIs in the <script> tag inside "ui.html" which has a
// // full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// // This shows the HTML page in "ui.html".
// figma.showUI(__html__);

// // Calls to "parent.postMessage" from within the HTML page will trigger this
// // callback. The callback will be passed the "pluginMessage" property of the
// // posted message.
// figma.ui.onmessage =  (msg: {type: string, count: number}) => {
//   // One way of distinguishing between different types of messages sent from
//   // your HTML page is to use an object with a "type" property like this.
//   if (msg.type === 'create-rectangles') {
//     const nodes: SceneNode[] = [];
//     for (let i = 0; i < msg.count; i++) {
//       const rect = figma.createRectangle();
//       rect.x = i * 150;
//       rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
//       figma.currentPage.appendChild(rect);
//       nodes.push(rect);
//     }
//     figma.currentPage.selection = nodes;
//     figma.viewport.scrollAndZoomIntoView(nodes);
//   }

//   // Make sure to close the plugin when you're done. Otherwise the plugin will
//   // keep running, which shows the cancel button at the bottom of the screen.
//   figma.closePlugin();
// };


figma.showUI(__html__, { width: 300, height: 400 });

// check if we've a token stored
const checkAuthentication = async () => {
  const token = await figma.clientStorage.getAsync("my-token");

  if (token) {
    figma.ui.postMessage({ type: "show-rectangle-ui", token })
  }
  else {
    console.log("do nothing");
  }
}

checkAuthentication();

figma.ui.onmessage = async (msg: { type: string, token?: string, count?: number }) => {
  if (msg.type === 'invoke-oauth') {
    // console.log("Hello developer!")
    figma.ui.postMessage({ type: 'start-auth' });
  } else if (msg.type === "save-token") {
    await figma.clientStorage.setAsync("my-token", msg.token)
    showAuthenticatedUI()
  } else if (msg.type === 'create-rectangles') {
    const nodes: SceneNode[] = [];
    for (let i = 0; i < msg.count!; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      const solidPaint: SolidPaint = {
        type: 'SOLID',
        color: { r: 1, g: 0.5, b: 0 },
        opacity: 1, // default opacity
        visible: true, // visibility is true by default
        blendMode: 'NORMAL', // default blend mode
        boundVariables: {},
      };

      rect.fills = [solidPaint];
      // rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  } else if (msg.type === "cancel") {
    figma.closePlugin();
  }
};

// Function to show the authenticated UI
function showAuthenticatedUI() {
  figma.ui.postMessage({ type: 'show-rectangle-ui' });
}