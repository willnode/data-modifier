import './app.css'
import App from './App.svelte'

import('./lib/monaco');

const app = new App({
  target: document.getElementById('app')!,
})

export default app
