# ContFlow 

The "ContFlow" is a powerful Visual Studio Code extension designed to streamline the process of creating responsive web layouts by addressing content overflow challenges. As web design complexity grows, managing content overflow, especially concerning viewport width & Element Overflow within the containers, becomes crucial for delivering a seamless user experience across various devices.

## Features

1. Content Overflow Detection: Detects and analyzes content overflow issues within HTML and CSS files, focusing on: 
    - **Viewport Width Overflow Detection:** Identify elements that overflow the viewport width, potentially causing visibility issues on certain devices.

    - **Element Overflow within Containers:** Highlight elements within containers that exceed the container's width, impacting horizontal overflow.

    - **User-Friendly Feedback:** Provide clear and user-friendly feedback in the webview. Communicate the type of overflow, its location, and potential solutions.

2. Interactive Webview: Utilizes a dynamic webview embedded within VS Code, offering an interactive interface for visualizing and addressing content overflow.

3. Real-time Feedback: Provides real-time feedback to web designers by dynamically updating the webview with detailed information about detected overflow conditions.

4. Responsive Design Guidance: Offers insights and suggestions for responsive design adjustments to optimize the layout for different screen sizes.

5. Seamless Integration: Seamlessly integrates with the VS Code editor, ensuring a smooth workflow for developers without the need to switch between tools.

## How it Works

1.Detection: The extension employs advanced algorithms to identify content overflow scenarios, particularly those related to viewport width.

2.Webview Interaction: Through a webview interface embedded within VS Code, designers receive real-time notifications and insights about overflow conditions.

3.Responsive Recommendations: The extension provides actionable recommendations to enhance responsive design, assisting developers in making informed adjustments.

## Getting Started

### Installation

1. Clone the repository:

   ```bash 
   git clone https://github.com/PEIYA-BISEN/ContFloww

2. Install dependencies:
    
   ![](<WhatsApp Image 2023-12-06 at 21.07.36.jpeg>)

3. Open the project in Visual Studio Code.

4. Press F5 to launch the extension in debug mode.

### Usage

1. Open an HTML or CSS file in Visual Studio Code.

2. Trigger the extension by running the "Show Content Overflow Webview" command from the Command Palette.

3. The webview panel will display information about detected content overflow issues.

4. Follow the recommendations provided to address the overflow problems.

### Contributing

Contributions are welcome! If you have ideas for improvements or encounter issues, please open an issue or submit a pull request.

### License

This project is licensed under the MIT License.

### Acknowledgements

Special thanks to the Visual Studio Code team for providing a powerful extension development platform.
  
  - https://code.visualstudio.com/api 
  - https://code.visualstudio.com/api/extension-guides/webview
  - https://code.visualstudio.com/api/extension-guides/web-extensions


