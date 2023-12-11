import * as vscode from 'vscode';
// import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';

export function activate(context: vscode.ExtensionContext) {
  // Register the command to analyze and show content overflow in a webview
  let disposable = vscode.commands.registerCommand('contentOverflow.showWebview', async () => {
    // Get the active text editor
    const editor = vscode.window.activeTextEditor;

    if (editor && editor.document.languageId === 'html') {
      // Get the text content of the active editor
      const document = editor.document;
      const text = document.getText();

      // Detect content overflow using Puppeteer
      const overflowInfo = await detectContentOverflow(text);

      // Create and show the webview panel
      const panel = vscode.window.createWebviewPanel(
        'contentOverflow',
        'Content Overflow Details',
        vscode.ViewColumn.One,
        {}
      );

      // Load the content of the webview
      panel.webview.html = getWebviewContent(overflowInfo);

      // Handle messages from the webview
      panel.webview.onDidReceiveMessage(
        message => {
          // Handle user interaction if needed
          // For example, opening the relevant file or showing additional details
          vscode.window.showInformationMessage(`Webview received message: ${JSON.stringify(message)}`);
        },
        undefined,
        context.subscriptions
      );
    }
  });

  context.subscriptions.push(disposable);
}

async function detectContentOverflow(text: string): Promise<{ overflowDetected: boolean; details: string }> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Set content to the HTML text
    await page.setContent(text);

    // Use evaluate to run JavaScript in the context of the page
    const result = await page.evaluate(() => {
      const viewportWidthOverflow = document.documentElement.scrollWidth > window.innerWidth;
      const container = document.querySelector('.container');
      const containerOverflow = container && container.scrollWidth > container.clientWidth;

      return { viewportWidthOverflow, containerOverflow };
    });

    const problematicElements = [];
    let targetedElements = [];

    if (result.viewportWidthOverflow) {
      problematicElements.push('Viewport width overflow');

      // Use Puppeteer to get the targeted element in the page context
      const viewportHandle = await page.$('div');
      const viewportClassName = viewportHandle ? await page.evaluate(el => el.className.toLowerCase(), viewportHandle) : '';
      targetedElements.push(viewportClassName);
    }
    if (result.containerOverflow) {
      problematicElements.push('Container width overflow');

      // Use Puppeteer to get the targeted element in the page context
      const containerHandle = await page.$('div');
      const containerClassName = containerHandle ? await page.evaluate(el => el.className.toLowerCase(), containerHandle) : '';
      targetedElements.push(containerClassName);

      // Also check for element-overflow within the container
      const elementOverflowHandle = await page.$('.element-overflow');
      const elementOverflowClassName = elementOverflowHandle
        ? await page.evaluate(el => el.className.toLowerCase(), elementOverflowHandle)
        : '';
      targetedElements.push(elementOverflowClassName);
    }

    const details = generateOverflowDetails(problematicElements, targetedElements);

    return { overflowDetected: problematicElements.length > 0, details };
  } finally {
    await browser.close();
  }
}

function generateOverflowDetails(problematicElements: string[], targetedElements: string[]): string {
  let details = 'Content Overflow problems:';
  details += problematicElements.length > 0 ? `<ul>${problematicElements.map(element => `<li>${element}</li>`).join('')}</ul>` : 'No problems detected.';

  if (targetedElements.length > 0) {
    details += '<br/>Targeted elements:';
    details += `<ul>${targetedElements.map(element => `<li>${element}</li>`).join('')}</ul>`;
  }

  details += '<br/>Suggestion: Use <ul><li>overflow:auto</li><li> overflow:scroll</li><li> overflow:hidden</li>';

  return details;
}




function getWebviewContent(overflowInfo: { overflowDetected: boolean; details: string ; problematicElements?: string[] }): string {
  const nonce = getNonce();

  let elementsList = '';
  if (overflowInfo.problematicElements) {
    elementsList = overflowInfo.problematicElements.map(element => `<li>${element}</li>`).join('');
  }

  // Use a nonce to whitelist scripts
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Content Overflow Details</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          font-size: 30px
        }

        .highlight {
          background-color: #3a3a3a; 
          padding: 2px;
        }
      </style>
    </head>
    <body>
      <h1>Content Overflow Details:</h1>
      <div id="overflow-details" class="${overflowInfo.overflowDetected ? 'highlight' : ''}">
        <p>${overflowInfo.details}</p>
        ${elementsList ? `<ul><li>${elementsList}</li></ul>` : ''}
      </div>

      <script nonce="${nonce}">
        // Handle messages from the extension
        window.addEventListener('message', event => {
          const message = event.data;

          // Handle content overflow information
          if (message.overflowDetected) {
            handleOverflow(message.details);
          }
        });

        // Function to handle overflow details and update the webview content
        function handleOverflow(details) {
          const overflowDetailsElement = document.getElementById('overflow-details');
          overflowDetailsElement.innerHTML = '<p>' + details + '</p>';

          // Request the extension to highlight problematic elements
          vscode.postMessage({
            command: 'highlightProblematicElements'
          });
        }
      </script>
    </body>
    </html>
  `;
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
