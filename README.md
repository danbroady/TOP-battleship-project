### Template Use Guide
Zero-hassle boilerplate for SPA's using Webpack 5, ESM, & HTML/CSS/JS.

1. **Create & Clone Repository**

   Create a new repository on GitHub using the **"template"** button, then clone locally:
   ```bash
   git clone <repo url>
   cd <directory>
   
2. **Local Setup**

	Set your new project name in package.json and install the local dependencies:
	```bash
	npm pkg set name="<your-project-name>"
	npm install
	
3. **Development - Localhost**

	Start the local dev server with hot reloading:

	```bash
	npm run dev

4. **Code Architecture & Assets Reminder**

	Source code: _Place all JS modules, CSS stylesheets, & templates inside the 'src/' directory_

	Images & SVGs: _Images or icons should be imported into the JS files (e.g. import icon from './resources/logo.svg') so Webpack can process & bundle correctly_

5. **Commit & push src code updates to main branch:**

	```bash
	git add .
	git commit -m "[commit msg]"
	git push origin main

6. **Deploy to GH-Pages**

	Compile the optimised production bundle & deploy the dist folder to gh-pages branch:

	```bash
	npm run build
	npm run deploy
